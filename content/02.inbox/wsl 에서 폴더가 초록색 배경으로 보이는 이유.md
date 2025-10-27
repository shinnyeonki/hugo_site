---
title: wsl 에서 폴더가 초록색 배경으로 보이는 이유
resource-path: 02.inbox/wsl 에서 폴더가 초록색 배경으로 보이는 이유.md
keywords:
tags:
  - 잡지식
  - shell
date: 2024-06-10T21:31:00+09:00
lastmod: 2025-08-11T00:49:10+09:00
---
- 전제조건
- 초록색 이유
- 선택 전제 조건
- 윈도우 파일과 유닉스 파일의 파일 시스템 차이
## 전제조건

> wsl 우분투 배포판을 기준 debian 계열은 거이 비슷

1. wsl 측에서 바라본 윈도우 파일 시스템(ntfs) 를 wsl 환경에서 윈도우측 파일시스템을 `/mnt` 폴더 아래에 보조메모리 디바이스 장치 이름  으로 마운트 되어있다
    #ModificationRequired

	```shell
	shinnk@DESKTOP-KRSG68U:/mnt$ mount
	C:\ on /mnt/c type 9p (rw,noatime,dirsync,aname=drvfs;path=C:\;uid=1000;gid=1000;symlinkroot=/mnt/,mmap,access=client,msize=65536,trans=fd,rfd=5,wfd=5)
	```

1. ls, dir, grep, 등등의 명령은 화면에 적절한 색깔을 입혀서 표시할 필요가 있는데 이때 LS_COLORS 라는 환경변수를 참조해서 적절히 색깔을 입혀서 출력한다
2. 그렇다면 LS_COLORS 환경변수를 확인해보자
   `set | grep "LS_COLORS"` 명령을 통해 확인해보면 여러가지 설정이 지정되어있는 것을 확인 할 수 있다 예를 들어 `di=01;34:` 를 보면 di(directory) 라는 변수에 `01;34` 라는 변수가 할당되어 있고 (`:` 는 구분자이다) 01;34는  SRG(select graphic rendition) 의 문법을 따른 방식이다)
   [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR) 를 참조
	- 01 굵은 글꼴 bold 효과 
	- ; => 속성 구분자
	- 34 => 3비트 컬러 표시에서 전경색(글자색) 34번 색상 파란색 [](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors)을 나타낸다

   ```shell
   shinnk@DESKTOP-KRSG68U:~$ set | grep "LS_COLORS"
   LS_COLORS='rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31'
	```

1. 잠깐 추가적으로 LS_COLORS 환경변수는 정적으로 로드된 것일까?? 최소한 우분투에서는 dircolors 라는 실행파일을 통해 로그인 셸이 실행될 때각 셸(sh, zsh, bash 등등)에 맞는 설정을(LS_COLORS 환경변수에 적절한 값을 로드) 하도록 만든다
   아래는 .bashrc 파일의 일부이다 셸에 로그인 될때 .bashrc 가 실행되고 이 파일에서 dircolors 를 실행시킨다 또한 LS_COLORS 를 사용하는 ls,grep 와 같은 프로그램에 옵션을 기본적으로 추가시켜 alias 시켜둔다

	```shell
	# enable color support of ls and also add handy aliases
	if [ -x /usr/bin/dircolors ]; then
	    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
	    alias ls='ls --color=auto'
	    #alias dir='dir --color=auto'
	    #alias vdir='vdir --color=auto'
	
	    alias grep='grep --color=auto'
	    alias fgrep='fgrep --color=auto'
	    alias egrep='egrep --color=auto'
	fi
	```

```shell
echo $TERM # `TERM` 변수의 출력이 `xterm-256color`, `screen-256color`, `tmux-256color`와 같은 값이면 256색을 지원하는 터미널입니다. 실제로는 이렇게 출력 되더락도 24비트 컬러(16,777,216가지 색상)를 지원한다
```

```shell
for i in {0..255}; do
	printf "\x1b[38;5;${i}mcolour${i}\n" 
done # 모든 컬러 확인
```

모든 디렉토리는 굵은 파란색으로 보여지게 하고 있다

그렇다면 모든 사용자에게 w 쓰기 권한이 주어진다면 왜 초록색 배경으로 보이게 될까
## 초록색으로 보이는 이유
1. `env | grep "LS_COLORS" |grep ow`
   라고 입력하면 ow 변수(모든 사용자가 쓰기가능한 디렉토리)에 입력된 값이 보인다 아까 보았던 LS_COLORS 에 설정된 값중 ow 변수를 확인해 보았다 
   (`ow=34;42` 나의 경우 이미 설정된 값은 이렇다) 이것은 34(전경색 파란색) 42(배경색 초록색) 이다 
2. 윈도우 파일시스템인 ntfs 의 경우 유닉스에서 관리하는 일반적인 ext4 zfs 등등의 파일시스템과는 달리 파일의 권한을 저장하는 방식이 다르다 (ACL 이라고 하는데 아직 모르겠다) 그런데 wsl 측에서 윈도우 파일 시스템을 마운트 할 때 모든 파일(폴더 포함)에 쓰기 권한을 (rwx 중 x 를 설정 해두었다) wsl 의 사용자와 윈도우 사용자가 다르기 때문에 파일 이동 및 수정을 자유롭게 하기 위해서 이렇게 한것 같다 그래서 ow 변수에 설정된 값이 작동하는 것이다



말이 매우 길었지만 결론은 매우 간단하다(?)

> 윈도우측 사용자와 wsl linux 측 사용자의 차이로 인한 파일 이동 및 수정에 불편함을 만들지 않기 위해 모든 사용자가 쓰기 가능한 디렉토리라고 정하였고 이때 linux 에서는 윈도우 측 파일에 외부 사용자의 쓰기(x) 권한이 등록 되어 있으므로 사용자가 이것을 건들 가능성이 있으니 보안의 목적으로 특별한 색깔로 보였던 것이다

## 추가 전제 조건

### LS_CLOLORS 의 ow 변수
`env | grep "LS_COLORS" |grep ow`
라고 입력하면 ow 변수에 입력된 값이 보인다
(`ow=34;42` 나의 경우 이미 설정된 값은 이렇다) 이것은 34(전경색 파란색) 42(배경색 초록색) 이다 
그러면 ow 쓰기가능한 디렉토리

조금더 명확히 이해하기 이해해보기 위해 LS_COLORS 을 정확하게 이해해보자 아까 보았던
`~/.bashrc` 파일의 일부이다

```shell
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi
```

dircolors 명령이 실행가능할 때 AND
.dircolos 폴더가 있으면 그것을 사용하고 없으면 dircolors 기본 설정을 사용한다는 의미이다 
즉  dircolors가  LS_COLORS 를 설정한다 이후 `The LS_COLORS environment variable can change the settings.  Use the dircolors command to set it.` ls manual 페이지에 처럼 ls 명령이 LS_COLORS 환경변수를 통해 적절히 출력되게 된다


dircolors 수동 설정 시 적용가능한 변수목록
![Pasted image 20240611092335](08.media/20240611092335.png)론:  bashrc 파일에서 dircolors 존재하는지 확인 -> dircolors 이 LS_COLORS 변수 설정 -> ls 명령 시행시에 LS_COLORS 변수를 사용해서 출력



실제 LS_COLORS 를 통해 파일이 보이는 방식을 보여주는 스크립트

```bash
echo "$LS_COLORS" | sed 's/:/\n/g' | while IFS== read -r key value; do
    if [[ -n "$value" ]]; then
        printf "\e[${value}m%s\e[m  (%s)\n" "$key" "$value"
    fi
done
```

또는

```bash
declare -A descriptions=(
    [bd]="block device"
    [ca]="file with capability"
    [cd]="character device"
    [di]="directory"
    [do]="door"
    [ex]="executable file"
    [fi]="regular file"
    [ln]="symbolic link"
    [mh]="multi-hardlink"
    [mi]="missing file"
    [no]="normal non-filename text"
    [or]="orphan symlink"
    [ow]="other-writable directory"
    [pi]="named pipe, AKA FIFO"
    [rs]="reset to no color"
    [sg]="set-group-ID"
    [so]="socket"
    [st]="sticky directory"
    [su]="set-user-ID"
    [tw]="sticky and other-writable directory"
)

# Split LS_COLORS by colon
IFS=':'
color_prev=""

for ls_color in $LS_COLORS; do
    # Extract color code and file type
    color="${ls_color#*=}"
    type="${ls_color%=*}"

    # Get description if available
    desc="${descriptions[$type]}"

    # Print newline when color changes (except first)
    if [ -n "$color_prev" ] && [ "$color" != "$color_prev" ]; then
        echo
    fi

    # Print colored type + description
    printf '\e[%sm%s%s\e[m ' "$color" "$type" "${desc:+ ($desc)}"

    # Remember last color
    color_prev="$color"
done

echo
```

## 윈도우 파일시스템(NTFS) 와 유닉스 파일시스템
NTFS 파일 시스템은 기본적으로 Windows 운영 체제에서 사용되는 파일 시스템입니다. 유닉스 기반 시스템에서 NTFS 파일 시스템을 마운트하고 접근할 때 권한 설정은 다음과 같은 방식으로 처리됩니다:
1. **NTFS-3G 드라이버 사용**: 대부분의 리눅스 배포판은 NTFS 파일 시스템을 읽고 쓸 수 있는 NTFS-3G 드라이버를 사용합니다. 이 드라이버는 NTFS 파일 시스템의 파일과 디렉터리에 접근할 수 있게 해줍니다.
2. **마운트 옵션**: NTFS-3G를 사용하여 NTFS 파일 시스템을 마운트할 때, 기본적으로 모든 파일과 디렉터리가 특정 사용자의 소유로 설정됩니다. 일반적으로 `uid`와 `gid` 마운트 옵션을 사용하여 파일과 디렉터리의 소유자와 그룹을 지정할 수 있습니다.

    ```bash
    sudo mount -t ntfs-3g /dev/sdX1 /mnt/ntfs -o uid=1000,gid=1000
    ```

    위 명령어에서 `/dev/sdX1`은 NTFS 파티션, `/mnt/ntfs`는 마운트 지점, `uid=1000`과 `gid=1000`은 특정 사용자의 UID와 GID를 의미합니다.
3. **권한 설정**: NTFS 파일 시스템은 유닉스 파일 시스템과는 다르게 파일 권한을 저장하지 않습니다. 그래서 마운트할 때 지정한 UID와 GID가 모든 파일과 디렉터리의 소유자와 그룹으로 설정됩니다. 또한, `umask`, `fmask`, `dmask` 옵션을 사용하여 파일과 디렉터리의 권한을 설정할 수 있습니다.

    ```bash
    sudo mount -t ntfs-3g /dev/sdX1 /mnt/ntfs -o uid=1000,gid=1000,umask=022
    ```

    여기서 `umask=022`는 파일과 디렉터리의 기본 권한을 설정합니다.
4. **권한 변경**: NTFS 파일 시스템은 유닉스 파일 시스템과 달리 파일 시스템 수준에서 파일 권한을 저장하지 않기 때문에, NTFS 파일 시스템에 있는 파일의 권한을 변경하려고 하면 실제로는 변경되지 않습니다. 마운트 옵션을 통해서만 권한을 제어할 수 있습니다.

tput colors
stty -a
위의 두개는 뭐야?? #ModificationRequired 