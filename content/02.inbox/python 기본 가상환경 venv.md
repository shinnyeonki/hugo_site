---
title: python 기본 가상환경 venv
resource-path: 02.inbox/python 기본 가상환경 venv.md
aliases:
tags:
  - python
date: 2023-12-20T07:12:00+09:00
lastmod: 2023-12-20T07:12:00+09:00
---
```
python -m venv 가상환경이름
```

  



이제 가상 환경을 활성화합니다. 운영체제에 따라 활성화 방법이 다릅니다.

## (1) MacOS 경우

```
source 가상환경이름/bin/activate
```

## (2) WindowOS 경우

```
source 가상환경이름/Scripts/activate
```

정상적으로 가상환경이 실행되었다면, 터미널에서 현재 디렉토리 맨 앞에 상환경 이름이 괄호 안에 출력됩니다.


가상 환경을 비활성화하는 방법입니다.

```
deactivate
```


생성했던 가상 환경을 삭제하는 방법입니다.

```
sudo rm -rf 가상환경이름
```