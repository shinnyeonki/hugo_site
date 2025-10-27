---
title: 디버거 cli 명령어 모음
resource-path: 02.inbox/디버거 cli 명령어 모음.md
keywords:
tags:
  - reference
  - ai-content
date: 2025-10-11T13:27:45+09:00
lastmod: 2025-10-11T13:27:52+09:00
---
## GDB

### 🔹 **기본 실행 및 종료**
| 명령어 | 설명 |
|--------|------|
| `gdb <executable>` | 실행 파일로 GDB 시작 |
| `run` 또는 `r` | 프로그램 실행 (인자: `run arg1 arg2`) |
| `quit` 또는 `q` | GDB 종료 |

---

### 🔹 **중단점 (Breakpoint)**
| 명령어 | 설명 |
|--------|------|
| `break main.cpp:10` 또는 `b main.cpp:10` | 파일의 특정 라인에 중단점 설정 |
| `break main` 또는 `b main` | 함수 이름에 중단점 설정 |
| `info breakpoints` 또는 `i b` | 현재 중단점 목록 보기 |
| `delete 1` | ID가 1인 중단점 삭제 |
| `disable 1` | 중단점 비활성화 |
| `enable 1` | 중단점 활성화 |
| `clear main.cpp:10` | 특정 위치의 중단점 제거 |

---

### 🔹 **스텝 실행 (Stepping)**
| 명령어 | 설명 |
|--------|------|
| `step` 또는 `s` | 한 줄 실행 (함수 내부로 들어감) |
| `next` 또는 `n` | 한 줄 실행 (함수 내부로 안 들어감) |
| `finish` | 현재 함수 끝까지 실행 후 반환 |
| `continue` 또는 `c` | 다음 중단점까지 실행 |

---

### 🔹 **변수 및 메모리 보기**
| 명령어 | 설명 |
|--------|------|
| `print <var>` 또는 `p <var>` | 변수 값 출력 (식 평가 가능) |
| `display <var>` | 매 스텝마다 자동으로 변수 출력 |
| `undisplay 1` | display 목록에서 제거 |
| `x/16xb 0x12345678` | 메모리 덤프 (`x/[count][format][size] address`) |
| `set variable x = 10` | 변수 값 변경 |

---

### 🔹 **스택 및 프레임**
| 명령어 | 설명 |
|--------|------|
| `backtrace` 또는 `bt` | 콜 스택 출력 |
| `frame 2` 또는 `f 2` | 특정 프레임으로 이동 |
| `up` / `down` | 스택 프레임 위/아래로 이동 |

---

### 🔹 **프로세스 및 스레드**
| 명령어 | 설명 |
|--------|------|
| `info threads` | 현재 스레드 목록 |
| `thread 2` | 특정 스레드로 전환 |
| `kill` | 디버그 중인 프로세스 강제 종료 |

---

### 🔹 **도움말 및 설정**
| 명령어 | 설명 |
|--------|------|
| `help` | 전체 도움말 |
| `help <command>` | 특정 명령어에 대한 도움말 |
| `set args arg1 arg2` | 실행 인자 설정 |
| `run < input.txt` | 표준 입력 리다이렉션 (쉘 수준에서 처리) |
| `set environment VAR=value` | 환경 변수 설정 |

---

### 🔹 **LLDB ↔ GDB 명령어 비교 (참고)**
| LLDB | GDB |
|------|-----|
| `b main` | `b main` |
| `br list` | `info breakpoints` |
| `v` 또는 `frame variable` | `info locals` |
| `expr x = 5` | `set variable x = 5` |
| `process launch` | `run` |
| `memory read` | `x/...` |
| `settings set target.run-args ...` | `set args ...` |

---

### 💡 팁
- GDB는 `.gdbinit` 파일을 통해 시작 시 자동으로 명령어를 실행할 수 있습니다.
- 최신 GDB(8.0+)는 Python 스크립팅을 지원하여 고급 디버깅이 가능합니다.
- ARM64 환경에서도 잘 작동하지만, 크로스 디버깅 시 `gdb-multiarch`나 대상 아키텍처 전용 GDB를 사용해야 할 수 있습니다.

## LLDB
### 🔹 **기본 실행 및 종료**
| 명령어                 | 설명                 |
| ------------------- | ------------------ |
| `lldb <executable>` | 실행 파일로 LLDB 시작     |
| `run` 또는 `r`        | 프로그램 실행            |
| `process launch`    | 프로그램 실행 (옵션 사용 가능) |
| `quit` 또는 `q`       | LLDB 종료            |

---

### 🔹 **중단점 (Breakpoint)**
| 명령어 | 설명 |
|--------|------|
| `breakpoint set --file main.cpp --line 10` | 파일의 특정 라인에 중단점 설정 |
| `b main.cpp:10` | 위와 동일 (간단한 형태) |
| `breakpoint set --name main` | 함수 이름에 중단점 설정 |
| `b main` | 위와 동일 |
| `breakpoint list` 또는 `br list` | 현재 중단점 목록 보기 |
| `breakpoint delete 1` | ID가 1인 중단점 삭제 |
| `breakpoint disable 1` | 중단점 비활성화 |
| `breakpoint enable 1` | 중단점 활성화 |

---

### 🔹 **스텝 실행 (Stepping)**
| 명령어 | 설명 |
|--------|------|
| `step` 또는 `s` | 한 줄 실행 (함수 내부로 들어감) |
| `next` 또는 `n` | 한 줄 실행 (함수 내부로 안 들어감) |
| `finish` | 현재 함수 끝까지 실행 후 반환 |
| `continue` 또는 `c` | 다음 중단점까지 실행 |

---

### 🔹 **변수 및 메모리 보기**
| 명령어 | 설명 |
|--------|------|
| `frame variable` 또는 `v` | 현재 프레임의 지역 변수 출력 |
| `print <var>` 또는 `p <var>` | 변수 값 출력 (식 평가 가능) |
| `expr <expression>` | 표현식 평가 및 실행 (변수 수정도 가능) |
| `memory read --size 1 --count 16 0x12345678` | 메모리 덤프 |

---

### 🔹 **스택 및 프레임**
| 명령어 | 설명 |
|--------|------|
| `bt` 또는 `thread backtrace` | 콜 스택 출력 |
| `frame select 2` | 특정 프레임으로 이동 |
| `up` / `down` | 스택 프레임 위/아래로 이동 |

---

### 🔹 **프로세스 및 스레드**
| 명령어 | 설명 |
|--------|------|
| `thread list` | 현재 스레드 목록 |
| `process status` | 현재 프로세스 상태 확인 |
| `process kill` | 디버그 중인 프로세스 강제 종료 |

---

### 🔹 **도움말 및 설정**
| 명령어 | 설명 |
|--------|------|
| `help` | 전체 도움말 |
| `help <command>` | 특정 명령어에 대한 도움말 |
| `settings set target.run-args arg1 arg2` | 실행 인자 설정 |
| `settings set target.input-path input.txt` | 표준 입력 리다이렉션 |

---

### 🔹 **GDB ↔ LLDB 명령어 비교 (참고)**
| GDB | LLDB |
|-----|------|
| `run` | `run` |
| `break main` | `b main` |
| `step` | `step` |
| `next` | `next` |
| `print x` | `p x` |
| `info breakpoints` | `br list` |
| `bt` | `bt` |



