---
title: bash
resource-path: temp/bash.md
keywords:
tags:
  - shell
date: 2024-02-21T16:50:00+09:00
lastmod: 2024-02-21T16:50:00+09:00
---
## \.\/ vs source \=\= \.

[도트 및 소스 연산자 공식문서](https://ss64.com/bash/source.html)
source 와 . 은 완벽하게 동일
test.sh 파일
```shell
ps -ejH # 플로세스를 tree 형태로 보여주는 명령
```
실행별 차이
```shell
User@HostName:~/test$ . test.sh # . or source 
    PID    PGID     SID TTY          TIME CMD
   3996    3996    3996 ?        00:00:00     SessionLeader
   3998    3996    3996 ?        00:00:00       Relay(4003)
   4003    4003    4003 pts/6    00:00:00         bash
  39032   39032    4003 pts/6    00:00:00           ps 
User@HostName:~/test$ ./test.sh # ./
    PID    PGID     SID TTY          TIME CMD
   3996    3996    3996 ?        00:00:00     SessionLeader
   3998    3996    3996 ?        00:00:00       Relay(4003)
   4003    4003    4003 pts/6    00:00:00         bash
  39255   39255    4003 pts/6    00:00:00           test.sh # !!!!!!!!!
  39256   39255    4003 pts/6    00:00:00             ps
```

./test.sh의 경우 다른 명령(gcc)와 마찬가지로 명령을 셸에서 해석하여 시스템에게 전달하며 새로운 프로세스<u> fork() 형태로 하위 프로세스로 생성한다?</u> #ModificationRequired 

하지만 

. test.sh 또는 source test.sh 의 경우는 현재 실행되고 있는 셸이 직접 실행하는 것이다 그로므로 test.sh 에 선언된 전역변수가 현재 셸에 적용된다

bash 파일 실행시 interactive shell 인가 non interactive shell 인가의 차이
일반 파일 실행시 










이 코드는 Bash 스크립트로, 깃 상태 정보를 비동기적으로 반환하는 데몬 프로세스인 `gitstatusd`를 시작하는 데 사용됩니다. 스크립트의 각 부분을 하나씩 분석해 보겠습니다.

## 1. Bash 버전 확인

```bash
if [ "$BASH_VERSION" < 4 ](%20"$BASH_VERSION"%20<%204%20); then
   # 에러 메시지를 표준 에러(stderr)에 출력하고 함수를 종료합니다.
   return 1
fi
```

이 부분은 현재 실행 중인 Bash의 버전이 4.0 이상인지 확인합니다. 그렇지 않다면, 사용자에게 메시지를 출력하고 함수를 종료합니다.

## 2. 옵션 파싱

```bash
unset OPTIND
local opt timeout=5 max_dirty=-1 ttl=3600 extra_flags=...

while getopts "t:s:u:c:d:m:r:eUWD" opt; do
  case "$opt" in
    ...
  esac
done

(( OPTIND == $# + 1 )) || { echo "usage: gitstatus_start [OPTION]..." >&2; return 1; }

[ -z "${GITSTATUS_DAEMON_PID:-}" ](%20-z%20"${GITSTATUS_DAEMON_PID:-}"%20) || return 0
```

스크립트 실행 시 전달된 명령줄 옵션들을 처리합니다. `getopts` 빌트인을 사용하여 각각의 옵션에 대한 값을 지역 변수에 할당합니다.

## 3. 플러그인 디렉터리 설정

```bash
if [ "${BASH_SOURCE[0](%20"${BASH_SOURCE[0); then
   ...
fi
```

`gitstatus_plugin_dir` 변수는 스크립트 파일이 있는 디렉터리 경로를 설정합니다. 이 경로는 후속 명령어에서 사용됩니다.

## 4. `gitstatus_start_impl` 함수

이 함수는 데몬 프로세스를 시작하고, 필요한 파일 FIFO (First-In First-Out) 특수 파일을 생성 및 구성하고, 데몬과 통신을 설정합니다.

```bash
function gitstatus_start_impl() {
   ...
}
```

## 5. tmpdir 설정 및 FIFO 파일 생성

```bash
tmpdir="$(command mktemp -d "$tmpdir"/gitstatus.bash.$$.XXXXXXXXXX)" || return

command mkfifo -- "$req_fifo" "$resp_fifo" || return
```

임시 디렉터리를 생성하고, 데몬에 요청을 보내고 응답을 받는데 사용될 FIFO 파일을 만듭니다.

## 6. 데몬 프로세스 시작

```bash
source "$gitstatus_plugin_dir"/install      || return
"$_gitstatus_bash_daemon" ... <&"$fd_in" >&"$fd_out" &
```

`install` 스크립트를 소스화 함으로써 데몬 프로세스를 가져오고 구동합니다.

## 7. 파일 디스크립터 할당 및 정리

```bash
exec {_GITSTATUS_REQ_FD}>>"$req_fifo" {_GITSTATUS_RESP_FD}<"$resp_fifo" || return
command rm -f -- "$req_fifo" "$resp_fifo"                                 || return
```

읽기 및 쓰기 작업을 위해 파일 디스크립터를 FIFO 파일에 할당하고, 더 이상 필요하지 않은 파일은 제거합니다.

## 8. 데몬 초기화 확인

```bash
IFS='' read -r -u $_GITSTATUS_RESP_FD GITSTATUS_DAEMON_PID || return
[ "$GITSTATUS_DAEMON_PID" == [1-9](%20"$GITSTATUS_DAEMON_PID"%20==%20[1-9) || return
```

데몬 프로세스가 성공적으로 시작되었는지 확인하고, 그 PID를 저장합니다.

## 9. 청소

```bash
unset -f gitstatus_start_impl
```

필요하지 않은 함수를 삭제하고, 청소 작업을 수행합니다.

## 10. 환경 변수 내보내기

```bash
export _GITSTATUS_CLIENT_PID _GITSTATUS_REQ_FD _GITSTATUS_RESP_FD GITSTATUS_DAEMON_PID
```

데몬 관련 변수를 내보내어 다른 스크립트에서 사용할 수 있게 합니다.

## 전체적인 요약

이 스크립트는 `gitstatusd` 데몬을 시작하고, 해당 데몬과 통신할 수 있게 준비하는 일련의 과정을 수행합니다. 이를 통해 git 저장소의 상태 정보를 빠르게 제공받을 수 있으며, 쉘 프롬프트를 더 효율적으로 만들어 주는 기능을 제공합니다.


=======================

이 코드는 `gitstatus_start`라는 함수를 정의하고 있습니다. 이 함수는 git 상태를 빠르게 가져오는데 사용되는 `gitstatusd` 데몬을 시작하는 역할을 합니다. 각 부분의 목적과 문법은 다음과 같습니다:

1. **BASH 버전 확인**: 이 코드는 BASH 버전이 4.0 이상인지 확인합니다. 이는 `gitstatusd`가 BASH 4.0 이상에서만 작동하기 때문입니다.

```bash
if [ "$BASH_VERSION" < 4 ](%20"$BASH_VERSION"%20<%204%20); then
  >&2 printf 'gitstatus_start: need bash version >= 4.0, found %s\n' "$BASH_VERSION"
  return 1
fi
```

2. **옵션 파싱**: `getopts`를 사용하여 함수에 전달된 옵션을 파싱합니다. 각 옵션은 `gitstatusd`의 동작을 조정하는데 사용됩니다.

```bash
unset OPTIND
local opt timeout=5 max_dirty=-1 ttl=3600 extra_flags=
local max_num_staged=1 max_num_unstaged=1 max_num_conflicted=1 max_num_untracked=1
while getopts "t:s:u:c:d:m:r:eUWD" opt; do
  case "$opt" in
    t) timeout=$OPTARG;;
    s) max_num_staged=$OPTARG;;
    u) max_num_unstaged=$OPTARG;;
    c) max_num_conflicted=$OPTARG;;
    d) max_num_untracked=$OPTARG;;
    m) max_dirty=$OPTARG;;
    r) ttl=$OPTARG;;
    e) extra_flags+='--recurse-untracked-dirs ';;
    U) extra_flags+='--ignore-status-show-untracked-files ';;
    W) extra_flags+='--ignore-bash-show-untracked-files ';;
    D) extra_flags+='--ignore-bash-show-dirty-state ';;
    *) return 1;;
  esac
done
```

3. **데몬 시작**: `gitstatusd` 데몬을 시작합니다. 데몬은 백그라운드에서 실행되며, git 상태 정보를 빠르게 가져오는데 사용됩니다.

```bash
if [ -z "${GITSTATUS_DAEMON_PID:-}" ](%20-z%20"${GITSTATUS_DAEMON_PID:-}"%20); then
  # 데몬 시작 코드...
fi
```

4. **데몬 초기화 실패 처리**: 만약 `gitstatusd` 데몬이 제대로 시작되지 않았다면, 오류 메시지를 출력하고 함수를 종료합니다.

```bash
if ! gitstatus_start_impl; then
  >&2 printf '[\033[31mERROR\033[0m]: gitstatus failed to initialize.\n'
  gitstatus_stop
  return 1
fi
```

이 함수는 `gitstatusd` 데몬을 효율적으로 관리하고, git 상태 정보를 빠르게 가져오는 기능을 제공합니다. 이는 git 저장소가 매우 큰 경우에 유용하며, git 상태 정보를 표시하는 프롬프트를 빠르게 업데이트하는 데 사용될 수 있습니다. 이 함수는 `gitstatus` 플러그인의 일부입니다. 이 플러그인은 Zsh 및 Bash 쉘에서 사용할 수 있습니다.