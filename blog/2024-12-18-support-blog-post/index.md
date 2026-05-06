---
title: Introducing HAMi
date: "2024-12-18"
slug: introducing-hami
description: "An introduction to HAMi (Heterogeneous AI Computing Virtualization Middleware), a Kubernetes-native solution for managing heterogeneous AI computing devices with resource isolation and unified management."
keywords: [HAMi, GPU virtualization, Kubernetes, heterogeneous computing]
tags: [Introduction, GPU Sharing, Kubernetes]
authors: [hami_community]
---

## What is HAMi?

HAMi (Heterogeneous AI Computing Virtualization Middleware), formerly known as k8s-vGPU-scheduler, manages heterogeneous AI computing devices within Kubernetes clusters. It enables sharing of various AI devices while enforcing resource isolation between tasks, and provides a unified interface for different device types.

<!-- truncate -->

## Why Choose HAMi?

### Kubernetes Native API Compatibility

HAMi is compatible with Kubernetes' native API. Users can adopt HAMi without changing existing configurations, and Kubernetes default behavior is preserved.

### Open and Neutral

HAMi is developed by stakeholders from internet services, finance, manufacturing, and cloud providers. Governance is open under the Cloud Native Computing Foundation (CNCF).

### Avoid Vendor Lock-in

HAMi integrates with mainstream cloud providers without requiring proprietary vendor orchestration. Organizations can use their preferred cloud solutions alongside HAMi.

### Resource Isolation

HAMi enforces resource isolation within containers. Each task is restricted to its allocated resources, preventing quota overuse. Hard limits improve security and stability.

### Support for a Variety of Heterogeneous Computing Devices

HAMi supports GPUs, MLUs, NPUs, and other accelerators from multiple vendors. Devices can be shared across tasks, improving resource efficiency.

### Unified Management

HAMi includes a unified monitoring system and configurable scheduling policies such as bin packing and spreading.

## Get Started

HAMi works with existing Kubernetes configurations and supports multiple device vendors. See the [installation guide](/docs/get-started/deploy-with-helm) to deploy it in your cluster.
