---
title: HTTPS와 비대칭 키 초기 설정부터 데이터 전송까지의 모든 과정 simulation
resource-path: 02.inbox/HTTPS와 비대칭 키 초기 설정부터 데이터 전송까지의 모든 과정 simulation.md
keywords:
tags:
  - simulation
  - encryption
date: 2025-06-20T09:02:36+09:00
lastmod: 2025-06-26T23:03:48+09:00
---
클라이언트가 서버로부터 HTTPS 프로토콜을 통해 `index.html`을 요청하는 상황에서 TCP 핸드셰이크가 완료된 후 진행되는 TLS 과정은 크게 세 단계로 나눌 수 있습니다: 

1. 핸드셰이크 (Handshake Phase)
2. 키 도출 (Key Derivation Phase)
3. 데이터 전송 (Data Transfer Phase)
### TLS 과정 상세 설명

**1. TLS 핸드셰이크 (Handshake Phase)** TLS 핸드셰이크 단계는 클라이언트와 서버가 안전한 통신을 위해 필요한 매개변수와 키를 설정하는 과정입니다. 이 단계에서는 다음의 중요한 과정들이 진행됩니다:

- **클라이언트 "Hello" 메시지 전송**:
    
    - 클라이언트(Bob)는 서버(Alice)에게 **지원하는 암호화 알고리즘 목록**을 보냅니다. 이 목록에는 대칭키 알고리즘 (예: AES), 공개키 알고리즘 (예: RSA), HMAC 알고리즘 (예: MD5 또는 SHA-1) 등이 포함될 수 있습니다.
    - 또한, **클라이언트 논스(Client Nonce)**를 함께 전송합니다. 논스는 프로토콜에서 한 번만 사용되는 고유한 숫자이며, 재생 공격(playback attack)을 방지하고 상대방이 '살아있는(live)' 상태임을 확인하는 데 사용됩니다.
- **서버 "Hello" 및 인증서 응답**:
    
    - 서버(Alice)는 클라이언트가 보낸 목록에서 **선호하는 암호화 알고리즘들을 선택**하여 클라이언트에게 다시 보냅니다.
    - 서버는 자신의 **디지털 인증서(Certificate)**와 **서버 논스(Server Nonce)**를 함께 전송합니다.
    - **인증서(Certificate)**는 서버의 **공개키(Public Key)**와 서버의 신원 정보를 포함하고 있으며, **인증 기관(Certification Authority, CA)에 의해 디지털 서명**되어 있습니다.
- **클라이언트의 서버 인증 및 Pre-Master Secret 전송**:
    
    - 클라이언트(Bob)는 수신한 서버의 인증서를 **인증 기관(CA)의 공개키를 사용하여 검증**합니다. 이 과정을 통해 클라이언트는 인증서에 포함된 서버의 공개키가 **실제로 해당 서버(Alice)의 것임을 신뢰**하게 됩니다. 이는 Trudy와 같은 침입자가 Bob에게 Alice로 가장하여 가짜 공개키를 전달하는 것을 방지합니다.
    - 클라이언트는 **Pre-Master Secret (PMS)**이라는 무작위 값을 생성합니다.
    - 이 PMS를 **서버의 공개키(Server's Public Key)**로 **암호화**한 후, **암호화된 PMS (Encrypted PMS)**를 서버로 전송합니다.
- **서버의 PMS 복호화 및 Master Secret 계산**:
    
    - 서버(Alice)는 클라이언트로부터 수신한 **암호화된 PMS를 자신의 개인키(Private Key)를 사용하여 복호화**하여 원래의 PMS를 얻습니다.
    - 이제 클라이언트와 서버 **모두** PMS, 클라이언트 논스, 서버 논스를 공유하게 됩니다. 이 세 가지 정보를 바탕으로 양측은 **동일한 키 도출 함수(Key Derivation Function)**를 사용하여 **마스터 시크릿(Master Secret, MS)**을 독립적으로 계산합니다.
- **핸드셰이크 메시지 무결성 확인**:
    
    - 클라이언트는 지금까지 주고받은 **모든 핸드셰이크 메시지들의 HMAC(Hash-based Message Authentication Code)을 계산하여 서버에 전송**합니다.
    - 서버도 동일하게 지금까지 주고받은 **모든 핸드셰이크 메시지들의 HMAC을 계산하여 클라이언트에 전송**합니다.
    - 이 HMAC 값들은 핸드셰이크 과정에서 메시지가 조작되지 않았음을 상호 검증하는 데 사용됩니다. 예를 들어, Trudy가 클라이언트가 제안한 강력한 알고리즘을 목록에서 삭제하려 했다면, 이 HMAC 검증 단계에서 감지되어 연결이 종료될 수 있습니다.
    - 이 단계에서 사용된 논스들은 "연결 재생 공격(connection replay attack)"을 방어하는 데 핵심적인 역할을 합니다.

**2. 키 도출 (Key Derivation Phase)** 핸드셰이크 단계에서 공유된 마스터 시크릿(MS)을 사용하여, 클라이언트와 서버는 실제로 데이터 암호화 및 무결성 검증에 사용될 **4개의 세션 키**를 도출합니다. 이는 보안 강화를 위한 것으로, 보통 동일한 키를 모든 암호화와 무결성 검증에 사용하지 않습니다.

- **마스터 시크릿(MS)으로부터 세션 키 생성**:
    - **`EB`**: 클라이언트(Bob)가 서버(Alice)에게 데이터를 보낼 때 사용할 **세션 암호화 키**.
    - **`MB`**: 클라이언트(Bob)가 서버(Alice)에게 데이터를 보낼 때 사용할 **세션 HMAC 키**.
    - **`EA`**: 서버(Alice)가 클라이언트(Bob)에게 데이터를 보낼 때 사용할 **세션 암호화 키**.
    - **`MA`**: 서버(Alice)가 클라이언트(Bob)에게 데이터를 보낼 때 사용할 **세션 HMAC 키**.
- **Initialization Vector (IV) 생성 (필요시)**:
    - 만약 선택된 대칭 암호화 방식이 CBC(Cipher Block Chaining) 모드를 사용하는 경우 (예: 3DES 또는 AES), 각 통신 방향(클라이언트->서버, 서버->클라이언트)에 대한 **Initialization Vector (IV)**도 마스터 시크릿(MS)으로부터 도출됩니다. IV는 동일한 평문 블록이 항상 다른 암호문 블록을 생성하도록 무작위성을 부여하는 데 사용됩니다.

이 단계가 완료되면, 클라이언트와 서버는 이제 향후 모든 메시지를 암호화하고 인증하는 데 필요한 모든 세션 키를 공유하게 됩니다.

**3. 데이터 전송 (Data Transfer Phase)** 모든 세션 키가 설정된 후, 클라이언트와 서버는 안전한 TCP 연결을 통해 실제 애플리케이션 데이터 (예: `index.html` 파일의 내용)를 주고받기 시작합니다.

- **데이터 스트림을 레코드(Record)로 분할**:
    - TLS는 긴 데이터 스트림을 **레코드(record)**라는 작은 단위로 분할합니다. `index.html` 파일의 내용도 여러 TLS 레코드로 나뉘어 전송됩니다.
- **HMAC 추가 및 암호화**:
    - 각 레코드에 대해 발신자(클라이언트 또는 서버)는 해당 레코드 데이터, 해당 방향의 **HMAC 세션 키** (클라이언트의 경우 `MB`, 서버의 경우 `MA`), 그리고 **TLS 시퀀스 번호**를 입력으로 사용하여 **HMAC을 계산**합니다. 이 HMAC은 메시지 무결성을 보장합니다.
    - 계산된 HMAC은 레코드 데이터 뒤에 추가됩니다.
    - 이 "레코드 + HMAC" 패키지 전체는 해당 방향의 **암호화 세션 키** (클라이언트의 경우 `EB`, 서버의 경우 `EA`)를 사용하여 **암호화**됩니다.
- **TCP로 전송**:
    - 암호화된 레코드 패키지는 하위 TCP 계층으로 전달되어 인터넷을 통해 전송됩니다.
- **수신자의 처리**:
    - 수신자(예: `index.html`을 받는 클라이언트)는 암호화된 레코드를 받으면 먼저 해당 세션 암호화 키로 **복호화**합니다.
    - 복호화된 레코드와 TLS 시퀀스 번호를 사용하여 HMAC을 다시 계산하고, 수신된 HMAC과 비교하여 **데이터 무결성을 확인**합니다. HMAC이 일치하면 데이터가 변경되지 않았음을 확인합니다.
    - **TLS 시퀀스 번호**의 사용은 Trudy가 TCP 세그먼트를 재정렬하거나 재생하는 등의 공격("woman-in-the-middle" attack)을 막아줍니다.
    - 무결성이 확인된 복호화된 데이터는 애플리케이션 계층으로 전달됩니다.
- **연결 종료 (Connection Closure)**:
    - TLS 세션은 더 이상 필요하지 않을 때 종료됩니다. TLS는 단순히 하위 TCP 연결을 종료하는 대신, 레코드의 `type` 필드를 사용하여 TLS 세션 종료를 명시적으로 알립니다. 이는 Trudy가 TCP FIN 세그먼트를 주입하여 세션을 조기에 종료(truncation attack)시키고 수신자가 모든 데이터를 받지 못했다고 오인하게 만드는 것을 방지합니다.

---

### TLS 과정 요약 표

| 단계            | 클라이언트 (요청자)                                     | 서버 (응답자)                                        | 주요 목적 및 포함 정보                              |
| :------------ | :---------------------------------------------- | :---------------------------------------------- | :----------------------------------------- |
| **1. 핸드셰이크**  | 1. 지원 암호화 알고리즘 목록 및 **클라이언트 논스** 전송.            | 2. 암호화 알고리즘 선택, **서버 인증서**, **서버 논스** 전송.       | 안전한 통신을 위한 매개변수 및 키 설정.                    |
|               | 3. 서버 인증서 검증 (CA를 통해 서버 공개키 신뢰).                | 4. **Pre-Master Secret (PMS)** 복호화.             | **CA 역할**: 서버 공개키가 진짜임을 검증.                |
|               | 5. PMS 생성 및 서버 공개키로 암호화 후 전송.                   | 6. PMS와 논스로부터 **Master Secret (MS)** 계산.        | **논스**: 재생 공격 방지 및 '살아있음' 증명.              |
|               | 7. 핸드셰이크 메시지 HMAC 전송.                           | 8. 핸드셰이크 메시지 HMAC 전송.                           | **HMAC**: 핸드셰이크 메시지 무결성 검증.                |
| **2. 키 도출**   | MS로부터 **4개의 세션 키** (`EB`, `MB`, `EA`, `MA`) 도출. | MS로부터 **4개의 세션 키** (`EB`, `MB`, `EA`, `MA`) 도출. | 실제 데이터 암호화 및 무결성 검증에 사용될 대칭 세션 키 생성.       |
|               | (CBC 사용 시) **IV** 도출.                           | (CBC 사용 시) **IV** 도출.                           | 효율적이고 안전한 데이터 전송을 위한 준비.                   |
| **3. 데이터 전송** | `index.html` 데이터 스트림을 레코드로 분할.                  | 수신한 레코드 복호화 및 HMAC 검증.                          | `index.html`과 같은 애플리케이션 데이터의 기밀성 및 무결성 보장. |
|               | 레코드에 HMAC 추가 (시퀀스 번호 포함).                       | 무결성 확인된 데이터를 애플리케이션 계층에 전달.                     | **HMAC**: 메시지 무결성 보장.                      |
|               | 레코드+HMAC을 세션 암호화 키로 암호화 후 TCP로 전송.              | TLS 연결 종료 시 명시적 종료 레코드 사용.                      | **시퀀스 번호**: 재생 및 재정렬 공격 방지.                |

---
### 실제 요청시 TLS 과정

```bash
shinnk@DESKTOP-KRSG68U:~/source_main/university/network_박현민_4$ curl -v "https://dns.google"
*   Trying 8.8.4.4:443...
* Connected to dns.google (8.8.4.4) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
*  CAfile: /etc/ssl/certs/ca-certificates.crt
*  CApath: /etc/ssl/certs
* TLSv1.0 (OUT), TLS header, Certificate Status (22):
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS header, Certificate Status (22):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS header, Finished (20):
* TLSv1.2 (IN), TLS header, Supplemental data (23):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.2 (OUT), TLS header, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use h2
* Server certificate:
*  subject: CN=dns.google
*  start date: Jun  2 08:37:32 2025 GMT
*  expire date: Aug 25 08:37:31 2025 GMT
*  subjectAltName: host "dns.google" matched cert's "dns.google"
*  issuer: C=US; O=Google Trust Services; CN=WE2
*  SSL certificate verify ok.
* Using HTTP2, server supports multiplexing
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
* Using Stream ID: 1 (easy handle 0x55896f9109f0)
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
> GET / HTTP/2
> Host: dns.google
> user-agent: curl/7.81.0
> accept: */*
>
* TLSv1.2 (IN), TLS header, Supplemental data (23):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* TLSv1.2 (IN), TLS header, Supplemental data (23):
* TLSv1.2 (OUT), TLS header, Supplemental data (23):
* TLSv1.2 (IN), TLS header, Supplemental data (23):
* TLSv1.2 (IN), TLS header, Supplemental data (23):
< HTTP/2 200
< content-security-policy: object-src 'none';base-uri 'self';script-src 'nonce-V0n3tKAxmea423-IDB1pAg' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/honest_dns/1_0;frame-ancestors 'none'
< strict-transport-security: max-age=31536000; includeSubDomains; preload
< x-content-type-options: nosniff
< content-security-policy-report-only: script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/scaffolding/ntdsgswbsc:55:0
< cross-origin-opener-policy-report-only: same-origin; report-to=ntdsgswbsc:55:0
< report-to: {"group":"ntdsgswbsc:55:0","max_age":2592000,"endpoints":[{"url":"https://csp.withgoogle.com/csp/report-to/scaffolding/ntdsgswbsc:55:0"}],}
< server: scaffolding on HTTPServer2
< x-xss-protection: 0
< x-frame-options: SAMEORIGIN
< date: Wed, 25 Jun 2025 16:24:52 GMT
< expires: Wed, 25 Jun 2025 16:29:52 GMT
< cache-control: public, max-age=300
< content-type: text/html; charset=UTF-8
< age: 90
< alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
< accept-ranges: none
< vary: Accept-Encoding
<
* TLSv1.2 (IN), TLS header, Supplemental data (23):
```

주어진 `tls.txt` 결과는 클라이언트(curl)가 `dns.google` 서버와 HTTPS (TLS) 연결을 수립하는 과정을 상세하게 보여줍니다. 이미 TCP 핸드셰이크가 완료되었다는 가정하에, 이 로그를 **TLS 핸드셰이크**, **키 도출**, 그리고 **데이터 전송**의 세 가지 주요 TLS 단계에 맞춰 분석하고 해석해 드리겠습니다. 서버 측에서 TLS 1.3을 사용하고 있는 것이 확인됩니다.

---

### `tls.txt` 로그 해석: TLS 과정의 단계별 이해

`tls.txt` 로그는 클라이언트(여기서는 `curl` 명령어를 실행한 당신의 시스템)와 서버(`dns.google`) 간의 TLS 통신을 보여줍니다. 이 로그는 `output.pdf`에 설명된 TLS 프로토콜의 원리와 실제 구현이 어떻게 연결되는지 이해하는 데 도움이 됩니다.

**시작 부분: TCP 연결 및 ALPN 협상**

*   `* Trying 8.8.4.4:443...`
*   `* Connected to dns.google (8.8.4.4) port 443 (#0)`
    *   이 부분은 클라이언트가 서버의 IP 주소 `8.8.4.4`의 443 포트로 TCP 연결을 시도하고 성공했음을 보여줍니다. 이는 **TCP 핸드셰이크가 완료되었다는 가정**을 충족합니다.

*   `* ALPN, offering h2`
*   `* ALPN, offering http/1.1`
    *   **ALPN (Application-Layer Protocol Negotiation)**은 TLS 핸드셰이크 과정 중 클라이언트가 서버에게 자신이 지원하는 **애플리케이션 계층 프로토콜 목록**을 제안하는 것입니다 [외부 정보: ALPN은 TLS 확장 기능으로, HTTPS에서 HTTP/1.1과 HTTP/2 중 무엇을 사용할지 협상하는 데 사용됩니다]. 여기서 클라이언트는 HTTP/2 (`h2`)와 HTTP/1.1을 제안하고 있습니다.

*   `* CAfile: /etc/ssl/certs/ca-certificates.crt`
*   `* CApath: /etc/ssl/certs`
    *   이것은 클라이언트의 시스템이 **인증서 (Certificate)**를 검증하기 위해 사용할 **인증 기관 (CA) 인증서**의 경로를 나타냅니다. 클라이언트는 이 경로의 CA 인증서를 사용하여 서버가 전송한 인증서를 신뢰할 수 있는지 확인합니다.

**1. TLS 핸드셰이크 (Handshake Phase)**

TLS 핸드셰이크는 클라이언트와 서버가 안전한 통신을 위한 모든 매개변수를 협상하고, 서로의 신원을 확인하며, **세션 키를 생성**하는 데 필요한 **마스터 시크릿(Master Secret)**을 안전하게 교환하는 과정입니다.

*   `* TLSv1.0 (OUT), TLS header, Certificate Status (22):`
*   `* TLSv1.3 (OUT), TLS handshake, Client hello (1):`
    *   **클라이언트 "Hello" 메시지 전송**: 클라이언트는 TLS 1.3 버전으로 **"Client Hello"** 메시지를 전송하며 핸드셰이크를 시작합니다. 이 메시지에는 클라이언트가 지원하는 **암호화 알고리즘 목록** (대칭키, 공개키, HMAC 알고리즘 등)과 함께 **클라이언트 논스 (Client Nonce)**가 포함됩니다. 논스는 재생 공격(playback attack)을 방지하고 상대방이 현재 "살아있는" 상태임을 확인하는 데 사용되는 "한 번만 사용되는 값"입니다. 앞서 보이는 `TLSv1.0`이나 `TLSv1.2` 레코드는 `curl`의 내부 로깅이나 초기 협상 시도일 수 있으며, 실제로는 더 높은 버전이 사용됩니다.

*   `* TLSv1.2 (IN), TLS header, Certificate Status (22):`
*   `* TLSv1.3 (IN), TLS handshake, Server hello (2):`
    *   **서버 "Hello" 및 인증서 응답**: 서버는 클라이언트의 목록에서 **암호화 알고리즘들을 선택**하고, **"Server Hello"** 메시지를 보냅니다. 이 메시지에는 서버가 선택한 알고리즘과 함께 **서버 논스 (Server Nonce)**가 포함됩니다.

*   `* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):`
    *   **암호화된 확장 (Encrypted Extensions)**: TLS 1.3의 특징 중 하나로, 이전 버전에서는 평문으로 전송되던 일부 핸드셰이크 확장(예: ALPN 협상 결과 등)이 이제 암호화되어 전송됩니다 [외부 정보: TLS 1.3의 주요 변경 사항 중 하나는 핸드셰이크 메시지의 더 많은 부분을 암호화하여 정보 노출을 줄이는 것입니다].

*   `* TLSv1.3 (IN), TLS handshake, Certificate (11):`
    *   **서버 인증서 전송**: 서버는 자신의 **디지털 인증서 (Certificate)**를 클라이언트에게 전송합니다. 이 인증서는 서버의 **공개키 (Public Key)**와 서버의 신원 정보를 포함하고 있으며, 신뢰할 수 있는 **인증 기관 (CA)**에 의해 **디지털 서명**되어 있습니다.

*   `* TLSv1.3 (IN), TLS handshake, CERT verify (15):`
    *   **인증서 검증 (Certificate Verify)**: 서버는 **자신의 개인키 (Private Key)**로 **핸드셰이크 메시지들의 해시 값에 서명**하여 클라이언트에게 보냅니다. 클라이언트는 서버의 공개키로 이 서명을 검증하여, 서버가 해당 공개키에 상응하는 개인키를 소유하고 있음을 확인하고, 핸드셰이크 메시지가 위변조되지 않았음을 검증합니다.

*   `* TLSv1.3 (IN), TLS handshake, Finished (20):`
*   `* TLSv1.2 (OUT), TLS header, Finished (20):`
*   `* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):`
*   `* TLSv1.3 (OUT), TLS handshake, Finished (20):`
    *   **핸드셰이크 완료 (Finished)**: 클라이언트와 서버는 지금까지 주고받은 **모든 핸드셰이크 메시지들의 HMAC (Hash-based Message Authentication Code)을 계산하여 상호 전송**합니다. 이 HMAC 값은 핸드셰이크 과정에서 메시지가 조작되지 않았음을 상호 검증하는 데 사용됩니다. `Change Cipher Spec` 메시지는 주로 하위 호환성을 위해 전송되며, 이제 암호화된 통신이 시작됨을 알리는 역할을 합니다 [외부 정보: TLS 1.3에서는 이 메시지가 TLS 1.2만큼 중요하지 않고 주로 하위 호환성을 위해 사용됩니다].

*   `* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384`
    *   이 줄은 **TLS 핸드셰이크가 성공적으로 완료**되었음을 명확히 보여줍니다. 협상된 프로토콜 버전은 **TLSv1.3**이며, 사용될 암호화 스위트는 **TLS_AES_256_GCM_SHA384**입니다. 이는 데이터 암호화에 **AES-256 (GCM 모드)**을 사용하고, 메시지 무결성 검증에 **SHA384 기반의 HMAC**를 사용하기로 결정되었음을 의미합니다.

*   `* ALPN, server accepted to use h2`
    *   서버가 클라이언트가 제안한 **HTTP/2 (h2)** 프로토콜 사용을 수락했음을 확인합니다.

*   **서버 인증서 상세 정보 및 검증 결과**:
    *   `* Server certificate: ...`
    *   `* subject: CN=dns.google`
    *   `* start date: ...`
    *   `* expire date: ...`
    *   `* issuer: C=US; O=Google Trust Services; CN=WE2`
    *   `* SSL certificate verify ok.`
        *   이 부분은 클라이언트가 서버로부터 받은 인증서의 세부 정보를 보여줍니다. **인증서의 주체 (Subject)**가 `dns.google`이며, **발급자 (Issuer)**는 `Google Trust Services`라는 CA임을 명확히 보여줍니다. 또한, `SSL certificate verify ok.`는 클라이언트가 CA 공개키를 사용하여 서버 인증서의 유효성을 성공적으로 검증했으며, **서버의 신뢰성 (End-point authentication)**이 확인되었음을 의미합니다.

**2. 키 도출 (Key Derivation Phase)**

TLS 1.3 핸드셰이크 과정에서 **Pre-Master Secret (PMS)**와 **논스(Nonces)**를 사용하여 **마스터 시크릿 (Master Secret, MS)**이 계산됩니다. 이 MS는 실제 데이터 암호화 및 무결성 검증에 사용될 **세션 키**들을 도출하는 데 사용됩니다. `tls.txt` 로그에는 이 과정이 명시적으로 나타나지 않지만, "SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384"라는 결과는 키 도출이 완료되었음을 암시합니다.

*   **세션 키 생성**: 클라이언트와 서버는 MS와 논스를 바탕으로 **동일한 키 도출 함수 (Key Derivation Function)**를 사용하여 다음의 **4가지 세션 키**를 독립적으로 계산합니다:
    *   `EB`: 클라이언트가 서버로 데이터를 보낼 때 사용할 **세션 암호화 키**.
    *   `MB`: 클라이언트가 서버로 데이터를 보낼 때 사용할 **세션 HMAC 키** (메시지 무결성 검증용).
    *   `EA`: 서버가 클라이언트로 데이터를 보낼 때 사용할 **세션 암호화 키**.
    *   `MA`: 서버가 클라이언트로 데이터를 보낼 때 사용할 **세션 HMAC 키**.
*   **Initialization Vector (IV) 생성**: AES와 같은 블록 암호 방식이 CBC (Cipher Block Chaining) 모드를 사용하는 경우, 각 통신 방향에 대한 **Initialization Vector (IV)**도 MS로부터 도출됩니다. IV는 동일한 평문 블록이 항상 다른 암호문 블록을 생성하도록 무작위성을 부여하여 암호문의 패턴 노출을 방지합니다. (참고: AES-GCM은 IV/Nonce를 사용하지만, CBC와는 다른 방식으로 사용합니다. `output.pdf`는 주로 CBC를 예로 설명합니다.)

이 단계가 완료되면, 클라이언트와 서버는 이후 모든 메시지를 암호화하고 인증하는 데 필요한 모든 대칭 세션 키를 공유하게 됩니다.

**3. 데이터 전송 (Data Transfer Phase)**

모든 세션 키가 설정된 후, 클라이언트와 서버는 안전한 TLS 연결을 통해 실제 애플리케이션 데이터 (여기서는 HTTP/2 요청 및 응답)를 주고받기 시작합니다.

*   `* Using HTTP2, server supports multiplexing`
*   `* Connection state changed (HTTP/2 confirmed)`
    *   클라이언트와 서버가 이제 HTTP/2 프로토콜을 통해 통신할 것임을 확인합니다.

*   `* TLSv1.2 (OUT), TLS header, Supplemental data (23):` (여러 번 반복)
*   `> GET / HTTP/2`
*   `> Host: dns.google`
*   `> user-agent: curl/7.81.0`
*   `> accept: */*`
    *   이 부분은 클라이언트가 서버로 **실제 HTTP/2 요청**을 전송하는 것을 보여줍니다. `Supplemental data (23)`는 TLS 레코드 형식에서 **애플리케이션 데이터**를 나타냅니다.
    *   TLS는 긴 데이터 스트림 (예: HTTP 요청)을 **레코드 (record)**라는 작은 단위로 분할합니다. 각 레코드에 대해 발신자 (여기서는 클라이언트)는 해당 레코드 데이터, 클라이언트의 **HMAC 세션 키 (`MB`)**, 그리고 **TLS 시퀀스 번호**를 사용하여 **HMAC을 계산**하고 이를 레코드 뒤에 추가합니다. 그런 다음, 이 "레코드 + HMAC" 패키지 전체는 클라이언트의 **암호화 세션 키 (`EB`)**를 사용하여 **암호화**됩니다. 이 암호화된 패키지는 TCP 계층으로 전달되어 인터넷을 통해 전송됩니다. **TLS 시퀀스 번호**의 사용은 메시지 재정렬 또는 재생 공격 (woman-in-the-middle attack)을 막는 데 핵심적인 역할을 합니다.

*   `* TLSv1.2 (IN), TLS header, Supplemental data (23):` (여러 번 반복)
*   `* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):` (두 번)
*   `* old SSL session ID is stale, removing`
    *   서버는 암호화된 애플리케이션 데이터 (`Supplemental data (23)`)와 함께 **세션 재개 (Session Resumption)**를 위한 **New Session Ticket**을 전송하고 있습니다 [외부 정보: TLS 1.3의 주요 기능 중 하나로, 다음 연결을 더 빠르게 설정할 수 있도록 암호화된 세션 키 정보를 클라이언트에게 제공합니다].

*   `< HTTP/2 200`
*   `< content-security-policy: ...` (이하 서버 응답 헤더)
    *   이 부분은 서버로부터 수신된 **HTTP/2 응답 헤더**를 보여줍니다. `HTTP/2 200`은 요청이 성공적으로 처리되었음을 나타냅니다. 클라이언트는 이 암호화된 레코드를 받으면 먼저 서버의 세션 암호화 키 (`EA`)로 **복호화**하고, 수신된 HMAC과 자체 계산한 HMAC을 비교하여 **데이터 무결성**을 확인합니다. 무결성이 확인된 복호화된 데이터는 애플리케이션 계층으로 전달됩니다. 이 과정에서 `index.html` 파일의 내용 (또는 여기서는 `dns.google`의 루트 페이지 내용)이 안전하게 클라이언트에게 전달됩니다.

---

### TLS 과정 요약 표 (TLS 1.3 중심)

| 단계                | 클라이언트 (시작)                                                                            | 서버 (응답)                                                                          | 주요 목적 및 `tls.txt` 로그 해석                                                                                                                                                                                                                                                                                                    |
| :------------------ | :------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. 핸드셰이크**   | 1. `Client hello` (TLS 1.3) 전송: 지원 암호화 목록, 클라이언트 논스, ALPN 제안.    | 2. `Server hello` (TLS 1.3) 전송: 암호화 알고리즘 선택, 서버 논스, `Encrypted Extensions` 전송. | 안전한 통신 매개변수 협상 및 키 교환 준비. <br> **로그**: `* ALPN, offering h2`, `* TLSv1.3 (OUT), TLS handshake, Client hello (1):` <br> `* TLSv1.3 (IN), TLS handshake, Server hello (2):`, `* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):` |
|                     | 3. 서버 인증서 및 CERT verify 수신. CA 공개키로 서버 인증서 검증 (서버 인증). | 4. `Certificate` 및 `CERT verify` 전송.                                        | 서버 신원 확인 및 핸드셰이크 메시지 무결성 보장. <br> **로그**: `* TLSv1.3 (IN), TLS handshake, Certificate (11):`, `* TLSv1.3 (IN), TLS handshake, CERT verify (15):` <br> `* SSL certificate verify ok.`                                                                                           |
|                     | 5. Pre-Master Secret (PMS) 생성, 서버 공개키로 암호화 후 전송.                     | 6. PMS 복호화. 논스, PMS 이용 `Master Secret (MS)` 독립적 계산.             | **마스터 시크릿 교환**: 세션 키 생성을 위한 공유 비밀 값 확립. <br> **로그**: 이 단계는 로그에 직접 표시되지 않지만, `SSL connection using TLSv1.3` 결과에 내포됨. `output.pdf`에서 이 부분이 상세 설명됨.                                                                                        |
|                     | 7. 모든 핸드셰이크 메시지의 HMAC 전송.                                             | 8. 모든 핸드셰이크 메시지의 HMAC 전송.                                         | **핸드셰이크 무결성 검증**: 메시지 조작 방지. <br> **로그**: `* TLSv1.3 (IN), TLS handshake, Finished (20):`, `* TLSv1.2 (OUT), TLS header, Finished (20):` (클라이언트 측에서 TLSv1.2로 표시된 Finished 메시지도 이 역할을 수행)                                                                       |
| **2. 키 도출**      | MS와 논스로부터 4개의 세션 키 (`EB`, `MB`, `EA`, `MA`) 및 IV(필요시) 도출.   | MS와 논스로부터 4개의 세션 키 (`EB`, `MB`, `EA`, `MA`) 및 IV(필요시) 도출. | 실제 데이터 암호화 및 무결성 검증에 사용될 대칭 세션 키 생성. <br> **로그**: `* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384` 이 줄이 키 도출이 성공했음을 최종적으로 확인.                                                                                                                |
| **3. 데이터 전송**  | HTTP/2 요청 (예: `GET / HTTP/2`)을 레코드로 분할. HMAC 추가, 세션 키로 암호화 후 전송. | 수신한 레코드 복호화 및 HMAC 검증. 무결성 확인된 데이터를 애플리케이션에 전달.    | `index.html`과 같은 애플리케이션 데이터의 기밀성 및 무결성 보장. <br> **로그**: `* TLSv1.2 (OUT), TLS header, Supplemental data (23):` (클라이언트 요청) <br> `* TLSv1.2 (IN), TLS header, Supplemental data (23):` (서버 응답) <br> `< HTTP/2 200` (애플리케이션 데이터 수신 확인) |
|                     | (선택) 세션 재개를 위한 `Newsession Ticket` 수신 [외부 정보].                              | (선택) `Newsession Ticket` 전송 [외부 정보].                                         | 다음 연결의 효율성 증대. <br> **로그**: `* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):`                                                                                                                                                                                                                         |

---

**추가적인 통찰:**

*   **보안 목표 달성**: 이 TLS 과정을 통해 `output.pdf`에서 강조하는 다음의 보안 목표들이 달성됩니다:
    *   **기밀성 (Confidentiality)**: `index.html` 내용과 같은 애플리케이션 데이터는 세션 암호화 키 (`EB`, `EA`)로 암호화되어 전송되므로, `Trudy`(침입자)가 데이터를 스니핑하더라도 내용을 이해할 수 없습니다.
    *   **메시지 무결성 (Message integrity)**: 각 TLS 레코드에 HMAC이 포함되며, TLS 시퀀스 번호까지 HMAC 계산에 포함되므로, `Trudy`가 메시지 내용을 변경하거나, 순서를 재정렬하거나, 재생하더라도 수신 측에서 이를 감지할 수 있습니다.
    *   **종단점 인증 (End-point authentication)**: 클라이언트는 서버의 디지털 인증서를 CA의 공개키로 검증하여 서버의 신원을 확인하고, 서버는 클라이언트의 Pre-Master Secret을 복호화하여 클라이언트가 공유 비밀을 알고 있음을 (선택적으로) 확인합니다 (이 예시에서는 서버 인증만 명확함).
*   **TLS 1.3의 효율성**: `output.pdf`는 `Pre-Master Secret`을 서버 공개키로 암호화하여 보내고, 이를 통해 `Master Secret`을 도출하는 과정을 설명합니다. TLS 1.3은 이 키 교환 과정을 더욱 최적화하여 대부분의 핸드셰이크가 단 한 번의 왕복으로 완료될 수 있도록 합니다 [외부 정보: 1-RTT 핸드셰이크].
*   **로그의 `TLSv1.2` 표기**: 로그에 간간이 나타나는 `TLSv1.2` 표기는 실제 협상된 프로토콜 버전이 `TLSv1.3`임에도 불구하고 `curl` 내부 로직이나 TLS 레코드 계층의 특정 상태 또는 하위 호환성 메커니즘을 나타내는 것일 수 있습니다. 핵심은 최종적으로 `TLSv1.3`이 사용되었다는 점입니다.


### TLS 의 오해 바로잡기

> [!question] 
> 헨드세이크 과정중에 키 도출을 하는 거야 아니면 handshake 이후에 키 도출을 하는 거야?

TLS 핸드셰이크 과정에서 **키 도출은 핸드셰이크 단계 내에서 이루어집니다**.

소스에 따르면, TLS 프로토콜은 핸드셰이크, 키 도출, 데이터 전송의 세 단계를 가집니다. 하지만 실제로 TLS 핸드셰이크 프로토콜을 더 자세히 살펴보면, 키 도출이 핸드셰이크 단계의 핵심 부분으로 통합되어 있음을 알 수 있습니다.

실제 TLS 핸드셰이크 과정에서 키 도출은 다음과 같이 진행됩니다:

- 클라이언트와 서버는 핸드셰이크 과정 중에 **논스(nonces)를 서로 교환합니다**. 논스는 재생 공격(replay attack)을 방지하고 통신 상대방의 "생존성(liveness)"을 확인하는 데 사용되는 고유한 숫자입니다.
- 클라이언트는 서버의 공개 키를 사용하여 **사전 마스터 시크릿(Pre-Master Secret, PMS)을 생성하고 암호화하여 서버로 전송합니다**.
- 클라이언트와 서버는 TLS 표준에 지정된 **동일한 키 도출 함수를 사용하여 PMS와 논스로부터 마스터 시크릿(Master Secret, MS)을 독립적으로 계산합니다**.
- 이 MS는 이후 **세션 암호화 키(encryption keys)와 HMAC 키(HMAC keys)를 생성하는 데 사용됩니다**. 만약 선택된 대칭 암호가 CBC(Cipher Block Chaining)를 사용한다면, 초기화 벡터(Initialization Vectors, IVs)도 MS에서 얻어집니다.

**이 모든 과정, 즉 MS 계산 및 세션 키 생성은 TLS 핸드셰이크의 4단계에서 발생합니다**. 이 단계가 완료되면 클라이언트와 서버 간의 **모든 메시지는 생성된 키를 사용하여 암호화되고 인증(HMAC)됩니다**. `tls.txt` 소스에서도 핸드셰이크 메시지 교환(`Client hello`, `Server hello`, `Finished` 등) 이후에 SSL 연결이 `TLSv1.3 / TLS_AES_256_GCM_SHA384`와 같은 특정 암호화 방식을 사용하여 설정되었음을 보여주며, 이는 핸드셰이크 과정에서 키가 성공적으로 도출되었음을 시사합니다.