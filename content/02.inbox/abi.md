---
title: abi
resource-path: 02.inbox/abi.md
aliases:
tags:
  - operating-system
  - c
date: 2025-01-22T18:31:00+09:00
lastmod: 2025-01-22T18:31:00+09:00
---
```
gcc-arm-[플렛폼]-[ABI 타입]


gcc-arm-linux-gnueabi/jammy 4:11.2.0-1ubuntu1 amd64
  GNU C compiler for the armel architecture

gcc-arm-linux-gnueabihf/jammy 4:11.2.0-1ubuntu1 amd64
  GNU C compiler for the armhf architecture

gcc-arm-none-eabi/jammy 15:10.3-2021.07-4 amd64
  GCC cross compiler for ARM Cortex-R/M processors

gcc-arm-none-eabi-source/jammy 15:10.3-2021.07-4 all
  GCC cross compiler for ARM Cortex-R/M processors (source)
```


arm-none-eabi-gcc

ABI는 "Application Binary Interface"의 약자로, 소프트웨어와 하드웨어 간의 상호작용을 정의하는 규약입니다. ABI는 다음과 같은 요소를 포함합니다:

- 데이터 타입: 데이터의 크기, 정렬 방식, 표현 방식 등을 정의합니다.
- 함수 호출 규약: 함수에 인자를 전달하는 방법, 반환 값 처리, 스택 관리 등을 규정합니다.
- 레지스터 사용: CPU 레지스터의 사용 방식과 어떤 레지스터가 어떤 용도로 사용되는지를 정의합니다.
- 바이너리 형식: 실행 파일과 라이브러리의 구조와 형식에 대해 설명합니다.