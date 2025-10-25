---
title: Linux - 로케일(Locale) 설정 알아보기
resource-path: 05.clipping/Linux - 로케일(Locale) 설정 알아보기.md
series: https://server-talk.tistory.com/426
author:
  - "[서버구축이야기!!](서버구축이야기!!)"
published: 2022-07-25
date: 2025-05-20
description: Linux - 로케일(Locale) 설정 알아보기 이번 포스팅에서는 로케일(Locale) 설정에 대해서 알아보도록 하겠습니다. Linux 로케일(Locale) 이란? 전 세계의 나라들은 각기 다른 언어, 날짜, 시간, 화폐 등등 다르게 갖고 있습니다 리눅스에서도 마찬가지입니다 그래서 국제화(Internationalization = i18n)를 통해 사용자가 어떻게 표시할지 환경을 선택하는 기능이 로케일(Locale) 입니다. 또한, 언어뿐만 아니라 숫자, 날짜 등등 사용이 가능하고 로케일(Locale) 설정에 따라 다른 결과의 언어로 표시할 수도 있습니다. Linux 로케일(Locale) 설정 및 사용법 리눅스에서는 localectl 명령어를 통해 설정되어 로케일(Locale)를 확인 및 설정할 수 있고..
tags:
  - clippings
---
`localectl` 명령은 **systemd 기반 리눅스 배포판** 에서 사용할 수 있는 시스템 관리 도구로, 로케일(locale), 키보드 레이아웃, 가상 콘솔(Console) 설정 등을 관리하는 데 사용됩니다.

**1\. 로케일 및 키보드 설정 확인**
```bash
# localectl 
   System Locale: LANG=en_US.UTF-8
       VC Keymap: n/a
      X11 Layout: us
       X11 Model: pc105
```

| **형식** | 의미 |
| --- | --- |
| **System Locale** | 현재 설정되어 있는 로케일(Locale)을 표시합니다. |
| **VC Keymap** | 가상콘솔에서 사용하는 키맵을 표시합니다. |
| **X11 Layout** | Xwindows에서 사용되는 키보드 레이아웃을 표시합니다. |
| **X11 Model** | 키보드 모델을 표시 합니다. |

**2\. 설정 가능한 로케일(Locale) 확인**

```bash
# localectl list-locales 
C.UTF-8
en_US.UTF-8
```

localectl 명령어로 list-locales 옵션을 사용하면 설정이 가능한 로케일(Locale) 목록을 출력합니다.

**3\. 로케일(Locale) 설정**

```bash
사용법 : localectl set-locale "[Locale]"
```
```bash
# localectl set-locale "en_US.UTF-8"
```

localectl 명령어에 set-locale 옵션을 사용하여 로케일(Locale)을 설정할 수 있습니다.

**4\. 시스템에 설정되어 있는 로케일 정보 확인**

```html
# locale
LANG=en_US.UTF-8
LANGUAGE=
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_PAPER="en_US.UTF-8"
LC_NAME="en_US.UTF-8"
LC_ADDRESS="en_US.UTF-8"
LC_TELEPHONE="en_US.UTF-8"
LC_MEASUREMENT="en_US.UTF-8"
LC_IDENTIFICATION="en_US.UTF-8"
LC_ALL=
```

locale 명령어를 사용하면 LANG를 포함하여 설정되어 있는 전체 로케일(Locale) 정보를 확인할 수 있습니다.

**5\. 사용가능한 로케일 확인**

```html
# locale -a
```

locale 명령어에서 -a 옵션을 사용하면 사용 가능한 로케일(Locale)를 확인하실 수 있으며, 원하시는 로케일(Locale) 이 없으신 경우 별도로 설치해야 됩니다.