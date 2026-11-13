#!/usr/bin/env python3
"""Generate a subtle ambient music bed for the HAMi v2.11.0 announcement video.

Pure-additive synthesis with numpy: slow chord pads with gentle crossfades,
a soft sub bass, and a quiet breathing LFO. Total length matches the timeline.
Replace public/audio/bgm-*.wav with licensed music if available.

Usage:
  python3 scripts/make_bgm.py --frames 2140 --output public/audio/bgm-zh.wav
"""
import argparse
import os
import wave

import numpy as np

SR = 44100

# A minor progression: Am - F - C - G, repeated to fill the duration
CHORD = [
    ([110.0, 220.0, 261.63, 329.63], 55.0),   # Am
    ([87.31, 174.61, 220.0, 261.63], 43.65),  # F
    ([130.81, 196.0, 261.63, 329.63], 65.41), # C
    ([98.0, 196.0, 246.94, 293.66], 49.0),    # G
]


def drifting_sine(freq, n, seed, lfo_rate=0.11, drift=0.006):
    """Sine with slow random LFO detune, phase integrated to avoid clicks."""
    rng = np.random.default_rng(seed)
    tt = np.arange(n) / SR
    lfo = 1.0 + drift * np.sin(2 * np.pi * lfo_rate * tt + rng.uniform(0, 6))
    phase = 2 * np.pi * np.cumsum(freq * lfo) / SR
    return np.sin(phase)


def pad_tone(freq, n, seed):
    return (
        drifting_sine(freq, n, seed) * 2 ** (6 / 1200)
        + drifting_sine(freq, n, seed + 100) * 2 ** (-6 / 1200)
        + 0.35 * np.sin(2 * np.pi * freq * 2 * np.arange(n) / SR)
        + 0.12 * np.sin(2 * np.pi * freq * 3 * np.arange(n) / SR)
    ) / 2.47


def build(dur, out, peak_target=0.30):
    N = int(SR * dur)
    t = np.arange(N) / SR

    chords = CHORD * (int(np.ceil(dur / 30)) + 1)
    seg_len = dur / len(chords)

    mix = np.zeros(N)
    for i, (notes, bass) in enumerate(chords):
        start = int(i * seg_len * SR)
        n = min(int(seg_len * 1.35 * SR), N - start)  # overlap tails
        atk = min(int(2.4 * SR), n)
        env = np.ones(n)
        env[:atk] = np.linspace(0, 1, atk) ** 2
        rel = int(2.8 * SR)
        if rel < n:
            env[-rel:] *= np.linspace(1, 0, rel) ** 1.5
        seg = np.zeros(n)
        for j, f in enumerate(notes):
            amp = 0.9 if j == 0 else 0.55
            seg += amp * pad_tone(f, n, 10 * i + j)
        bt = np.arange(n) / SR
        seg += 0.5 * np.sin(2 * np.pi * bass * bt) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.1 * bt))
        mix[start:start + n] += seg * env

    # global breathing + fades
    mix *= 1.0 + 0.05 * np.sin(2 * np.pi * 0.07 * t)
    fade_in = int(1.8 * SR)
    fade_out = int(5.0 * SR)
    mix[:fade_in] *= np.linspace(0, 1, fade_in) ** 2
    mix[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5

    # gentle stereo width
    lfo_pan = np.sin(2 * np.pi * 0.05 * t)
    left = mix * (1 - 0.08 * lfo_pan)
    right = mix * (1 + 0.08 * lfo_pan)

    peak = max(np.abs(left).max(), np.abs(right).max())
    left *= peak_target / peak
    right *= peak_target / peak

    stereo = np.empty(N * 2)
    stereo[0::2] = left
    stereo[1::2] = right
    pcm = (stereo * 32767).astype(np.int16)

    os.makedirs(os.path.dirname(out), exist_ok=True)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {out} ({dur:.2f}s)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", type=int, default=2140, help="timeline length in frames @30fps")
    ap.add_argument("--output", default="public/audio/bgm-zh.wav")
    args = ap.parse_args()
    build(args.frames / 30, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", args.output))
