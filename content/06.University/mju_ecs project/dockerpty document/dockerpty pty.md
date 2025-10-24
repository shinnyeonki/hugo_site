---
title: dockerpty pty
date: 2025-06-20T02:31:54+09:00
lastmod: 2025-09-09T23:10:58+09:00
resource-path: 06.University/mju_ecs project/dockerpty document/dockerpty pty.md
aliases: 
tags: 
---
### 문서: `dockerpty` 모듈 개요

제공된 코드는 `dockerpty`라는 Python 모듈을 나타내며, 특히 `pty.py` 파일에 초점을 맞추고 있습니다. 이 문서에서는 모듈의 주요 구성 요소와 기능을 설명합니다.

---

### **소개**

`dockerpty` 모듈은 Docker 컨테이너와 의사 터미널(PTY) 인터페이스를 통해 상호작용하는 것을 용이하게 설계되었습니다. 사용자가 로컬 터미널 세션과 유사한 방식으로 Docker 컨테이너 터미널에 연결하고 제어할 수 있도록 합니다.

이 모듈의 주요 목적은 PTY의 라이프사이클을 관리하는 것인데, 호스트와 컨테이너 간의 입력/출력 스트림을 처리하며 터미널 창 크기를 조정하는 작업을 포함합니다.

---

### **주요 클래스 및 기능**

#### 1. **WINCHHandler**
   - **목적**: 터미널 창 크기가 변경될 때 동적으로 PTY를 조정하기 위해 `SIGWINCH` 신호를 처리합니다.
   - **메서드**:
     - `__init__(self, pty)`: PTY를 참조하여 핸들러를 초기화합니다.
     - `start(self)`: `SIGWINCH` 신호를 트랩하고 PTY를 조정합니다.
     - `stop(self)`: `SIGWINCH` 신호 트랩을 중지하고 이전 신호 핸들러를 복원합니다.
     - `__enter__(self)` & `__exit__(self, *_)`: `start()` 및 `stop()` 메서드를 호출하는 컨텍스트 관리 메서드입니다.

---

#### 2. **Operation (추상 기본 클래스)**
   - **목적**: Docker 컨테이너 또는 exec 관련 작업을 위한 추상 기본 클래스로 사용됩니다.
   - **메서드**:
     - `israw(self, **kwargs)`: 해당 작업이 raw 모드로 작동해야 하는지 여부를 결정합니다 (즉, 컨테이너/exec에 TTY가 할당되었는지 확인).
     - `start(self, **kwargs)`: 작업 실행을 시작합니다 (하위 클래스에서 구현해야 함).
     - `resize(self, height, width, **kwargs)`: PTY를 조정합니다 (하위 클래스에서 구현해야 함).
     - `sockets(self)`: 입력/출력 스트림에 대한 소켓을 반환합니다 (하위 클래스에서 구현해야 함).

---

#### 3. **RunOperation**
   - **목적**: `docker run`-like 명령을 관리하기 위해 `Operation` 인터페이스를 구현합니다.
   - **초기화**:

     ```python
     RunOperation(client, container, interactive=True, stdout=None, stderr=None, stdin=None, logs=None)
     ```

     - `client`: Docker 클라이언트 인스턴스.
     - `container`: Docker에서 반환된 컨테이너 사전.
     - `interactive`: 세션이 대화형으로 작동해야 하는지 여부 (기본값: `True`).
     - `stdout`, `stderr`, `stdin`: 표준 출력, 오류 및 입력 스트림 (기본값은 `sys.stdout`, `sys.stderr`, `sys.stdin`).
     - `logs`: 컨테이너 로그를 포함할지 여부 (설정되지 않으면 폐기 예정 경고 발생).
   - **주요 메서드**:
     - `start(self, sockets=None, **kwargs)`: PTY를 설정하고 호스트와 컨테이너 간 데이터 전송을 시작합니다.
     - `israw(self, **kwargs)`: 컨테이너가 `tty=True`로 시작되었는지 확인합니다.
     - `sockets(self)`: `stdin`, `stdout`, `stderr`에 대한 소켓을 반환합니다.
     - `resize(self, height, width, **kwargs)`: 컨테이너의 PTY를 조정합니다.
     - `_container_info(self)`: 컨테이너에 대한 자세한 정보를 검색합니다.

---

#### 4. **ExecOperation**
   - **목적**: `docker exec`-like 명령을 관리하기 위해 `Operation` 인터페이스를 구현합니다.
   - **초기화**:

     ```python
     ExecOperation(client, exec_id, interactive=True, stdout=None, stderr=None, stdin=None)
     ```

     - `client`: Docker 클라이언트 인스턴스.
     - `exec_id`: `client.exec_create`를 사용하여 생성된 `exec` 인스턴스 ID.
     - `interactive`: 세션이 대화형으로 작동해야 하는지 여부 (기본값: `True`).
     - `stdout`, `stderr`, `stdin`: 표준 출력, 오류 및 입력 스트림 (기본값은 `sys.stdout`, `sys.stderr`, `sys.stdin`).
   - **주요 메서드**:
     - `start(self, sockets=None, **kwargs)`: `exec` 프로세스를 시작하고 데이터 펌프를 설정합니다.
     - `israw(self, **kwargs)`: `exec` 프로세스가 `tty=True`로 시작되었는지 확인합니다.
     - `sockets(self)`: `exec` 프로세스의 모든 I/O 스트림에 대한 단일 소켓을 반환합니다.
     - `resize(self, height, width, **kwargs)`: `exec` 프로세스의 PTY를 조정합니다.
     - `is_process_tty(self)`: `exec` 프로세스에 TTY가 할당되어 있는지 확인합니다.
     - `_exec_info(self)`: `exec` 인스턴스에 대한 자세한 정보를 검색합니다.

---

#### 5. **PseudoTerminal**
   - **목적**: Docker 컨테이너 또는 `exec` 프로세스를 위한 PTY의 라이프사이클을 관리합니다.
   - **초기화**:

     ```python
     PseudoTerminal(client, operation)
     ```

     - `client`: Docker 클라이언트 인스턴스.
     - `operation`: `RunOperation` 또는 `ExecOperation` 인스턴스.
   - **주요 메서드**:
     - `sockets(self)`: 기본 작업의 `sockets()` 메서드에 위임합니다.
     - `start(self, sockets=None)`: PTY 세션을 시작하고, 호스트와 컨테이너 간 입력/출력 스트림을 관리하며, 터미널 크기를 조정합니다.
     - `resize(self, size=None)`: 현재 터미널 크기 또는 지정된 크기에 따라 PTY를 조정합니다.
     - `_hijack_tty(self, pumps)`: 호스트와 컨테이너 간 데이터를 읽고 쓰기 위한 주요 루프를 관리합니다.

---

### **헬퍼 함수**

#### `exec_create`
   - **목적**: 컨테이너에 대해 `exec` 인스턴스를 생성합니다.
   - **시그니처**:

     ```python
     exec_create(client, container, command, interactive=True)
     ```

     - `client`: Docker 클라이언트 인스턴스.
     - `container`: 대상 컨테이너.
     - `command`: 컨테이너 내에서 실행할 명령.
     - `interactive`: 세션이 대화형으로 작동해야 하는지 여부 (기본값: `True`).

---

### **종속성**

- **표준 라이브러리**:
  - `sys`: 표준 입력/출력/오류 스트림에 접근하기 위해.
  - `signal`: `SIGWINCH` 신호를 처리하기 위해.
  - `warnings`: 폐기 경고를 발행하기 위해.
  - `ssl.SSLError`: SSL 관련 오류를 처리하기 위해.
- **내부 모듈**:
  - `dockerpty.io`: 저수준 I/O 작업 및 스트림 관리를 처리합니다.
  - `dockerpty.tty`: 터미널 조작 유틸리티를 제공합니다.

---

### **예제 사용법**

```python
import docker
from dockerpty import PseudoTerminal

# Docker 클라이언트 초기화
client = docker.Client()

# 컨테이너 생성
container = client.create_container(
    image='busybox:latest',
    stdin_open=True,
    tty=True,
    command='/bin/sh',
)

# 컨테이너의 PTY 시작
pty = PseudoTerminal(client, RunOperation(client, container))
pty.start()
```

---

### **결론**

`dockerpty` 모듈은 Docker 컨테이너와 의사 터미널을 통한 상호작용을 위한 견고한 프레임워크를 제공합니다. PTY를 활용하여 컨테이너화된 애플리케이션을 터미널 기반 워크플로우로 원활히 통합할 수 있으며, 로컬 터미널 세션과 유사한 사용자 경험을 보장합니다.