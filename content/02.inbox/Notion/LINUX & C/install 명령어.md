---
title: install 명령어
resource-path: 02.inbox/Notion/LINUX & C/install 명령어.md
---
apt isntall 과는 다른 명령어

sudo install -m 0755 -d /etc/apt/keyrings

**install**[이라는 명령어입니다](https://docs.python.org/ko/3/installing/index.html)[**install**](https://docs.python.org/ko/3/installing/index.html) [명령어는 파일이나 디렉토리를 생성하고 권한을 변경할 수 있는 명령어입니다](https://docs.python.org/ko/3/installing/index.html)1. 이 명령어에는 여러 옵션이 있습니다. [이 중에서](https://docs.python.org/ko/3/installing/index.html) [**-m**](https://docs.python.org/ko/3/installing/index.html) [옵션은 권한을 지정하는 옵션이고,](https://docs.python.org/ko/3/installing/index.html) [**-d**](https://docs.python.org/ko/3/installing/index.html) [옵션은 디렉토리를 생성하는 옵션입니다](https://docs.python.org/ko/3/installing/index.html)2. 따라서 이 명령어는 **/etc/apt/keyrings** 이라는 디렉토리를 생성하고, 그 디렉토리의 권한을 **0755**[로 설정하는 것입니다](https://velog.io/@devyang97/Linux-%EB%AA%85%EB%A0%B9%EC%96%B4-%EC%A0%95%EB%A6%AC-Ubuntu-%EC%82%AC%EC%9A%A9)[**0755**](https://velog.io/@devyang97/Linux-%EB%AA%85%EB%A0%B9%EC%96%B4-%EC%A0%95%EB%A6%AC-Ubuntu-%EC%82%AC%EC%9A%A9) [권한은 소유자에게 읽기, 쓰기, 실행 권한을 주고, 그룹과 다른 사용자에게 읽기와 실행 권한만 주는 것입니다](https://velog.io/@devyang97/Linux-%EB%AA%85%EB%A0%B9%EC%96%B4-%EC%A0%95%EB%A6%AC-Ubuntu-%EC%82%AC%EC%9A%A9)