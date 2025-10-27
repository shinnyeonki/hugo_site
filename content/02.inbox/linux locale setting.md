---
title: linux locale setting
resource-path: 02.inbox/linux locale setting.md
keywords:
tags:
  - setting
  - linux
  - 잡지식
date: 2025-05-20T18:55:00+09:00
lastmod: 2025-05-20T18:55:00+09:00
---
### systemd 기반 리눅스 배포판

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