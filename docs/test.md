# 명지대 공지사항 mcp 

요느낌
```
gonggi_list = []


# 스케줄러 설정
scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_job, "interval", seconds=30)  # 30초마다 폴링

@endpoint(/api/all_mju_gonggi):
    홈페이지에서 공지 다가져와 (scraping으로 하던가, 홈페이지 엔드포인드 조지던가)
    gonggi_list = 응답.데이터

@endpoint(/api/갱신_시작):
    scheduler.start()

@endpoint(/api/갱신_종료):
    scheduler.shutdown()


스케줄 안에서
@secadule
    old; map 자료구조
    new = 가져와()

    if old == new {
        넘어가
    } else {
        old = new
        실행()
    }
```


