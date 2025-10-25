---
title: 터미널 command line shell
resource-path: temp/터미널 command line shell.md
aliases:
tags:
  - shell
  - linux
description: 리눅스 콘솔 환경에서 shell 의 관한 정보
series:
series_weight:
finish:
date: 2024-04-28T08:46:00+09:00
lastmod: 2025-08-11T00:45:47+09:00
---
터미널 command line 이라고 한정하여 shell 이라고 말한다면
일반적으로 /dev 파일 내부에 터미널 드라이브 장치를 통해 사용되는 shell 을 말한다 즉![[../08.media/20231223130204.png|login shell vs non-login shell-20231223130204]]2020231223130204.png)
## 분류
- login vs non-login : shell 이 다른 셸의 하위 프로세스로 실행되는가
- interactive vs non-interactive : 사용자와 상호작용하는가

## login shell vs non-login shell

> [!요약]
> Login Shell : userid passwd 입력해서 들어가는 방법
> Non Longin Shell : 이미 다른 로그인 된 shell 에서 shell 을 fork 형태로 불러내는 방법

초기에는 자원의 효과적인 사용을 위해서 사용된 개념이다
로그인 셸에서 할 수 있는 최대한의 환경 구성을 미리 해두면 이후 비로그인 셸에서 적게 환경구성을 할 수 있다

로그인 셸은 대화형 세션에서 로그인 할 때 사용자 id 로 실행되는 첫번째 프로세스 이다



## Interactive Shell vs non Interactive Shell
   타 프로그래밍 언어와의 큰 차이이다 interactive Shell 은 python 명령어 입력시 나타나는 것과 비슷한 것으로 사용자 입력을 순차적으로 입력 받을 수 있는 방식이다
   이에 반해 non interactive shell 은 `python hello.py` 같이 실행한다


## 로그인 셸 비로그인 셸 확인하기

```
prompt> echo $0 # 로그인 셸
-bash # "-" is the first character. Therefore, this is a login shell.

prompt> echo $0 # 비 로그인 셸
bash # "-" is NOT the first character. This is a non-login shell.
```

## 실행순서
`bash -lx` : -l 로그인 셸 -x 디버깅 : 로그인 셸이 실행한 모든 코드를 볼 수 있다

```
로그인 셸
1) /etc/profile
2) ~/.bash_profile    or    ~/.bash_login    or    ~/.profile

비로그인 셸
로그인 셸의 속성중 상속을 받을 수 있는 속성만 상속후
3) /etc/bashrc (우분투는 bash.bashrc)
4) ~/.bashrc

```

하지만 현실은... (우분투 기준)

```
if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi
구문으로 인해 
1) /etc/profile
2) ~/.bash_profile    or    ~/.bash_login    or    ~/.profile
3) /etc/bashrc (우분투는 bash.bashrc)
4) ~/.bashrc
순으로 실행된다
```

```
"로그인 셸의 속성중 상속을 받을 수 있는 속성만 상속후" 의 의미
ex) root 로 로그인 후 shinnk 로 비로그인 하면 
root의 .profile 설정과 shinnk의 .bashrc 설정을 가지게 된다

사용자 이동시에는 로그인 셸을 사용하자

그렇다면 상속을 받을 수 있는 속성이란 
```

## 특수 매게 변수
- `$1`, `$2`, `$3`, ...는 [위치 매개변수](https://www.gnu.org/software/bash/manual/html_node/Positional-Parameters.html) 입니다 .
- `"$@"`모든 위치 매개변수의 배열과 유사한 구성입니다 `{$1, $2, $3 ...}`.
- `"$*"`는 모든 위치 매개변수의 IFS 확장입니다 `$1 $2 $3 ...`.
- `$#`위치 매개변수의 수입니다.
- `$-`쉘에 설정된 현재 옵션.
- `$$`현재 쉘의 pid(서브쉘 아님)
- `$_`가장 최근 매개변수(또는 시작 후 즉시 현재 쉘을 시작하는 명령의 절대 경로).
- `$IFS`(입력) 필드 구분 기호입니다.
- `$?`가장 최근의 포그라운드 파이프라인 종료 상태입니다.
- `$!`가장 최근 백그라운드 명령의 PID입니다.
- `$0`쉘 또는 쉘 스크립트의 이름입니다


## 셸 옵션 변경
`set` 명령과 `shopt` 명령을 통해 셸의 옵션을 변경할 수 있는데
set 보다 shopt 가 조금더 고급의 추상화된 작업을 제공한다




## 셸 확장
### Brace Expansion
Brace expansion은 중괄호를 사용하여 표현식을 확장하여 여러 아이템을 생성합니다.
예시: `echo a{1,2,3}b`는 `a1b a2b a3b`로 확장됩니다.
### Tilde Expansion
Tilde expansion은 홈 디렉토리 경로를 나타내는 데 사용됩니다.
예시: `cd ~`는 사용자의 홈 디렉토리로 이동합니다. `echo ~user`는 `user`의 홈 디렉토리 경로를 출력합니다.
### Parameter and Variable Expansion
변수나 파라미터의 값을 대체합니다.
예시: `name="World"; echo Hello, $name!`는 `Hello, World!`로 확장됩니다.
### Command Substitution
명령어의 실행 결과를 대체합니다.
예시: `echo "Today is $(date)"`는 `Today is`와 `date` 명령어의 실행 결과로 확장됩니다.
### Arithmetic Expansion
산술 연산의 결과를 계산하여 대체합니다.
예시: `echo $((2 + 3))`는 `5`로 확장됩니다.
### Word Splitting
변수의 값을 IFS(Internal Field Separator)에 따라 단어로 나눕니다.
예시: `name="one two three"; echo $name`는 `one`, `two`, `three`로 나누어 출력합니다. 이는 IFS의 기본값이 공백, 탭, 개행 문자임을 반영합니다.
### Filename Expansion
와일드카드를 사용하여 파일 이름을 확장합니다.
예시: `echo *.txt`는 현재 디렉토리의 모든 `.txt` 파일 명을 출력합니다.
각 확장 방식은 스크립트를 보다 유연하고 강력하게 만들어주는 도구입니다. 적절히 사용하면 복잡한 작업을 간단하게 수행할 수 있습니다.
### Process Substitution (프로세스 치환)
프로세스의 입력이나 출력을 파일명을 사용하여 참조합니다. 예를 들어, `diff <(ls folder1) <(ls folder2)`는 두 디렉토리의 리스트를 출력하여 비교합니다.
### Quote Removal (인용 부호 제거)
이스케이프 문자, 인용 부호, 백슬래시의 비인용 인스턴스를 제거합니다. 예를 들어, `echo "Hello, \"World\"!"`는 `Hello, "World"!`를 결과로 나타냅니다.