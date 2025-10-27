---
title: mjuecs-system-programming-ubuntu 이미지 설명
resource-path: 06.University/mju_ecs project/mjuecs-system-programming-ubuntu 이미지 설명.md
keywords:
tags:
date: 2025-06-03T06:05:16+09:00
lastmod: 2025-06-04T06:11:18+09:00
---
# mjuecs-system-programming-ubuntu 이미지 설명

> 본 이미지는 mjuecs-ubuntu 이미지에서 system-programming 실습시 필요할 거 같은 패키지들을 추가로 설치해놓은 추가 변형 이미지 입니다 아래는 해당 패키지에 대한 설명이 추가 되어 있습니다.

## 📦 시스템 프로그래밍을 위한 리눅스 패키지 목록

| 패키지명 | 설명 | 주요 용도 |
|----------|------|-----------|
| `build-essential` | C/C++ 컴파일 및 빌드에 필요한 핵심 도구 묶음 | 기본 개발 환경 구축 |
| `gcc` | GNU C Compiler | C 언어 소스 코드 컴파일 |
| `g++` | GNU C++ Compiler | C++ 언어 소스 코드 컴파일 |
| `make` | Makefile 기반 자동 빌드 도구 | 여러 파일로 구성된 프로젝트 빌드 관리 |
| `gdb` | GNU Debugger | 실행 중인 프로그램 디버깅 (변수, 메모리, 스택 등 확인) |
| `valgrind` | 메모리 디버깅 및 성능 분석 도구 | 메모리 누수, 잘못된 접근 감지 |
| `strace` | 시스템 콜 추적 도구 | 프로그램이 어떤 시스템 호출을 사용하는지 분석 |
| `ltrace` | 공유 라이브러리 함수 호출 추적 | 외부 라이브러리 함수 호출 내역 확인 |
| `pkg-config` | 라이브러리 정보 제공 도구 | 컴파일 시 필요한 옵션, 경로 등을 자동으로 불러옴 |
| `libssl-dev` | OpenSSL 개발 라이브러리 | SSL/TLS 관련 네트워크 프로그래밍에 필요 |
| `manpages-dev` | 개발자용 매뉴얼 페이지 (`man 2`, `man 3`) | 시스템 콜과 C 라이브러리 함수 문서 제공 |

---

## 💡 설치 명령어 예시:

```bash
sudo apt update
sudo apt install build-essential gcc g++ make gdb valgrind strace ltrace pkg-config libssl-dev manpages-dev
```

---

## 🔍 각 패키지의 활용 예시 (간단히)

| 패키지 | 예제 사용법 | 설명 |
|--------|--------------|-------|
| `gcc` | `gcc hello.c -o hello` | C 코드 컴파일 |
| `make` | `make all` | Makefile 기반 전체 빌드 |
| `gdb` | `gdb ./hello` → `run`, `break main`, `step` | 디버깅 시작, 중단점 설정 등 |
| `valgrind` | `valgrind --leak-check=yes ./hello` | 메모리 누수 체크 |
| `strace` | `strace ./hello` | 실행 중 시스템 콜 확인 |
| `ltrace` | `ltrace ./hello` | 외부 라이브러리 함수 호출 보기 |
| `pkg-config` | `gcc prog.c -o prog $(pkg-config --cflags --libs openssl)` | OpenSSL 사용 시 편리한 컴파일 옵션 자동 삽입 |
| `manpages-dev` | `man 2 read` 또는 `man 3 printf` | 시스템 콜(`read`)이나 라이브러리 함수(`printf`) 설명 보기 |