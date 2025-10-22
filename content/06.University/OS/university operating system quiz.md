---
title: university operating system quiz
aliases: 
tags:
  - university
  - operating-system
created: 2025-04-22T11:00:00+09:00
modified: 2025-06-03T06:40:43+09:00

---

- pcb(process control block) 에 포함된 정보
	- process state
	- process number
	- program counter and registers
	- memory limits
	- list of open files

### 6주차

- CPU를 연속적으로 사용하는 시간을 CPU burst 라고 한다
- 스케줄링 알고리즘의 목적으로 바람직한것
	- cpu 사용율을 최대화
	- throughput 을 최대화
	- average wating time 최대화
- 스케줄링에 대해 맞는것
	- preemtive 는 강제 중단 가능 non-preemtive 는 강제 중단 불가능
	- 최근 운영체제는 preemtive 를 주로 사용
- non-preemtive 알고리즘
	- SJF
	- FCFS
- non-preemtive 에서 가장 average wating time 이 가장 작은 것은 shortest job first
- exponential moving average
	- 과거의 데이터가 현재의 값에 영향을 미치고 최근 데이터가 더 영향이 더 큰 경우에 사용한다
	- 값의 변화의 추이를 예측하는 데 사용된다
- preemtive 스케줄링
	- SRTF
	- Priorty
	- Round Robin
- priorty 스케줄링의 단점 => starvation, 기아


### 7주차
- 멀티레벨 queue 스케줄링에서는 각 큐가 일정비율로 CPU 를 할당받는다 => True
- process aging 을 구현할 수 있는 스케줄링 방법 => multilevel feedback queue 스케줄링
- 윈도우는 preemptive scheduling 을 사용
- 동시성 문제에 대해 맞는것 
	- 두개이상의 프로세스가 같은 리소스를 동시에 접근하려 할 때 발생
	- CPU 코어가 하나인 경우에도 발생한다
	- race condition 때문에 발생하기도 한다
	- critical section problem 으로 이해 할 수 있다
- 동시성 문제는 프로세스가 같은 변수를 동시에 읽으려고 할 때도 발생한다 => False
- critical section 은 하나의 프로세스만 들어갈 수 있다는 조건은 mutual exclution
- critical section에 아무도 없는데 계속 대기하는 상황은 Progress
- critical section 문제를 해결하고자 할때 Mutual exclution 을 만족하지 못하는 이유
	- locked = 0 or 1 lock 방식 알고리즘의 경우 여러 프로세스가 동시에 critical section에 들어 갈 수 있기 때문

### 9주차
- lock 방식은 mutual exclusion, bounded Waiting 만족하지 못한다
- peterson solution의 한계는 critical section problem 이 이미 해결되었다고 가정한 후에 풀었다
- critical section problem 를 해결하기 위해 interrupt 를 비활성화 하는 방법의 한계는 cpu 가 여러개인 경우 적용할 수 없고 결국 시스템의 성능이 저하된다
- semaphore 접근을 위해 들어갈때 wait, 나갈 때 signal 을 부른다
- semaphore 가 critical section 에 들어가기 위해 지속적으로 semaphore 의 현재값을 체크 할 수 있다 이것을 busy-wating(spin lock) 이라고 한다
- semaphore 의 값이 -2 일 때 대기자 리스트에 2개의 프로세스가 대기중이다


### 중간고사
폰 노이만 구조가 이전과 다른점 : 코드영역(program)이 하드웨어가 아닌 메모리로 올라간다(소프트웨어 개념의 탄생)  
캐쉬를 통해 성능 향상이 가능한 이유 : priciple of locality : 비슷한 시간에 지역적으로 접근한다



### 10주차
- dining philosopher problem 에서 Deadlock 이 발생 -> 이것의 해결방법
	- 항상 적어도 한명의 철학자가 배가 고프지 않으면 된다 => Circular Wait
	- 옆사람이 쥐고 있는 젓가락을 뺏어올 수 있으면 된다 => no preemtion 
	- 젓가락 두개를 동시에 가져올 수 없으면 젓가락을 가져가지 않으면 된다 => hold and wait
- deadlock 해결책
	- prevention 은 deadlock 이 발생할 수 있는 원인을 애초에 없애 버리는 기술이다
		- o
	- avoid 기술은 deadlock 이 이미 발생했을 때 피해를 최소화 하는 방법이다
		- x => detection
	- Detection 기술은 한 프로세스에게 리소스를 허용하면 deadlock 이 발생하는지 미리 감지하는 기술이다
		- x => avoid
- 다른문서 출력중인데 출력명령을 내리기위해 대기할 필요 없음
	- 스풀링
- 4가지 조건은 필요조건( 충분조건 x , 필요충분조건 x )







### 12 주차

- logical address space 맞는 설명
  - cpu 가 사용하는 주소
  - 컴퓨터에 장착되어 있는 실제 메모리 크기 보다 클 수 있다 => virtual memory
  - 실제와는 다른 추상적인 주소이다
- MMU 는 레지스터에 저장된 base 주소를 더해서 메모리 상의 실제 주소를 찾아낸다
- fixed partitioning 방법 에서는 프로세스 당 정해진 크기의 메모리가 할당되므로 프로세스가 사용하지 않는 공간이 생길 수 있는데 이 공간을 internal(내부) fragmentation(단편화) 이라고 부른다 반면 dynamic patritioning 방법에서는 프로세스에게 할당되는 공간 사이사아에 남는 공간이 생기는데 이른 external(외부) fragmentation(단편화) 라고 부른다
- dynamic partitioning의 메모리 할당 전략에 대해서 맞는 것
  - **First-fit:** 요청 크기를 만족하는 첫 번째 가용 공간을 할당합니다 (위에서부터 탐색 가정).
  - **Best-fit:** 요청 크기를 만족하면서 가장 크기가 비슷한 (즉, 남는 공간이 가장 적은) 가용 공간을 할당합니다.
  - **Worst-fit:** 요청 크기를 만족하면서 가장 크기가 큰 가용 공간을 할당합니다.
- paging 기법 맞는 것
  - logical address 와 physical address space 를 분리하여 메모리를 유연하게 관리한다
  - cpu 가 바라보는 가용 용량과 실제 가용한 메모리 공간이 무관햊니다
  - page table 을 효과적으로 저장하고 읽어오기 우해서는 하드웨어의 도움이 필요하다
- TLB(transiation lookaside buffer) 에 대해 맞는 것을 고르시오
  - 캐시의 종류이야
  - 하드웨어로 구현되어 있음
  - associative memory


