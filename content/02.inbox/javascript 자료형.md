---
title: javascript 자료형
resource-path: 02.inbox/javascript 자료형.md
keywords:
tags:
  - javascript
  - language
date: 2023-12-20T07:12:00+09:00
lastmod: 2023-12-20T07:12:00+09:00
---
|             | var | let | const |
| ----------- | --- | --- | ----- |
| 재선언      | o   | x   | x     |
| 업데이트    | o   | o   | x     |
| 호이스팅    | o   | o   | o      | 
| 자동 초기화 | o   | x   | x     |
|             |     |     |       |



호이스팅: let, const 는 오류 발생(호이스팅은 되어도 자동 초기화 안해서 오류 발생)
```javascript
console.log(a)
변환 ->
var a
console.log(a) // undefined
```


| 기준            |        |         |       |           |
| --------------- | ------ | ------- | ----- | --------- |
| 원시(primitive) | number | boolean | null  | undifined |
| 참조(reference) | BigInt | object  | array | function  |


자바스크립트에서는 원시 타입(primitive type) 참조 타입(reference type)이라는 두 가지 자료형을 제공한다.

숫자, 불린값, null과 undefined는 원시 타입이다. 객체, 배열, 함수는 참조 타입이다.
