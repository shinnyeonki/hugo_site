# `dockerpty: tty.py` 모듈 문서

`dockerpty: tty.py` 모듈은 터미널(TTY) 장치와 상호 작용하기 위한 유틸리티를 제공하며, 특히 가상 터미널(PTY)과 관련된 작업에 유용합니다. 이 모듈은 TTY 크기를 확인하거나 터미널을 일시적으로 raw 모드로 전환하는 기능을 포함하고 있습니다. 이러한 기능은 Docker 컨테이너 또는 PTY와 TTY 간 데이터를 스트리밍해야 하는 환경에서 유용하게 사용됩니다.

아래는 모듈의 구성 요소와 사용 방법에 대한 자세한 설명입니다.

---

## 함수

### `size(fd)`
#### 설명
제공된 파일 디스크립터와 연결된 TTY의 크기를 `(행, 열)` 형태의 튜플로 반환합니다. 파일 디스크립터는 일반적으로 TTY의 표준 출력 스트림(`stdout`)을 나타내야 합니다.

TTY 크기를 확인할 수 없는 경우 (예: 파일 디스크립터가 TTY가 아닌 경우), 함수는 `None`을 반환합니다.

#### 매개변수
- **`fd`**: 유효한 파일 디스크립터를 가진 파일 객체 (예: `sys.stdout`). 파일 디스크립터는 TTY와 연결되어 있어야 합니다.

#### 반환 값
- **`(rows, cols)`**: TTY의 행과 열 수를 나타내는 튜플.
- **`None`**: TTY 크기를 확인할 수 없는 경우.

#### 예제 코드
```python
import sys
from dockerpty.tty import size

tty_size = size(sys.stdout)
if tty_size:
    rows, cols = tty_size
    print(f"TTY 크기: 행={rows}, 열={cols}")
else:
    print("TTY가 아니거나 크기를 확인할 수 없습니다.")
```

---

## 클래스

### `Terminal`
#### 설명
`Terminal` 클래스는 터미널을 일시적으로 raw 모드로 전환하기 위한 컨텍스트 관리자 인터페이스를 제공합니다. Raw 모드에서는 줄 버퍼링 및 문자 처리가 비활성화되며, PTY에서 TTY로 데이터를 직접 스트리밍할 때 유용합니다.

#### 생성자
```python
Terminal(fd, raw=True)
```
- **매개변수**:
  - **`fd`**: 유효한 파일 디스크립터를 가진 파일 객체 (예: `sys.stdin`). 이는 터미널의 입력 스트림을 나타냅니다.
  - **`raw`**: 터미널이 raw 모드로 동작할지 여부를 나타내는 플래그. 기본값은 `True`.

- **속성**:
  - **`fd`**: 터미널과 연결된 파일 디스크립터.
  - **`raw`**: 터미널이 raw 모드로 동작할지 여부.
  - **`original_attributes`**: raw 모드로 전환하기 전의 원래 터미널 속성을 저장합니다. 초기값은 `None`.

#### 메서드

##### `start()`
터미널이 TTY이고 `raw` 플래그가 `True`인 경우, 터미널을 raw 모드로 전환합니다. 원래의 터미널 속성을 나중에 복원하기 위해 저장합니다.

- **동작**:
  - 파일 디스크립터가 TTY가 아니거나 `raw`가 `False`인 경우 아무 작업도 수행하지 않습니다.
  - 그렇지 않으면 현재 터미널 속성을 저장하고 `tty.setraw()`를 사용하여 raw 모드로 전환합니다.

##### `stop()`
터미널 속성을 raw 모드로 전환하기 전의 원래 상태로 복원합니다.

- **동작**:
  - `original_attributes`가 `None`이 아닌 경우, `termios.tcsetattr()`를 사용하여 `TCSADRAIN` 플래그와 함께 터미널 속성을 복원합니다.
  - 그렇지 않으면 아무 작업도 수행하지 않습니다.

##### `israw()`
터미널이 raw 모드로 설정되어 있는 경우 `True`를 반환하고, 그렇지 않으면 `False`를 반환합니다.

##### `__enter__()`
`with` 블록에 진입할 때 호출됩니다. `start()` 메서드를 호출하여 터미널을 raw 모드로 준비합니다.

##### `__exit__(*_args)`
`with` 블록을 종료할 때 호출됩니다. `stop()` 메서드를 호출하여 터미널을 원래 상태로 복원합니다.

##### `__repr__()`
`Terminal` 객체의 문자열 표현을 반환합니다. 파일 디스크립터와 raw 모드 상태를 포함합니다.

#### 예제 코드
```python
import sys
from dockerpty.tty import Terminal

# Terminal 컨텍스트 관리자를 사용하여 stdin을 일시적으로 raw 모드로 전환
with Terminal(sys.stdin, raw=True):
    print("터미널이 이제 raw 모드입니다. Ctrl+C를 눌러 종료하세요.")
    # raw 모드가 필요한 작업 수행
    # 예: 입력을 한 문자씩 즉시 읽기
    while True:
        char = sys.stdin.read(1)
        if char == '\x03':  # Ctrl+C
            break
        print(f"누른 키: {char}")

print("터미널이 원래 상태로 복원되었습니다.")
```

---

## 주요 개념

### Raw 모드
Raw 모드는 줄 버퍼링 및 문자 처리를 비활성화하여 터미널과 직접 상호 작용할 수 있도록 합니다. 이는 입력을 즉시 처리해야 하는 대화형 셸과 같은 애플리케이션에서 유용합니다.

### TTY 크기
TTY 크기는 텍스트를 표시하기 위한 행과 열의 수로 표현됩니다. 이 정보는 출력을 올바르게 포맷하거나 터미널 기반 애플리케이션의 레이아웃을 조정하는 데 사용됩니다.

### 컨텍스트 관리자
`Terminal` 클래스는 Python의 컨텍스트 관리자 프로토콜(`__enter__` 및 `__exit__`)을 활용하여 사용 후 터미널 설정이 제대로 복원되도록 보장합니다. 예외가 발생하더라도 설정이 복원됩니다.

---

## 의존성

`dockerpty: tty.py` 모듈은 다음 표준 라이브러리 모듈에 의존합니다:

- **`os`**: 운영 체제와 상호 작용하기 위한 함수를 제공합니다 (예: 파일 디스크립터가 TTY인지 확인).
- **`termios`**: POSIX 터미널 제어 함수에 접근하여 터미널 속성을 조작합니다.
- **`tty`**: 터미널 모드를 설정하기 위한 도우미 함수를 제공합니다 (예: raw 모드로 전환).
- **`fcntl`**: 파일 제어 작업에 접근하여 TTY 크기를 쿼리합니다.
- **`struct`**: `fcntl.ioctl()`에서 반환된 바이너리 데이터를 해석합니다.

---

## 라이선스

이 모듈은 Apache License, Version 2.0에 따라 배포됩니다. 전체 라이선스 텍스트는 [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)에서 확인할 수 있습니다.

---

## 작성자

- **Chris Corbyn** (`chris@w3style.co.uk`)

---

이 문서는 `dockerpty: tty.py` 모듈의 구성 요소와 이를 효과적으로 사용하는 방법에 대한 종합적인 개요를 제공합니다.