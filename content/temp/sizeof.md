
`sizeof` 연산자는 C 언어에서 객체나 데이터 타입의 크기를 바이트 단위로 반환하는 데 사용됩니다. `sizeof`의 사용법과 규칙은 다음과 같습니다.

## 1. 기본 사용법

- **변수나 데이터 타입**의 크기를 알아낼 수 있습니다.
  
  ```c
  int a;
  printf("%zu\n", sizeof(a));        // int의 크기 출력
  printf("%zu\n", sizeof(int));      // int 타입의 크기 출력
  ```

## 2. 배열의 크기

- **배열**에 대해서는 전체 배열의 크기를 반환합니다.
  
  ```c
  char text[] = "hello";
  printf("%zu\n", sizeof(text));     // 6 (5 characters + 1 for '\0')
  ```

- 그러나 **포인터**에 대해서는 포인터의 크기만 반환합니다.
  
  ```c
  char *ptr = "hello";
  printf("%zu\n", sizeof(ptr));      // 보통 4 또는 8 (32비트 또는 64비트 시스템에서의 포인터 크기)
  ```

## 3. 구조체의 크기

- **구조체**의 크기는 그 안에 포함된 멤버들의 크기의 합과 메모리 정렬 패딩을 고려하여 계산됩니다.

  ```c
  struct MyStruct {
      char a;
      int b;
  };
  printf("%zu\n", sizeof(struct MyStruct)); // 메모리 정렬에 따라 8 또는 12 반환
  ```

## 4. 함수의 크기

- **함수**에 대해서는 `sizeof`를 사용할 수 없습니다. 함수 이름은 포인터로 해석되기 때문에, 컴파일러는 오류를 발생시킵니다.

  ```c
  int myFunction() { return 0; }
  // printf("%zu\n", sizeof(myFunction)); // 오류 발생
  ```

## 5. 연산자의 크기

- **연산자**에 대해서도 `sizeof`를 사용할 수 있습니다. 이 경우, 연산자의 결과 타입에 따라 크기가 결정됩니다.

  ```c
  printf("%zu\n", sizeof(3.14)); // double의 크기 출력
  ```

## 6. 타입의 크기

- **typedef**와 같은 사용자 정의 타입에 대해서도 사용할 수 있습니다.

  ```c
  typedef unsigned long ulong;
  printf("%zu\n", sizeof(ulong)); // unsigned long의 크기 출력
  ```

## 7. `sizeof`의 평가 시기

- `sizeof`는 컴파일 타임에 평가됩니다. 즉, 런타임에 실행되지 않습니다. 따라서, `sizeof`는 변수를 인자로 전달할 때 그 변수가 배열인지 포인터인지 구분할 수 있습니다.

## 8. 조건부 연산

- `sizeof`는 조건부 표현식의 피연산자에 대해서도 사용할 수 있습니다.

  ```c
  int a;
  printf("%zu\n", sizeof(a > 0 ? a : 0)); // int의 크기 출력
  ```

## 요약

- `sizeof`는 다양한 데이터 타입과 객체의 크기를 구하는 데 유용한 연산자입니다.
- 배열과 포인터, 구조체, 기본 데이터 타입 등 각각의 크기 계산에 대한 규칙을 이해하는 것이 중요합니다.

추가 질문이 있으시면 언제든지 말씀해 주세요! 

이런 자료를 참고했어요.
[1] Microsoft Learn - sizeof 연산자 (https://learn.microsoft.com/ko-kr/cpp/cpp/sizeof-operator?view=msvc-170)
[2] Microsoft Learn - sizeof 연산자 - 형식에 대한 스토리지 요구 사항 결정 - C# ... (https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/sizeof)
[3] NAVER - c언어 - sizeof의 개념 (https://blog.naver.com/PostView.naver?blogId=jsky10503&logNo=220584768026)
[4] 티스토리 - Sizeof, 쉼표 연산자, 조건부 연산자 - Hyonii - 티스토리 (https://hyoniidaaa.tistory.com/6) 

뤼튼 사용하러 가기 > https://agent.wrtn.ai/5xb91l