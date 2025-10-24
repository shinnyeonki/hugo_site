---
title: ios 터미널 접근
date: 2024-05-15T14:30:00+09:00
lastmod: 2024-05-15T14:30:00+09:00
resource-path: 02.inbox/ios 터미널 접근.md
aliases: 
tags:
  - ios
---
## 외부 접근
ios 는 모바일 운영체제로서 샌드박스 형태의 아키텍쳐를 취하고 있다
즉 앱 하나하나다 일종의 User 로서 로그인하게 되고 유저의 home 영역을 제외한 곳은 읽기 조차 금지 되어있다 하지만 android 는 초창기 부터 다른 A 앱에서 B 앱의 접근을 api 로서 허용하고 있으며 이를 활용해 삼성의 '내파일' '사진' '한글뷰어' 과 같은 앱들은 android 가 제공하는 공용 공간에 접근 api 를 사용하여 동일한 공간에 사용자의 파일을 몰아넣고 데스크탑과 비슷한 환경을 구축해놓았다 하지만 ios 의 경우에는 이런것이 매우 부족하다 하지만 ios 13 부터였나(?) 이러한 api 가 개발자들에게 지원되기 시작했고 이를 이를 통해 할 수 있는 포텐셜이 늘어나게 되었다 
## 터미널의 구현
ios 에서 터미널을 구현한 인기있는 앱 2가지 종류가 보이는 것 같았다
- ISH : 시스템 콜 수준의 변환을 통한 터미널 구현 : ios 와 리눅스의 시스템 콜의 호환성만 일치시키면 어떠한 아키텍쳐든 구현이 가능하고 이것을 실현시킨 앱이다
	- 장점 : 사용자 수준에서 느껴지는 운영체제의 수준이 완벽하게 실행되며 데스크탑 운영체제에서 할 수 있는 모든 행동이 구현 가능하다
	- 단점  : 느리다
- a-shell : 실제로는 safari 의 브라우저 엔진인 webkit 을 사용하고 있으며 git, gawk 등등의 앱들은 웹어셈블리로 컴파일되어진 앱들이며 a-shell 에서 돌아간다 또한 웹 어셈블리로 다른 앱들을 컴파일하여 돌릴 수 있다
	- 장점 : 위에보다는 훨씬 빠르다 (웹어셈블리는 네이티브 속도의 60% ~ 95% 속도를 보여준다고 알려저 있다)
	- 단점 어셈블리어로 컴파일 되어 있는 앱들만 사용가능하다


## ISH
```shell
mount -t ios . {마운트할 path}
```
를 통해 파일앱의 폴더를 마운트 할 수 있다

## a-shell
파일의 구조가 일반적인 unix 구조와 다르다 (샌드박스 정책 때문에)

패지키 관리
```shell
pkg {install | remove | list search } pakage-name
```
[제공하는 패키지 종류 서버](https://github.com/holzschu/a-Shell-commands/tree/master/packages)


m

pickFolder : 먼저 apple 이 제공하는 api 를 통해 외부에 접근할 곳을 지정한다 지정한 곳은 bookmark 라는 a-shell 이 관리하는 공간에 저장된다
```shell
pickFolder
```

파일 선택 창이 나오고 연결한 포인트를 설정하면 bookmard 에 폴더이름으로 북마크 이름이 된다
```shell
showmarks # 모든 북마크 보기
jump {북마크 이름}` 또는 `cd ~{북마크 이름} # 북마크 이동
deletemarks {북마크 이름}
renamemarks {예전 이름} {바꿀 이름}
bookmark {정할 이름} # 현재 디렉토리에 대한 북마크를 추가
```

다른앱 연결
```shell
open {file-name} # 파일 공유
view {file-name} # 파일 뷰어
play {file-name} # 미디어 파일 재생
internalbrowser {https://google.com} # 내부 브라우저 사용
```

