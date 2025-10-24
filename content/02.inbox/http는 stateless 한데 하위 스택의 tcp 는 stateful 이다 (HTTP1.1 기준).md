---
title: http는 stateless 한데 하위 스택의 tcp 는 stateful 이다 (HTTP1.1 기준)
date: 2025-03-25T15:09:00+09:00
lastmod: 2025-03-25T15:09:00+09:00
resource-path: 02.inbox/http는 stateless 한데 하위 스택의 tcp 는 stateful 이다 (HTTP1.1 기준).md
aliases: 
tags:
  - network
---
### 질문
Persistent HTTP 에서 기본적으로 http 는 stateless 해 하지만 어떻게 Persistent하게 get 요청을 보낼 수 있는 거야 즉 서버 측에서 이미 3way handshake 했다는 것을 어떻게 인지하는 거야??


### 답변 요약
- **Stateless** 상태를 유지하지 않는 시스템의 특성의 의미 (HTTP)
- **Stateful** 은 상태를 유지하며 동작하는 시스템의 특성을 나타냅니다. (TCP)
- **Persistent** 는 연결을 재사용하여 네트워크 효율성을 높이는 방식을 의미합니다.
- 따라서 HTTP는 **stateless** 지만, **(일반적으로 사용하는)전송 계층에서 TCP의 stateful 특성을 활용**(HTTP 헤더의 `Connection: keep-alive` 속성) 하여 persistent connection을 구현할 수 있다

### **핵심 개념: Stateless vs Stateful

1. **HTTP는 Stateless(무상태)이다**:  
   - HTTP 프로토콜 자체는 이전 요청에 대한 정보를 유지하지 않습니다. 매 요청은 독립적으로 처리됩니다.
   - 즉, 서버는 클라이언트가 이전에 어떤 요청을 보냈는지 기억하지 않습니다.

2. **TCP는 Stateful(상태 유지)이다**:  
   - TCP는 연결 지향(connection-oriented) 프로토콜로, 연결 상태를 유지합니다.  
   - 3-way handshake를 통해 연결이 설정된 후, 해당 연결은 특정 시간 동안 유지되며, 이 연결을 통해 여러 데이터 패킷을 주고받을 수 있습니다.

---

### **Persistent HTTP에서 GET 요청이 가능한 이유**

#### **1. TCP 연결 유지**
- Persistent HTTP에서는 하나의 TCP 연결을 통해 여러 개의 HTTP 요청과 응답을 주고받을 수 있습니다.  
- TCP 연결은 **stateful**이므로, 서버는 이미 설정된 TCP 연결을 통해 클라이언트로부터 들어오는 데이터를 인식하고 처리할 수 있습니다.  
- 즉, 서버는 "이미 3-way handshake를 완료한 연결"이라는 사실을 TCP 계층에서 관리하며, 이를 통해 추가적인 요청(GET 등)을 처리할 준비가 됩니다.

#### **2. HTTP 요청의 독립성**
- HTTP는 **stateless**이므로, 각 HTTP 요청은 독립적입니다.  
- 클라이언트는 동일한 TCP 연결을 통해 새로운 HTTP 요청을 보내더라도, 이전 요청과 관련된 정보를 포함하지 않습니다.  
- 서버는 매번 들어오는 HTTP 요청을 처음부터 해석하고 처리하며, 이전 요청에 의존하지 않습니다.

---

### **예시: Persistent HTTP 동작 과정**

1. **TCP 연결 설정 (3-way handshake)**:
   - 클라이언트와 서버 간 TCP 연결이 설정됩니다.
   - 이 연결은 일정 시간 동안 유지됩니다.

2. **첫 번째 HTTP GET 요청**:
   - 클라이언트는 TCP 연결을 통해 첫 번째 HTTP GET 요청을 보냅니다.
   - 서버는 이 요청을 처리하고 응답을 반환합니다.

3. **두 번째 HTTP GET 요청**:
   - 클라이언트는 동일한 TCP 연결을 통해 두 번째 HTTP GET 요청을 보냅니다.
   - 서버는 이 요청을 처리하고 응답을 반환합니다.

4. **TCP 연결 종료**:
   - 더 이상 요청이 없거나 타임아웃이 발생하면 TCP 연결이 종료됩니다.

---

### **서버가 어떻게 TCP 연결을 인지하는가?**

TCP는 **연결 상태**를 관리하는 프로토콜이므로, 서버는 다음과 같은 정보를 통해 연결을 인지합니다:

1. **소켓(Socket)**:
   - TCP 연결은 클라이언트와 서버 간의 소켓으로 표현됩니다.
   - 소켓은 IP 주소와 포트 번호 쌍으로 식별됩니다.
   - 서버는 각 클라이언트의 소켓 정보를 기반으로 연결 상태를 관리합니다.

2. **연결 식별자(Connection Identifier)**:
   - 서버는 각 TCP 연결을 고유한 식별자(예: 소켓 파일 디스크립터)로 관리합니다.
   - 이 식별자를 통해 특정 클라이언트와의 연결을 추적합니다.

3. **데이터 스트림(Stream)**:
   - TCP는 데이터를 순차적으로 전송하는 스트림 기반 프로토콜입니다.
   - 서버는 동일한 연결을 통해 들어오는 데이터를 순차적으로 처리합니다.

---

### **HTTP의 Stateless 특성과 Persistent HTTP의 관계**

- **HTTP Stateless**:  
  - 각 HTTP 요청은 독립적이며, 서버는 이전 요청에 대한 정보를 유지하지 않습니다.
  - 예를 들어, 첫 번째 GET 요청과 두 번째 GET 요청 사이에는 아무런 연관성이 없습니다.

- **TCP Persistent**:  
  - TCP 연결은 상태를 유지하므로, 동일한 연결을 통해 여러 개의 HTTP 요청을 보낼 수 있습니다.
  - 즉, HTTP 요청은 무상태이지만, 이를 전달하는 TCP 연결은 상태를 유지합니다.

---

### **요약**

1. **HTTP는 Stateless**:  
   - 각 HTTP 요청은 독립적이며, 서버는 이전 요청에 대한 정보를 유지하지 않습니다.

2. **TCP는 Stateful**:  
   - TCP 연결은 상태를 유지하므로, 동일한 연결을 통해 여러 개의 HTTP 요청을 보낼 수 있습니다.

3. **Persistent HTTP 동작 원리**:  
   - TCP 연결이 설정된 후, 이 연결을 통해 여러 개의 HTTP 요청(GET 등)을 순차적으로 보낼 수 있습니다.
   - 서버는 TCP 연결 상태를 통해 클라이언트를 인지하며, 각 HTTP 요청은 독립적으로 처리됩니다.

따라서, **HTTP의 Stateless 특성과 TCP의 Stateful 특성이 결합되어 Persistent HTTP가 가능**하게 됩니다.