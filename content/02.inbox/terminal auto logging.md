---
title: terminal auto logging
resource-path: 02.inbox/terminal auto logging.md
keywords:
tags:
  - project
date: 2025-09-09T17:16:26+09:00
lastmod: 2025-09-09T17:17:45+09:00
---
## Terminal Auto Logger

### 프로젝트 개요

-   **프로젝트 이름**: `terminal auto logger`
-   **로그 디렉토리**: `~/.local/log/terminal_auto_log`
-   **핵심 동작**:
    1.  `terminal_auto_logger.sh`: 쉘 시작 시 실행되어 로깅 환경을 설정하고, 실제 로깅을 담당하는 Executor 스크립트를 호출합니다.
    2.  `_tal_executor.sh`: `script` 명령을 직접 실행하고, 세션이 종료된 후 로그 파일의 이름을 최종적으로 결정합니다. (내부 헬퍼 스크립트)

---

### 1. **Executor 스크립트 생성: `_tal_executor.sh`**

이 스크립트는 실제 로깅을 실행하고 세션 종료 후 파일명 변경을 담당하는 핵심 로직입니다. 사용자가 직접 실행하는 것이 아닌, 메인 스크립트에 의해 호출됩니다.

**파일 위치**: `~/.local/bin/_tal_executor.sh`

```bash
#!/bin/bash

# 이 스크립트는 terminal_auto_logger.sh에 의해 호출되는 내부 헬퍼입니다.
# 사용자가 직접 실행하지 마세요.

# 인자 파싱
TEMP_LOG_FILE="$1"
LOG_DIR="$2"
PID="$3"
TTY_NAME="$4"
START_TIMESTAMP="$5"

# 'script' 명령으로 실제 로깅 세션 시작
# -q: 시작/종료 메시지 숨김
# -f: 실시간으로 버퍼를 비워 파일에 기록
# -a: 파일에 이어쓰기 (메타데이터를 먼저 기록했으므로 필수)
script -qfa "$TEMP_LOG_FILE"
EXIT_CODE=$? # script 명령의 종료 코드 캡처

# 세션 종료 후 로그 파일 이름 변경
# 임시 로그 파일이 존재하고 내용이 있을 때만 이름 변경을 시도
if [ -s "$TEMP_LOG_FILE" ]; then
    END_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

    # 종료 코드에 따라 최종 파일명 결정
    if [ "$EXIT_CODE" -eq 0 ]; then
        # 정상 종료 (exit, logout 등)
        END_PART="$END_TIMESTAMP"
    else
        # 비정상 종료 (kill, 시스템 다운 등)
        END_PART="aborted"
    fi

    FINAL_LOG_FILE="${LOG_DIR}/terminal_(${START_TIMESTAMP} ~ ${END_PART})_${PID}_${TTY_NAME}.log"
    mv "$TEMP_LOG_FILE" "$FINAL_LOG_FILE"
else
    # 세션 동안 아무런 출력이 없었으면 임시 파일 삭제
    rm -f "$TEMP_LOG_FILE"
fi
```

### 2. **메인 스크립트 개선: `terminal_auto_logger.sh`**

이 스크립트는 쉘 설정 파일(`.bashrc`, `.zshrc`)에서 호출되며, 모든 안정성 검사와 환경 설정을 담당합니다.

**파일 위치**: `~/.local/bin/terminal_auto_logger.sh`

```bash
#!/bin/bash

# --- 안정성 검사 ---

# 1. 'script' 명령어가 없으면 즉시 종료
if ! command -v script &> /dev/null; then
    echo "Terminal Auto Logger: 'script' command not found. Logging disabled." >&2
    return 1
fi

# 2. 이미 로깅 중이거나(재귀 방지), tmux/screen 세션 내에서는 실행하지 않음
if [ -n "$TERMINAL_AUTO_LOGGER_ACTIVE" ] || [ -n "$TMUX" ] || [[ "$TERM" == screen* ]]; then
    return 0
fi

# --- 로깅 준비 ---

# 로그 디렉토리 생성
LOG_DIR="$HOME/.local/log/terminal_auto_log"
mkdir -p "$LOG_DIR"

# 로그 파일명에 사용할 변수 설정
TTY_NAME=$(tty | sed 's|/|_|g' | sed 's|[^a-zA-Z0-9_-]||g')
START_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PID=$$

# 종료 후 이름이 변경될 임시 로그 파일
TEMP_LOG_FILE="${LOG_DIR}/session_${START_TIMESTAMP}.tmp"

# --- 로깅 시작 ---

# 로깅 세션 메타데이터를 임시 파일에 기록
{
    echo " SCRIPT_SESSION_START"
    echo "================================================="
    echo "  Project: Terminal Auto Logger"
    echo "  User: $(whoami)"
    echo "  Host: $(hostname)"
    echo "  TTY: $(tty)"
    echo "  Shell: $SHELL"
    echo "  Started: $(date)"
    echo "  Ended: "
    echo "================================================="
} > "$TEMP_LOG_FILE" # 이어쓰기가 아닌 새로 쓰기

# 재귀 실행 방지를 위한 환경 변수 설정
export TERMINAL_AUTO_LOGGER_ACTIVE=1

# 현재 쉘을 Executor 스크립트로 대체하여 실행
# 필요한 모든 정보를 인자로 전달
exec ~/.local/bin/_tal_executor.sh \
    "$TEMP_LOG_FILE" \
    "$LOG_DIR" \
    "$PID" \
    "$TTY_NAME" \
    "$START_TIMESTAMP"
```

### 3. **설치 및 설정**

**1단계: 디렉토리 생성**
사용자 로컬 바이너리 디렉토리와 로그 디렉토리를 생성합니다. (`~/.local/bin`은 많은 시스템에서 자동으로 PATH에 추가됩니다.)

```bash
mkdir -p ~/.local/bin
mkdir -p ~/.local/log/terminal_auto_log
```

**2단계: 스크립트 저장 및 권한 설정**
위에서 작성한 두 스크립트 코드를 각각 `~/.local/bin/terminal_auto_logger.sh`와 `~/.local/bin/_tal_executor.sh`에 저장한 후, 실행 권한을 부여합니다.

```bash
chmod +x ~/.local/bin/terminal_auto_logger.sh
chmod +x ~/.local/bin/_tal_executor.sh
```

**3단계: 쉘 설정 파일에 적용 (`~/.bashrc` 또는 `~/.zshrc`)**
쉘 설정 파일 가장 아래쪽에 다음 코드를 추가합니다.

#### Bash 사용자 (`~/.bashrc`):

```bash
# Terminal Auto Logger (안정성 강화 버전)
# ~/.local/bin 이 PATH에 있는지 확인하고, 없다면 추가
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    export PATH="$HOME/.local/bin:$PATH"
fi

if [[ -t 1 && -z "$TERMINAL_AUTO_LOGGER_ACTIVE" ]]; then
    source ~/.local/bin/terminal_auto_logger.sh
fi
```

#### Zsh 사용자 (`~/.zshrc`):

```zsh
# Terminal Auto Logger (안정성 강화 버전)
# ~/.local/bin 이 PATH에 있는지 확인하고, 없다면 추가
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    export PATH="$HOME/.local/bin:$PATH"
fi

if [[ -o interactive && -z "$TERMINAL_AUTO_LOGGER_ACTIVE" ]]; then
    source ~/.local/bin/terminal_auto_logger.sh
fi
```

**4단계: 적용**
`source ~/.bashrc` (또는 `source ~/.zshrc`)를 실행하거나 새 터미널을 열면 로깅이 자동으로 시작됩니다.

---

## 💡 주요 개선 사항 및 작동 원리

1.  **2-Script 구조의 안정성**:
    *   메인 스크립트(`terminal_auto_logger.sh`)는 환경 검사와 설정만 담당하여 역할이 명확합니다.
    *   `exec`를 통해 쉘 프로세스가 Executor 스크립트(`_tal_executor.sh`)로 완전히 대체됩니다.
    *   Executor는 `script`가 **종료될 때까지 기다린 후**, 그 종료 상태(성공/실패)를 확인하여 후처리(파일명 변경)를 수행합니다. 이 구조 덕분에 세션 종료 시점의 정보를 파일명에 안정적으로 반영할 수 있습니다.

2.  **정확한 파일명 생성**:
    *   세션이 시작되면 `.tmp` 확장자를 가진 임시 파일에 로그가 기록됩니다.
    *   사용자가 `exit` 등으로 정상 종료하면 `script`는 종료 코드 `0`을 반환하고, 파일명은 `... (시작시간 ~ 종료시간).log` 형식으로 변경됩니다.
    *   세션이 `kill` 명령으로 강제 종료되거나 비정상적으로 끝나면, `script`는 `0`이 아닌 종료 코드를 반환하고, 파일명은 `... (시작시간 ~ aborted).log` 형식으로 변경되어 문제 상황을 명확히 알려줍니다.

3.  **예측 가능한 동작**:
    *   `tmux`/`screen` 환경이나 이미 로깅 중인 세션에서는 중복 실행되지 않아 충돌을 원천적으로 방지합니다.
    *   환경 변수명을 `TERMINAL_AUTO_LOGGER_ACTIVE`로 명확하게 지정하여 다른 프로그램과의 잠재적 충돌 가능성을 최소화했습니다.
    *   로그 디렉토리와 스크립트 위치를 `~/.local` 아래로 표준화하여 시스템을 깔끔하게 유지합니다.

이 개선된 솔루션은 요구하신 모든 사항을 만족시키면서, 예측 불가능한 상황에 더욱 잘 대처할 수 있도록 설계되었습니다. 안정적이고 신뢰도 높은 터미널 활동 기록 시스템으로 활용하실 수 있습니다.