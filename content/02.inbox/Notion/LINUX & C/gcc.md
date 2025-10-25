---
title: gcc
resource-path: 02.inbox/Notion/LINUX & C/gcc.md
aliases:
tags:
date: 2025-06-03T06:05:15+09:00
lastmod: 2025-10-01T19:17:13+09:00
---
GCC(GNU Compiler Collection)는 C 컴파일러입니다. C언어를 컴퓨터가 읽을 수 있도록 번역해야 하는데 리눅스에서는 Visual Studio C++과 같이 윈도우에서 쓰이는 프로그램이 사용 불가합니다. 그래서 리눅스용의 대표 C컴파일러가 GCC인 것입니다.

C 파일을 컴파일 할 경우의 단계는 아래와 같습니다.

![](https://blog.kakaocdn.net/dn/x8xPL/btq0HabcJAh/n5rCuGjzpUtynbDi3n00m0/img.png](https://blog.kakaocdn.net/dn/x8xPL/btq0HabcJAh/n5rCuGjzpUtynbDi3n00m0/img.png)



**전처리 단계** : c 파일을 gcc 컴파일러로 컴파일 할 경우 전처리 단계가 진행되는데 결과로 i 파일을 만들어냅니다.

이 단계에서는 헤더파일을 포함하고 매크로 확장을 합니다.

\#include <stdio.h> 와 같은 헤더파일 처리

\#define HUNDRED = 100 과 같은 매크로 처리

gcc는 cpp라는 전처리기를 사용하는데

**gcc -E hello.c -o hello.i**

를 입력하면 전처리 단계 까지만 진행되어 hello.i 파일이 생성됩니다.

**컴파일 단계** : 전처리된 파일로 컴파일을 진행하여 어셈블리어로 된 파일인 s 파일을 생성합니다. cll 을 사용합니다.

**gcc -S hello.c**

를 입력하면 hello.s 파일이 생성됩니다.

[![](https://blog.kakaocdn.net/dn/b0NjMT/btq1pz2N6Pn/WJLO8wtNHvxKz93vg9AlR0/img.png)](https://blog.kakaocdn.net/dn/b0NjMT/btq1pz2N6Pn/WJLO8wtNHvxKz93vg9AlR0/img.png)

hello.s 파일(어셈블리 코드)

**어셈블 단계** : 어셈블리어로 쓰여진 s 파일을 컴퓨터가 이해할 수 있는 기계어로 된 파일인 o 파일로 변환합니다. gcc는 as라는 어셈블러를 사용합니다.

**gcc -c hello.c**

이 명령어의 결과로 바이너리 파일인 hello.o(object 파일)을 얻을 수 있습니다.

**링크 단계** : 라이브러리 함수와 여러 오브젝트 파일들을 연결해서 실행 파일인 a.out을 생성합니다.

**gcc hello.c -o hello**

결과물은 코드와 데이터를 포함하는 실행 가능한 바이너리 파일인 hello.exe입니다.

아무리 간단한 C 프로그램이라고 해도 단계를 세분화 해서 보면 바로 실행 파일이 생성되는 것이 아니고 이와 같은 절차를 거칩니다.

임베디드 프로그래밍을 할 때 c 파일 뿐만 아니라 여러 가지 파일이 나오는데 잘 인식GCC(GNU Compiler Collection)는 C 컴파일러입니다. C언어를 컴퓨터가 읽을 수 있도록 번역해야 하는데 리눅스에서는 Visual Studio C++과 같이 윈도우에서 쓰이는 프로그램이 사용 불가합니다. 그래서 리눅스용의 대표 C컴파일러가 GCC인 것입니다.

C 파일을 컴파일 할 경우의 단계를 요약하면 아래와 같습니다.

[![](https://blog.kakaocdn.net/dn/eu1UH7/btq1qOk8XgQ/TeDREHIi6PjCq7umCjp3EK/img.png)](https://blog.kakaocdn.net/dn/eu1UH7/btq1qOk8XgQ/TeDREHIi6PjCq7umCjp3EK/img.png)

전처리 단계 : c 파일을 gcc 컴파일러로 컴파일 할 경우 전처리 단계가 진행되는데 결과로 i 파일을 만들어냅니다.

컴파일 단계 : 전처리된 파일로 어셈블리어로 된 파일인 s 파일을 생성합니다.

어셈블 단계 : 어셈블리어로 쓰여진 s 파일을 컴퓨터가 이해할 수 있는 기계어로 된 파일인 o 파일로 변환합니다.

링크 단계 : 라이브러리 함수와 여러 오브젝트 파일들을 연결해서 실행 파일인 a.out을 생성합니다.

아무리 간단한 C 프로그램이라고 해도 단계를 세분화 해서 보면 바로 실행 파일이 생성되는 것이 아니고 이와 같은 절차를 거칩니다.

임베디드 프로그래밍을 할 때 c 파일 뿐만 아니라 여러 가지 파일이 나오는데 당황하지 않을 수 있겠죠~

GCC와 연결해서 동작 할 수 있도록 해보겠습니다.

- E Preprocess only; do not compile, assemble or link.  
    -S Compile only; do not assemble or link.  
    -c Compile and assemble, but do not link.  
    -o <file> Place the output into <file>.  
    -pie Create a dynamically linked position independent  
    executable.  
    

  

  

- 출력 종류 제어: 실행 파일, 객체 파일, 어셈블러 파일 또는 사전 처리된 소스를 생성합니다.
- C 언어 방언 제어: 컴파일할 C 언어의 표준이나 변형을 지정합니다.
- 경고 옵션: 컴파일러가 얼마나 까다롭게 경고 메시지를 출력할지 결정합니다.
- 디버깅 옵션: 디버깅을 위한 정보를 코드에 삽입하거나 제거합니다.
- 최적화 옵션: 코드의 실행 속도나 크기를 최적화하는 방법을 선택합니다.
- 전처리기 옵션: 헤더 파일이나 매크로 정의를 제어하거나 종속성 정보를 생성합니다.
- 어셈블러 옵션: 어셈블러에게 전달할 옵션을 지정합니다.
- 링크 옵션: 라이브러리나 링커 스크립트를 지정하거나 링크 과정을 제어합니다.
- 디렉토리 옵션: 헤더 파일이나 라이브러리, 컴파일러 실행 파일을 찾을 수 있는 디렉토리를 추가하거나 변경합니다.
- 코드 생성 옵션: 함수 호출, 데이터 레이아웃, 레지스터 사용법 등과 관련된 규칙을 지정합니다.
- 개발자 옵션: GCC 구성 정보, 통계, 디버깅 덤프 등을 출력하거나 검사합니다.
- 하위 모델 옵션: 특정 프로세서 변형이나 타겟 아키텍처에 대한 컴파일을 수행합니다.

  

  

전처리 단계 **gcc -E hello.c -o hello.i**

컴파일 단계 **gcc -S hello.c**

어셈블 단계 **gcc -c hello.c**

링크 단계 **gcc hello.c -o hello**