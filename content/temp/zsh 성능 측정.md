---
title: zsh 성능 측정
resource-path: temp/zsh 성능 측정.md
keywords:
tags:
  - zsh
date: 2024-11-18T05:09:00+09:00
lastmod: 2024-11-18T05:09:00+09:00
---
zsh는 측정용 프로파일링 모듈을 가지고 있다. [](https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzprof-Module)라는 모듈인데, `.zshrc` 파일에 설정만 해두면 사용할 수 있다.

1. `~/.zshrc` 파일 가장 상단에 `zmodload zsh/zprof` 를 적는다. (import라고 생각하자)
2. 그리고 가장 하단에 `zprof` 라고 적어두자. (이는 세션이 시작될 때 zprof 명령어를 실행한다는 의미와 같다.)
3. 세션 로드가 완료되면 `time zsh -i -c echo` 명령어를 사용해 측정 결과를 얻자.
4. 