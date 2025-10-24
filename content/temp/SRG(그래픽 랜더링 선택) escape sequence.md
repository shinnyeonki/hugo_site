---
title: SRG(그래픽 랜더링 선택) escape sequence
date: 2024-07-30T19:36:00+09:00
lastmod: 2025-08-11T00:45:48+09:00
resource-path: temp/SRG(그래픽 랜더링 선택) escape sequence.md
aliases: 
tags: 
---
SGR(Select Graphic Rendition)

이것을 이해하기 위해
wiki 에는 이렇게 나와 있다

> **ANSI 이스케이프 시퀀스는 비디오** [텍스트 터미널](https://en.wikipedia.org/wiki/Text_terminal "텍스트 터미널") 과 [터미널 에뮬레이터](https://en.wikipedia.org/wiki/Terminal_emulator "터미널 에뮬레이터") 에서 커서 위치, 색상, 글꼴 스타일 및 기타 옵션을 제어하기 위한 인 [밴드 신호](https://en.wikipedia.org/wiki/In-band_signaling "대역 내 신호 전송") 표준

즉 cli 환경에서 커서 위치, 색상, 글꼴 스타일 등등의 옵션을 제어하기 위한 표준이라고 나와있다