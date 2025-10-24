---
title: IPC (massage passing)
date: 2025-05-01T13:03:00+09:00
lastmod: 2025-05-01T13:03:00+09:00
resource-path: 02.inbox/IPC (massage passing).md
aliases: 
tags:
  - system-programing
  - operating-system
---
아래는 **Unix에서 사용되는 다양한 프로세스 간 통신**(Inter-Process Communication, IPC) 방식들에 대한 **자세한 설명**입니다.  
주요 내용은 다음과 같은 IPC 기법들을 포함합니다:

1. **Ordinary Pipe (일반 파이프)**
2. **Named Pipe (FIFO)**
3. **UNIX Domain Socket**

---

### 🔹 1. Ordinary Pipe (일반 파이프)

#### ✅ 개념

- `pipe()` 시스템 콜을 통해 생성됨
- 두 개의 **파일 디스크립터**(file descriptor) 반환:
  - 하나는 **쓰기 전용**(write-end)
  - 하나는 **읽기 전용**(read-end)
- 데이터는 쓰기 쪽으로 넣고, 읽기 쪽에서 뺌 → **Producer-Consumer 패턴**
- 단방향(unidirectional) 통신만 지원

#### ✅ 특징

| 항목        | 내용                             |     |
| --------- | ------------------------------ | --- |
| **범위**    | 부모와 자식 프로세스 간만 가능 (fork 이후 공유) |     |
| **존속성**   | 프로세스 종료 시 사라짐                  |     |
| **방향성**   | 단방향 (한쪽에서만 보내고 한쪽에서만 받음)       |     |
| **사용 예시** | 쉘 명령어 연결 (`ls \| grep "txt"`)  |     |


#### ✅ 예제 코드

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
    int pipefd[2];
    pid_t pid;
    char buf;

    if (pipe(pipefd) == -1) {
        perror("Pipe failed");
        exit(EXIT_FAILURE);
    }

    pid = fork();

    if (pid < 0) { // Fork 실패
        perror("Fork failed");
        exit(EXIT_FAILURE);
    }

    if (pid == 0) { // 자식 프로세스 (reader)
        close(pipefd[1]); // 쓰기 fd 닫기
        while (read(pipefd[0], &buf, 1) > 0)
            write(STDOUT_FILENO, &buf, 1);
        close(pipefd[0]);
    } else { // 부모 프로세스 (writer)
        close(pipefd[0]); // 읽기 fd 닫기
        write(pipefd[1], "Hello from parent", 17);
        close(pipefd[1]);
        wait(NULL); // 자식 기다리기
    }

    return 0;
}
```

> 이 코드는 부모가 메시지를 보내고 자식이 그것을 출력하는 간단한 파이프 예제입니다.

---

### 🔹 2. Named Pipe (FIFO: First In First Out)

#### ✅ 개념

- 이름을 가진 파일 형태의 파이프
- `mkfifo()` 함수로 생성되며, 실제 파일처럼 `/tmp/myfifo` 같은 경로에 존재함
- 여러 프로세스 간 통신 가능 (부모-자식 관계 필요 없음)

#### ✅ 특징

| 항목 | 내용 |
|------|------|
| **범위** | 관련 없는 모든 프로세스 간 통신 가능 |
| **존속성** | 프로세스 종료 후에도 유지됨 (수동 삭제 필요) |
| **방향성** | 기본 단방향, 하지만 양방향도 가능 (두 FIFO 사용하면 됨) |
| **형태** | 파일 시스템 상에 물리적으로 존재하는 파일 |

#### ✅ 예제 코드

##### 🧱 FIFO 생성자
```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    mkfifo("myfifo", 0666); // 권한 0666으로 myfifo 생성
    return 0;
}
```

##### 📝 쓰기(writer)
```c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fd = open("myfifo", O_WRONLY); // Blocking 모드
    write(fd, "Hello from writer", 17);
    close(fd);
    return 0;
}
```

##### 📖 읽기(reader)
```c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    char buffer[80];
    int fd = open("myfifo", O_RDONLY);
    read(fd, buffer, sizeof(buffer));
    printf("Received: %s\n", buffer);
    close(fd);
    return 0;
}
```

> 위 코드를 실행하려면 세 개의 터미널 창에서 각각 순서대로 실행해야 합니다:
> ```
> $ ./creator
> $ ./reader   # reader 먼저 실행하고 대기
> $ ./writer   # writer가 메시지 전송
> ```

---

### 🔹 3. UNIX Domain Socket (로컬 소켓)

#### ✅ 개념

- 로컬 머신 내에서만 사용되는 소켓
- 파일 시스템 경로(`/tmp/mysocket`)를 주소로 사용함
- TCP/IP 소켓과 비슷하지만, 커널 내부에서 처리되어 더 빠름

#### ✅ 특징

| 항목 | 내용 |
|------|------|
| **범위** | 동일 머신 내의 프로세스 간 |
| **존속성** | 프로세스 종료 후에도 파일 유지(삭제 필요) |
| **방향성** | 양방향(full-duplex), 스트림 또는 데이터그램 방식 가능 |
| **성능** | 일반 파이프보다 느리지만 네트워크 소켓보다 빠름 |

#### ✅ 예제 코드

```c
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main() {
    int sv[2]; // 소켓 페어
    char buffer[100];

    if (socketpair(AF_UNIX, SOCK_STREAM, 0, sv) == -1) {
        perror("Socketpair failed");
        return 1;
    }

    pid_t pid = fork();

    if (pid < 0) {
        perror("Fork failed");
        return 1;
    }

    if (pid == 0) { // 자식 프로세스 (수신)
        close(sv[0]); // 부모 쪽 fd 닫기
        read(sv[1], buffer, sizeof(buffer) - 1);
        printf("Child received: %s\n", buffer);
        close(sv[1]);
    } else { // 부모 프로세스 (송신)
        close(sv[1]); // 자식 쪽 fd 닫기
        write(sv[0], "Hello my child", 15);
        close(sv[0]);
        wait(NULL); // 자식 종료 대기
    }

    return 0;
}
```

---

### 📊 전체 비교표

| 항목 | Ordinary Pipe | Named Pipe (FIFO) | Unix Domain Socket |
|------|----------------|--------------------|---------------------|
| **통신 범위** | 부모-자식 프로세스 | 모든 프로세스 | 모든 프로세스 |
| **존속성** | 일시적 | 영구적 (파일 시스템에 남음) | 영구적 (경로로 지정된 파일) |
| **방향성** | 단방향 | 단방향/양방향 가능 | 양방향(full-duplex) |
| **방식** | Direct | Indirect | Indirect |
| **동기화** | 기본 blocking | 기본 blocking | 기본 blocking |
| **비동기 지원** | 가능 | 가능 | 가능 |
| **성능** | 매우 빠름 | 중간 | 빠름 |
| **복잡성** | 낮음 | 중간 | 약간 복잡 |
| **사용 목적** | 간단한 parent-child 통신 | 여러 프로세스 간 안정적인 통신 | 고성능 로컬 멀티프로세스 통신 |

---

### 🚀 성능 비교 (내부 구현 기준)

```
Ordinary Pipe > Unix Domain Socket > Named Pipe (FIFO) > Network Socket
```

- **Ordinary Pipe** : 가장 빠르고 간단 (커널 내부 버퍼 사용)
- **Unix Domain Socket** : 양방향, full-duplex, 네트워크 소켓처럼 사용 가능
- **Named Pipe (FIFO)** : 파일 시스템 기반이므로 약간 느림
- **Network Socket** : TCP/IP 오버헤드가 있어 가장 느림

---

### 💬 요약

- **Ordinary Pipe**: 부모-자식 간 단방향 통신, 가장 간단하고 빠름
- **Named Pipe (FIFO)**: 파일처럼 생성하여 여러 프로세스 간 통신 가능
- **UNIX Domain Socket**: 로컬 머신 내에서 네트워크 소켓처럼 사용되는 고성능 통신 수단