---
title: TCP TELNET 통신 과정 시뮬레이션
resource-path: 02.inbox/TCP TELNET 통신 과정 시뮬레이션.md
keywords:
tags:
  - network
date: 2025-05-21T09:08:00+09:00
lastmod: 2025-05-21T09:08:00+09:00
---
## Telnet (TCP 기반) 패킷 이동 시뮬레이션: Sender/Receiver 윈도우 및 패킷 내용

Telnet은 애플리케이션 계층 프로토콜이며, 전송 계층에서는 **TCP(Transmission Control Protocol)**를 사용합니다. TCP는 신뢰성 있는 데이터 전송을 보장하기 위해 **연결 설정(3-way handshake)**, **데이터 전송(슬라이딩 윈도우, 확인 응답)**, **연결 해제(4-way handshake)** 과정을 거칩니다.

아래는 Telnet 클라이언트(Sender)가 Telnet 서버(Receiver)에 접속하여 간단한 데이터를 주고받는 과정을 가상으로 시뮬레이션한 결과입니다. 실제 환경에서는 윈도우 크기 변화, 패킷 손실 및 재전송 등 더 복잡한 상황이 발생할 수 있습니다.

**용어 설명:**

- **Sender (송신자):** Telnet 클라이언트 (사용자 측)
- **Receiver (수신자):** Telnet 서버
- **Seq:** Sequence Number (순서 번호). 보내는 데이터의 바이트 순서를 나타냅니다.
- **Ack:** Acknowledgment Number (확인 응답 번호). 다음에 받아야 할 데이터의 시작 순서 번호를 나타냅니다. (즉, Ack-1 까지는 잘 받았다는 의미)
- **Win:** Window Size (윈도우 크기). 수신 버퍼의 남은 공간 크기를 알려주어 흐름 제어(Flow Control)에 사용됩니다. 송신자는 이 크기만큼만 확인 응답 없이 데이터를 보낼 수 있습니다.
- **Flags:** TCP 제어 플래그 (SYN, ACK, FIN, PSH 등)
- **Payload:** 실제 전송되는 데이터 (Telnet 명령어, 서버 응답 등)

**시뮬레이션 시작 (가정):**

- Sender의 초기 Sequence Number (ISN): `X`
- Receiver의 초기 Sequence Number (ISN): `Y`
- Sender의 초기 수신 윈도우 크기: `Win_C`
- Receiver의 초기 수신 윈도우 크기: `Win_S`

---

**1. 연결 설정 (3-Way Handshake)**

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|**단계**|**방향**|**TCP Flags**|**Seq**|**Ack**|**Win**|**Payload**|**설명**|
|1|Sender -> Receiver|`[SYN]`|`X`|`0`|`Win_C`|-|연결 요청. 자신의 초기 순서 번호(X)와 수신 윈도우 크기(Win_C) 전송.|
|2|Receiver -> Sender|`[SYN, ACK]`|`Y`|`X+1`|`Win_S`|-|연결 수락 및 요청 확인. 자신의 초기 순서 번호(Y), Sender의 요청 확인(X+1), 자신의 수신 윈도우 크기(Win_S) 전송.|
|3|Sender -> Receiver|`[ACK]`|`X+1`|`Y+1`|`Win_C`|-|Receiver의 연결 수락 확인(Y+1). **연결 성립 완료.**|

---

**2. 데이터 전송 (Telnet: 서버가 로그인 프롬프트 전송 -> 클라이언트가 사용자 이름 입력)**

- **상황:** 연결 후 Telnet 서버(Receiver)가 로그인 프롬프트를 보냅니다. (예: "Login: ")

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|**단계**|**방향**|**TCP Flags**|**Seq**|**Ack**|**Win**|**Payload**|**설명**|
|4|Receiver -> Sender|`[PSH, ACK]`|`Y+1`|`X+1`|`Win_S`|"Login: " (7 bytes)|서버가 데이터를 보냄 (Push 플래그 설정 가능). Seq=Y+1 (이전 ACK 다음 번호), Ack=X+1 (이전 Sender의 Seq+1). Payload 포함.|
|5|Sender -> Receiver|`[ACK]`|`X+1`|`Y+8`|`Win_C`|-|Sender가 서버 데이터 수신 확인. Ack=Y+1+7 = Y+8 (다음 받을 번호). 윈도우 크기는 Sender의 현재 버퍼 상황에 따라 업데이트될 수 있음.|

- **상황:** Telnet 클라이언트(Sender)가 사용자 이름 "user1\n" (6 bytes)을 입력하여 서버로 전송합니다.

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|**단계**|**방향**|**TCP Flags**|**Seq**|**Ack**|**Win**|**Payload**|**설명**|
|6|Sender -> Receiver|`[PSH, ACK]`|`X+1`|`Y+8`|`Win_C`|"user1\n" (6 bytes)|클라이언트가 데이터를 보냄. Seq=X+1 (이전 ACK 이후 첫 데이터), Ack=Y+8 (이전 Receiver의 Seq+Payload 길이). Payload 포함.|
|7|Receiver -> Sender|`[ACK]`|`Y+8`|`X+7`|`Win_S`|-|Receiver가 클라이언트 데이터 수신 확인. Ack=X+1+6 = X+7 (다음 받을 번호). 윈도우 크기는 Receiver의 현재 버퍼 상황에 따라 업데이트될 수 있음.|

---

**3. 연결 해제 (4-Way Handshake - 클라이언트가 먼저 종료 요청)**

- **상황:** Telnet 클라이언트(Sender)가 연결 종료를 원합니다.

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|**단계**|**방향**|**TCP Flags**|**Seq**|**Ack**|**Win**|**Payload**|**설명**|
|8|Sender -> Receiver|`[FIN, ACK]`|`X+7`|`Y+8`|`Win_C`|-|연결 종료 요청 (FIN). 마지막으로 보낸 데이터의 다음 Seq 번호(X+7). 마지막으로 받은 데이터의 다음 번호(Y+8)를 Ack.|
|9|Receiver -> Sender|`[ACK]`|`Y+8`|`X+8`|`Win_S`|-|Sender의 종료 요청(FIN) 확인. Ack=X+7+1 = X+8. (서버는 아직 데이터를 보낼 수 있는 상태 - Half-Close)|

- **상황:** Telnet 서버(Receiver)도 데이터를 모두 보냈고, 연결 종료를 원합니다.

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|**단계**|**방향**|**TCP Flags**|**Seq**|**Ack**|**Win**|**Payload**|**설명**|
|10|Receiver -> Sender|`[FIN, ACK]`|`Y+8`|`X+8`|`Win_S`|-|서버 측 연결 종료 요청 (FIN). 마지막으로 보낸 데이터의 다음 Seq 번호(Y+8). 마지막으로 받은 데이터의 다음 번호(X+8)를 Ack.|
|11|Sender -> Receiver|`[ACK]`|`X+8`|`Y+9`|`Win_C`|-|서버의 종료 요청(FIN) 확인. Ack=Y+8+1 = Y+9. **연결 종료 완료.** Sender는 TIME_WAIT 상태로 잠시 대기.|

---

**핵심 요약:**

- **Seq/Ack 번호:** 데이터의 순서를 맞추고, 빠진 데이터 없이 잘 받았는지 확인하는 데 사용됩니다. Ack 번호는 '다음에 받을 것으로 예상되는 Seq 번호'를 의미합니다.
- **윈도우 크기 (Win):** 수신 측의 버퍼 여유 공간을 송신 측에 알려주어, 송신 측이 과도하게 많은 데이터를 보내지 않도록 조절합니다 (흐름 제어). 수신 측의 처리 속도나 버퍼 상태에 따라 동적으로 변할 수 있습니다.
- **TCP Flags:** 연결 설정(SYN), 데이터 전송(PSH, URG), 확인 응답(ACK), 연결 종료(FIN, RST) 등 TCP 연결의 상태를 제어하는 데 사용됩니다.

이 시뮬레이션은 Telnet 통신 중 TCP 레벨에서 패킷이 어떻게 교환되는지 기본적인 흐름을 보여줍니다. 실제 네트워크 환경에서는 지연, 혼잡 제어(Congestion Control) 알고리즘, 재전송 등으로 인해 윈도우 크기 변화나 패킷 교환 순서가 더 복잡해질 수 있습니다.