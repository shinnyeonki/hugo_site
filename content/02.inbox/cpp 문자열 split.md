---
title: cpp 문자열 split
aliases:
  - string split
  - delimiter
tags:
  - algorithm
created: 2024-12-17T06:46:00+09:00
modified: 2024-12-17T06:46:00+09:00

---

```c++
vector<string> split(const string& input, const string& delimiter) {
    vector<string> ret;
    size_t pos = 0;
    string token;

    // input 문자열이 비어있거나 delimiter가 비어있으면 빈 벡터 반환
    if (input.empty() || delimiter.empty()) {
        return ret;
    }

    string str = input;  // 원본 문자열을 수정하지 않기 위해 복사

    // 구분자가 문자열에 없을 때까지 반복
    while ((pos = str.find(delimiter)) != string::npos) {
        token = str.substr(0, pos);  // 구분자 이전의 문자열 추출
        ret.push_back(token);          // 벡터에 추가
        str.erase(0, pos + delimiter.length());  // 구분자 이후의 문자열로 업데이트
    }

    // 남은 문자열 추가
    ret.push_back(str);  // 마지막 토큰 추가

    return ret;
}
```