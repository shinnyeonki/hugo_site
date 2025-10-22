---
title: sse (server sent event)
aliases: 
tags:
  - web
created: 2025-05-26T14:09:00+09:00
modified: 2025-05-26T14:09:00+09:00

---

### Back
```java
package com.example.sse.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
public class SseController {

    private final Random random = new Random();

    @GetMapping(value = "/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter handleSse() {
        SseEmitter emitter = new SseEmitter(60_000L); // 타임아웃 설정
        //

        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                for (int i = 0; i < 10; i++) { // 10번의 무작위 이벤트
                    int delay = random.nextInt(3000) + 1000; // 1~4초 사이 랜덤 지연
                    Thread.sleep(delay);
                    String eventData = "Event at " + System.currentTimeMillis();
                    emitter.send(eventData);
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            } finally {
                executor.shutdown();
            }
        });

        return emitter;
    }
}
```

- `produces = MediaType.TEXT_EVENT_STREAM_VALUE`: 클라이언트에게 **text/event-stream** 형식의 데이터를 보낸다는 의미 → SSE 방식.
	- 반환형은 `SseEmitter` 객체이며, 서버에서 클라이언트로 일방향 통신을 가능하게 합니다.
- `SseEmitter emitter = new SseEmitter(60_000L); // 타임아웃 60초`
	-  클라이언트가 60초 동안 응답을 받지 않으면 연결이 종료됩니다.
- 별도의 스레드에서 비동기적으로 작업 수행.
- 총 10번의 이벤트를 랜덤한 시간 간격(1~4초)으로 전송.
- `emitter.send(data)`로 클라이언트에게 데이터를 실시간 전송.


### Front
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>SSE 실시간 이벤트</title>
</head>
<body>
    <h2>실시간 이벤트 수신</h2>
    <ul id="eventList"></ul>

    <script>
        const eventSource = new EventSource("/sse");

        eventSource.onmessage = function(event) {
            const li = document.createElement("li");
            li.textContent = event.data;
            document.getElementById("eventList").appendChild(li);
        };

        eventSource.onerror = function(err) {
            console.error("SSE 오류:", err);
        };
    </script>
</body>
</html>
```