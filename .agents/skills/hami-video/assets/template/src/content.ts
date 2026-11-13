// ---------------------------------------------------------------------------
// HAMi v2.11.0 announcement — all copy lives here.
// Add/complete a locale object with the same shape to render another language:
//   npx remotion render HAMI211EN out/hami-v2.11.0-announcement-en.mp4
// Scene order & durations live in TIMING below.
// ---------------------------------------------------------------------------

export interface Bullet {
  text: string;
}
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sub: string;
}
export interface PolicyCard {
  name: string;
  desc: string;
}
export interface MoreCard {
  title: string;
  desc: string;
}

export interface VideoContent {
  meta: {
    project: string;
    version: string;
    releaseDate: string;
    cncf: string;
  };
  intro: {
    kicker: string;
    released: string;
    tagline: string;
    date: string;
  };
  stats: {
    kicker: string;
    title: string;
    items: StatItem[];
  };
  remoteGpu: {
    kicker: string;
    title: string;
    subtitle: string;
    clientNode: { title: string; sub: string; pod: string; inject: string };
    serverNode: { title: string; sub: string; gpuLabel: string; label: string };
    wireLabel: string;
    bullets: string[];
  };
  amd: {
    kicker: string;
    title: string;
    subtitle: string;
    cardTitle: string;
    cardSub: string;
    bars: { label: string; value: string; fill: number }[];
    chips: string[];
    bullets: string[];
  };
  ascend: {
    kicker: string;
    title: string;
    subtitle: string;
    policies: PolicyCard[];
    dieNote: string;
    bullets: string[];
  };
  numa: {
    kicker: string;
    title: string;
    subtitle: string;
    cpuChip: string;
    gpuChip: string;
    center: string;
    event: string;
    bullets: string[];
  };
  more: {
    kicker: string;
    title: string;
    cards: MoreCard[];
  };
  upgrade: {
    kicker: string;
    title: string;
    terminalTitle: string;
    command: string;
    notes: string[];
    linkLabel: string;
    links: string[];
  };
  outro: {
    tagline: string;
    line2: string;
    thanks: string;
    links: string[];
    cncf: string;
    ctaHeadline: string;
    starButton: string;
    starSub: string;
    qrTitle?: string;
    qrSub?: string;
    qrImage?: string;
    webButton?: string;
    webSub?: string;
  };
}

// ------------------------------- Chinese ----------------------------------
const zh: VideoContent = {
  meta: {
    project: "HAMi",
    version: "v2.11.0",
    releaseDate: "2026.11.04",
    cncf: "CNCF Incubating",
  },
  intro: {
    kicker: "RELEASE ANNOUNCEMENT",
    released: "正式发布",
    tagline: "云原生 GPU 虚拟化中间件",
    date: "2026 年 11 月 4 日",
  },
  stats: {
    kicker: "BY THE NUMBERS · 发布规模",
    title: "一次大版本,社区一起迈出的一大步",
    items: [
      { value: 220, suffix: "+", label: "合并的 Pull Request", sub: "功能、修复与文档" },
      { value: 50, suffix: "+", label: "社区贡献者", sub: "横跨主仓与卫星项目" },
      { value: 29, suffix: "", label: "首次贡献者", sub: "欢迎新同学" },
    ],
  },
  remoteGpu: {
    kicker: "01 · REMOTE GPU",
    title: "Remote GPU:算力随网络而至",
    subtitle: "无 GPU、无驱动的客户端节点,也能运行 CUDA 与 vLLM",
    clientNode: {
      title: "客户端节点",
      sub: "无 GPU · 无 NVIDIA 驱动",
      pod: "vLLM / CUDA Pod",
      inject: "init 容器注入 Lupine 客户端库",
    },
    serverNode: {
      title: "Lupine GPU 服务器",
      sub: "GPU 经网络对外提供算力",
      gpuLabel: "GPU",
      label: "hami.io/lupine-server",
    },
    wireLabel: "nvidia.com/remote-gpu",
    bullets: [
      "GPU 节点可专职 Lupine 服务器,按节点标签划分资源池",
      "整机预留 + 可选的每 GPU 显存上限,容器内强制执行",
      "vLLM 0.19 – 0.26 官方镜像开箱即用",
    ],
  },
  amd: {
    kicker: "02 · AMD INSTINCT",
    title: "AMD GPU 成为一等公民",
    subtitle: "ROCm GPU 共享,与 NVIDIA 同一调度层统一管理",
    cardTitle: "AMD INSTINCT",
    cardSub: "ROCm · amd.com/gpu",
    bars: [
      { label: "显存隔离", value: "gpumem / gpumem-percentage", fill: 0.62 },
      { label: "算力隔离", value: "HSA_CU_MASK", fill: 0.45 },
    ],
    chips: ["NUMA 绑定", "XGMI 感知", "topology-aware", "binpack · spread · mutex"],
    bullets: [
      "amd-hami-core 在容器内强制显存与算力上限",
      "多 GPU Pod 可绑定同一 NUMA 或同一 XGMI 组",
      "DRA 路径就绪:amd-dra-driver 已发布",
    ],
  },
  ascend: {
    kicker: "03 · ASCEND ENPU",
    title: "昇腾 ENPU:第三种切分模式",
    subtitle: "与 template、hami-core 并列,策略化的资源隔离",
    policies: [
      { name: "fixed-share", desc: "固定份额" },
      { name: "elastic", desc: "弹性共享" },
      { name: "best-effort", desc: "尽力而为" },
    ],
    dieNote: "DIE 级隔离 · 策略互斥的租户互不干扰",
    bullets: [
      "配额不经过硬件模板取整,按请求直达",
      "hami-vnpu-core 锁竞争大幅优化,并发推理显著提速",
      "新增昇腾 950 整卡调度支持",
    ],
  },
  numa: {
    kicker: "04 · NUMA REFIT",
    title: "CPU 与 GPU 调度,终于对齐",
    subtitle: "kubelet Topology Manager 与 HAMi 调度器达成一致",
    cpuChip: "CPU Manager · cpuset",
    gpuChip: "HAMi 调度器 · GPU",
    center: "同一 NUMA 节点",
    event: "NumaRefitSucceed",
    bullets: [
      "Pod 注解 hami.io/numa-alignment:strict / best-effort",
      "调度器在 kubelet 允许的设备集合内重新放置",
      "真机验证:CPU 亲和与 GPU 落在同一 NUMA",
    ],
  },
  more: {
    kicker: "05 · AND MORE",
    title: "更多更新,一次看清",
    cards: [
      { title: "Flexible MIG 成熟", desc: "动态 MIG 支持 CDI 注入与带回退的放置打分" },
      { title: "调度器更安全", desc: "extender / webhook 加固,回环端口 + 身份校验" },
      { title: "OpenShift & SELinux", desc: "SCC 自动创建,SELinux 目录重标" },
      { title: "Cluster Autoscaler", desc: "GPU 显存与算力上报至节点容量" },
      { title: "观测性增强", desc: "NVML 直采、硬件健康与错误指标" },
      { title: "官网大改版", desc: "新信息架构 + Concepts 重绘 + llms.txt" },
    ],
  },
  upgrade: {
    kicker: "06 · UPGRADE",
    title: "一条命令,升级 v2.11.0",
    terminalTitle: "helm — upgrade",
    command:
      "helm repo add hami-charts https://Project-HAMi.github.io/charts/\nhelm upgrade hami hami-charts/hami \\\n  -n kube-system --version 2.11.0",
    notes: [
      "chart 值结构已重构(devices.VENDOR)",
      "自定义 values.yaml 请按升级指南迁移",
    ],
    linkLabel: "发布说明与升级指南",
    links: ["github.com/Project-HAMi/HAMi/releases/tag/v2.11.0", "project-hami.io"],
  },
  outro: {
    tagline: "开源的云原生 GPU 虚拟化中间件",
    line2: "为 AI 工作负载提供异构加速器的共享、隔离与调度能力",
    thanks: "感谢每一位贡献者",
    links: ["project-hami.io", "github.com/Project-HAMi/HAMi"],
    cncf: "CNCF Incubating 项目",
    ctaHeadline: "欢迎到 GitHub 给 HAMi 点个 Star",
    starButton: "github.com/Project-HAMi/HAMi",
    starSub: "Star 是对社区最好的鼓励",
    qrTitle: "扫码添加社区小助手",
    qrSub: "加入 HAMi 微信社区",
    qrImage: "img/wechat-assistant-qr.jpg",
  },
};

// ------------------------------- English ----------------------------------
// Ready to render as soon as you want the EN cut:
//   npx remotion render HAMI211EN out/hami-v2.11.0-announcement-en.mp4
const en: VideoContent = {
  meta: {
    project: "HAMi",
    version: "v2.11.0",
    releaseDate: "2026.11.04",
    cncf: "CNCF Incubating",
  },
  intro: {
    kicker: "RELEASE ANNOUNCEMENT",
    released: "Officially Released",
    tagline: "Cloud-native GPU virtualization middleware",
    date: "November 4, 2026",
  },
  stats: {
    kicker: "BY THE NUMBERS",
    title: "One major release, a big community step",
    items: [
      { value: 220, suffix: "+", label: "Pull requests merged", sub: "Features, fixes and docs" },
      { value: 50, suffix: "+", label: "Contributors", sub: "Across the main repo and satellites" },
      { value: 29, suffix: "", label: "First-time contributors", sub: "Welcome aboard!" },
    ],
  },
  remoteGpu: {
    kicker: "01 · REMOTE GPU",
    title: "Remote GPU: compute over the network",
    subtitle: "Run CUDA and vLLM on GPU-less, driver-less client nodes",
    clientNode: {
      title: "Client node",
      sub: "No GPU · No NVIDIA driver",
      pod: "vLLM / CUDA Pod",
      inject: "Lupine client libs injected via init container",
    },
    serverNode: {
      title: "Lupine GPU server",
      sub: "GPUs served over the network",
      gpuLabel: "GPU",
      label: "hami.io/lupine-server",
    },
    wireLabel: "nvidia.com/remote-gpu",
    bullets: [
      "GPU nodes can dedicate themselves to Lupine, pooled by node label",
      "Whole-server reservation + optional per-GPU memory cap, enforced in-container",
      "vLLM 0.19 – 0.26 official images work out of the box",
    ],
  },
  amd: {
    kicker: "02 · AMD INSTINCT",
    title: "AMD GPUs are now first-class",
    subtitle: "ROCm GPU sharing behind the same scheduler as NVIDIA",
    cardTitle: "AMD INSTINCT",
    cardSub: "ROCm · amd.com/gpu",
    bars: [
      { label: "Memory isolation", value: "gpumem / gpumem-percentage", fill: 0.62 },
      { label: "Compute isolation", value: "HSA_CU_MASK", fill: 0.45 },
    ],
    chips: ["NUMA bind", "XGMI aware", "topology-aware", "binpack · spread · mutex"],
    bullets: [
      "amd-hami-core enforces memory and compute caps inside the container",
      "Multi-GPU Pods can bind to one NUMA node or one XGMI group",
      "DRA path ready: amd-dra-driver released",
    ],
  },
  ascend: {
    kicker: "03 · ASCEND ENPU",
    title: "Ascend ENPU: a third partitioning mode",
    subtitle: "Alongside template and hami-core, with policy-based isolation",
    policies: [
      { name: "fixed-share", desc: "Guaranteed share" },
      { name: "elastic", desc: "Elastic sharing" },
      { name: "best-effort", desc: "Best effort" },
    ],
    dieNote: "DIE-level isolation · tenants with clashing policies never share a DIE",
    bullets: [
      "Quotas pass through without hardware-template rounding",
      "hami-vnpu-core lock-contention overhaul, much faster concurrent inference",
      "Ascend 950 whole-card scheduling added",
    ],
  },
  numa: {
    kicker: "04 · NUMA REFIT",
    title: "CPU and GPU scheduling finally agree",
    subtitle: "kubelet's Topology Manager and HAMi's scheduler, aligned",
    cpuChip: "CPU Manager · cpuset",
    gpuChip: "HAMi scheduler · GPU",
    center: "Same NUMA node",
    event: "NumaRefitSucceed",
    bullets: [
      "Pod annotation hami.io/numa-alignment: strict / best-effort",
      "The scheduler re-places within kubelet's allowed device set",
      "Validated on real hardware: cpuset and GPU on the same NUMA",
    ],
  },
  more: {
    kicker: "05 · AND MORE",
    title: "Everything else, at a glance",
    cards: [
      { title: "Flexible MIG grows up", desc: "CDI injection and backtracking placement for dynamic MIG" },
      { title: "A harder scheduler", desc: "Extender / webhook hardening, loopback + identity checks" },
      { title: "OpenShift & SELinux", desc: "SCC creation and SELinux relabeling" },
      { title: "Cluster Autoscaler", desc: "GPU memory and cores reported in node capacity" },
      { title: "Observability boost", desc: "Direct NVML metrics, hardware health and error metrics" },
      { title: "Website overhaul", desc: "New IA + redrawn Concepts + llms.txt" },
    ],
  },
  upgrade: {
    kicker: "06 · UPGRADE",
    title: "Upgrade to v2.11.0 in one command",
    terminalTitle: "helm — upgrade",
    command:
      "helm repo add hami-charts https://Project-HAMi.github.io/charts/\nhelm upgrade hami hami-charts/hami \\\n  -n kube-system --version 2.11.0",
    notes: [
      "Chart values restructured (devices.VENDOR)",
      "Migrate custom values.yaml via the upgrade guide",
    ],
    linkLabel: "Release notes & upgrade guide",
    links: ["github.com/Project-HAMi/HAMi/releases/tag/v2.11.0", "project-hami.io"],
  },
  outro: {
    tagline: "Open-source cloud-native GPU virtualization middleware",
    line2: "Sharing, isolation and scheduling for heterogeneous AI accelerators",
    thanks: "Thank you to every contributor",
    links: ["project-hami.io", "github.com/Project-HAMi/HAMi"],
    cncf: "A CNCF Incubating project",
    ctaHeadline: "Get involved",
    starButton: "Star HAMi on GitHub",
    starSub: "Stars keep the community going",
    webButton: "project-hami.io",
    webSub: "Docs, guides and the full story",
  },
};

export const CONTENT: Record<"zh" | "en", VideoContent> = { zh, en };

// ------------------------------ Durations ----------------------------------
// Scene lengths in frames @30fps, per locale, narration-driven.
// Generated by scripts/build_narration.py (measures TTS audio and adds padding).
import timingJson from "./timing.generated.json";

export type SceneKey =
  | "intro"
  | "stats"
  | "remoteGpu"
  | "amd"
  | "ascend"
  | "numa"
  | "more"
  | "upgrade"
  | "outro";

export const TIMING: Record<"zh" | "en", Record<SceneKey, number>> = {
  zh: timingJson.zh,
  en: timingJson.en,
};

export const totalFrames = (locale: "zh" | "en"): number =>
  Object.values(TIMING[locale]).reduce((a, b) => a + b, 0);
