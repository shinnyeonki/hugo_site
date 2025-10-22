---
title: markdown systex
aliases: 
tags: 
created: 2025-09-05T00:38:30+09:00
modified: 2025-10-07T23:35:38+09:00

---
아래는 **Markdown 기본 구문**(Basic Syntax)과 **확장 구문**(Extended Syntax)을 모두 포함한 테스트용 Markdown 파일입니다. 이 파일을 `.md` 확장자로 저장한 후, 다양한 Markdown 렌더러(예: VS Code, Obsidian, Typora, GitHub 등)에서 열어 각 기능이 제대로 작동하는지 확인할 수 있습니다.

# Markdown 전체 구문 테스트 문서

이 문서는 [Markdown 기본 구문](https://www.markdownguide.org/basic-syntax/)과 [확장 구문](https://www.markdownguide.org/extended-syntax/)을 모두 포함합니다.

---

## 1. 제목 (Headings)

# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6

또는 대체 문법:

Heading level 1
==

Heading level 2
--

---

## 2. 단락과 줄바꿈 (Paragraphs & Line Breaks)

이것은 첫 번째 단락입니다.

이것은 두 번째 단락입니다.

줄바꿈 테스트:  
두 칸 이상의 공백으로 줄바꿈 →  
다음 줄입니다.

또는 `<br>` 태그 사용:  
첫 줄<br>두 번째 줄

---

## 3. 강조 (Emphasis)

- **굵게**: `**굵게**` 또는 `__굵게__`
- *기울임*: `*기울임*` 또는 `_기울임_`
- ***굵게 + 기울임***: `***굵게 + 기울임***` 또는 `___굵게 + 기울임___`
- 단어 중간 강조: Love**is**bold, A*cat*meow

---

## 4. 인용문 (Blockquotes)

> 이것은 인용문입니다.

> 이것은  
> 여러 줄 인용문입니다.

> 인용문 안에
>
> > 중첩 인용문

> 인용문 안에 다른 요소:
>
> #### 인용 내 제목
>
> - 목록 항목
> - 또 다른 항목
>
> **굵게**, *기울임*, `코드`

---

## 5. 목록 (Lists)

### 순서 있는 목록 (Ordered)

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

### 순서 없는 목록 (Unordered)

- 항목 1
- 항목 2
  - 중첩 항목
  - 또 다른 중첩 항목
    - 더 깊은 중첩 항목
    - 더 깊은 중첩 항목
      - 더더 깊은 중첩 항목
      - 더더 깊은 중첩 항목
* 항목 (별표)
+ 항목 (플러스)

### 목록 내 요소

- 목록 항목
  다음 단락을 넣으려면 4칸 들여쓰기:
  
    이건 들여쓴 단락입니다.

- 코드 블록 포함:
        console.log("Hello, world!");

- 이미지 포함:
  ![Tux](https://mdg.imgix.net/assets/images/tux.png?auto=format&fit=clip&q=40&w=100)

---

## 6. 코드 (Code)

인라인 코드: `console.log("Hello")`

백틱 포함 코드: `` `code` ``

### 코드 블록 (기본 문법)

    <html>
      <body>
        <p>Hello</p>
      </body>
    </html>

### 코드 블록 (펜스 문법, 확장)

```json
{
  "name": "John",
  "age": 30
}
```

```python
def hello():
    print("Hello, world!")
```

---

## 7. 수평선 (Horizontal Rules)

---

***

___

---

## 8. 링크와 이미지 (기본 문법)

[Markdown Guide](https://www.markdownguide.org) 

![Tux](https://mdg.imgix.net/assets/images/tux.png?auto=format&fit=clip&q=40&w=100)

자동 URL 링크:  
https://www.example.com

비활성화된 자동 링크:  
`https://www.example.com`

---

## 9. 표 (Tables, 확장)

| 좌정렬 | 중앙정렬 | 우정렬 |
| :----- | :------: | -----: |
| 왼쪽   |  가운데  | 오른쪽 |
| 데이터 |  데이터  | 데이터 |

표 내 강조: **굵게**, *기울임*, `코드`

파이프 문자 이스케이프: &#124;

---

## 10. 각주 (Footnotes, 확장)

간단한 각주.[^3]  
긴 각주.[^2]

[^2]: 여러 단락을 가진 각주입니다.
    들여쓰면 같은 각주에 포함됩니다.
    `코드`도 가능합니다.

---

## 11. 제목 ID 및 앵커 링크 (Heading IDs, 확장)

### 이 제목은 ID를 가집니다 {#custom-id}

[위 제목으로 이동](#custom-id)

---

## 12. 정의 목록 (Definition Lists, 확장)

사과  
: 달콤하고 바삭한 과일.

오렌지  
: 비타민 C가 풍부한 감귤류.  
: 주스로도 즐깁니다.

---

## 13. 취소선 (Strikethrough, 확장)

~~이 문장은 취소되었습니다~~.

---

## 14. 작업 목록 (Task Lists, 확장)

- [x] 완료된 작업
- [ ] 미완료 작업
- [ ] 또 다른 미완료 작업

---

## 15. 이모지 (Emoji, 확장)

복사-붙여넣기: 🎉🚀

이모지 쇼트코드: :smile: :rocket: :tada:

---

## 16. 하이라이트 (Highlight, 확장)

==이 텍스트는 하이라이트됩니다==.

또는 HTML: <mark>하이라이트</mark>

---

## 17. 첨자와 위첨자 (Subscript/Superscript, 확장)

- 아랫첨자: H~2~O  
  또는 HTML: H<sub>2</sub>O

- 윗첨자: E = mc^2^  
  또는 HTML: E = mc<sup>2</sup>

---

## 18. 자동 URL 링크 (Automatic URL Linking, 확장)

https://www.markdownguide.org

비활성화: `https://www.markdownguide.org`

---

> ✅ 이 파일은 Markdown 기본 및 확장 구문을 모두 테스트하기 위해 작성되었습니다.  
> 사용 중인 Markdown 렌더러에 따라 일부 확장 기능이 지원되지 않을 수 있습니다.

---

HTML 태그도 사용할 수 있습니다:

<p style="color: blue;">이 텍스트는 파란색입니다.</p>

<!-- 이건 주석입니다 -->

---

수식은 일부 도구에서 지원됩니다.

$$
E = mc^2
$$

인라인 수식: $a^2 + b^2 = c^2$



### link to heading
`[보여질 이름](파일경로#헤더 이름)`
[수식 테스트](../수식%20테스트.md)

### footnote (각주)

이것은 간단한 각주[^3]이고, 이것은 더 긴 각주입니다.[^4]

[^3]: 이것은 첫 번째 각주입니다.
[^4]: 여러 단락과 코드가 포함된 각주입니다.
    각주에 단락을 포함시키려면 들여쓰기를 해야 합니다.
    `{ 내 코드 }`
    원하는 만큼 단락을 추가할 수 있습니다.

#### 설명:

- `[^1]`과 `[^bignote]`는 각주의 레퍼런스(참조 번호 또는 이름)입니다.
- 각주 내용은 문서 맨 아래에서 정의되며, `[^레퍼런스]:` 형식으로 시작합니다.
- 여러 단락을 각주 안에 넣고 싶다면 **들여쓰기**(indent)를 해야 합니다.
- 코드나 다른 형식도 각주 안에 포함시킬 수 있습니다.

