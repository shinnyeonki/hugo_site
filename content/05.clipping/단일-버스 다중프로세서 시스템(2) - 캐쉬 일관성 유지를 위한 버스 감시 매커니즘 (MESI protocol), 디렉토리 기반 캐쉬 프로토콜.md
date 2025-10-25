---
title: 단일-버스 다중프로세서 시스템(2) - 캐쉬 일관성 유지를 위한 버스 감시 매커니즘 (MESI protocol), 디렉토리 기반 캐쉬 프로토콜
date: 2025-06-10
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 05.clipping/단일-버스 다중프로세서 시스템(2) - 캐쉬 일관성 유지를 위한 버스 감시 매커니즘 (MESI protocol), 디렉토리 기반 캐쉬 프로토콜.md
source: "https://butter-shower.tistory.com/40"
author:
  - "[[_rian]]"
published: 2019-06-18
description: "캐시 일관성 유지 방법 중 가장 많이 사용하는 버스 감시 메커니즘에 대한 소개이다. 버스 감시 매커니즘을 이용하는 방법 데이터 일관성 유지를 위하여 버스 감시 기능을 가진 H/W 모듈인 스누프 제어기(snoop controller : 버스 감시기 (bus watcher))를 추가하는 방법 스누프 제어기(Snoop controller) 다른 프로세서에 의한 버스 상의 주기억장치 액세스의 주소를 감시하여, 그 결과에 따라 자신의 캐시 블록 상태를 조정하는 HW 모듈 각 캐쉬 블록들은 상태 비트들을 가지며, 상태의 수와 종류는 쓰기 방식 및 일관성 유지 프로토콜에 따라 달라짐. - Write-through coherence protocol - Write-back coherence protocol 1. Writ.."
tags:
  - "clippings"
---
글 작성자: \_rian

캐시 일관성 유지 방법 중 가장 많이 사용하는 버스 감시 메커니즘에 대한 소개이다.

---

## 버스 감시 매커니즘을 이용하는 방법

데이터 일관성 유지를 위하여 버스 감시 기능을 가진 H/W 모듈인 스누프 제어기(snoop controller: 버스 감시기 (bus watcher))를 추가하는 방법

스누프 제어기(Snoop controller)

- 다른 프로세서에 의한 버스 상의 주기억장치 액세스의 주소를 감시하여, 그 결과에 따라 자신의 캐시 블록 상태를 조정하는 HW 모듈
- 각 캐쉬 블록들은 상태 비트들을 가지며, 상태의 수와 종류는 쓰기 방식 및 일관성 유지 프로토콜에 따라 달라짐.  
	\- Write-through coherence protocol  
	\- Write-back coherence protocol
![|561x288](https://blog.kakaocdn.net/dn/bgbsdY/btqwaGJWJp5/lDSHPzBZQmNhkqUNH0GaEK/img.png)

버스 감시 매커니즘이 포함된 (스누프 제어기가 포함된) 프로세서 모듈

---

## 1\. Write-through 일관성 유지 프로토콜

프로세서가 캐시의 데이터를 수정할 때, 동시에 주 기억장치에도 갱신

스누프 제어기의 동작

- 주 기억장치에 대한 쓰기 동작의 주소가 자신의 캐시에 있는지 검사함
- 만약 존재한다면, 그 블록을 무효화(invalidate) 시킨다.  
	\-> 프로세서가 무효화된 블록을 액세스 하는 경우에는 캐시 미스로 처리한다.

캐시 데이터의 상태

- 유효(V: Valid) 상태: 캐시의 내용 = 주기억장치의 내용
- 무효(I: Invalid) 상태: 캐쉬의 내용!= 주기억장치의 내용

---

## 2\. Write-back 일관성 유지와 MESI 프로토콜

프로세서가 캐쉬의 데이터를 변경해도 주기억장치의 내용은 갱신되지 않음. -> 다른 스누프 제어기들이 시스템 버스를 감시해도 변경 사실을 알 수 없음.

> 해결책! 변경된 캐시의 스누프 제어기가 변경 사실을 다른 스누피 제어기들에게 통보하면 된다.

- 무효화 신호 (invalidate signal): 데이터의 변경 사실을 알려주기 위한 신호
- 무효화 사이클 (invalidate cycle): 무효화 신호가 전송되는 버스 사이클

### MESI 프로토콜에서 캐시 데이터의 상태

- 수정 (M: Modified) 상태: 데이터가 수정(변경) 된 상태
- 베타 (E: Exclusive) 상태: 유일한 복사본이고, 주기억장치의 내용과 동일한 상태
- 공유 (S: Shared) 상태: 데이터가 두 개 이상의 프로세서 캐시에 적재되어 있는 상태
- 무효 (I: Invalid) 상태: 데이터가 다른 프로세서에 의해 수정되어 무효가 된 상태
![|561x288](https://blog.kakaocdn.net/dn/cFqUqE/btqwaHIQYHy/Gh71mxdKDR4MuW4DjZnpd1/img.png)

MESI 프로토콜의 상태 전이도

#### (1) 데이터를 처음 읽는 경우

P1이 주기억장치로부터 X를 처음 인출: 읽기 미스 (read miss) => 주기억장치로부터 X를 읽어온 후, 상태를 배타(E) 로 세트.

![|561x288](https://blog.kakaocdn.net/dn/ce8hKp/btqv96vzjxW/kAm2GKYGidkLtwVoeFWx9K/img.png)

#### (2) 캐시에 적재된 데이터의 변경

P1이 X를 새로운 값(X')으로 변경: 쓰기 적중 (write hit) => X'로 수정한 후, 상태를 수정(M)으로 세트

![|561x288](https://blog.kakaocdn.net/dn/GVPxC/btqv9txLC4o/LyfaRSMdAHQQ3ey7az28Ok/img.png)

#### (3) 데이터가 공유되는 경우 - 1

P1이 X를 가진 상태에서 P2도 X를 읽는 경우  
\=> 읽기 미스 (read miss) => 주기억장치로부터 읽음  
\=> P1의 스누프 제어기가 그 버스 동작을 확인하고, X의 상태를 공유(S)로 변경하며, P2로 공유 사실을 알림  
\=> P2가 X의 상태를 공유(S)로 세트

![|561x288](https://blog.kakaocdn.net/dn/oRZCO/btqwaG4f5zF/J8g9Nj8LKnayrO7yAIADxK/img.png)

#### (4) 데이터가 공유되는 경우 - 2

앞의 결과와 같이 두 프로세서들이 X를 가진 상태에서 다른 프로세서 (P3)가 X를 읽는다면, 같은 동작이 발생하며 데이터의 상태는 공유(S)로 세트

#### (5) 데이터가 공유되는 경우 - 3

- (2)의 결과 상태에서, 만약 P2가 X를 액세스 한다면, 캐시 미스 발생 => 주기억장치 읽기 동작
- P1의 스누프 제어기가 그 동작을 중단시키고, 자신의 데이터(X')를 P2로 전송 (캐쉬간 전송(cache-to-cache transfer))하며, X'를 주기억장치에도 갱신
- 캐시 상태는 모두 공유(S)로 세트
![|561x288](https://blog.kakaocdn.net/dn/HZGKy/btqv8yGmRdW/JXVBi8HTsMk5XkNao22dk1/img.png)

캐시 간 전송이 지원되지 않는 시스템의 경우, P1의 스누프 제어기가 P2의 읽기 동작을 중단시키고, P2에게 재시도(retry)를 요구한 후,  
\=> P1이 X'를 주기억장치에 갱신하면,  
\=> P2가 읽기를 재시도하여 X'를 읽어간다.

#### (6) 공유 상태의 데이터가 변경되는 경우

(3)의 결과 상태에서, P2가 X를 새로운 값으로 갱신하는 경우

- P2가 버스를 통하여 무효화 신호(invalid signal)를 방송
- X를 가진 캐시들은 X의 상태를 무효(I)로 변경하고, 확인 신호 전송 => P2가 배타적 소유권 획득
- P2가 X를 새로운 값(X')으로 갱신하고, 상태를 수정(M)으로 변경
![|561x288](https://blog.kakaocdn.net/dn/bTvRHu/btqwah4HQ4u/mQ2cpgHMyS3ByKo3dzmBD1/img.png)

#### (7) M 상태의 데이터를 다시 변경하는 경우

(6)의 결과 상태에서, P2가 X'를 다시 X''로 변경하면 쓰기 적중 (write hit) => 데이터만 변경되고 상태는 불변.

![|561x288](https://blog.kakaocdn.net/dn/mLXNW/btqv8wIvy2f/pxYoQjHn3KNPJ4KHkjpMj0/img.png)

#### (8) I 상태의 데이터를 변경하는 경우

(7)의 결과 상태에서, P1이 X를 수정하기 위하여 읽으려 한다면, 쓰기 미스 (write miss) 발생

- 주기억장치 읽기 동작 시작: 수정을 위한 읽기 (read with intention to modify: RWITM)
- P2의 수누프 제어기가 X''를 P1으로 보내주고, 데이터의 상태를 무효(I)로 변경
- P1은 X''를 X'' '로 수정하고, 상태를 수정(M)으로 세트.

\=> 캐쉬간 전송이 지원되지 않는 시스템의 경우 retry 요구

![|561x288](https://blog.kakaocdn.net/dn/6tWna/btqv8wIvzPJ/FfgFYBvPdwYd67sluVpbq0/img.png)

#### (9) 프로세서가 새로운 데이터를 읽어와서 수정하는 경우

P1만 X를 가지고 있는 상태 ( (1)의 결과 )에서 P2가 X를 수정하는 경우

- 쓰기 미스 (write miss) 발생
- P2가 RWITM 시작
- P1이 X를 P2로 보내주고, 상태를 무효(I)로 변경
- P2는 X를 X'로 수정하고, 상태를 수정(M)으로 세트
![|561x288](https://blog.kakaocdn.net/dn/dcwTI8/btqv7QgB8iR/fvkSvX5lj0yuhxKGan29rk/img.png)

---

## 디렉토리 - 기반 캐시 프로토콜

수백 개 이상의 프로세서들로 구성되는 대규모 공유-기억장치 병렬 컴퓨터 시스템을 위한 캐시 프로토콜이다.

데이터 일관성 유지를 위한 신호들의 방송 (broadcasting) -> 상호 연결망의 통신량 증가 -> 방송을 하지 않는 캐시 일관성 유지 방법을 위하여 디렉토리를 도입함

> 디렉토리(directory)  
> 공유 데이터의 복사본(copy)들에 관한 정보를 관리하는 리스트(list)
> 
> 각 데이터 블록에 대한 엔트리(entry): 데이터의 상태 (state) 비트와 복사본의 위치(location)를 가리키는 포인터 (pointer)를 저장

### 디렉토리 방식의 기본 원리

#### 중앙 디렉토리 방식

모든 데이터 블록에 대한 정보를 하나의 중앙 디렉토리에 저장함 -> 용량이커지고 검색 시간이 길어짐

#### 분산 디렉토리 방식

각 기억장치 모듈에 별도의 디렉토리를 유지하는 방법

디렉토리는 데이터 블록들에 대한 상태와 위치 정보들을 저장함

상태 (state): 해당 블록이 '유효'상태인지, 혹은 수정되어 '무효'상태인지를 가리킴

## 분산 디렉토리 방식의 분류

### 1\. 풀-맵 디렉토리 (full-map directory) 방식

- 공유 기억장치 내의 각 블록에 대한 디렉토리 엔트리가 한 개씩 생성됨.
- 각 엔트리는 프로세서 수만큼의 포인터 비트(pointer bit = 존재 비트(presence bit))들과 상태 비트(state bit)로 구성
- 포인터 비트: 각 프로세서 당 한 비트씩 배정 - 해당 프로세서의 캐시에 그 데이터가 적재되어 있는지를 가리키는 데 사용함
![|561x288](https://blog.kakaocdn.net/dn/onFcl/btqv95Ked6R/2pK5p3cfkcvofBejiyVTRK/img.png)

풀-맵 디렉토리 방식의 예

풀-맵 디렉토리 방식의 장단점

- 장점: 성능 우수
- 단점: 포인터 비트들이 프로세서 수에 비례  
	\=> 디렉토리 저장 공간 증가: 기억장치 오버헤드 = O(N^2)

### 2\. 유한 디렉토리 (limited directory) 방식

- 디렉토리 저장공간의 절약을 위한 방식
- 데이터 블록을 동시에 적재할 수 있는 캐시 수를 제한. 즉, 디렉토리의 포인터 수 < 전체 프로세서 수(N)
	- 각 포인터의 비트수 = l o g 2 N $log2N$ 개
	- 엔트리 당 포인터의 수가 p개인 경우. 포인터 비트 수 = p ∗ l o g 2 N $p∗log2N$ 개
- 퇴거 (eviction): 포인터 수의 제한에 따라, 새로운 캐시에 적재 시 기존 포인터를 교체하는 동작.
	- 포인터 교체 알고리즘 필요 (세트-연관 캐시와 유사)
![|561x288](https://blog.kakaocdn.net/dn/boBARf/btqv7YMhh2p/A8ckq991MVdh9LjqkRSClK/img.png)

유한 디렉토리 방식의 예 - two pointer directory

유한 디렉토리 방식의 장단점

- 장점: 디렉토리 저장공간의 감소 => 기억장치 오버헤드 = O(N log2 N)
- 단점
	- 캐시에 적재될 수 있는 복사본 개수의 한계 때문에, 특정 데이터를 필요로 하는 프로세서 수가 많은 경우에는 캐시 적중률 저하
	- 퇴거 동작을 위한 오버헤드

### 3\. 체인 디렉토리 (chained - directory) 방식

- 공유 데이터의 복사본 개수를 제한하지 않으면서도, 유한 디렉토리의 이점도 가질 수 있는 방식
- 연결 리스트 (linked list)를 이용하여, 어떤 데이터의 복사본을 적재하고 있는 포인터들 간에 체인(chain)을 구성
![|561x288](https://blog.kakaocdn.net/dn/dy2BMA/btqv7YlaMxU/vGamGqzWS8iD35UuDMotB0/img.png)

체인 디렉토리 방식의 예

체인 디렉토리 방식의 장점

- ㅂ 저장 공간의 증가율 감소
	- 증가율: Log2N에 비례
	- 캐시와 기억장치에는 블록당 한 개 식의 포인터만 저장
- 복사본이 저장될 캐시의 수에 제한이 없음

체인 디렉토리 방식의 단점

- 캐시 슬롯이 교체될 때 복잡한 메커니즘 필요

---

## 디렉토리 프로토콜의 확장

- 공유 기억장치 시스템의 규모 확장을 위하여 다수의 다중 프로세서 시스템을 서로 접속하는 경우, 시스템 전체적으로 캐시 데이터 일관성을 유지하기 위한 방식
- 최근의 분산 공유 기억장치 다중 프로세서 시스템 (distributed shared-memory multiprocessor system)에서 널리 사용

### 분산 공유-기억장치 시스템의 구성 방법

#### 1\. 스누핑 - 스누핑 방식

스누핑 어뎁터 (snooping adapter)가 버스 내부 동작들을 다른 클러스터들로 방송하고 모니터링하는 방식.

![|561x288](https://blog.kakaocdn.net/dn/pq4yy/btqv7QVe94v/OKis6B4y1JD3weTQpQouI0/img.png)

스누핑 - 스누핑 방식

단점: 시간적 오버헤드가 크고 시스템 확장성에 한계

#### 2\. 스누핑 - 디렉토리 방식

각 클러스터 내부는 버스 스누핑 방식, 다른 클러스터들과는 디렉토리 프로토콜에 의해 일관성 유지

- 네트워크 어뎁터 (network adapter: NA): 네트워크 인터페이스 및 디렉토리 제어기 (directory controller)로 동작
![|561x288](https://blog.kakaocdn.net/dn/ddrTKC/btqwaiP715c/a1y4lkkb3FDWLeL4L5LhK1/img.png)

스누핑 - 디렉토리 방식

\[사례\] DASH 다중 프로세서 시스템 (스탠포드 대학에서 연구용으로 개발)

#### ' > ' 카테고리의 다른 글

| [\[병렬 처리\] 고성능 입출력 시스템 구조](https://butter-shower.tistory.com/43) (0) | 2019.06.20 |
| --- | --- |
| [\[병렬처리\] 상호 연결망 구조 - 정적 상호 연결망의 종류](https://butter-shower.tistory.com/42) (0) | 2019.06.20 |
| [그래픽 처리 유니트 (GPU) - GPU의 개념과 CUDA 프로그래밍](https://butter-shower.tistory.com/41) (0) | 2019.06.20 |
| [단일-버스 다중프로세서 시스템(1) - 버스 중재 방식과 캐시 일관성 유지 방법](https://butter-shower.tistory.com/39) (0) | 2019.06.17 |
| [다중-버스 다중 프로세서 시스템 - 크로스바 네트워크, 다중-버스, 계층 버스 구조](https://butter-shower.tistory.com/38) (0) | 2019.06.17 |

  

2 / 15

## 단일-버스 다중프로세서 시스템(2) - 캐쉬 일관성 유지를 위한 버스 감시 매커니즘 (MESI protocol), 디렉토리 기반 캐쉬 프로토콜

MESI 프로토콜의 상태 전이도