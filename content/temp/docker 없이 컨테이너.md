---
title: docker 없이 컨테이너
aliases: 
tags:
  - linux
created: 2024-04-10T03:21:00+09:00
modified: 2024-04-10T03:21:00+09:00

---
[관련 리포지토리](https://github.com/sam0kim/container-internal)
[유튜브 영상](https://www.youtube.com/watch?v=mSD88FuST80&t=650s)

아래의 패지지 의존
```bash
sudo apt-get update &&
sudo apt-get -y install gcc &&
sudo apt-get -y install make &&
sudo apt-get -y install pkg-config &&
sudo apt-get -y install libseccomp-dev &&
sudo apt-get -y install tree &&
sudo apt-get -y install jq &&
sudo apt-get -y install bridge-utils
```

## 전제
- 루트 파일 시스템
	- container => / 는 overlay 로 마운트
	- host => / 는 일반적인 곳으로 마운트
- 프로세스
	-  container => 1번이 shell
	- host => 일반
- 네트워크
	-  container => eth0@~~
	- host => 일반
- 유저 및 호스트
	-  container => root (host 의 root 와 동일할까??), 이상한 문자열 호스트네임
	- host => 
## chroot
프로세스를 가두자 => 사용자 프로세스를 fake 루트를 통해 막는다 (프로세스를 가둔다는 말이 무었일까 #ModificationRequired )


```bash
chroot myroot /dirname
```

```bash
docker export $(docker create nginx) | tar -C nginx-root  -xvf -;
```

## 네임스페이스
chroot 의 경우 #ModificationRequired  이유로 프로세스를 탈옥이 가능했다 하지만 마운트의 원리를 사용하여 루트 파일시스템을 pivot_root 명령으로 바꿀 수 있고 이러면 원래 루트파일 시스템으로 접근 할 수 없다

또한 이러한 접근 권한을 폴더 접근 뿐만 아니라 네트워크 ipc 마운트 등등으로 적용하여 접근을 제한 할 수 있다 이러한 제한에 사용되는 용어가 바로 네임스페이스이다

lsns 명령으로 네임스페이스 확인가능 inode 로 확인
ushare 명령으로 네임스페이스를 변경 가능

## mount
chroot_pivot 이란
루트 파일 시스템을 변경

overlay 마운트 개념
오버레이를 통해 프로그램이 필요한 위존성을 따로 hub 에 올릴 수 있다

## 네트워크
`/var/run/netns` 위치에 저장

## 