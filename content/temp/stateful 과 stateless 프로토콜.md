---
title: stateful 과 stateless 프로토콜
date: 2024-02-13T02:02:00+09:00
lastmod: 2024-02-13T02:02:00+09:00
resource-path: temp/stateful 과 stateless 프로토콜.md
aliases: 
tags:
  - network
---
- stateful : TCP, FTP
- stateless : udp http ...

==stateful 구조는 server와 client 세션의 state(상태)에 기반하여 client 에 response 를 보낸다==
즉 server 측 client 모두 state 를 저장한다 (참조 [네트워크 스텍](https://d2.naver.com/helloworld/47667))

stateless : 보내고 아몰랑??

## 궁금증
1. http(stateless) 응용계층의 프로토콜은 하위계층(4계층) TCP(stateful) 를 사용한다??
2. statless http 프로토콜은 연결된 상태를 어떻게 판단 구현하는가??
 
 
 2가지에 대해 궁금증이 생겨서  글을 작성하게됨

## TCP 프로토콜은 stateful 을 어떻게 구현하는가
stateful 을 구현하고자 하는 [](../02.inbox/따라IT/네트워크%204계층.md#TCP) 는 syn.. ack... 두가지 정보의 교환으로 서로의 연결이 되었다는 것을 논리적으로 확인하게 된다 이때 상태 정보가 운영체제에 스텍으로 메모리에 저장된다 [](https://elixir.bootlin.com/linux/latest/source/net/ipv4/tcp_ipv4.c#L2161)


## statless http 프로토콜의 연결 상태 구현
cookie 를 통해 클라이언트 측에만 상태를 강제로 구현함 보안문제

session : 연결되었다는 사람이 인지하는 일종의 추상적 개념 ex) 로그인 성공 상태

## 결론
tcp 를 통해 http PDU(massage) 가 전부 전달 되었다는 것만 보장 나머지 로그인 인증 등 과정은 http 에서 확인해야함








> http 버전
> RFC2068(1997)
> RFC2616(1999)
> RFC7230~7235(2014)
