---
title: c++ 입력함수
resource-path: temp/c++ 입력함수.md
keywords:
tags:
date: 2023-12-24T08:43:00+09:00
lastmod: 2025-06-05T06:16:41+09:00
---
```cpp
// 정수  
int n;  
cin >> n;  
  
// 문자열  
string str;  
cin >> str;
```

- `<iostrem>` 에 포함
- 표준 입력 버퍼에서 개행문자를 제외한 값을 가져옴
- 공백이나 개행입력시 공백 이전까지의 값만 결과로 받아드린다
- 개행문자를 입력 버퍼에 남겨둔다


getline()함수는 두 가지가 존재하는데 각가 다른 라이브러리에 존재한다. istream 라이브러리에 속한 cin.getline()함수와 string 라이브러리에 속하는 getline()함수가 있다.

- **istream 라이브러리의 cin.getline()**
    - 문자 배열이며 마지막 글자가 ‘\0’(terminator)인 c-string을 입력 받는데 사용
    - n-1개의 문자 개수만큼 읽어와 str에 저장 (n번째 문자는 NULL(‘\0’)로 바꾼다.)
    - 세 번째 인자인 delim은 별도로 지정해주지 않으면 엔터(‘\n’)로 인식
    - delim을 지정해주면 그 제한자(delim)문자 직전까지 읽어서 str에 저장

```cpp
cin.getline(char* str, streamsize n);  
cin.getline(char* str, streamsize n, char dlim);
```

cin.getline(변수 주소, 최대 입력 가능 문자수, 종결 문자);  
ex) cin.getline(str, 100);

- **string 라이브러리의 getline()**
    - 최대 문자 수를 입력하지 않아도 됨.
    - 원하는 구분자(delimiter)를 만날 때 까지 모든 문자열을 입력 받아 하나의 string 객체에 저장

```cpp
getline(istream& is, string str);  
getline(istream& is, string str, char dlim);
```

getline(입력스트림 오브젝트, 문자열을 저장할 string객체, 종결 문자);  
ex) getline(cin, str);

## [](https://kyu9341.github.io/C-C/2020/01/17/C++getline()/#%EC%A3%BC%EC%9D%98 "주의")주의[](https://kyu9341.github.io/C-C/2020/01/17/C++getline()/#%EC%A3%BC%EC%9D%98)

getline() 함수를 사용할 때 주의할 점이 있다.

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|int n;  <br>string str;  <br>cin >> n;  <br>getline(cin, str);|

위와 같은 상황을 보자. 위 코드대로 실행을 하면 n을 입력 받은 후 문자열을 입력받지 않고 바로 다음 코드로 넘어가게 된다. 이유는 버퍼에 정수 값을 입력한 뒤 누른 엔터(‘\n’)가 그대로 남아있어 getline()에 들어가기 때문이다. 이를 해결하기 위해 **cin.ignore()** 라는 함수를 사용할 수 있다.

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|int n;  <br>string str;  <br>cin >> n;  <br>cin.ignore();  <br>getline(cin, str);|

위와 같이 변경하면 cin.ingore()가 입력 버퍼의 모든 내용을 제거해주어 getline()이 정상적으로 동작할 수 있다.

추가적으로 cin.ignore() 함수에 대해 알아보자면  
cin.ignore(int n, char dlim);  
cin.ignore(읽어들일 문자의 개수, 종결 문자);  
와 같은 형태로도 사용이 가능하다.


- 표준 입력 버퍼에서 문자를 하나만 가져온다.
- 문자 하나만 입력이 가능하며 공백과 개행도 입력으로 포함한다.

|   |   |
|---|---|
|1  <br>2  <br>3|char ch1, ch2;  <br>ch1 = cin.get();  <br>ch2 = cin.get();|