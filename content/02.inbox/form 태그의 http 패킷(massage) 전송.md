---
title: form 태그의 http 패킷(massage) 전송
resource-path: 02.inbox/form 태그의 http 패킷(massage) 전송.md
keywords:
tags:
  - network
  - html
date: 2024-02-13T15:15:00+09:00
lastmod: 2024-02-13T15:15:00+09:00
---
클라이언트측 post 메서드 전송 예시
```html
<form action="http://www.example.com/test" method="POST">
  <label for="userId">User ID:</label><br>
  <input type="text" id="userId" name="userId"><br>
  
  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>
  
  <input type="submit" value="Submit">
</form> 
```

서버측으로 전송되는 패킷 예시
```http
POST /test HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 43
Origin: http://www.example.com
Connection: keep-alive
Referer: http://www.example.com/test
Cookie: PHPSESSID=5a1lvj45uk83a3k9opjkpo3jm2
\n\r
userId=user&password=password
```




클라이언트측 get 메서드 html
```html
<form action="http://www.example.com/test" method="GET">
  <label for="userId">User ID:</label><br>
  <input type="text" id="userId" name="userId"><br>
  
  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>
  
  <input type="submit" value="Submit">
</form>
```


서버측으로 전송되는 패킷 예시
```http
GET /test?userId=user&password=password HTTP/1.1
Host: www.example.com
```