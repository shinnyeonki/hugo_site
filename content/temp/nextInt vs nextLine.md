---
title: nextInt vs nextLine
aliases:
tags:
  - ai-content
created: 2025-09-19T16:08:18+09:00
modified: 2025-09-19T16:09:18+09:00
share_link: https://share.note.sx/5qh8oyi0#jWUxnNYJuELWLPrXroZeBBPL8TUMvHS+yYMx3QmSFjo
share_updated: 2025-09-19T17:49:56+09:00

---
완벽히 이해했습니다.  
아래는 **기존의 틀과 구조를 100% 유지하면서**,  
**각 단계에서 `nextInt()`와 `nextLine()`의 동작 차이를 병렬로 설명**한 버전입니다.  
→ **동일한 입력(`25\n`)이 주어졌을 때, 두 메서드가 어떻게 다른 방식으로 버퍼를 소비하고 커서를 이동시키는지**를 **계층별로 명확히 대조**합니다.

---

## 🧩 완전한 데이터 흐름: 사용자 입력 → Scanner 내부 버퍼  
### (시스템 프로그래밍 + 터미널 관점 — `nextInt()` vs `nextLine()` 비교 포함)

> ✍️ **목표**: 사용자가 키보드로 `25`를 치고 `Enter`를 누른 순간부터,  
> Java의 `Scanner.nextInt()` 또는 `Scanner.nextLine()`이 어떻게 다른 방식으로 `25\n`을 처리하는지  
> **모든 계층을 투명하게 추적 + 비교**.

---

### 🌐 전체 흐름 다이어그램 (계층별 분리 — 두 메서드 병렬 비교)

```
[User] → [Keyboard Hardware] → [OS TTY Driver (Line Buffering)] → [Kernel stdin Buffer]  
    → [JVM System.in (FileInputStream)] → [InputStreamReader (decode)]  
    → [Scanner CharBuffer + Tokenizer] 
        ├→ nextInt()   → "25" 반환, \n은 버퍼에 남김
        └→ nextLine()  → "25" 반환, \n까지 소비
```

---

## 🔍 1. 사용자 입력 — 키보드 인터럽트

- 사용자가 키보드로 `2`, `5`, `Enter` 입력
- 하드웨어 인터럽트 발생 → CPU → OS 커널로 전달
- 커널은 **TTY 드라이버**(또는 PTY, 가상 터미널)에 입력을 전달

> 💡 여기서 중요한 개념: **“터미널은 기본적으로 라인 버퍼링 모드”**  
> → 이 동작은 `nextInt()`든 `nextLine()`이든 **공통 전제 조건**입니다.

---

## ⚙️ 2. 터미널(TTY) 동작 — Canonical Mode (Cooked Mode)

### ✅ 기본 동작: “라인 단위 입력” — 사용자가 `Enter` 칠 때까지 커널이 버퍼링

- 터미널은 기본적으로 **Canonical Mode (Cooked Mode)** 로 동작
- 사용자가 입력하는 모든 문자는 **커널의 TTY 버퍼에 쌓임**
- `Enter`(`\n`) 또는 `Ctrl+D`(EOF)를 칠 때까지 **아무것도 애플리케이션(JVM)에 전달되지 않음**

> 🖥️ 즉, `25`만 치고 있으면 — JVM은 **아무것도 읽지 못함**.  
> **`Enter`를 쳐야 비로소 커널이 `25\n`을 stdin으로 푸시**.

→ **`nextInt()`든 `nextLine()`이든, 이 시점까지는 동일하게 `25\n`을 받습니다.**

---

### 📜 TTY 버퍼링 예시 (두 메서드 공통 출발점)

```
User types:  2 → 5 → Enter
TTY Buffer: [ '2', '5', '\n' ]  ← Enter 전까지 여기에 쌓임
            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            JVM은 아직 아무것도 못 읽음!

User presses Enter → TTY sends "25\n" to stdin → 이제 JVM이 읽을 수 있음.
```

> ✅ **핵심 공통점**: Scanner 버퍼에는 항상 `25\n`이 들어감.  
> ✅ **핵심 차이점**: `nextInt()`는 `\n`을 **버퍼에 남기고**, `nextLine()`은 `\n`을 **소비함**.

---

## 📥 3. OS 커널 → JVM: read() 시스템 콜

- JVM의 `System.in`은 `FileInputStream` 기반
- 내부적으로 `FileDescriptor.in`(stdin, fd=0)을 감싸고 있음
- `Scanner`가 데이터를 요청하면 → `source.read(buf)` → 결국 `read(0, buffer, len)` 시스템 콜 발생

```c
// 실제 리눅스 시스템 콜 — 두 메서드 모두 동일하게 호출
ssize_t n = read(STDIN_FILENO, buffer, sizeof(buffer)); // buffer에 "25\n" 복사됨
```

→ 이 시점에서 **커널 TTY 버퍼의 `25\n`이 JVM의 바이트 버퍼로 복사됨**  
→ 이후부터 **Scanner 내부에서 두 메서드의 동작이 갈림**.

---

## 🔄 4. JVM 내부: 바이트 → 문자 디코딩 (InputStreamReader)

- `System.in`은 **바이트 스트림** → Scanner는 **문자 기반**
- 중간에 `InputStreamReader`가 존재 → `CharsetDecoder`로 UTF-8 → `char[]` 변환

```java
// Scanner 생성 시 내부적으로 이렇게 연결됨 — 두 메서드 동일
Readable source = new InputStreamReader(System.in, charset);
```

→ `"25\n"` (UTF-8 바이트) → `char[] { '2', '5', '\n' }`로 디코딩 → **Scanner의 `CharBuffer`에 적재**  
→ 이제 `nextInt()`와 `nextLine()`이 이 버퍼를 **다르게 해석**합니다.

---

## 🧠 5. Scanner 내부: 토큰 파싱 vs 라인 파싱 — 핵심 분기점

### 🔹 `nextInt()` 호출 시

```java
int age = scanner.nextInt();
```

#### 🔁 동작 단계:

1. **버퍼 확인**: `CharBuffer`에 `['2','5','\n']` 존재
2. **정규식 매칭**: `Pattern.compile("-?\\d+")` → `lookingAt()` → `"25"` 매칭 성공
3. **토큰 반환**: `Integer.parseInt("25")` → `age = 25`
4. **커서 이동**: 버퍼의 **읽기 위치를 `'2','5'` 다음으로 이동** → 즉, `\n` 바로 앞으로 이동
   → **`\n`은 버퍼에 그대로 남아 있음!**

> 🚫 `nextInt()`는 **토큰만 소비** — **구분자(whitespace, including `\n`)는 소비하지 않음**

---

### 🔸 `nextLine()` 호출 시

```java
String line = scanner.nextLine();
```

#### 🔁 동작 단계:

1. **버퍼 확인**: `CharBuffer`에 `['2','5','\n']` 존재
2. **줄 단위 읽기**: 현재 위치에서 **다음 `\n`까지의 모든 문자를 읽음** → `"25"`
3. **`\n` 소비**: `\n`도 포함해 **완전히 소비**
4. **커서 이동**: `\n` 다음 위치(다음 줄 시작)로 이동
   → **버퍼는 완전히 비워짐 (또는 다음 입력 대기 상태)**

> ✅ `nextLine()`은 **줄 전체 + 줄바꿈 문자까지 소비** — **항상 커서를 다음 줄로 이동**

---

## 📝 6. 혼합 사용 시 문제 — `nextInt()` → `nextLine()`

```java
int age = scanner.nextInt();   // → "25" 반환, \n 버퍼에 남김
String name = scanner.nextLine(); // → 남은 \n을 읽어 "" 반환 → 버그!
```

#### 🔄 버퍼 상태 변화:

```
초기: [ '2', '5', '\n' ]
nextInt() 후: [ '\n' ]          ← 커서는 \n 앞
nextLine() 후: [ ]              ← \n 소비, 커서는 다음 줄
→ name = ""
```

→ **사용자는 이름을 입력할 기회조차 얻지 못함 — 버그 발생!**

---

### 🆚 만약 처음부터 `nextLine()`만 사용했다면?

```java
String ageStr = scanner.nextLine(); // → "25" 반환, \n 소비 완료
String name = scanner.nextLine();    // → 다음 입력 정상 대기
```

#### 🔄 버퍼 상태 변화:

```
초기: [ '2', '5', '\n' ]
첫 nextLine() 후: [ ]               ← "25" 반환, \n 소비
두 번째 nextLine() → 사용자에게 입력 대기 → 정상 입력 가능
```

→ **문제 없음!**

---

## 🧱 계층별 정리: 각 레이어의 책임과 데이터 상태 + 메서드별 차이

| 레이어 | 책임 | `nextInt()` 동작 후 상태 | `nextLine()` 동작 후 상태 | 시스템 프로그래밍 키워드 |
|--------|------|---------------------------|----------------------------|--------------------------|
| **1. Keyboard + Hardware** | 전기 신호 → 인터럽트 | `2`, `5`, `Enter` 신호 발생 (공통) | 동일 | IRQ, PS/2, USB HID |
| **2. OS TTY Driver** | 라인 버퍼링 | `25\n` 전달 (공통) | 동일 | `termios`, `ICANON` |
| **3. Kernel stdin Buffer** | read()로 전달 | `25\n` 전달 (공통) | 동일 | `fd 0`, `read(2)` |
| **4. JVM System.in** | 바이트 스트림 | `byte[]{50,53,10}` (공통) | 동일 | `FileInputStream`, JNI |
| **5. InputStreamReader** | 바이트 → 문자 | `char[]{'2','5','\n'}` (공통) | 동일 | `UTF-8`, `StreamDecoder` |
| **6. Scanner CharBuffer** | 토큰/라인 파싱 | 커서: `\n` 앞, `\n` 잔류 | 커서: `\n` 다음, 버퍼 비움 | `Pattern`, `Matcher`, `readLine()` |
| **7. Your Code** | 비즈니스 로직 | `age=25`, 이후 `nextLine()`이 빈 문자열 | `line="25"`, 이후 정상 입력 가능 | `nextInt()`, `nextLine()` |

---

## 💡 왜 이렇게 복잡한가? — 추상화와 트레이드오프

- **터미널 라인 버퍼링**: 사용자 편의 → 공통 전제
- **Scanner 토큰 기반 vs 라인 기반**:  
  → `nextInt()`는 유연한 토큰 파싱을 위해 구분자 보존  
  → `nextLine()`은 줄 단위 처리를 위해 구분자 소비
- **버퍼링 계층**: 시스템 콜 최소화 → 성능 향상

→ **두 메서드는 같은 버퍼를 공유하지만, “어디까지 소비할 것인가”에 대한 철학이 다름**  
→ 혼용 시 **레이어 간 데이터 흐름이 깨져 버그 발생**

---

## 🛠️ 해결책 — 시스템 프로그래머의 시각에서

#### ✅ 방법 1: `nextInt()` 후 `nextLine()`으로 버퍼 정리

```java
int age = scanner.nextInt();
scanner.nextLine(); // ← \n 소비 — 커서를 다음 줄로 강제 이동
String name = scanner.nextLine(); // 정상 입력
```

→ **Scanner 레이어에서 수동으로 커서를 다음 줄로 이동**

#### ✅ 방법 2: 항상 `nextLine()` 사용 → 파싱은 수동으로

```java
int age = Integer.parseInt(scanner.nextLine()); // \n까지 소비
String name = scanner.nextLine();               // 다음 줄 정상 입력
```

→ **토큰/라인 혼용 문제를 원천 차단 — 권장!**

#### ✅ 방법 3: 터미널 모드 변경 (Advanced) — Raw Mode

```bash
stty raw
java YourProgram
stty cooked
```

→ **권장하지 않음** — Scanner의 파서 설계와 충돌 가능성 ↑

---

## 📊 시각화: 입력 데이터의 생명 주기 — 두 메서드 비교

```
[User] 
   │
   ▼
[Keyboard] → "2" → "5" → "\n" (Enter) — 공통 시작점
   │
   ▼
[TTY Driver] → Canonical Mode → "25\n" 전달 — 공통
   │
   ▼
[Kernel stdin] → read() → "25\n" 전달 — 공통
   │
   ▼
[JVM System.in] → byte[]{50,53,10} — 공통
   │
   ▼
[InputStreamReader] → char[]{'2','5','\n'} — 공통
   │
   ▼
[Scanner CharBuffer] — 여기서 분기!
        ├─ nextInt()  → "25" 반환 → 커서: \n 앞 → \n 잔류
        │                   │
        │                   ▼
        │           [nextLine()] → 즉시 \n 소비 → "" 반환 → 버그!
        │
        └─ nextLine() → "25" 반환 → \n 소비 → 커서: 다음 줄 → 정상
```

---

## ✅ 최종 결론 — 시스템 프로그래머라면 이렇게 말해야 한다

> **“사용자 입력은 터미널의 Canonical Mode에 의해 라인 단위로 커널 버퍼에 쌓이다가 `Enter`와 함께 `25\n` 형태로 JVM에 전달된다. Scanner는 이 문자열을 내부 CharBuffer에 적재한 후, `nextInt()`는 정수 토큰 ‘25’만 추출하고 줄바꿈 문자 `\n`은 구분자로 간주해 소비하지 않아 버퍼에 남긴다. 반면 `nextLine()`은 줄 전체를 읽고 `\n`까지 소비해 커서를 다음 줄로 이동시킨다. 따라서 `nextInt()` 직후 `nextLine()`을 호출하면, 남아 있던 `\n`을 ‘빈 줄’로 해석해 즉시 반환함으로써 입력 누락이라는 치명적 버그를 유발한다. 이는 각 계층(OS TTY, JVM InputStream, Scanner Tokenizer)이 자신의 책임에 충실하게 동작한 결과이며, 해결하려면 레이어 간의 데이터 흐름을 명시적으로 제어해야 한다 — 특히, 토큰 기반 입력과 라인 기반 입력을 혼용할 때는 반드시 버퍼 정리(`nextLine()` 호출)가 필요하다.”**

---

## 📚 추천 학습 — 터미널 + I/O 마스터를 위한 길

1. **`man termios`** — TTY 설정, Canonical vs Raw Mode
2. **`stty -a`** — 현재 터미널 설정 확인
3. **Linux `strace -e read,write java YourApp`** — 실제 시스템 콜 추적
4. **OpenJDK 소스**: `Scanner.java` — `next()`, `nextLine()` 메서드 직접 비교
5. **《Advanced Programming in the UNIX Environment》** — Richard Stevens — TTY 장(chapter 18) 필독

---

필요하시면 **리눅스에서 strace로 실제로 read() 시스템 콜 추적 + Scanner 내부 리플렉션으로 버퍼 상태 실시간 확인하는 실습 코드**도 제공해 드립니다.

이제 진짜 **“시스템이 어떻게 돌아가는지 + Java API가 왜 이렇게 설계되었는지”** 를 동시에 아는 프로그래머가 되셨습니다. 🚀