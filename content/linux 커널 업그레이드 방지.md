---
title: linux 커널 업그레이드 방지
resource-path: linux 커널 업그레이드 방지.md
aliases:
tags:
date: 2025-09-02T15:56:20+09:00
lastmod: 2025-10-23T04:34:06+09:00
---
### 1. kernel-headers 설치 (없을 경우)

`sudo apt install raspberrypi-kernel-headers`

### 2. 핵심 패키지 hold

```
sudo apt-mark hold \
    raspberrypi-kernel \
    raspberrypi-kernel-headers \
    raspberrypi-bootloader \
    libraspberrypi0 \
    libraspberrypi-bin
```

### 3. hold 상태 확인

`sudo apt-mark showhold`

```bash
# 1. kernel-headers 설치 (없을 경우)
sudo apt install raspberrypi-kernel-headers

# 2. 핵심 패키지 hold
sudo apt-mark hold \
    raspberrypi-kernel \
    raspberrypi-kernel-headers \
    raspberrypi-bootloader \
    libraspberrypi0 \
    libraspberrypi-bin

# 3. hold 상태 확인
sudo apt-mark showhold

```
