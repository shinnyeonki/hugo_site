---
title: unix 도메인 소켓
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: temp/unix 도메인 소켓.md
draft: true
---
`PF_UNIX` (또는 `AF_UNIX`)는 로컬 시스템 내에서 프로세스 간 통신(IPC)을 위한 프로토콜로, 네트워크를 거치지 않고 소켓을 사용해 데이터를 교환합니다. 아래는 `PF_UNIX`와 `datagram socket`을 사용한 클라이언트와 서버 예제입니다.

---

## **서버 코드 (Datagram Socket with PF_UNIX)**

```c


int main() {
    int server_sock;
    struct sockaddr_un server_addr, client_addr;
    char buffer[BUFFER_SIZE];
    socklen_t client_addr_len;

    // 1. 소켓 생성
    if ((server_sock = socket(PF_UNIX, SOCK_DGRAM, 0)) == -1) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    // 2. 주소 구조체 초기화
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sun_family = AF_UNIX;
    strncpy(server_addr.sun_path, SOCKET_PATH, sizeof(server_addr.sun_path) - 1);

    // 3. 소켓 주소 바인딩
    unlink(SOCKET_PATH); // 기존 소켓 파일 삭제
    if (bind(server_sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1) {
        perror("bind");
        close(server_sock);
        exit(EXIT_FAILURE);
    }

    printf("Server is running and waiting for messages...\n");

    // 4. 데이터 수신
    client_addr_len = sizeof(client_addr);
    while (1) {
        ssize_t received = recvfrom(server_sock, buffer, BUFFER_SIZE, 0,
                                    (struct sockaddr *)&client_addr, &client_addr_len);
        if (received == -1) {
            perror("recvfrom");
            break;
        }

        buffer[received] = '\0';
        printf("Received: %s\n", buffer);

        // 5. 클라이언트로 응답 전송
        const char *response = "Message received!";
        if (sendto(server_sock, response, strlen(response), 0,
                   (struct sockaddr *)&client_addr, client_addr_len) == -1) {
            perror("sendto");
            break;
        }
    }

    // 6. 소켓 종료
    close(server_sock);
    unlink(SOCKET_PATH); // 소켓 파일 삭제
    return 0;
}
```

---

## **클라이언트 코드 (Datagram Socket with PF_UNIX)**

```c


int main() {
    int client_sock;
    struct sockaddr_un server_addr, client_addr;
    char buffer[BUFFER_SIZE];

    // 1. 소켓 생성
    if ((client_sock = socket(PF_UNIX, SOCK_DGRAM, 0)) == -1) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    // 2. 클라이언트 주소 구조체 초기화
    memset(&client_addr, 0, sizeof(client_addr));
    client_addr.sun_family = AF_UNIX;
    strncpy(client_addr.sun_path, CLIENT_SOCKET_PATH, sizeof(client_addr.sun_path) - 1);

    // 3. 소켓 주소 바인딩
    unlink(CLIENT_SOCKET_PATH); // 기존 소켓 파일 삭제
    if (bind(client_sock, (struct sockaddr *)&client_addr, sizeof(client_addr)) == -1) {
        perror("bind");
        close(client_sock);
        exit(EXIT_FAILURE);
    }

    // 4. 서버 주소 구조체 초기화
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sun_family = AF_UNIX;
    strncpy(server_addr.sun_path, SERVER_SOCKET_PATH, sizeof(server_addr.sun_path) - 1);

    // 5. 서버로 메시지 전송
    const char *message = "Hello from client!";
    if (sendto(client_sock, message, strlen(message), 0,
               (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1) {
        perror("sendto");
        close(client_sock);
        exit(EXIT_FAILURE);
    }

    printf("Message sent to server.\n");

    // 6. 서버로부터 응답 수신
    ssize_t received = recvfrom(client_sock, buffer, BUFFER_SIZE, 0, NULL, NULL);
    if (received == -1) {
        perror("recvfrom");
        close(client_sock);
        exit(EXIT_FAILURE);
    }

    buffer[received] = '\0';
    printf("Received from server: %s\n", buffer);

    // 7. 소켓 종료
    close(client_sock);
    unlink(CLIENT_SOCKET_PATH); // 소켓 파일 삭제
    return 0;
}
```

---

## **실행 방법**

1. 서버를 먼저 실행:
    
    ```bash
    gcc -o unix_dgram_server server.c
    ./unix_dgram_server
    ```
    
2. 클라이언트를 실행:
    
    ```bash
    gcc -o unix_dgram_client client.c
    ./unix_dgram_client
    ```
    
3. 서버는 클라이언트로부터 메시지를 받고, 클라이언트로 응답을 보냅니다.
    

---

## **설명**

- **서버**:
    - `bind()`를 통해 지정된 파일 경로(`/tmp/unix_dgram_server.sock`)에 소켓을 바인딩.
    - `recvfrom()`로 메시지를 받고, 클라이언트 주소로 응답을 보냄.
- **클라이언트**:
    - 서버로 데이터를 전송하고, `recvfrom()`를 통해 응답을 수신.
    - 클라이언트 소켓 경로(`/tmp/unix_dgram_client.sock`)를 사용하여 독립적인 소켓 설정.

이 코드는 `PF_UNIX` 및 `datagram socket`을 활용한 간단한 클라이언트-서버 모델을 보여줍니다.