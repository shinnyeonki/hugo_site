---
title: UDP와 TCP Demultiplexing 의 이해
resource-path: 02.inbox/UDP와 TCP Demultiplexing 의 이해.md
keywords:
tags:
  - network
  - university
date: 2025-03-28T09:53:00+09:00
lastmod: 2025-03-28T09:53:00+09:00
---
> 디멀티플렉싱은 수신된 네트워크 패킷을 분석하여 해당 패킷이 어떤 소켓으로 전달되어야 하는지를 결정하는 과정

> 멀티플렉싱은 여러 응용 프로그램에서 생성된 데이터를 하나의 네트워크 인터페이스로 전송하는 과정


```
UDP와 TCP 디멀티플렉싱의 비교 분석
UDP는 디멀티플렉싱을 위해 목적지 IP 주소와 목적지 포트 번호라는 2-튜플을 사용하는 반면 8, TCP는 송신지 IP 주소, 송신지 포트 번호, 목적지 IP 주소, 목적지 포트 번호로 구성된 4-튜플을 사용합니다

이러한 차이는 각 프로토콜의 연결 지향성 여부에서 비롯됩니다. TCP는 연결 지향적인 특성상 각 연결의 상태를 추적해야 하며, 이는 고유한 4-튜플을 통해 이루어집니다
TCP 연결은 두 특정 호스트의 두 특정 프로세스 간의 전용 통신 채널을 의미하므로, 더 자세한 식별 정보가 필요합니다. TCP의 신뢰성 있는 데이터 전송과 순서 보장 기능은 이러한 연결 상태 유지에 의존합니다.
반면, UDP는 각 데이터그램을 독립적인 단위로 취급하는 비연결형 프로토콜이므로 데이터그램을 올바른 포트에서 수신 대기 중인 애플리케이션에 전달하는 데 목적지 정보만으로 충분합니다. UDP의 이러한 단순성은 디멀티플렉싱 과정을 더 빠르고 효율적으로 만들어줍니다
이는 속도가 중요하고 일부 데이터 손실이 허용되는 애플리케이션(예: 스트리밍, 온라인 게임)에 UDP가 적합한 이유입니다.
반대로, TCP의 복잡한 디멀티플렉싱 방식은 여러 동시 연결을 통해 데이터를 안정적이고 순서대로 전달하는 데 필수적이며 3, 웹 브라우징, 파일 전송, 이메일과 같이 데이터 무결성이 중요한 애플리케이션에 적합합니다.
```

### UDP와 TCP의 Demultiplexing 이해하기

UDP와 TCP의 demultiplexing 차이는 각 프로토콜의 연결 방식에서 비롯됩니다. UDP는 비연결형으로, 각 데이터그램을 독립적으로 처리하며 목적지 포트만으로 충분히 데이터를 전달할 수 있습니다. 반면, TCP는 연결 지향형으로, 두 호스트 간의 특정 프로세스 쌍을 식별하기 위해 더 많은 정보(4-튜플)가 필요합니다.  

이를 실제로 느끼기 위해 Linux 명령어를 사용하거나 C 언어로 간단한 서버를 구현할 수 있습니다. 아래에서 단계별로 설명하겠습니다.  

---

### Linux 명령어 사용하기

Linux에서 `nc`(netcat)와 `ss` 명령어를 사용해 차이를 관찰할 수 있습니다:  

#### **UDP 관찰**

1. **UDP 서버 시작:** `nc -u -l 12345`  
2. **다른 터미널에서 데이터 전송:** `echo "Hello" | nc -u 127.0.0.1 12345`  
3. **UDP 소켓 확인:** `ss -u -a`  
   - 포트 12345에서 듣고 있는 단일 UDP 소켓을 볼 수 있으며, 여러 출처에서 데이터를 받을 수 있습니다.  
#### **TCP 관찰**

1. **TCP 서버 시작:** `nc -l 12345`  
2. **다른 터미널에서 연결:** `nc 127.0.0.1 12345` 후 데이터 입력(예: "Hello" 입력).  
3. **TCP 소켓 확인:** `ss -t -a`  
   - 듣기 중인 소켓과 특정 클라이언트 IP, 포트와 연결된 확립된 연결을 볼 수 있습니다.  

이 과정에서 UDP는 단일 소켓으로 여러 클라이언트의 데이터를 처리하지만, TCP는 각 연결마다 별도의 소켓을 생성하는 것을 알 수 있습니다.  

```
ESTAB    0    0     127.0.0.1:37479         127.0.0.1:12345 # UDP
LISTEN   0    1     0.0.0.0:12345           0.0.0.0:*       # TCP
ESTAB    0    0     127.0.0.1:12345         127.0.0.1:50972 # TCP
```

---

### C 언어 구현  
C 언어로 간단한 서버를 작성해 차이를 체험할 수 있습니다.  

#### **UDP 서버 예제**  
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 12345
#define BUFFER_SIZE 1024

int main() {
    int sockfd;
    struct sockaddr_in server_addr, client_addr;
    char buffer[BUFFER_SIZE];
    socklen_t addr_len = sizeof(client_addr);

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket creation failed");
        exit(EXIT_FAILURE);
    }

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    printf("UDP server listening on port %d\n", PORT);

    while (1) {
        int n = recvfrom(sockfd, buffer, BUFFER_SIZE, 0, (struct sockaddr*)&client_addr, &addr_len);
        if (n < 0) {
            perror("recvfrom failed");
            continue;
        }
        buffer[n] = '\0';
        printf("Received from %s:%d: %s\n",
               inet_ntoa(client_addr.sin_addr), ntohs(client_addr.sin_port), buffer);
    }

    return 0;
}
```
이 코드는 단일 소켓으로 모든 클라이언트의 데이터그램을 처리합니다.  

#### **TCP 서버 예제**  
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 12345
#define BUFFER_SIZE 1024

int main() {
    int listenfd, connfd;
    struct sockaddr_in server_addr, client_addr;
    char buffer[BUFFER_SIZE];
    socklen_t addr_len = sizeof(client_addr);

    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    if (listenfd < 0) {
        perror("socket creation failed");
        exit(EXIT_FAILURE);
    }

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(listenfd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    if (listen(listenfd, 5) < 0) {
        perror("listen failed");
        exit(EXIT_FAILURE);
    }

    printf("TCP server listening on port %d\n", PORT);

    while (1) {
        connfd = accept(listenfd, (struct sockaddr*)&client_addr, &addr_len);
        if (connfd < 0) {
            perror("accept failed");
            continue;
        }

        printf("Accepted connection from %s:%d\n",
               inet_ntoa(client_addr.sin_addr), ntohs(client_addr.sin_port));

        int n = read(connfd, buffer, BUFFER_SIZE);
        if (n > 0) {
            buffer[n] = '\0';
            printf("Received: %s\n", buffer);
        }

        close(connfd);
    }

    return 0;
}
```
TCP 서버는 각 클라이언트 연결마다 새로운 소켓(`connfd`)을 생성하며, 이는 4-튜플로 식별됩니다.  

---

### UDP와 TCP의 비교  

| 항목                | UDP                              | TCP                              |
|-----------------------|-----------------------------------|-----------------------------------|
| **Demultiplexing Key** | 목적지 IP, 목적지 포트 (2-튜플) | 송신지 IP, 송신지 포트, 목적지 IP, 목적지 포트 (4-튜플) |
| **연결 모델**        | 비연결형, 상태 없음              | 연결 지향형, 상태 유지           |
| **소켓 동작**        | 모든 클라이언트가 하나의 소켓 사용 | 각 연결마다 별도 소켓 생성        |
| **적합한 애플리케이션** | 스트리밍, 온라인 게임 (속도 중요, 일부 데이터 손실 허용) | 웹 브라우징, 파일 전송 (신뢰성, 순서 보장 중요) |
| **`ss` 명령어 출력** | "UNCONN" 상태, 하나의 소켓만 표시 | 수신 대기 및 여러 개의 확립된 연결 표시 |

이 표에서 알 수 있듯이, UDP는 간단한 방식으로 데이터를 전달하지만 신뢰성이 낮고, TCP는 보다 복잡한 방식으로 데이터를 관리하여 신뢰성을 보장합니다.  

---

### 추가 고려 사항  

#### **멀티 클라이언트 실험**  
- UDP의 경우, 여러 개의 클라이언트에서 `nc -u`를 사용해 데이터를 전송하면 하나의 소켓에서 모든 데이터를 받을 수 있습니다.  
- TCP의 경우, 여러 개의 클라이언트가 연결하면 `ss -t -a` 명령어에서 각 클라이언트와 서버 간에 생성된 개별 연결을 확인할 수 있습니다.  

#### **패킷 분석 도구 사용**  
- Wireshark와 같은 네트워크 패킷 분석기를 사용하면 UDP와 TCP의 패킷 헤더를 직접 확인할 수 있습니다.  
- `strace` 명령어를 사용하여 시스템 호출을 분석하면, 각각의 프로토콜이 어떻게 소켓을 다루는지 더 깊이 이해할 수 있습니다.  

---

이제 UDP와 TCP의 demultiplexing 방식이 어떻게 다른지, 그리고 그것이 실제 네트워크 애플리케이션에 어떤 영향을 미치는지 직접 체험할 수 있습니다.