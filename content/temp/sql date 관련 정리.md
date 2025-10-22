---
title: sql date 관련 정리
aliases: 
tags:
  - sql
created: 2024-04-12T09:58:00+09:00
modified: 2024-04-12T09:58:00+09:00

---
sql 에서 제공하는 date 에 관련한 정보를 기술한다

## 자료형
### 1. DATE 타입
- DATE 타입은 날짜는 포함하지만 시간은 포함하지 않을 때 사용하는 타입입니다.
- DATE 타입 YYYY-MM-DD 형식 입력가능하며, '1000-01-01' 부터 '9999-12-31' 까지만 입력가능합니다.

### 2. DATETIME 타입

- DATETIME 타입은 날짜와 시간을 모두 포함할 때 사용하는 타입입니다.
- YYYY-MM-DD HH:MM:SS의 형태로 사용되며 '1001-01-01 00:00:00'부터 '9999-12-31 23:59:59'까지 입력이 가능하다

### 3. TIME 타입

- TIME은 HH:MM:SS의 형태를 지닌다.(HHH:MM:SS의 형태를 띄기도 한다)
- -838:59:59 부터 838:59:59 까지의 범위를 가진다. 이때 TIME type의 시간이 크다고 느낄수도 있다.
- TIME은 현재의 시간을 표현할때만 쓰는것이 아니라 이미 지나버린 시간이나, 특정 이벤트끼리의 간극을 표현하는데 사용되기 때문에 이처럼 쓰인다.

### 4. TIMESTAMP 타입

- TIMESTAMP 역시 날짜와 시간을 포함한다.
- TIMESTAMP는 1970-01-01 00:00:01 UTC 부터 2038-01-19 03:14:07UTC 까지가 그 범위이다.


## 관련 함수
**dayofweek(date)**
날짜를 한 주의 몇 번째 요일인지를 나타내는 숫자로 리턴한다.
(1 = 일요일, 2 = 월요일, ... 7 = 토요일)
mysql> select dayofweek('1998-02-03'); -> 3

**weekday(date)**
날짜를 한 주의 몇 번째 요일인지를 나타내는 숫자로 리턴한다. (0 = 월요일, 1=화요일 ... 6 = 일요일)
mysql> select weekday('1997-10-04 22:23:00'); -> 5
mysql> select weekday('1997-11-05'); -> 2

**dayofmonth(date)**
그 달의 몇 번째 날인지를 알려준다. 리턴 값은 1에서 31 사이이다.
mysql> select dayofmonth('1998-02-03'); -> 3

**dayofyear(date)**
한 해의 몇 번째 날인지를 알려준다. 리턴 값은 1에서 366 사이이다.
mysql> select dayofyear('1998-02-03'); -> 34

**month(date)**
해당 날짜가 몇 월인지 알려준다. 리턴 값은 1에서 12 사이이다.
mysql> select month('1998-02-03'); -> 2

**dayname(date)**
해당 날짜의 영어식 요일이름을 리턴한다.
mysql> select dayname("1998-02-05"); -> thursday
  
**monthname(date)**
해당 날짜의 영어식 월 이름을 리턴한다.
mysql> select monthname("1998-02-05"); -> february

**quarter(date)**
분기를 리턴한다 (1~ 4)
mysql> select quarter('98-04-01'); -> 2

**week(date)**
**week(date,first)**
인수가 하나일 때는 해달 날짜가 몇 번째 주일인지(0 ~ 52)를 리턴하고 2개일 때는 주어진 인수로 한 주의 시작일을 정해 줄 수 있다. 0이면 일요일을 1이면 월요일을 한 주의 시작일로 계산해 몇 번째 주인가 알려준다.
mysql> select week('1998-02-20'); -> 7
mysql> select week('1998-02-20',0); -> 7
mysql> select week('1998-02-20',1); -> 8

**year(date)**
년도를 리턴한다.(1000 ~ 9999)
mysql> select year('98-02-03'); -> 1998

**hour(time)**
시간을 알려준다.(0 ~ 23)
mysql> select hour('10:05:03'); -> 10

**minute(time)**
분을 알려준다(0 ~ 59)
mysql> select minute('98-02-03 10:05:03'); -> 5

  
**second(time)**
초를 알려준다(0 ~ 59)
mysql> select second('10:05:03'); -> 3

**period_add(p,n)**
yymm 또는 yyyymm 형식으로 주어진 달에 n개월을 더한다. 리턴 값은 yyyymm의 형식이다.
mysql> select period_add(9801,2); -> 199803

  
**period_diff(p1,p2)**
yymm 또는 yyyymm 형식으로 주어진 두 기간사이의 개월을 구한다
mysql> select period_diff(9802,199703); -> 11

**date_add(date,interval expr type)**
**date_sub(date,interval expr type)**
**adddate(date,interval expr type)**
**subdate(date,interval expr type)**

위의 함수들은 날자 연산을 한다. 잘 만 사용하면 꽤나 편리한 함수 들이다. 모두 mysql 3.22 버전에서 새롭게 추가되었다. adddate() 과 subdate() 는 date_add() 와 date_sub()의 또 다른 이름이다.
인수로 사용되는 date 는 시작일을 나타내는 datetime 또는date 타입이다. expr 는 시작일에 가감하는 일수 또는 시간을 나타내는 표현식이다.


**type** 값의 의미  사용 예
**second, seconds**   초  
**minute, minutes**  분
**hour, hours**   시간  
**day, days**  일  
**month, months**  월  
**year, years**  
년
**minute_second, "minutes:seconds"**   분:초  
**hour_minute, "hours:minutes"**   시:분  
**day_hour, "days hours"**  일 시  
**year_month, "years-months"**  년 월  
**hour_second, "hours:minutes:seconds"**  시 분  
**day_minute, "days hours:minutes"**  일, 시, 분  
**day_second, "days hours:minutes:seconds"**  일, 시, 분, 초

**[예제]**
mysql> select date_add("1997-12-31 23:59:59",interval 1 second); -> 1998-01-01 00:00:00
mysql> select date_add("1997-12-31 23:59:59",interval 1 day); -> 1998-01-01 23:59:59
mysql> select date_add("1997-12-31 23:59:59",interval "1:1" minute_second); -> 1998-01-01 00:01:00
mysql> select date_sub("1998-01-01 00:00:00",interval "1 1:1:1" day_second); -> 1997-12-30 22:58:59
mysql> select date_add("1998-01-01 00:00:00",interval "-1 10" day_hour); -> 1997-12-30 14:00:00
mysql> select date_sub("1998-01-02", interval 31 day); -> 1997-12-02

**to_days(date)**
주어진 날짜를 0000년부터의 일수로 바꾼다.
mysql> select to_days(950501); -> 728779
mysql> select to_days('1997-10-07'); -> 729669

**from_days(n)**
주어진 일수 n로부터 날짜를 구한다
mysql> select from_days(729669); -> '1997-10-07'

**date_format(date,format)**
format 의 정의에 따라 날자 혹은 시간을 출력한다. 매우 빈번히 쓰이는 함수 이다.
format 에 사용되는 문자는 다음과 같다.
**%m  
월이름 (january..december)
%w  
**요일명 (sunday..saturday)
**%d**  
영어식 접미사를 붙인 일(1st, 2nd, 3rd, etc.)
**%y**   4자리 년도
**%y**  
2자리 년도
**%a**  
짧은 요일명(sun..sat)
**%d  
**일(00..31)
**%e**  
일(0..31)
**%m  
**월(01..12)
**%c  
**월(1..12)
**%b**  
짧은 월이름 (jan..dec)
**%j  
**한해의 몇 번째 요일인가 (001..366)
**%h  
**24시 형식의 시간 (00..23)
**%k  
**24시 형식의 시간 (0..23)
**%h  
**12시 형식의 시간 (01..12)
**%i**  
12시 형식의 시간 (01..12)
**%l  
**시간 (1..12)
**%i  
**분 (00..59)
**%r**  
시분초12시 형식 (hh:mm:ss [ap]m)
**%t  
**시분초 24시 형식 (hh:mm:ss)
**%s  
**초 (00..59)
**%s  
**초 (00..59)
**%p  
**am 또는 pm 문자
**%w**  
일주일의 몇 번째 요일인가(0=sunday..6=saturday)
**%U  
**한해의 몇 번째 주인가(0..52). 일요일이 시작일
**%u**  
한해의 몇 번째 주인가(0..52). 월요일이 시작일
**%%**  
`%' 문자를 나타냄
위 표에 나와 있는 것들을 제외한 모든 문자는 그냥 그대로 출력된다.

mysql> select date_format('1997-10-04 22:23:00', '%w %m %y'); -> 'saturday october 1997'
mysql> select date_format('1997-10-04 22:23:00', '%h:%i:%s'); -> '22:23:00'
mysql> select date_format('1997-10-04 22:23:00','%d %y %a %d %m %b %j'); -> '4th 97 sat 04 10 oct 277'
mysql> select date_format('1997-10-04 22:23:00','%h %k %i %r %t %s %w'); -> '22 22 10 10:23:00 pm 22:23:00 00 6'

주의! : mysql 3.23 버전부터 % 기호가 각 형식문자 앞에 필요하게 되었다 그 이전 버전에서는 선택 사항이다.

**time_format(time,format)**
이 함수는 date_format()와 비슷한 역할을 하지만 단지 시,분,초 만을 나타낼 수 있다는 점이다.
**curdate()**
**current_date()**  
오늘 날짜를 'yyyy-mm-dd' 또는 yyyymmdd 형식으로 리턴한다, 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다.
mysql> select curdate(); -> '1997-12-15'

mysql> select curdate() + 0; -> 19971215

**curtime()**
**current_time()**
'hh:mm:ss' 또는 hhmmss 형식으로 현재시간을 나타낸다. 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다.
mysql> select curtime(); -> '23:50:26'
mysql> select curtime() + 0; -> 235026

**now()**
**sysdate()**
**current_timestamp()**
오늘 날자와 현재 시간을 'yyyy-mm-dd hh:mm:ss' 또는 yyyymmddhhmmss 형식으로 리턴 한다, 역시 리턴 값은 이 함수가 문자열로 쓰이느냐 숫자로 쓰이느냐에 따라 달라진다. 실제 개발 시 사용자의 등록일시 등을 나타낼 때 유용하게 쓰이는 함수다. 뒷부분의 실전예제에서 보게 될 것이다.
mysql> select now(); -> '1997-12-15 23:50:26'
mysql> select now() + 0; -> 19971215235026

**unix_timestamp()**
**unix_timestamp(date)**
인수가 없이 사용될 경우 현재 시간의 유닉스 타임스탬프를 리턴하고
만일 날짜형식의 date 가 인수로 주어진 경우에는 주어진 날짜의 유닉스 타임스탬프를 리턴한다 유닉스 타임스탬프 란 그리니치 표준시로 1970 년 1월 1일 00:00:00 이 후의 시간경과를 초단위로 나타낸 것이다.
mysql> select unix_timestamp(); -> 882226357
mysql> select unix_timestamp('1997-10-04 22:23:00'); -> 875996580
  
주의 : 만일 unix_timestamp함수가 timestamp 컬럼 에서 사용될 경우에는 주어진 시간이 타임스탬프로 바뀌지 않고 그대로 저장된다.

**from_unixtime(unix_timestamp)**
주어진 유닉스 타임스탬프 값으로부터 'yyyy-mm-dd hh:mm:ss' 또는 yyyymmddhhmmss 형식의 날짜를 리턴한다.
mysql> select from_unixtime(875996580); -> '1997-10-04 22:23:00'
mysql> select from_unixtime(875996580) + 0; -> 19971004222300

**from_unixtime(unix_timestamp,format)**
주어진 유닉스 타임스탬프 값을 주어진 날짜 형식에 맞게 바꿔서 보여준다. 여기서 사용되는 형식문자는 date_format() 함수에서 사용된 것과 같다.
아래 예에서 %x 는 형식문자가 아니므로 그냥 x 가 표시됨에 유의하기 바란다.
mysql> select from_unixtime(unix_timestamp(), '%y %d %m %h:%i:%s %x'); -> '1997 23rd december 03:43:30 x'

**sec_to_time(seconds)**
주어진 초를 'hh:mm:ss' 또는 hhmmss 형식의 시간단위로 바꿔준다.
mysql> select sec_to_time(2378); -> '00:39:38'
mysql> select sec_to_time(2378) + 0; -> 3938

**time_to_sec(time)**
주어진 시간을 초 단위로 바꿔준다.

mysql> select time_to_sec('22:23:00'); -> 80580
mysql> select time_to_sec('00:39:38'); -> 2378

**[예제]**

쿼리문으로 날짜계산  
$query = "SELECT (now() - interval ′1 month′)::timestamp"; // 현재 부터 한 달 전 날짜
$query = "SELECT (now() + interval ′6 month′)::timestamp"; // 현재 부터 6 달 후 날짜 ...
**[Q/A]** mysql에서 타임스탬프값을 날짜값으로 바꿔주는 함수 있나요?  
select from_unixtime(날짜필드) ...
하시면 우리가 보는 시간으로 보일거예요~
**[MySQL에서 제공하는 날자 관련 함수]**
**DAYOFMONTH(date)** : 날짜만 리턴해주는 함수. (1-31) 한달을 단위로.  
**DAYOFYEAR(date)** : 이역시 날짜만 리턴. (1-366) 1년을 단위로.  
**TO_DAYS(date)** : 연도와 달을 모두 날짜화 시켜서 리턴해줍니다.  
                            (1999-01-01 = (1999 * 365) + (01 * 31) + 1)  
**MONTH(date)** : 달을 리턴해주는 함수.  
**DAYNAME(date)** : 요일을 문자로 리턴. (ex :'Thursday')  
**MONTHNAME(date)** : 달을 문자로 리턴. (ex :'February')  
**WEEK(date)** : 해당 연도에 몇번째 주인지를 리턴 (0-52)  
**YEAR(date)** : 연도를 리턴 (1000-9999)  
**HOUR(time)** : 시간 리턴   
**MINUTE(time)** : 분 리턴  
**SECOND(time)** : 초 리턴

**DATE_FORMAT(date,format)**

     `%W'    Weekday name (`Sunday'..`Saturday')  
     `%D'    Day of the month with english suffix (`1st', `2nd', `3rd',  
             etc.)  
     `%Y'    Year, numeric, 4 digits  
     `%y'    Year, numeric, 2 digits  
     `%a'    Abbreviated weekday name (`Sun'..`Sat')  
     `%d'    Day of the month, numeric (`00'..`31')  
     `%e'    Day of the month, numeric (`0'..`31')  
     `%m'    Month, numeric (`01'..`12')  
     `%c'    Month, numeric (`1'..`12')  
     `%b'    Abbreviated month name (`Jan'..`Dec')  
     `%j'    Day of year (`001'..`366')  
     `%H'    Hour (`00'..`23')  
     `%k'    Hour (`0'..`23')  
     `%h'    Hour (`01'..`12')  
     `%I'    Hour (`01'..`12')  
     `%l'    Hour (`1'..`12')  
     `%i'    Minutes, numeric (`00'..`59')  
     `%r'    Time, 12-hour (`hh:mm:ss [AP]M')  
     `%T'    Time, 24-hour (`hh:mm:ss')  
     `%S'    Seconds (`00'..`59')  
     `%s'    Seconds (`00'..`59')  
     `%p'    `AM' or `PM'  
     `%w'    Day of the week (`0'=Sunday..`6'=Saturday)  
     `%U'    Week (`0'..`52'), Sunday is the first day of the week.  
     `%u'    Week (`0'..`52'), Monday is the first day of the week.  
     `%%'    Single `%' characters are ignored.  Use `%%' to produce a  
             literal `%' (for future extensions).