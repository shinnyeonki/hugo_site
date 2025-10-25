---
title: etcfstab 영구 등록
resource-path: 02.inbox/Notion/이것이 우분투 리눅스다 기록/etcfstab 영구 등록.md
---
**fstab(file system table)**

  

**파일 시스템들에 대한 마운트 정보를 적는 테이블**

  

**원래 마운트는 껏다 키면 마운트가 해제가 되는데**

, 이

**"/etc/fstab"**

에 마운트 정보를

적으면 시스템이 켜질 때 자동으로 마운트가 됩니다. 즉 영구적으로 마운트가 유지된다는 것이죠.

임시적으로 외부 장치(usb, dvd)를 연결한 거라면

**"/etc/fstab"**

에 적을 필요가 없죠

하지만 저희가 계속 사용할 거라면 이곳에 적어줘야 합니다.

[![](https://3.bp.blogspot.com/-JzHB75niEvI/XbmLDCNfB-I/AAAAAAAACms/YK4sm10jbvA6HV1n3ieIVEBsntV1OIixACK4BGAYYCw/s640/53.png)](https://3.bp.blogspot.com/-JzHB75niEvI/XbmLDCNfB-I/AAAAAAAACms/YK4sm10jbvA6HV1n3ieIVEBsntV1OIixACK4BGAYYCw/s640/53.png)

한 번 "cat /etc/fstab"으로 내용을 읽어보았습니다. 이미 3개가 쓰여있네요?

하나는 "/dev/mapper/centos-root" 이고 또 하나는 "/dev/mapper/centos-swap"

이렇게 말이죠 그리고 옆에 뭐 다른것들도 샬라샬라 써 있습니다.

답답하니 "vim"으로 다시 열어볼게요!

[![](https://1.bp.blogspot.com/-tVIkbc9J-E4/XbmMJY6IJVI/AAAAAAAACm4/azzgJtsP--Y1rq5xZY_rCkOXHa9_1uMiACK4BGAYYCw/s640/54.png)](https://1.bp.blogspot.com/-tVIkbc9J-E4/XbmMJY6IJVI/AAAAAAAACm4/azzgJtsP--Y1rq5xZY_rCkOXHa9_1uMiACK4BGAYYCw/s640/54.png)

  

**"/ xfs defaults 0 0"**

와 여러 필드들은 이제 마운트를 자동으로

할 때 어떤 형식으로 할거냐에 대한

**세부 사항들**

  

**[디스크 이름 or 디스크 UUID] [마운트 포인트] [파일시스템] [마운트 옵션] [덤프(백업)유무)] [fsck 검사순서]**

입니다.

**각 값 사이의 공백은 1칸 이상만 띄우면 됩니다**

만 단지 저 파일에선 보기 쉽게 하려고

저렇게 띄워 놓여져 있는 겁니당

"디스크 이름", "마운트 포인트", "파일시스템"은 다들 아실 것이고

이제

**"마운트 옵션"**

이 궁금하실 텐데요!

[![](https://4.bp.blogspot.com/-rrQTGWbi7NQ/XbruRqGtJpI/AAAAAAAACnE/a5wZsdrKP2Iib5cU2RD8gz4le4223LNAQCK4BGAYYCw/s640/4.png)](https://4.bp.blogspot.com/-rrQTGWbi7NQ/XbruRqGtJpI/AAAAAAAACnE/a5wZsdrKP2Iib5cU2RD8gz4le4223LNAQCK4BGAYYCw/s640/4.png)

- "defaults"를 쓴다는 건 저 안에 들어있는 옵션들 모두 사용한다는 겁니다.
- **반대 개념들은 그냥 기존 옵션 맨앞에 "no"를 붙여주시면 됩니다.**

**"noauto, noexec, nosuid"**

와 같이 말이죠.

반대로 그냥 유저들도 마운트 권한을 갖게 하려면 "nouser"에서 no를 뺀 "user"를 쓰면 되고요

간단하게 "defaults"만 쓰면 좋겠지만

**특수한 경우 몇 개의 옵션은 빼거나 다른 옵션을**

**써야할 때가 있잖아요?**

그럴 땐 옵션 필드에

**"noauto,noexec,rw" 이렇게 ","로 분리해서**

**써주시면 됩니다.**

다음 필드인 [덤프 유무]는

원래

**"덤프(dump)"**

란 "원래 별로 중요하지 않은 많은 것들을 한번에 모아두는 것"인데

**컴퓨터공학**

에선 이걸

**"백업"의 개념으로 사용**

합니다.

**[덤프 사용 유무]**

는

**"0" 또는 "1"이 들어갈 수 있는데**

컴퓨터공학에서

**"0"은 off, 즉 사용을 안한다**

는 것이고

**"1"은 on, 사용한다**

는 것 아시죠?

마지막 필드인 [fsck 검사순서]는

**"fsck(file system check)"**

명령어를 통한 파일시스템 체크 순서를 어떻게 하냐는 겁니다.

이 필드엔

**"0", "1", "2" 총 3개가 들어갈 수 있는데**

**"0"은 아예 검사를 안하겠다고**

**"1"은 1순위로 검사하겠다.**

**"2"는 1순위 다음으로 검사하겠다. 라는 뜻입니다. 어렵지 않죠?**

"usrquota, grpquota"와 같은 "quota"개념은 다음에 다루도록 하겠습니다~

  

  

ex

/dev/md9 /raidLinear ext4 defaults 0 0