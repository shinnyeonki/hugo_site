---
title: clang + llvm
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 02.inbox/Notion/LINUX & C/clang + llvm.md
draft: true
---
소스코드(.c) → 중간코드(.ll, .bc, .o) → 기계어

1. 소스코드(.c) → 중간코드((.ll, .bc, .o)
    1. 소스코드 → LLVM IR(LLVM Intermediate Representation)
    2. 프론트 엔드 컴파일러인 clang 가 이 기능을 담당한다
    3. LLVM IR은 .ll 형식을 가진 LLVM 어셈블리(LLVM Assembly)[](https://namu.wiki/w/LLVM%5C#fn-3)와 .bc 형식을 가진 LLVM 비트코드(LLVM Bitcode), 그리고 .o 형식을 가진 C++ 목적 코드(C++ Object Code)로 분류된다.
    4. LLVM IR은 아키텍쳐 독립적이다