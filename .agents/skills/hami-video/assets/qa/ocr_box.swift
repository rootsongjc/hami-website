// macOS Vision OCR box-scan for video QA stills (zh-Hans + en-US).
// Usage: swift ocr_box.swift still1.png still2.png ...
// Prints per image: "== file" then "  [x0-x1 y0-y1] text" per recognized line
// (pixels, origin top-left — already flipped from Vision's bottom-left boxes).
import Vision
import AppKit

for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: path),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("== \(path): FAILED TO LOAD"); continue
    }
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    req.recognitionLanguages = ["zh-Hans", "en-US"]
    try? handler.perform([req])
    print("== \((path as NSString).lastPathComponent)")
    for obs in (req.results ?? []) {
        guard let cand = obs.topCandidates(1).first else { continue }
        let b = obs.boundingBox // normalized, origin bottom-left
        let x0 = Int(b.origin.x * CGFloat(cg.width))
        let y0 = Int(b.origin.y * CGFloat(cg.height))
        let w = Int(b.width * CGFloat(cg.width))
        let h = Int(b.height * CGFloat(cg.height))
        print("  [x\(x0)-\(x0+w) y\(cg.height-y0-h)-\(cg.height-y0)] \(cand.string)")
    }
}
