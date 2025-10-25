---
title: c 에서 오류를 발생시키는 방법
resource-path: temp/c 에서 오류를 발생시키는 방법.md
aliases:
tags:
  - c
date: 2024-09-27T13:07:00+09:00
lastmod: 2024-09-27T13:07:00+09:00
---
1. 반환 값 사용:
   - 함수에서 특정 값을 반환하여 오류를 나타냅니다.
   ```c
   return -1;  // 오류를 나타내는 음수 값
   return NULL;  // 포인터 함수에서 오류 표시
   ```

2. exit() 함수:
   - 프로그램을 즉시 종료하고 운영 체제에 상태 코드를 반환합니다.
   ```c
   #include <stdlib.h>
   exit(1);  // 비정상 종료를 나타내는 0이 아닌 값
   ```

3. abort() 함수:
   - 프로그램을 비정상적으로 종료하고 코어 덤프를 생성합니다.
   ```c
   #include <stdlib.h>
   abort();
   ```

4. assert() 매크로:
   - 조건이 거짓일 때 프로그램을 중단하고 오류 메시지를 출력합니다.
   ```c
   #include <assert.h>
   assert(condition);  // condition이 거짓이면 오류 발생
   ```

5. perror() 함수:
   - 시스템 오류 메시지를 표준 오류로 출력합니다.
   ```c
   #include <stdio.h>
   perror("오류 발생");
   ```

6. fprintf()를 이용한 오류 메시지 출력:
   - 오류 메시지를 표준 오류 스트림으로 출력합니다.
   ```c
   #include <stdio.h>
   fprintf(stderr, "오류: %s\n", "오류 메시지");
   ```

7. setjmp()와 longjmp() 함수:
   - 예외 처리와 유사한 기능을 구현할 수 있습니다.
   ```c
   #include <setjmp.h>
   jmp_buf env;
   if (setjmp(env) == 0) {
       // 정상 실행 코드
   } else {
       // 오류 처리 코드
   }
   // 오류 발생 시
   longjmp(env, 1);
   ```

8. errno 전역 변수:
   - 시스템 호출이나 라이브러리 함수의 오류 코드를 저장합니다.
   ```c
   #include <errno.h>
   #include <string.h>
   if (errno != 0) {
       fprintf(stderr, "오류: %s\n", strerror(errno));
   }
   ```

이러한 방법들을 상황에 맞게 적절히 조합하여 사용하면 C 프로그램에서 효과적으로 오류를 처리할 수 있습니다.