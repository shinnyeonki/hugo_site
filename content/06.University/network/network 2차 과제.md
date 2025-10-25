---
title: network 2차 과제
resource-path: 06.University/network/network 2차 과제.md
aliases:
tags:
date: 2025-06-03T06:05:16+09:00
lastmod: 2025-06-03T06:40:34+09:00
---
# 🌐 HTTP 0.9 ~ HTTP 1.1 까지 알아보는 통신 기술
![http-protocol-history](https://blog.kakaocdn.net/dn/I329S/btrRAEMQ1Dz/IuWfVfCOB3YfS3p4fdKffK/img.webp)

![http-0.9](https://blog.kakaocdn.net/dn/bQsfWU/btrRvIfmfVi/S0NlKDy59R89HKGvKeaKf0/img.png)

HTTP의 시작은 1989년 **팀 버너 리(Tim Berners-LEE)**에 의해 제안된 인터넷의 하이퍼 텍스트 시스템이다.

초기 버전인 HTTP/0.9는 매우 단순한 프로토콜이었다.

가능한 메서드는 하이퍼텍스트 문서(html)를 가져오기만 하는 **GET 동작**이 유일했으며, 헤더(header)도 없어 요청과 응답이 극히 단순 명료 하였다. 또한 상태 코드(status code)도 없었기 때문에 문제가 발생한 경우 특정 html 파일을 오류에 대한 설명과 함께 보내졌다.

![http-0.9](https://blog.kakaocdn.net/dn/zcPzC/btrRjpAv0BS/aB1y8CKT5GTTfj5KcbeDvK/img.png)

```
<HTML>
A very simple HTML page
</HTML>
```

HTTP 0.9 스펙을 요약하면 다음과 같다.

*   TCP/IP 링크 위에서 동작하는 ASCII 프로토콜
*   Get 메서드만 지원
*   HTTP 헤더 X, 상태 코드 X
*   응답도 HTML 파일 자체만 보내줌
*   서버와 클라이언트 간의 연결은 모든 요청 후에 닫힘(closed)

사실 초기에는 버전 번호가 존재하지 않았지만, 이후에 다른 http 버전들과 구분하기 위해서 0.9라는 버전을 붙이게 되었다고 한다.

HTTP는 이러한 비교적 단순한 형태로 1991년에 시작되어, 이후 빠르게 진화하고 발전하게 되어지기 시작 했다.

* * *

**HTTP / 1.0**
--------------

인터넷의 성장이 날이 갈수록 거대해지면서, 1994년 **W3C**가 만들어지며 HTML의 발전을 도모하게 되었고, 이와 비슷하게 HTTP 프로토콜 개선에 초점을 맞추기 위해 **HTTP-WG(HTTP Working Group)**가 설립되었다.

웹 브라우저, 인터넷 인프라가 빠르게 진화하며 이제는 단순히 하이퍼텍스트 문서 뿐만 아니라 멀티미디어 데이터나 메타데이터 등 다양하고 상세한 컨텐츠가 필요해짐으로써, 기존의 HTTP 0.9로는 다양한 요구사항들을 채울수 없는 한계에 봉착하게 되었다.

그러다 1996년 HTTP-WG는 HTTP/1.0 구현의 일반적인 사용을 문서화한 **RFC 1945**를 발표하게 된다.

> RFC 1945는 어렵게 생각할 필요없이 HTTP 1.0 프로토콜 통신 스펙에 관한 기술 문서 정도로 생각하면 된다.  
> 컨텐츠 인코딩, 다양한 글자 지원, 멀티파트 타입, 인가, 캐싱, 프록시, 날짜 형식 등을 문서화 하였다.

이는 다음과 같은 익숙한 형태의 요청과 응답 포맷으로 구성되었다.

Request 메세지에는 GET 요청이 시작되는 줄에 PATH와 HTTP 버젼 그리고 다음 줄로 이어지는 헤더값을 가지며, Response 메세지에는 200 OK 이후 응답 상태로 이어지는 응답 헤더값을 가지는 걸 볼 수 있다.

![http-1.0](https://blog.kakaocdn.net/dn/brHf7i/btrRnDGk6pe/dQPEnLJTjCMA5TNS1P2aN0/img.png)

![http-1.0](https://blog.kakaocdn.net/dn/bc1WXc/btrRoziSeG9/SpIemkW8YHeYMThkpsnVmk/img.png)

이른바 HTTP 포맷 형태의 시초라고 보면 된다.

이렇게 발표된 HTTP 1.0 스펙을 요약하면 다음과 같다.

*   기본적인 HTTP 메서드와 요청/응답 헤더 추가
*   HTTP 버전 정보가 각 요청 사이내로 전송되기 시작 (HTTP/1.0 이 GET 라인에 붙은 형태로)
*   상태 코드(status code)가  응답의 시작 부분에 붙어 전송되어, 브라우저가 요청에 대한 성공과 실패를 알 수 있고 그 결과에 대한 동작을 할 수 있게 되었다. (특정 방법으로 로컬 캐시를 갱신하거나 ..등)
*   응답 헤더의 Content-Type 덕분에 HTML 파일 형식 외에 다른 문서들을 전송하는 기능이 추가되었다.
*   단기커넥션 : connection 하나당 1 Request & 1 Response 처리 가능

* * *

### **HTTP 1.0 문제점**

#### **Short-lived Connection**

HTTP 1.0의 문제점은 비연결성(connectionless)로 인한 단기 커넥션(Short-lived connenction) 특징이다.

즉, 커넥션 하나당 하나의 요청 하나의 응답 처리가 가능한 것을 말하는데, 서버에 자원을 요청할때마다 매번 새로운 연결을 해주어야 했다.

*   1 Request & 1 response
*   매번 새로운 연결로 성능 저하
*   매번 새로운 연결로 서버 부하 비용 증가

![단기커넥션](https://blog.kakaocdn.net/dn/bnMVmL/btrRg7Pqvma/Lh3Kj0AZ2BKCWEs1uwof90/img.png)

예를들어 웹페이지를 요청하면 html과 그에 딸린 css나 js 및 이미지 등등 수 많은 자원들이 다운로드되어 화면에 띄울 텐데, 각 자원들을 따로 따로 매번 TCP 연결하고 다운받고 연결 끊고 다시 연결하고 다운 받고 연결 끊는 것이다.

그래서 HTTP 초기에는 모든 자료에 대해서 비연결성으로 각각의 자원에 대해 연결/응답/종료를 반복하다보니 느렸다.

* * *

**HTTP / 1.1**
--------------

HTTP 1.0의 몇가지 단점을 커버하기 위해 HTTP 1.0이 출시된지 **6개월 만에** 1997년 1월에 공식적으로 HTTP/1.1이 릴리즈 되게 된다. 

HTTP 1.1은 현재 가장 많이 쓰이는 프로토콜 버젼이며, 우리가 HTTP를 학습할때 배우는 기본 베이스 지식이기도 하다.

HTTP 1.1 표준은 이전 버전에서 발견 된 많은 프로토콜 모호성을 해결하고 몇 가지 크리티컬한 성능 개선을 도입했다.

좀더 보완된 특징은 다음과 같다.

*   지속 연결(Persistent connection) : 지정한 timeout 동안 연속적인 요청 사이에 커넥션을 닫지 않음. 기존 연결에 대해서 handshake 생략 가능
*   파이프 라이닝(pipelining) : 이전 요청에 대한 응답이 완전히 전송되기 전에 다음 전송을 가능하게 하여,  여러 요청을 연속적으로 보내 그 순서에 맞춰 응답을 받는 방식으로 지연 시간을 줄이는 방식 (불안정하여 사장됨)
*   HOST 헤더 추가 : 동일 IP 주소에 다른 도메인을 호스트하는 기능 가능
*   Chunk Encoding 전송 : 응답 조각
*   바이트 범위 요청
*   캐시 제어 메커니즘 도입

* * *

### **Persistent Connection **(keep-alive)****

HTTP는 TCP 연결 기반 위에서 동작하는 프로토콜로 신뢰성 확보를 위해 연결을 맺고 끊는 데 있어서 [3 way Handshake](https://inpa.tistory.com/entry/NW-%F0%9F%8C%90-%EC%95%84%EC%A7%81%EB%8F%84-%EB%AA%A8%ED%98%B8%ED%95%9C-TCP-UDP-%EA%B0%9C%EB%85%90-%E2%9D%93-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EC%9E%90) 가 이루어진다. 그런데 HTTP는 기본적으로 비연결성(connecitonless) 프로토콜이기 때문에 한 번의 요청과 응답을 하고 응답이 끝나면 연결을 끊어 버리는데, 자원을 요청할때 마다 연결을 맺고 끊어버려 [오버헤드(overhead)](overhead))가 생기게 된다.

그래서 HTTP/1.1에서 **Persistent Connection** 기능이 추가됨으로써, **한 번 맺어졌던 연결을 끊지 않고 지속적으로 유지**하여 불필요한 Handshake를 줄여 성능을 개선하였다.

*   연결을 유지함으로써 Handshake 과정을 생략해 빠르게 자원을 받아올 수 있다.
*   불필요한 연결의 맺고 끊음을 최소화시켜 네트워크 부하를 줄 일 수 있다.
*   클라이언트 측에서 요청에 keep-alive 헤더를 담아 보내야 한다. 
*   정확한 Content-length 헤더를 사용해야 한다. 하나의 connection을 계속해서 재사용해야 하는데, 특정 요청의 종료를 판단할 수 없기 때문이다.
*   Connection 헤더를 지원하지 않는 proxy에는 사용할 수 없다.

![Persistent Connection](https://blog.kakaocdn.net/dn/c0dV5Z/btrRhmeFOcr/mJgYfT0gEEkPezGK0WLULK/img.png)

> 가끔 HTTP 지속 연결을 persistent connection 혹은 keep-alive connection 으로 용어를 혼재하는데, 정확히는 persistent connection이 맞다.  
> keep-alive는 HTTP 1.0+�� persistent connection을 연결하기 위해, 헤더에 명시해 사용하는 단어라고 보면 된다.  

#### ****keep-alive 동작 과정****

Keep-Alive는 원리는 단순하다.

지정한 timeout동안 연결을 끊지 않게 지정해서, HTTP 요청과 응답 시 다수의 TCP 연결 handshake를 줄이는 것에 초점을 둔다.

HTTP/1.1부터는 keep-alive가 기본으로 세팅되어 자동으로 Persistent Connection 연결이 된다. 하지만 기본적으로 HTTP/1.0 connection은 하나의 request에 응답할 때마다 connection을 close하도록 설정돼있다.

![keep-alive](https://blog.kakaocdn.net/dn/5PnGQ/btrRnZuRO2e/74FHBQDsmfjkHEcuagKMak/img.png)

따라서 HTTP/1.0+ 기반에서 TCP 연결의 재사용을 원할때 아래처럼 **요청 헤더 Connection 속성에 keep-alive를 세팅**해야 한다는 특징이 있다.

![keep-alive](https://blog.kakaocdn.net/dn/LnWeN/btrRjphUoWU/VKPlCg7f62mMiRh05EeNKk/img.png)

request header

만약 서버에서 keep-alive connection을 지원하는 경우에는 동일한 헤더를 response에 담아 보내주고, 지원하지 않으면 헤더에 담아 보내주지 않는다. 만약 서버의 응답에 해당 헤더가 없을 경우 client는 지원하지 않는다고 가정하고 connection을 재사용하지 않게 된다.

![keep-alive](https://blog.kakaocdn.net/dn/CCEb7/btrRmUnW18n/8HkPtkXoKzW1Wewho2Ek90/img.png)

*   max : keep-alive을 통해서 주고받을 수 있는 request의 최대 갯수. 이 수보다 더 많은 요청을 주고 받을 경우에는 connection은 close된다.
*   timeout : keep-alive가 얼마동안 유지될 것인가를 의미한다. 이 시간이 지날 동안 request가 없을 경우에 connection은 close된다

keep-alive를 이용한 통신은 위의 설정에 따라 클라이언트나 서버 중 한쪽이 다음 헤더를 부여해 접속을 끊거나 타임아웃될 때까지 연결이 유지된다. 그래서 만일 필요한 자원을 모두 할당받고 더이상 keep-alive 연결을 유지할 필요가 없을 경우 요청 헤더에서 Connection 속성을 close로 설정해 서버로 보내게 되면, TCP 지속 연결을 끊게 된다.

![keep-alive](https://blog.kakaocdn.net/dn/c9FCJ5/btrRlIOTd2i/BYRSblOoT5cohYsamdCCW0/img.png)

#### ****keep-alive 메세지 통신****

다음은 두개의 요청에 대한 HTTP 메세지 예시이다.

먼저 HTML 페이지에 대한 요청을 하고 그다음 아이콘 이미지에 대한 요청을 한다. 이 2가지 요청은 모두 한 개의 keep-alive 연결을 통해 전달된다.

**1. HTML 파일 요청 (인코딩, charset과 쿠키 메타데이터와 함께)**

![keep-alive](https://blog.kakaocdn.net/dn/cWJ1wO/btrRmTITTgR/LZE6PNIkfm7VwSV7zdaecK/img.png)

**2. HTML 요청에 대한 응답**

![keep-alive](https://blog.kakaocdn.net/dn/euBMnb/btrRibqIAzr/kGtKdpCBpQfweg72eK5eGk/img.png)

**3. 동일한 TCP 연결에 발생한 icon 파일 요청 (icon 파일을 받고나면 서버에게 해당 연결이 재사용되지 않을 것임을 알리기 위에 Connection 헤더값을 close로 설정)**

![keep-alive](https://blog.kakaocdn.net/dn/bl0yhv/btrRjyyHmrJ/cEaFE3mCIBsjFcIOt73U10/img.png)

**4. icon 응답과 연결 종료**

![keep-alive](https://blog.kakaocdn.net/dn/dR376W/btrRnDlJ9kv/VwpdM4OFvAWJv7qA8IeMLK/img.png)

* * *

### **Pipelining**

파이프 라이닝은 여러개의 요청을 보낼때 처음 요청이 응답될 때까지 기다리지 않고 바로 **요청을 한꺼번에 보내는 것**을 의미한다. 즉, 여러개의 요청을 한꺼번에 보내서 응답을 받음으로서 대기시간을 줄이는 기술이다.

*   keep-alive를 전제로 하며, 서버 간 요청의 응답속도를 개선시키기 위해 적용
*   서버는 요청이 들어온 순서대로(FIFO) 응답을 반환한다.
*   하지만 응답 순서를 지키기 위해 응답 처리를 미루기 때문에 Head Of Line Blocking 문제가 발생하여, 그래서 모던 브라우저들은 대부분 파이프라이닝을 사용하지 못하도록 막아 놓았다.
*   HTTP 2에서는 멀티플렉싱 알고리즘으로 대체되었다.

![Pipelining](https://blog.kakaocdn.net/dn/bXzv41/btrRnESShns/4Lbp6LFv1zawLubY8JgMck/img.png)

* * *

### **Domain Sharding**

파이프라이닝을 대체하기 위한 차선책으로 나온 기술이며, 브라우저들은 하나의 도메인에 대해 여러 개의 Connection을 생성해서 병렬로 요청을 보내고 받는 방식으로 성능을 개선했다.

**한 도메인당 6~13개의 TCP 연결들을 동시 생성해 여러 리소스를 한 번에 다운로드** 하는 것이다. 이를 **Domain Sharding**이라고 부른다. 

![Domain Sharding](https://blog.kakaocdn.net/dn/bZVNjW/btrRnpO6a03/tQx8qsoxYNj3LOhDCGdrrk/img.png)

하지만 도메인의 주소를 찾기 위해 DNS Lookup 과정에서 시간을 잡아먹을수도 있으며, 브라우저별로 Domain당 Connection 개수의 제한이 존재하여 근본적인 해결책은 아니었다.

![Domain Sharding](https://blog.kakaocdn.net/dn/bz9xoC/btrRkcpy1v2/oEinjb5NKlOLSJKUUKZGpK/img.png)

* * *

**HTTP/1.1 문제점**
----------------

### **HOLB (Head Of Line Blocking)**

![Head Of Line Blocking](https://blog.kakaocdn.net/dn/Xq0Jh/btrRop1HHKR/0pGKxlJZKyqUzyoZpza9x1/img.png)

위에서 소개한 파이프 라이닝은 어찌보면 정말 혁신적인 기술이지만, 보낸 요청 순서대로 응답을 받아야하는 규칙 부분에서 문제가 생기게 된다.

마치 FIFO(선입선출) 처럼 생각하면 되는데, 문제는 요청하는 데이터의 크기는 제각각 이기 때문에, 첫번째로 요청한 데이터가 용량이 큰 데이터라면, 두번째, 세번째 데이터가 아무리 빨리 처리되어도 우선순위 원칙에 따라 첫번째 데이터의 응답 속도가 늦어지면 후 순위에 있는 데이터 응답속도도 덩달아 늦어지게 되는 것이다.

이해가 잘 되지 않는다면 아래 그림을 살펴보자.

첫번째 **http request**에서는 하나의 요청당 응답을 받아야 다음 요청을 보내는 오래된 방법으로 time 길이를 보면 오래 걸려 길다. 그래서 **pipelining**을 통해 동시 요청을 통해 time을 감소 시켰지만, 문제는 첫번째 요청에 대한 응답이 오래걸릴 경우 그 뒤의 응답도 같이 늦게 되서 결과적으로 **총 time이 길어지게 되는** 비효율적인 상황이 발생하게 되는 것이다.

![Head Of Line Blocking](https://blog.kakaocdn.net/dn/RTQw5/btrRnLRUBtu/YTsC8xfFRmQNmjD0QJwFR1/img.png)

따라서 위의 문제점과 더불어 구현 복잡성에 의해 파이프 라이닝은 활용이 매우 제한적이었으며, 대부분의 브라우저에서는 여러개의 tcp 연결을 만들어 병렬적으로 이용하는 방식을 많이 사용하였지만 이 역시 추가 메모리와 리소스를 낭비하는 단점이 있었다.

* * *

### **RTT (Round Trip Time)**

RTT(Round Trip Time)란, 요청(SYN)을 보낼 때부터 요청에 대한 응답(SYN+ACK)을 받을 때까지의 왕복 시간을 의미한다.

즉, 아무리 keep-alive 라고 하지만 결국 TCP상에서 동작하는 HTTP의 특성상 Handshake 가 반복적으로 일어나게 되어 불필요한 RTT증가로 인해 네트워크 지연을 초래하여 성능이 저하되게 된다.

예전에는 컨텐츠가 지금처럼 많지 않았기에 큰 부담은 아니었지만, 점점 컨텐츠가 증가하면서 이러한 레이턴시도 부담스러워 졌다.

![RTT](https://blog.kakaocdn.net/dn/dafhWk/btrRlsThGUo/k3gwUReUWF27rDxFV8fS31/img.png)

* * *

### **무거운 헤더 구조와 중복**

http/1.1의 헤더에는 많은 메타정보들이 저장되어져 있다. 또한 해당 도메인에 설정된 cookie정보도 매 요청시 마다 헤더에 포함되어 전송되기 때문에 오히려 **전송하려는 값보다 헤더 값이 더 큰 경우**가 비일비재 하였다.

그리고 지속 커넥션 속에서 주고 받는 연속된 요청 데이터가 **중복된 헤더값**를 가지고 있는 경우가 많아 쓸데없는 메모리 자원도 낭비하게 되는 꼴이 되었다.

![header-http](https://blog.kakaocdn.net/dn/cqdLVC/btrRo2TdCof/0TF5j9qzcofZwkUyJF4AR0/img.png)

* * *

**HTTP 1.1을 개선한 HTTP 2.0**
--------------------------

HTTP 2.0은 기존 HTTP 1.1 버전의 성능 향상에 초점을 맞춘 프로토콜이다.

기존의 HTTP 1.1의 내부적인 통신 구조를 다른 개념으로 송두리째 바꿔버렸는데, 웹 응답 속도가 HTTP/1/1에 비해 15~50% 향상 되었다.

아래 그림을 보면 고용량 이미지에 대해서 응답속도 비교를 한눈에 볼 수 있다.

![HTTP/2](https://blog.kakaocdn.net/dn/tp5hH/btrRjq01cpU/rH3cTGP5M05tAf41ltcqcK/img.gif)

# 🌐 HTTP 2.0 소개 & 통신 기술 알아보기
![http-protocol-history](https://blog.kakaocdn.net/dn/exybYN/btrRAEMQ1SZ/BLYmr3eR29wTEUpjz50fk0/img.webp)

HTTP 2.0은 기존 HTTP 1.1 버전의 성능 향상에 초점을 맞춘 프로토콜이다. 인터넷 프로토콜 표준의 대체가 아닌 확장으로써, HTTP 1.1의 성능 저하 부분과 비효율적인 것들을 개선되어 탄생한 것이 HTTP 2.0라고 생각하면 된다. 

HTTP 1.1까지는 한번에 하나의 파일만 전송이 가능했다. 비록 파이프라이닝 기술이 있었지만, 여러 파일을 전송할 경우 선행하는 파일의 전송이 늦어지면 HOLB(Head Of Line Blocking)이 발생하였다.

따라서 HTTP 2.0에서는 이 문제를 해결하기 위해 **여러 파일을 한번에 병렬로 전송**한다.

![http-protocol-history](https://blog.kakaocdn.net/dn/db51yE/btrSqYJi9oq/S3qO3t0gaqkFPoW41GqKc0/img.png)

그래서 일반적으로 HTTP/2를 사용만해도 웹 응답 속도가 HTTP/1/1에 비해 15~50% 향상 된다고 한다.

아래는 동일 이미지를 웹사이트에 로딩시켜 HTTP/1.1과 HTTP/2의 속도를 비교한 결과이다.

![http-2.0](https://blog.kakaocdn.net/dn/INLpO/btrRtx0atsO/lyUcE3Rv1fXBdovodgHQP1/img.gif)

이러한 혁신적인 속도에 대부분의 사이트들은 HTTP 2를 지원한다.

크롬 개발자 도구 네트워크 탭에서 우측 클릭하고 Protocol 탭을 활성화 시키면 각 요청에 대한 프로토콜을 볼 수 있다.

![http-protocol-history](https://blog.kakaocdn.net/dn/xw5ov/btrRmwmmZYt/uJBxMv7IrUm2OVHMdV7dM1/img.png)

![http-protocol-history](https://blog.kakaocdn.net/dn/dnua8U/btrRfOoyMzy/FBKdh8CgfBD4MxQnwN5oFK/img.png)

h2 가 http/2.0 약자라고 보면 된다

* * *

**SPDY 프로토콜**
-------------

사실 HTTP/2.0의 원조는 구글이 만든 새로운 프로토콜인 2009년 중반에 발표된 **SPDY(스피디)** 이다.

HTTP/1.1의 메시지 포맷은 구현의 단순성과 접근성에 주안점을 두고 최적화 된 프로토콜이다 보니 성능은 어느 정도 희생시키지 않을 수 없었다. 때문에 더 효율적이고 빠른 HTTP가 필요했고, 이러한 요구에 만들어진 것이 구글의 SPDY 프로토콜이다. 

SPDY는 HTTP를 대체하는 프로토콜이 아니고 HTTP를 통한 전송을 재 정의하는 형태로 구현 되었다. 그래서 전송 계층의 구현만 변경하면 기존 HTTP 서버 프로그램을 그대로 SPDY에서 사용할 수 있었다.

![SPDY](https://blog.kakaocdn.net/dn/GfBZh/btrRmT2CnsQ/tIyrBAkIc9VpssiSi6o0w0/img.png)

혁신적인 성능 향상에 힘입어 SPDY를 사용하는 사이트가 늘어나게 되었고, 이러한 상황을 주시하고 있던 HTTP-WG(HTTP working group)는 HTTP/2 표준을 선보이려는 노력을 했고 이 프로토콜의 초안을 SPDY 프로토콜을 채택하였다.

이렇게 2012년부터 2015년까지 3년간의 노력으로 **HTTP/2 표준**이 발행되게 되었다. 그리고 몇년간 함께 발전해온 SPDY는 지원을 중단하며, HTTP2가 널리 채택된다는 말을 남기고 사라지게 되었다.

![SPDY](https://blog.kakaocdn.net/dn/MYfnI/btrSsogkco4/d7WwakzsUgCZkkTOcXuQQ1/img.jpg)

* * *

**HTTP 2.0 개선점**
----------------

### **Binay Framing Layer**

HTTP 1.1과 HTTP 2.0의 주요한 차이점은 HTTP 메세지가 1.1에서는 text로 전송되었던 것과 달리, 2.0에서는 binary frame로 인코딩되어 전송된다는 점이다.

> 기존 text 방식으로 HTTP 메세지를 보내는 방식은, 본문은 압축이 되지만 헤더는 압축이 되지 않으며 헤더 중복값이 있다는 문제 때문에 HTTP 2.0에서는 바이너리로 변경 되었다.

또한 HTTP 헤더에 대해서 배웠을때 헤더와 바디를 \\r 이나 \\n 과 같은 개행 문자로 구분한다고 하였는데, HTTP/2.0에서 부터는 헤더와 바디가 **layer**로 구분된다.

이로인해 데이터 파싱 및 전송 속도가 증가하였고 오류 발생 가능성이 줄어들었다.

![http-2.0](https://blog.kakaocdn.net/dn/boEdAR/btrRicXfhXt/7eWm0PKjVImhikx6jkyifk/img.png)

#### **Stream 과 Frame 단위**

HTTP/1.1에서는 HTTP 요청와 응답은 통짜 텍스트 Message 단위로 구성되어 있었다.

HTTP/2 로 오면서 Message라는 단위 외에 Frame, Stream이라는 단위가 추가되었다.

*   **Frame** : HTTP/2에서 통신의 최소 단위이며, Header 혹은 Data 가 들어있다. 
*   **Message** : HTTP/1.1과 마찬가지로 요청 혹은 응답의 단위이며 다수의 Frame으로 이루어진 배열 라인
*   **Stream** : 연결된 Connection 내에서 양방향으로 Message를 주고 받는 하나의 흐름

즉, HTTP/2 는 HTTP 요청을 여러개의 Frame들로 나누고, 이 frame들이 모여 요청/응답 Message가 되고, 그리고 Message는 특정 Stream에 속하게 되고, 여러개의 Stream은 하나의 Connection에 속하게 되는 구조이다.

![http-2.0](https://blog.kakaocdn.net/dn/d0Rj8e/btrRltdNC9n/P6d7qkYzZSgbn3kRd5B4Dk/img.png)

frame - message - stream - connection

이 처럼 **프레임** 단위로 이루어진 요청과 응답 **메세지**는 하나의 **스트림**을 통해 이루어지며, 이러한 스트림들이 하나의 **커넥션** 내에서 병렬적로 처리된다. 하나의 커넥션에서 여러개의 스트림이 동시에 열리니 속도가 빠를수밖에 없다.

> 좀더 Stream 통신 방식에 대해 깊이 파보자면, 모든 스트림은 31비트의 무부호 정수로 된 고유한 식별자를 갖는데, 스트림이 클라이언트에 의해 초기화되었다면 이 식별자는 반드시 홀수여야 하며 서버라면 짝수를 갖는 식으로 요청 스트림인지 응답 스트림인지 구분을 둔다.  
> 새로 만들어지는 스트림의 식별자는 이전에 만들어졌거나 예약된 스트림들의 식별자보다 커야 한다. 한번 사용한 스트림 식별자는 다시 사용할 수 없다.  
> 하나의 커넥션에서 오래 스트림을 사용하다보면 스트림에 할당될 수 있는 식별자가 고갈되기도 하는데, 그런 경우 커넥션을 다시 맺는 식으로 처리한다.

* * *

### **Multiplexing**

![Multiplexing](https://blog.kakaocdn.net/dn/dIbRiK/btrRpXx8YKa/PZJEeEpq9joyI6pOkiNGz1/img.png)

바로 위에서 frame - message - stream - connection 그림에서 봤듯이, HTTP 헤더 메세지를 바이너리 형태의 프레임으로 나누고 하나의 커넥션으로 동시에 여러개의 메세지 스트림을 응답 순서에 상관없이 주고 받는 것을 **멀티플렉싱(multiplexing)**이라고 한다.

*   HTTP/1.1의 Connection Keep-Alive, Pipelining, Head Of Line Blocking을 개선했다.
*   latency만 줄여주는게 아니라 결국 네트워크를 효율적으로 사용할 수 있게 하고 그 결과 네트워크 비용을 줄여준다.
*   특히 클라우드 시스템을 이용한다면 비용과 직결된다.

#### **HTTP 1.1 통신 과정**

**HTTP 1.1**에서는 한 TCP 커넥션을 통해 요청을 보냈을 때, 그에 대한 응답이 도착하고 나서야 같은 TCP 커넥션으로 다시 요청을 보낼 수 있다. 따라서 웹브라우저들은 회전 지연을 줄이기 위해 여러 개의 TCP 커넥션을 만들어 동시에 여러 개의 요청을 보내는 방법을 사용하였다. 그러나 그렇다고 TCP 커넥션을 무한정 만들 수는 없기에, 한 페이지에 보내야 할 요청이 수십개에서 수백개에 달하는 요즘 시대에는 한계가 있었다.

![Multiplexing](https://blog.kakaocdn.net/dn/said3/btrRnOIdnoJ/v7PfJwYFICniIiOA6LdjFk/img.gif)

1.  Request 1을 전송 받기 위해 하나의 TCP Connection 1 을 열고 요청/응답한다.
2.  다음으로 Request 2, 3, 4을 요청하는데 빠르게 전송받기 위해 여러개의 커넥션 TCP Connection 2 와 TCP Connection 3을 만들어 요청/응답한다.
3.  하지만 커넥션을 무한정으로 만들수없어 이러한 방식은 한계가 존재한다.

#### **HTTP 2.0 통신 과정**

반면, **HTTP 2**에서는 하나의 커넥션에 여러 개의 스트림이 동시에 요청/응답 한다.

HTTP 1.1은 요청과 응답이 메시지라는 단위로 구분되어 있었지만, HTTP 2부터는 Stream을 통해 요청과 응답이 묶일 수 있어 다수 개의 요청을 병렬적으로 처리가 가능해졌다. 따라서 응답 프레임들은 요청 순서에 상관없이 먼저 완료된 순서대로 클라이언트에 전달이 가능하다.

![Multiplexing](https://blog.kakaocdn.net/dn/b7nEZv/btrRo3kn075/YfKfNG45pJl7k9DwXlBrKK/img.gif)

1.  Request 1을 전송 받기 위해, 우선 Framing Layer을 통해 바이너리 프레임 단위로 쪼개고 하나의 TCP Connection을 만들고 통신한다.
2.  다음으로 Request 2, 3, 4을 요청하는데 기존의 커넥션을 이용하며, 쪼개진 프레임들은 메세지 통로를 통해 동시다발적으로 요청/응답 받는다.
3.  커넥션 낭비도 없고 병렬적으로 자원이 전송받기에 매우 빠르다.

* * *

### **Server Push** 

![PUSH_PROMISE](https://blog.kakaocdn.net/dn/FBW9o/btrRjykWwrG/s4lBAaS7iQHtD4xOCSlGpK/img.png)

HTTP 2.0에서는 클라이언트의 요청에 대해 미래에 필요할것 같은 **리소스를 똑똑하게 미리 보낼 수 있다.** 

예를 들어 클라이언트로부터 HTML 문서를 요청하는 하나의 HTTP 메세지를 받은 서버는 그 HTML 문서가 링크하여 사용하고 있는 이미지, CSS 파일, JS 파일 등의 리소스를 스스로 파악하여 클라이언트에게 미리 push해�� 미리 브라우저의 캐시에 가져다 놓는다.

즉, 서버는 요청하지도 않은 리소스를 미리 보내어 가까운 미래에 특정 개체가 필요할때 바로 사용 되도록 성능 향상을 이끌어 내는 것이다. 그래서 클라이언트가 HTML 문서를 파싱해서 필요한 리소스를 다시 요청하여 발생하게 되는 트래픽과 회전 지연을 줄여준다는 장점이 있다.

#### **HTTP 2.0 + Push 통신 과정**

![PUSH_PROMISE](https://blog.kakaocdn.net/dn/cmio9u/btrRnElzChU/3y5zSZgQm9xrgkCrnopsd1/img.gif)

1.  서버가 클라이언트로부터 Request 1을 전송 받으면, index.html 에 있는 자원들을 파싱한다.
2.  클라이언트가 따로 요청하지 않아도, 서버가 알아서 미리 자원들을 클라이언트에 보낸다.
3.  따라서 총 로드 시간이 줄어드는 이점이 있다.

* * *

### **Stream Prioritization**

HTTP 1.1에서 파이프라이닝 이라는 혁신적인 기술이 있었지만, 우선 순위 문제 때문에 HOLB(Head Of Line Blocking)가 발생하여 사장되었다고 [HTTP 1.1 글](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-HTTP-09-HTTP-30-%EA%B9%8C%EC%A7%80-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-%ED%86%B5%EC%8B%A0-%EA%B8%B0%EC%88%A0)에서 소개했었다.

HTTP 2에서는 **리소스간 의존관계(우선순위)를 설정**하여 이런 문제를 해결하였다.

위에서 봤던 것 처럼 HTTP 메세지가 개별 바이너리 프레임으로 분할되고, 여러 프레임을 멀티플렉싱 할 수 있게 되면서 요청과 응답이 동시에 이루어져 비약적인 속도 향상이 되었다.

하지만 하나의 연결에 여러 요청과 응답이 뒤섞여 버려 패킷 순서가 엉망 징창이 되었다. 따라서 스트림들의 우선순위를 지정할 필요가 생겼는데, 클라이언트는 **우선순위 지정 트리**를 사용하여 스트림에 식별자를 설정함으로써 해결 하였다.

*   각각의 스트림은 1-256 까지의 가중치를 갖음
*   하나의 스트림은 다른 스트림에게 명확한 의존성을 갖음

![Stream Prioritization](https://blog.kakaocdn.net/dn/bovfzI/btrRoqmKpkC/0AuGPTjUW6ZKM2ruwnojPk/img.png)

우선순위 지정 트리

#### **스트림 우선순위 통신 과정**

![Stream Prioritization](https://blog.kakaocdn.net/dn/wtkcr/btrSmYRnoQc/mSbVkISwaBuw9ZKlKB2vm0/img.png)

1.  클라이언트는 서버에게 스트림을 보낼때, 각 요청 자원에 가중치 우선순위를 지정하고 보낸다.
2.  그렇게 요청 받은 서버는 우선순위가 높은 응답이 클라이언트에 우선적으로 전달될 수 있도록 대역폭을 설정한다.
3.  응답 받은 각 프레임에는 이것이 어떤 스트림인지에 대한 고유한 식별자가 있어, 클라이언트는 여러개의 스트림을 interleaving을 통해 서로 끼워놓는 식으로 조립한다.

> 최신 브라우저들은 자원의 종류, 페이지가 로드된 위치 그리고 이전 페이지 방문에서 학습한 결과에 따라 자원 요청의 우선순위를 결정하기도 한다.

* * *

### **HTTP Header Data Compression**

HTTP 1.1 에서 헤더는 아무런 압축 없이 그대로 전송되었다. 이를 개선하기 위해 HTTP 2.0에서는 **HTTP 메시지의 헤더를 압축하여 전송**한다.

또한 HTTP 1.1 에서는 연속적으로 요청되는 HTTP 메세지들에게서 헤더값이 중복되는 부분이 많아 역시 메모리가 낭비되었는데, HTTP 2.0 에서는 이전 Message의 **헤더의 내용 중 중복되는 필드를 재전송하지 않도록**하여 데이터를 절약할 수 있게 되었다. 

![HTTP Header Data Compression](https://blog.kakaocdn.net/dn/bE78mB/btrRpXYAvZP/i7kSUhkzka85xi2EQeq9n0/img.png)

만일 메세지 헤더에 중복값이 존재하는 경우, 위의 그림에서 Static / Dynamic Header Table 개념을 사용하여 중복 헤더를 검출하고, 중복된 헤더는 index값만 전송하고 중복되지 않은 Header 정보의 값은 호프만 인코딩(Huffman Encoding) 기법을 사용하는 **HPACK 압축 방식**으로 인코딩 처리 하여 전송하여, 데이터 전송 효율을 높였다고 보면 된다.

* * *

**HTTP 2.0 문제점**
----------------

### **여전한 RTT (Round Trip Time)**

아무리 혁신적으로 개선되었다 하더라도, HTTP 1.1 이나 HTTP 2는 여전히 [TCP](https://inpa.tistory.com/entry/NW-%F0%9F%8C%90-%EC%95%84%EC%A7%81%EB%8F%84-%EB%AA%A8%ED%98%B8%ED%95%9C-TCP-UDP-%EA%B0%9C%EB%85%90-%E2%9D%93-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EC%9E%90)를 이용하기 때문에 Handshake의 RTT(Round Trip Time)로인한 지연 시간(Latency)이 발생한다. 결국 원초적으로 TCP로 통신하는게 문제인 것이다.

### **TCP 자체의 HOLB (Head Of Line Blocking)**

분명 HTTP 2에서 HTTP 1.1의 파이프라이닝 HOLB 문제를 멀티플렉싱(Multiplexing)을 통해 해결했다고 하였다.

하지만 기본적으로 TCP는 패킷이 유실되거나 오류가 있을때 재전송하는데, 이 재전송 과정에서 패킷의 지연이 발생하면 결국 HOLB 문제가 발생된다. [TCP/IP 4 계층](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-TCP-IP-%EC%A0%95%EB%A6%AC-%F0%9F%91%AB%F0%9F%8F%BD-TCP-IP-4%EA%B3%84%EC%B8%B5)을 보면, 애플리케이션 계층(L4)에서 HTTP HOLB를 해결하였다 하더라도, 전송 계층(L3)에서의 TCP HOLB 를 해결한건 아니기 때문이다.

![HOLB](https://blog.kakaocdn.net/dn/bqeDAB/btrRqE6yXa1/U76HoLMtCIBFKr5qyzXGJ1/img.png)

### **중개자 캡슐화 공격**

위에서 배웠듯이 HTTP 2.0은 헤더 필드의 이름과 값을 바이너리로 인코딩한다. 이를 다르게 말하면 HTTP 2.0 이 헤더 필드로 어떤 문자열이든 사용할 수 있게 해준다는 뜻이다.

그래서 이를 악용하면 HTTP 2.0 메시지를 중간의 Proxy 서버가 HTTP 1.1 메시지로 변환할 때 메시지를 불법 위조할수 있다는 위험성이 있다. 다행히 거꾸로 HTTP/1.1 메시지를 HTTP/2.0 메시지로 번역하는 과정에서는 이런 문제가 발생하지 않는다.

### **길다란 커넥션 유지로 인한 개인정보 누출 우려**

HTTP 2.0은 기본적으로 성능을 위해 클라이언트와 서버 사이의 커넥션을 오래 유지하는 것을 염두에 두고 있다.

하지만 이것은 개인 정보의 유출에 악용될 가능성이 있다. 이는 HTTP/1.1에서의 Keep-Alive도 가지고 있는 문제이기도 하다.

* * *

**HTTP 2.0을 개선한 HTTP 3.0**
--------------------------

위의 HTTP 2.0의 문제점을 한마디로 요약하자면 **TCP가 문제**이다. (HTTP는 TCP 기반 위에서 동작된다)

최근에 나온 HTTP 3.0 버전은 TCP를 버리고 UDP를 채택하였다. 정확히 말하면 UDP를 개조한 QUIC 라는 프로토콜을 새로 만들었다.

기존 TCP는 클라이언트와 서버 간에 세션을 설정하기 위해 핸드쉐이크가 필요하며, 인증서인 TLS도 세션이 보호되도록 자체 핸드셰이크도 필요하다. 하지만 QUIC는 보안 세션을 설정하기 위해 한 번의 핸드셰이크만 필요하다. 아래 그림만 봐도 한번 통신하는데 드는 시간 세로축 차이가 어마어마하게 난다는 것을 볼 수 있다.

HTTP 3.0에 대한 자세한 스펙을 보려면 아래 포스팅을 참고하길 바란다.

![http-3.0](https://blog.kakaocdn.net/dn/RuPan/btrSq9DX0FB/Ij4U28LlrqhD76QlAir6HK/img.jpg)

# 🌐 HTTP 3.0 소개 & 통신 기술 알아보기
![http-protocol-history](https://blog.kakaocdn.net/dn/Qwkjv/btrRBadGxGx/zWVdKjMw8kb5YzceLG7Kwk/img.webp)

[HTTP 2.0](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-HTTP-20-%ED%86%B5%EC%8B%A0-%EA%B8%B0%EC%88%A0-%EC%9D%B4%EC%A0%9C%EB%8A%94-%ED%99%95%EC%8B%A4%ED%9E%88-%EC%9D%B4%ED%95%B4%ED%95%98%EC%9E%90) 의 등장과 함께 기존의 프로토콜 데이터 체계를 프레임과 스트림 개념으로 재구축한 결과 기존 보다 혁신적으로 성능이 향상되게 되었다. 하지만 여전히 HTTP는 TCP 기반 위에서 동작되기 때문에, TCP 자체의 **핸드쉐이크 과정에서 발생하는 지연 시간**과, 기본적으로 TCP는 패킷이 유실되거나 오류가 있을때 재전송을하는데 이 재전송하는 패킷에 지연이 발생하면 결국 **HOLB(Head Of Line Blocking) 문제**가 발생되었다.

즉, HTTP 2.0은 TCP/IP 4 계층의 애플리케이션 계층(L4)에서 HTTP의 HOLB를 해결하였지만, 전송 계층(L3)에서의 TCP HOLB 를 해결한건 아니기 때문이다.

애초에 **TCP로 인터넷 통신을 하는 것**이 발목을 잡은 것이다.

점점 기술이 발전하고 다채로운 휴대 통신 기기가 널리 보급되면서 기업들은 다양한 컨텐츠를 여러 기기에 신속하게 전달하기 위해 TCP의 한계를 극복하고 최적화하는 것이 급선무의 과제였다.

그러자 IT 기업의 선두주자인 구글은 SPDY 프로토콜에 이어 새로운 UDP 기반인 **QUIC 프로토콜**을 고안하게 된다. 그리고 이 새로운 QUIC 프로토콜이 TCP/IP 4계층에도 동작시키기 위해 설계된 것이 바로 **HTTP 3.0** 이다.

즉, **HTTP/1.1과 HTTP/2는 TCP**를 전송에 사용하지만, **HTTP/3은 UDP(QUIC)**를 사용한다고 보면 된다.

![http-3.0](https://blog.kakaocdn.net/dn/2sOW4/btrRlsy0Fi0/6tcqW5INT1JuxKWNDRFWYk/img.gif)

HTTP 3.0은 HTTP 2.0가 가지는 장점들을 모두 가지면서 TCP가 가지는 원초적인 단점을 보완하는데 중점으로 개발되었다. 그래서 지금까지 거론되었던 HTTP/2 의 문제를 거의 해결하였다고 보면 된다. RTT(Round Trip Time)를 제로 수준으로 줄였고, 패킷 손실에 대한 빠른 대응, 사용자 IP가 바뀌어도 연결이 유지되는 것이 특징이다.

통신 인프라가 빈약한 나라에서는 큰 차이가 느껴질지도 모르겠지만, 사실 한국에서 HTTP/2를 사용하든 HTTP/3를 사용하든 워낙에 땅이 좁은데다 통신 인프라는 세계에서 끝내주게 잘되어 있기 때문에 소비자들은 체감을 못 할 것이다.

그렇지만 2022년 11월 15일 한국 최초로 네이버가 HTTP/3을 도입하였다고 한다. (당연히 구글은 이미 도입했다)

![http-3.0](https://blog.kakaocdn.net/dn/dg9FUl/btrRsI13m0p/vOEEbMKEenKEjhst0RCMak/img.png)

https://n.news.naver.com/mnews/article/022/0003754517?sid=101

개발자 도구의 네트워크 탭에서 표 항목에 Protocol을 활성화하면 각 요청에 대한 프로토콜을 볼 수 가 있다.

사진상에서 h3이라고 쓰여져 있는 것이 http 3.0 이며 http 2.0 과 간혹 http 1.1 도 보인다.

![http-3.0](https://blog.kakaocdn.net/dn/bvbq4K/btrRssrXB7m/DuPVHKJHB7DlSJnN781xz0/img.png)

개발자 도구 네트워크 탭에서 우측 클릭하고 Protocol 탭을 활성화 시킨다

![http-3.0](https://blog.kakaocdn.net/dn/bFddjJ/btrRvITXY0n/RqHYQXoJQQ3ztAFc5n4F6k/img.png)

![http-3.0](https://blog.kakaocdn.net/dn/bnUPBl/btrRtVGv8Mr/oGPqxxRAaz6kRWENinuWvk/img.png)

* * *

**QUIC 프로토콜**
-------------

![QUIC 프로토콜](https://blog.kakaocdn.net/dn/40s7g/btrSq71LD3m/5HHEawdJ98R6pBfFNUFrY0/img.png)

HTTP/3의 가장 큰 특징은 기존의 HTTP/1, HTTP/2와는 다르게 **UDP** 기반의 프로토콜인 **QUIC(Quick UDP Internet Connections)**을 사용하여 통신하는 프로토콜이라는 점이다. 'Quick UDP Internet Connections' 라는 이름에서 알수 있듯이 말 그대로 **UDP를 사용하여 빠르게 인터넷 연결**을 하는 **새로운 프로토콜**이다. (참고로 '퀵' 이라고 읽는다)

HTTP/2의 기반이 되는 SPDY는 사장되었지만, HTTP/3의 기반이 되는 QUIC는 RFC 9000으로 표준화되어 있다는 점도 다르다.

* * *

### **QUIC의 계층 위치**

![QUIC-udp](https://blog.kakaocdn.net/dn/cEgsW1/btrSxl4NzIv/MmHiW98lUcmDi8QR1ioK11/img.png)

위의 [TCP/IP 4 Layer](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-TCP-IP-%EC%A0%95%EB%A6%AC-%F0%9F%91%AB%F0%9F%8F%BD-TCP-IP-4%EA%B3%84%EC%B8%B5)에서 볼 수 있듯이 HTTP/3은 계층 형태는 약간 특이하다.

왜냐하면 QUIC은 TCP + TSL + HTTP의 기능을 모두 구현한 프로토콜이기 때문이다. TCP의 프로토콜의 무결성 보장 알고리즘과 SSL이 이식됨으로써 높은 성능과 동시에 신뢰성을 충족시켰다고 보면 된다. 그래서 계층 위치도 약간 비스듬하게 걸쳐 있게 표현된 것이다. 

쉽게 말하자면, Application 계층의 HTTP/3은 QUIC를 동작시키기 위해 있는 것이라고 보면 되고, 위에서 배웠다시피 QUIC는 UDP 기반으로 만들어졌기에 Transport 계층의 UDP 위에서 동작한다고 보면된다.

* * *

### **어째서 TCP가 아닌 UDP인가 ���**

#### **💬 TCP는 구조상 한계로 개선해도 여전히 느리다**

사실 TCP는 인류가 지금과 같이 엄청난 속도로 발전할 것이라곤 상상 할 수 없는 시기에 만들어졌다. TCP가 만들어지던 시절에 클라이언트와 서버가 동시 다발적으로 여러 개 파일의 데이터 패킷을 교환할 것이라고 상상하지 못했기 때문이다.

그래서 모바일 기기와 같이 **네트워크 환경을 바꾸어가면서 서버와 클라이언트가 소통**할 수 있을 것이라고 생각하지 못했다. 그 때문에 와이파이를 바꾸면 다시 새로운 커넥션을 맺어야 되서 끊김 현상이 일어나는 것이다.

또한 TCP를 사용한 통신에선 패킷은 신뢰성을 위해 무조건 순서대로 처리되어야 한다. 또한 패킷이 처리되는 순서 또한 정해져있으므로 이전에 받은 패킷을 파싱하기 전까지는 다음 패킷을 처리할 수도 없다. 만일 중간에 패킷이 손실되어 수신 측이 패킷을 제대로 받지 못했으면 다시 보내야 한다.

이렇게 패킷이 중간에 유실되거나 수신 측의 패킷 파싱 속도가 느리다면 통신에 병목이 발생하게 되는데, 이러한 현상을**HOLB(Head of line Blocking)**라고 부른다.

이 HOLB는 TCP 설계도상 어쩔수 없이 발생하는 문제이기 때문에 [HTTP/1.1](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-HTTP-09-HTTP-30-%EA%B9%8C%EC%A7%80-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-%ED%86%B5%EC%8B%A0-%EA%B8%B0%EC%88%A0) 뿐만 아니라 [HTTP/2](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-HTTP-20-%ED%86%B5%EC%8B%A0-%EA%B8%B0%EC%88%A0-%EC%9D%B4%EC%A0%9C%EB%8A%94-%ED%99%95%EC%8B%A4%ED%9E%88-%EC%9D%B4%ED%95%B4%ED%95%98%EC%9E%90)도 가지고 있는 아주 고질적인 문제였다.

따라서 이런 고질적인 문제들을 해결하기 위해 HTTP/3는 TCP를 버리고 UDP를 선택하였다. 

#### **💬 UDP는 신뢰성이 없는게 아니라 탑재를 안했을 뿐이다**

처음 TCP와 UDP에 대해서 배웠을때, UDP는 하얀 도화지 같이 기능이 거의 없어서 빠르지만 대신에 신뢰성이 낮기 때문에, 인터넷 통신에선 조금 느리더라도 신뢰성이 높은 TCP를 사용한다라고 배웠을 것이다.


|         |TCP        |UDP          |
|---------|-----------|-------------|
|연결 방식    |연결 지향형 프로토콜|비 연결 지향형 프로토콜|
|전송 순서    |보장         |보장하지 않음      |
|신뢰성      |높음         |낮음           |
|전송속도(상대적)|느림         |빠름           |
|혼잡제어     |O          |X            |
|헤더 크기    |20바이트      |8 바이트        |


UDP는 User Datagram Protocol이라는 이름에서도 알 수 있듯이 **데이터그램 방식**을 사용하는 프로토콜이기 때문에 패킷의 목적지만 정해져있다면 중간 경로는 신경쓰지 않기 때문에 핸드쉐이크 과정이 필요없다.

![QUIC-udp](https://blog.kakaocdn.net/dn/bxhrmF/btrSrnwECWS/vQfp4v5lxaEoy1Dj9I786K/img.png)![QUIC-udp](https://blog.kakaocdn.net/dn/1f9uM/btrSwqyFAre/riaNtR2tKb5EniCE3LgxWk/img.png)

TCP(좌) - UDP(우)

결론으로는 UDP는 TCP가 신뢰성을 얻기 위해 내제된 과정을 거치지 않기 때문에 속도가 더 빠를 수 밖에 없다는 것인데, 그렇다면 UDP를 사용하게되면 빠르지만 신뢰성과 패킷의 무결성을 보증할 없다는 뜻인데 이것을 인터넷 통신에 사용해도 문제가 없는 걸까?

이부분은 오해인것이, UDP는 신뢰성이 없는게 아니라 탑재를 안했을 뿐이다.

UDP의 진짜 장점은 커스터마이징이 가능하다는 점이다.

즉, 아래 사진과 같이 UDP 자체는 헤더에 들은게 없어 신뢰성이 낮고 제어 기능도 없지만, 이후 개발자가 애플리케이션에서 구현을 어떻게 하냐에 따라서 TCP와 비슷한 수준의 기능을 가질 수도 있다는 말이다.

![QUIC-udp](https://blog.kakaocdn.net/dn/yDcIM/btrSvd00gbO/slq3TpvF9CaknqRRMqcgb0/img.png)

UDP 헤더 구성

#### **💬 아예 새로운 프로토콜은 안되는가?**

TCP가 문제이고 UDP도 애매하면 아예 다른 프로토콜을 만들거나 채용한다는 선택지도 있을 것이다. 이론적으로도 네트워크 스택에서 UDP와 TCP 옆에 새로운 전송 프로토콜을 만들 수 있다. 아니면 이미 있는 전송 프로토콜인 [SCTP](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%8A%B8%EB%A6%BC_%EC%A0%9C%EC%96%B4_%EC%A0%84%EC%86%A1_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)를 사용할 수도 있다. 

그러나 새 프로토콜 배포는 그렇게 녹록치만은 않은데, 사용자와 서버 사이에 있는 TCP와 UDP만 허용하는 방화벽, NAT, 라우터 등의 설정에 따라 차단 될 수 있기 때문이다. 이를 프로토콜 고착화(ossification)라고 부른다.

게다가 네트워크 스택의 전송 프로토콜 계층에서 뭔가를 바꾼다는 것은 새로운 운영체제 커널을 갱신하고 프로토콜을 구현해 배포하는 것은 상당한 노력이 필요한 과정이다. 그래서 이미 표준화된 수많은 TCP 개선사항도 광범위하게 지원되지 않아서 널리 배포되거나 사용되지 않고 있는 것이다.

* * *

**HTTP 3.0 개선점**
----------------

### **연결 시 레이턴시 감소**

기존 TLS+TCP에서는 TLS 연결을 위한 핸드쉐이크와 TCP를 위한 핸드쉐이크가 각각 발생했다.

그래서 TCP는 연결을 생성하기 위해 기본적으로 **1 RTT** 가 필요하고, 여기에 TLS를 이용한 암호화 통신까지 한다면 총 **3 RTT**가 필요하게 된다.

> **RTT (Round Trip Time)**  
> RTT(Round Trip Time)란, 요청(SYN)을 보낼 때부터 요청에 대한 응답(SYN+ACK)을 받을 때까지의 왕복 시간을 의미한다.  
> 
> ![QUIC-http3](https://blog.kakaocdn.net/dn/bl9JGZ/btrSxEDzD2p/Ji11PmfvNkBNRRaGB2qkk1/img.png)

QUIC에서는 이를 한단계로 줄였다.

UDP 위에서 동작하는 QUIC는 통신을 시작할 때 3 Way Handshake 과정을 거치지 않아도 되기 때문에 첫 연결 설정에 **1 RTT**만 소요된다.  그 이유는 연결 설정에 필요한 정보와 함께 데이터도 보내버리기 때문이다.

QUIC 내에 아예 TLS 인증서를 내포하고 있기 때문에, 최초의 연결 설정에서 필요한 인증 정보와 데이터를 함께 전송한다. 그래서 클라이언트가 서버에 어떤 신호를 한번 주고, 서버도 거기에 응답하기만 하면 바로 본 통신을 시작할 수 있다는 것이다

![QUIC-http3](https://blog.kakaocdn.net/dn/0hZxP/btrSvc9gxsU/51gJCaIiKlW6rFp0ZSk6zk/img.png)

최초 Connection 시

위의 그림에서 볼 수 있듯이 TCP+TLS는 서로 자신의 세션 키를 주고 받아 암호화된 연결을 성립하는 과정을 거치고 나서야 세션 키와 함께 데이터를 교환하기 때문에 핸드쉐이크 과정이 여러번 발생하게 된다.

하지만 QUIC은 서로의 세션 키를 교환하기도 전에 데이터를 교환할 수 있기 때문에 연결 설정이 더 빠르다. 다만, 최초의 요청을 보낼 때는 클라이언트는 서버의 세션 키를 모르는 상태이기 때문에, 목적지인 서버의 Connection ID를 사용하여 생성한 특별한 키인 초기화 키(Initial Key)를 사용하여 통신을 암호화 한다.

그리고 한번 연결에 성공했다면 서버는 그 설정을 캐싱해놓고 있다가, 다음 연결 때 캐시를 불러와 바로 연결을 하기 때문에 추가적인 핸드 쉐이크 없이 **0 RTT**만으로 바로 통신을 시작할 수도 있다는 장점도 있다. 

![QUIC-http3](https://blog.kakaocdn.net/dn/WfBA2/btrSxOZ9IyC/XOoAfG4m0Br4i0fGISbJiK/img.png)

재연결 Connection 시

* * *

### ****잔존하던 HOLB 현상을 해결****

#### **HTTP의 HOLB (Head Of Line Blocking)**

기존 HTTP/1.1 같은 경우 파이프라인(pipeline) 기술을 통해 병렬적으로 리소스를 빠르게 얻도록 하려고 하였지만, 만일 첫번째 요청에 딜레이가 생기면 나머지 요청이 빨리 처리됬음에도 불구하고 딜레이가 되는 심각한 현상이 있었다.

예를들어 3개의 이미지 a.png, b.png, c.png 를 받는다고 가정한다면 다음과 같이 첫번째 a.png 를 받는 과정에서 오래걸리게 된다면 b와 c 이미지가 아무리 빨리 처리되더라도 결과적으로 늦게 받게 되게 된다.

![QUIC-holb](https://blog.kakaocdn.net/dn/mONhZ/btrSwkeRXbH/FfLeRLkd4XUOLtwgH3xcB0/img.png)

그래서 이를 극복하기 위해 HTTP/2 에서는 리소스들을 하나의 커넥션에서 병렬적으로 보내도록 개선하였다. 따라서 a.png 가 시간이 걸리더라도 b 와 c 이미지는 먼저 받아서 보여줄 수 있었다.

![QUIC-holb](https://blog.kakaocdn.net/dn/vZOJ1/btrSxEDnZQR/9Ld0WQkEQezWLovlI9eBV0/img.png)

#### **TCP의 HOLB **(Head Of Line Blocking)****

이처럼 HTTP 레이어의 HOL Blocking 은 해결됬지만, 문제는 **TCP 레이어의** **HOL Blocking** **문제가 여전히 잔존해** 있었던 것이다.

HTTP/2를 사용하는 일반적인 브라우저는 TCP 연결 한개로 수십, 수백 개의 스트림 데이터를 병렬 전송을 한다. 그런데 만일 두 엔드포인트 사이 네트워크 어딘가에서 하나의 패킷이 빠지거나 없어진다면, 없어진 패킷을 다시 전송하고 목적지를 찾는 동안 전체 TCP 연결이 중단되게 된다. 

즉, HTTP/2에서 스트림에서 여러가지 프레임들이 뒤 섞여 이동되게 되는데, 만일 어느 하나의 프레임에 문제가 ���기면 상관없는 그 뒤의 프레임까지 영향이 가게 된다. 따라서 결국은 HTTP의 HOLB처럼 스트림 내 패킷들은 전체가 지연이 되게 된다.

![QUIC-holb](https://blog.kakaocdn.net/dn/bfdH9x/btrSwCTPsJP/sCxuf6MAL2aYF3LnMShqsk/img.png)

거기다가 HTTP/2는 1개의 TCP 커넥션으로 전부를 처리하고 있기 때문에 패킷 손실률이 증가하면 여러 개의 TCP를 사용하는 HTTP/1.1보다 성능 저하가 커질 수 있다.

#### **독립 스트림으로 HOLB 단축**

그래서 TCP를 버려버리고 새로 QUIC 프로토콜로 구축해서 아예 스트림 자체를 독립적으로 여러개로 나누어서 처리하도록 하였다. 이를 독립 스트림이라고 한다.

QUIC 연결을 통해 두 가지 다른 스트림을 설정했을 때, 이들을 독립적으로 다루므로 만약 특정 스트림에서 HOLB가 발생하더라도, 다른 스트림에는 영향을 미치지 않는다.

![QUIC-holb](https://blog.kakaocdn.net/dn/bjjqIW/btrSxlD5GUY/TYZBuMdWWTdwYCByKhfSB0/img.png)

* * *

### **패킷 손실 감지에 걸리는 시간 단축**

HOLB 해결에 이어 QUIC는 흐름 제어하는 시간까지 단축하였다.

QUIC도 TCP와 마찬가지로 전송하는 패킷에 대한 흐름 제어를 해야한다. QUIC는 기본적으로 TCP와 유사한 방법으로 패킷 손실을 탐지하지만 여기에 몇 가지 알고리즘 개선 사항을 추가하였다.

예를들어 HTTP 2.0에서는 아래 그림과 같이 하나의 스트림에 A, B, C 패킷 프레임들이 비순서대로 전달될때, 만일 세번째 프레임에서 패킷 손실이 일어나면, 패킷 B만 중지되어야 하지만 위에서 배운바와 같이 전혀 연관없는 패킷 A와 C도 모두 막혀 대기를 해야된다.

![QUIC-holb](https://blog.kakaocdn.net/dn/KdF9r/btrRvI0JD6r/BVphKbZUtXcWQtOl4udv0k/img.png)

이러한 문제를 해결하기 위해 QUIC는 헤더에 패킷의 전송 순서를 나타내는 별도의 패킷 번호 공간을 부여했다.

이를 이용해 QUIC는 패킷 번호를 파악해 개별 파일을 구분하여 중간에 패킷 로스가 발생해도 해당 파일의 스트림만 정지가 되도록 할 수 있다.

하나의 스트림에서 문제가 발생한다고 해도 다른 스트림은 지킬 수 있게 되어 이런 문제에서 자유로워 졌다.

![QUIC-holb](https://blog.kakaocdn.net/dn/bTDc9a/btrRth3qrzs/wRGZmXOKEaYl7ZvDPEC3vK/img.png)

* * *

### **더욱 향상된 멀티플렉싱**

HTTP/3도 당연히 HTTP/2와 같은 멀티플렉싱을 지원한다.

그리고 독립 스트림 방식으로 기존의 멀티플렉싱을 더욱 강화시켰다고 보면 된다.

![QUIC-http3](https://blog.kakaocdn.net/dn/dnU7iy/btrSvAbgT06/gKiGEnRuH61IN07Sv3LJA1/img.jpg)

* * *

### **보안을 더욱 강화**

HTTP/3와 그 기반 기술인 QUIC은 TLS 암호화를 기본적으로 사용한다.

물론 UDP와 TLS가 결합된 기술로는 **DTLS**라는 기술도 있지만 'TCP의 재구현'이 목표 중 하나인 QUIC와는 지향하는 바가 다르다.

이처럼 기본적으로 QUIC 내에 TLS 이 포함되어있기 때문에 TCP와 달리 **헤더 영역도 같이 암호화**된다.

![QUIC-http3](https://blog.kakaocdn.net/dn/ZXqGb/btrSwSO8Fk9/aPOd8Xax6Pg7efpd2RtGK1/img.png)

기존에 암호화되지 않던 영역까지 암호화에 포함해 보안성을 더 강화하였다.

* * *

### **네트워크가 변경 되도 연결이 유지**

TCP의 경우 클라이언트와 서버가 서로를 구분하기 위해서는 클라이언트 IP, 클라이언트 PORT, 서버 IP, 서버 PORT, 이렇게 네 가지가 필요하다. 그래서 클라이언트의 IP가 바뀌는 상황이 발생하면 연결이 끊어져 버린다.

우리가 핸드폰을 들고 와이파이존에서 LTE 데이터를 사용하게 됐을 때, 동영상 끊김과 같이 일시적 지연이 일어나는 이유는 클라이언트 IP가 이때 바뀌기 때문이다. 그래서 다시 연결을 생성하기 위해 결국 핸드쉐이크 과정을 다시 거쳐야한다는 것이고, 이 과정에서 다시 지연시간이 발생하게 되는 것이다.

![QUIC-http3](https://blog.kakaocdn.net/dn/ZBG1n/btrSxFh9eYR/Gyw8RHrLNW2pcLCx5fZ0ZK/img.png)

#### **Connection ID**

반면 QUIC은 Connection ID를 사용하여 서버와 연결을 생성한다.

Connction ID는 각 연결은 연결 식별자나 연결 ID를 가지므로 이를 통해 연결을 식별한다.

![QUIC-http3](https://blog.kakaocdn.net/dn/bseO29/btrSwpUNayJ/RdTC0IgR7vEaGuukMdx0wk/img.png)

Connection ID는 랜덤한 값일 뿐, 클라이언트의 IP와는 전혀 무관한 데이터이기 때문에 클라이언트의 IP가 변경되더라도 기존의 연결을 계속 유지할 수 있다. 그래서 새로 연결을 생성할 때 거쳐야하는 핸드쉐이크 과정을 생략할 수 있다. 따라서 휴대폰으로 인터넷을 할 때, 중간에 와이파이에서 LTE로 변경해도 스트림이 계속 유지가 된다. 

![QUIC-http3](https://blog.kakaocdn.net/dn/t8oZ6/btrSwCGom8N/Il5l5owKZYhULUoRgLmk4k/img.png)

하지만 똑같은 Connection ID만 사용한다면 해커가 네트워크를 통해 사용자를 추적하여 보안 문제가 일어날 수도 있을 것이다. 그래서 QUIC는 새 네트워크가 사용될 때마다 Connection ID를 변경한다.

위의 말과 행동이 다르겠다고 생각하겠지만, 내부적으로 클라이언트와 서버가 모두 연결을 위해 무작위로 생성한 Connection ID에 대해 인지하고 있고, 네트워크가 바뀔때 Connection ID를 바꾸더라도 이게 이전 Connectin ID와 동일하다고 인지하여 연결을 유지하는 것이다.

* * *

**HTTP 3.0 우려점**
----------------

HTTP 3.0 과 QUIC 프로토콜이 이렇게 좋은 많은 것들을 제공해 주고 있지만, 아직 전세계의 기업들이 이를 막상 도입하지 않는 현실적인 이유가 존재한다.

### **기존 체계 호환성 문제**

HTTP/1.1 이나 HTTP/2 기반의 프론트엔드단 최적화를 이미 적용한 기업의 경우 QUIC 도입에 부담스러울 수 있다.

예를들어 브라우저의 병렬 다운로드를 통해 리소스를 빠르게 받아오는 도메인 분할(domain sharding) 기법을 이미 적용하여 최적화를 시킨 기업은 오히려 멀티플렉싱 기반의 HTTP/2 혹은 HTTP/3에서 성능이 반감될 수 있다.

또한 브라우저의 콘텐츠 Prefetch 기능을 적용한 경우, 이를 Server Push 기능으로 변경해야 할지에 대한 기술적인 판단과 충분한 성능 비교 테스트가 필요하게 된다. ​

### **암호화로 네트워크 제어가 힘듬**

QUIC는 기존에는 암호화하지 않던 헤더 필드도 암호화한다. 

그래서 이런 헤더의 정보를 사용하는 ISP나 네트워크 중계회사들은 기존에 암호화하지 않던 헤더 필드 영역들을 읽을 수 없어 네트워크 혼잡을 관리하기 위한 네트워크를 최적화하기 힘들다. 예를 들어 패킷이 ACK인지 재전송인지 알 수 없다. RTT 추정 은 더 어렵다.

이러한 이유로 기업들이 HTTP 3 도입을 주저하고 있다.

### **암호화로 리소스가 많이 듬**

QUIC은 패킷별로 암호화를 한다.

이는 기존의 TLS-TCP에서 패킷을 묶어서 암호화하는 것보다 더 큰 리소스 소모를 불러올 수 있다는 단점이 있다.

### **QUIC는 CPU를 너무 사용함**

QUIC은 너무 많은 CPU 시간을 차지한다.

따라서 보급형 스마트폰과 IoT 장치같은 마이크로 애플리케이션들은 이용에 어려움을 겪을 수도 있다.

물론 시간이 지나면 개선될수도 있다. 다만 문제는 추가적인 CPU 사용이 배포자에게 얼마나 영향을 끼치는가 이다.

### **UDP의 보안적인 문제**

DNS에서 TCP나 UDP를 53포트를 이용해 통신하게 되는데, 53 포트가 아닌 UDP 트래픽이 최근에는 도스 공격에 주로 사용되기 때문에 많은 서비스들에서 차단하거나 속도를 제한하고 있다.

그래서 QUIC에서는 초기 패킷이 최소 1200바이트여야 한다는 조건과 서버가 클라이언트로부터 응답 패킷을 받지 않으면 요청 크기의 3배 이상은 절대 보내면 안 된다는 프로토콜의 제약사항으로 이를 해결하려고 노력중이다.

기존��도 HTTP/2의 여러 보안 취약점이 발견되어 모든 업체가 이에 대한 보안 패치를 적용한 사례가 있듯이, 이처럼 새로운 기술이 나오면 보안 문제는 항상 대두되길 마련이다.

* * *

물론 이러한 우려점들은 QUIC도 버전이 업데이트 됨에 따라 극복될 가능성이 있다.

HTTP/3도 점점 발전해 나갈것이고, QUIC가 사장되고 또다른 프로토콜이 나온다고 할지라도, 이제는 더이상 HTTP는 TCP라는 이야기도 바뀌지 않을꺼라 생각된다.

* * *