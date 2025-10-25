---
title: [임베디드] c 파일, i 파일, s 파일, o 파일(C 파일의 빌드 과정)
resource-path: 05.clipping/임베디드 c 파일, i 파일, s 파일, o 파일(C 파일의 빌드 과정).md
series: https://clearwater92.tistory.com/39
author:
  - "[[clearwater]]"
published: 2021-03-22
date: 2025-10-01
description: "GCC(GNU Compiler Collection)는 C 컴파일러입니다. C언어를 컴퓨터가 읽을 수 있도록 번역해야 하는데 리눅스에서는 Visual Studio C++과 같이 윈도우에서 쓰이는 프로그램이 사용 불가합니다. 그래서 리눅스용의 대표 C컴파일러가 GCC인 것입니다. C 파일을 컴파일 할 경우의 단계는 아래와 같습니다. 전처리 단계 : c 파일을 gcc 컴파일러로 컴파일 할 경우 전처리 단계가 진행되는데 결과로 i 파일을 만들어냅니다. 이 단계에서는 헤더파일을 포함하고 매크로 확장을 합니다. #include 와 같은 헤더파일 처리 #define HUNDRED = 100 과 같은 매크로 처리 gcc는 cpp라는 전처리기를 사용하는데 gcc -E hello.c -o hello.i 를 입력하면 전처리.."
tags:
  - clippings
---
[본문 바로가기](https://clearwater92.tistory.com/#dkBody)

---

**관리 메뉴**
- [글쓰기](https://clearwater92.tistory.com/manage/entry/post "글쓰기")
- [방명록](https://clearwater92.tistory.com/guestbook "방명록")
- [관리](https://clearwater92.tistory.com/manage "관리")

## 하나씩 알아가기

## \[임베디드\] c 파일, i 파일, s 파일, o 파일(C 파일의 빌드 과정) 본문

### \[임베디드\] c 파일, i 파일, s 파일, o 파일(C 파일의 빌드 과정)

clearwater 2021. 3. 22. 18:52

GCC(GNU Compiler Collection)는 C 컴파일러입니다. C언어를 컴퓨터가 읽을 수 있도록 번역해야 하는데 리눅스에서는 Visual Studio C++과 같이 윈도우에서 쓰이는 프로그램이 사용 불가합니다. 그래서 리눅스용의 대표 C컴파일러가 GCC인 것입니다.

C 파일을 컴파일 할 경우의 단계는 아래와 같습니다.

![|484x135](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fx8xPL%2Fbtq0HabcJAh%2FAAAAAAAAAAAAAAAAAAAAANgUQzVK8XIERQ-vN_51KV9CNBPL9b-U3RQnTbnHBQWR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3Dw5SavbZCx%252FvwB5QvzlwXj4ws29g%253D)

**전처리 단계**: c 파일을 gcc 컴파일러로 컴파일 할 경우 전처리 단계가 진행되는데 결과로 i 파일을 만들어냅니다.

이 단계에서는 헤더파일을 포함하고 매크로 확장을 합니다.

\#include <stdio.h> 와 같은 헤더파일 처리

\#define HUNDRED = 100 과 같은 매크로 처리

gcc는 cpp라는 전처리기를 사용하는데

**gcc -E hello.c -o hello.i**

를 입력하면 전처리 단계 까지만 진행되어 hello.i 파일이 생성됩니다.

**컴파일 단계**: 전처리된 파일로 컴파일을 진행하여 어셈블리어로 된 파일인 s 파일을 생성합니다. cll 을 사용합니다.

**gcc -S hello.c**

를 입력하면 hello.s 파일이 생성됩니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb0NjMT%2Fbtq1pz2N6Pn%2FAAAAAAAAAAAAAAAAAAAAAHNVG4D3l1GbNEDQPyM8wlCzgU_B10_S1AqdAtjg_icm%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D3H0FXadVWoOBV8Ar7CvQDaVcOXQ%253D)

hello.s 파일(어셈블리 코드)

**어셈블 단계**: 어셈블리어로 쓰여진 s 파일을 컴퓨터가 이해할 수 있는 기계어로 된 파일인 o 파일로 변환합니다. gcc는 as라는 어셈블러를 사용합니다.

**gcc -c hello.c**

이 명령어의 결과로 바이너리 파일인 hello.o(object 파일)을 얻을 수 있습니다.

**링크 단계**: 라이브러리 함수와 여러 오브젝트 파일들을 연결해서 실행 파일인 a.out을 생성합니다.

**gcc hello.c -o hello**

결과물은 코드와 데이터를 포함하는 실행 가능한 바이너리 파일인 hello.exe입니다.

아무리 간단한 C 프로그램이라고 해도 단계를 세분화 해서 보면 바로 실행 파일이 생성되는 것이 아니고 이와 같은 절차를 거칩니다.

임베디드 프로그래밍을 할 때 c 파일 뿐만 아니라 여러 가지 파일이 나오는데 잘 인식GCC(GNU Compiler Collection)는 C 컴파일러입니다. C언어를 컴퓨터가 읽을 수 있도록 번역해야 하는데 리눅스에서는 Visual Studio C++과 같이 윈도우에서 쓰이는 프로그램이 사용 불가합니다. 그래서 리눅스용의 대표 C컴파일러가 GCC인 것입니다.

C 파일을 컴파일 할 경우의 단계를 요약하면 아래와 같습니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Feu1UH7%2Fbtq1qOk8XgQ%2FAAAAAAAAAAAAAAAAAAAAAD7kgMOO7IdoZ9Zyp5Sk-7H8rNdMhmpRFRiaOaZ-LT0m%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D5EsitznxydhomKVz6bozF1guyu4%253D)

전처리 단계: c 파일을 gcc 컴파일러로 컴파일 할 경우 전처리 단계가 진행되는데 결과로 i 파일을 만들어냅니다.

컴파일 단계: 전처리된 파일로 어셈블리어로 된 파일인 s 파일을 생성합니다.

어셈블 단계: 어셈블리어로 쓰여진 s 파일을 컴퓨터가 이해할 수 있는 기계어로 된 파일인 o 파일로 변환합니다.

링크 단계: 라이브러리 함수와 여러 오브젝트 파일들을 연결해서 실행 파일인 a.out을 생성합니다.

아무리 간단한 C 프로그램이라고 해도 단계를 세분화 해서 보면 바로 실행 파일이 생성되는 것이 아니고 이와 같은 절차를 거칩니다.

임베디드 프로그래밍을 할 때 c 파일 뿐만 아니라 여러 가지 파일이 나오는데 당황하지 않을 수 있겠죠~

GCC와 연결해서 동작 할 수 있도록 해보겠습니다.

[\[ 리눅스 \] gcc 동작과정: 네이버 블로그 (naver.com)](https://m.blog.naver.com/PostView.nhn?blogId=ekthatkxkd&logNo=221218928935&proxyReferer=https:%2F%2Fwww.google.com%2F)

[C언어 빌드 과정 (build process) (brunch.co.kr)](https://brunch.co.kr/@mystoryg/57)

[

C언어 빌드 과정 (build process)

with gcc | 프로그래밍을 처음 시작하면 만나는 첫 예제는 hello world 출력이 아닐까 싶다. 그런데 이 쉬운 예제, 빌드 과정은 어떻게 될까? \#include int main() { printf("hello world!"); return 0; } 일단 hel

brunch.co.kr

](https://brunch.co.kr/@mystoryg/57)

[저작자표시 (새창열림)](https://creativecommons.org/licenses/by/4.0/deed.ko)

#### '' 카테고리의 다른 글

| [\[임베디드\] 오실로스코프로 신호 측정](https://clearwater92.tistory.com/41) (0) | 2021.03.25 |
| --- | --- |
| [\[임베디드\] KEIL uVision5에서 프로젝트 생성하기](https://clearwater92.tistory.com/40) (0) | 2021.03.23 |
| [\[임베디드\] JTAG, JLINK란 무엇인가](https://clearwater92.tistory.com/38) (0) | 2021.03.22 |
| [\[임베디드\] STM32F103RC](https://clearwater92.tistory.com/37) (0) | 2021.03.22 |
| [\[임베디드\] 갑자기 다른 분야로 들어왔다](https://clearwater92.tistory.com/36) (0) | 2021.03.19 |

---

Blog is powered by [kakao](http://www.kakaocorp.com/) / Designed by [Tistory](http://www.tistory.com/)