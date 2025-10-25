---
title: lvm 기능과 파일 시스템
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 02.inbox/Notion/Notion/파일 시스템/lvm 기능과 파일 시스템.md
draft: true
---
lvm 기능의 lvresize 명령어를 사용하여 “/” 마운트 되어 있는 /dev/mapper/rl-root 의 장치를 확장하였다

lvresize -l +100%FREE /dev/mapper/rl-root

  

그런데 logical volume 의 rl 이름이 마음에 들지 않아 lvrename rl myvg 로 이름을 변경하였다

여기서 lvm 의 크기조정후

xfs 시스템은 `xfs_growfs`  
ext4 시스템은  
`resize2fs`

/etc/fstab 수정

명령어를 통해 시스템에 알려주려고 하였지만 /dev/mapper/myvg-root 는 xfs 파일 시스템이 아니라고 오류를 내었다

실제 myvg-root 는 xfs 파일 시스템은 맞지만 이름 변경의 이유로 오류를 뿜어낸다고 판단하여  
다시 이름을 원래 이름으로 변경후 시스템에 알려주니 정상화 되었다  

  

여기서 질문

lvresize 와 `resize2fs` 명령은 무슨 관계인가

왜 resize2fs 명령어를 통해 알려주어야 하는가