import re

def clean_markdown_for_search(content: str) -> str:
    """
    마크다운 텍스트를 검색 인덱싱에 최적화된 순수 텍스트로 정제합니다.
    '보호-처리-복원' 전략을 사용하여 코드(`...` 및 ```...```, ~~~...~~~)를 안전하게 격리하고,
    나머지 마크다운 문법만 제거하여 의미 있는 콘텐츠만 남깁니다.
    """
    if not content:
        return ""

    protected_fragments = []

    def protect_fragment(match):
        fragment = match.group(0)
        # Use unprintable control characters for robust placeholders
        placeholder = f"\x02PROTECTED{len(protected_fragments)}\x03"
        protected_fragments.append(fragment)
        return placeholder

    # 1단계: 코드 블록 및 인라인 코드 보호
    content = re.sub(r'^\s*(?:> ?)*```[\s\S]+?^\s*(?:> ?)*```\s*$', protect_fragment, content, flags=re.MULTILINE)
    content = re.sub(r'^\s*(?:> ?)*~~~[\s\S]+?^\s*(?:> ?)*~~~\s*$', protect_fragment, content, flags=re.MULTILINE)
    content = re.sub(r'`[^`]+?`', protect_fragment, content)

    # 2단계: Frontmatter 제거
    content = re.sub(r'\A---[\s\S]+?^---\s*', '', content, flags=re.MULTILINE)

    # 3단계: HTML 태그 제거
    content = re.sub(r'<[^>]+>', '', content)

    # 4단계: 테이블 관련 문법 제거
    content = re.sub(r'^\s*\|?[-|: \t]+-[-|: \t]*\|?\s*$', '', content, flags=re.MULTILINE)
    content = content.replace('|', ' ')

    # 5단계: 이미지 및 링크 제거
    content = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', content) # 이미지
    content = re.sub(r'\[([^\]]+)\]\([^\)]*\)', r'\1', content) # 링크

    # 6단계: 헤더, 리스트, 인용문 등 라인 시작 문법을 반복적으로 제거
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        while True:
            new_line = re.sub(r'^\s*([#>*+-]|\d+\.)\s*', '', line)
            if new_line == line:
                break
            line = new_line
        cleaned_lines.append(line)
    content = '\n'.join(cleaned_lines)

    # 7단계: 나머지 마크다운 문법 제거
    content = re.sub(r'(\*\*|__)(.*?)\1', r'\2', content) # Bold
    content = re.sub(r'(\*|_)(.*?)\1', r'\2', content) # Italic
    content = re.sub(r'~~(.*?)~~', r'\1', content) # Strikethrough
    content = re.sub(r'^\[\^([^\]]+)\]:.*', '', content) # Footnote definition
    content = re.sub(r'\[\^([^\]]+)\]', '', content) # Footnote reference
    content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE) # Horizontal rules

    # 8단계: 보호된 코드 조각 복원 및 정제
    for i, fragment in enumerate(protected_fragments):
        placeholder = f"\x02PROTECTED{i}\x03"
        cleaned_fragment = fragment

        if '\n' in fragment: # 블록 코드로 간주
            lines = fragment.strip().split('\n')
            lines = lines[1:-1] # 펜스 제거
            lines = [re.sub(r'^\s*(?:> ?)*', '', l) for l in lines] # '>' 제거
            cleaned_fragment = '\n'.join(lines)
        else: # 인라인 코드로 간주
            cleaned_fragment = fragment.strip('`')
        
        content = content.replace(placeholder, " " + cleaned_fragment + " ")

    # 9단계: 최종 정제
    content = re.sub(r'\s+', ' ', content)
    return content.strip()


# --- 테스트용 예시 실행 ---
if __name__ == "__main__":
    sample_md = """
---
title: frontmatter 테스트
---

# 제목입니다

이것은 **굵은 글씨**와 *기울임체* 그리고 ~~취소선~~입니다.  
`inline_code` 도 있고, 아래는 코드 블록입니다:

인라인 코드에 마크다운 문법이 포함될 수도 있습니다: `**bold**`, `_italic_`, `~~strikethrough~~`.  하지만 이것들은 무시되어야 합니다 즉 마크다운 문법으로 평가되지 않습니다

```python
def hello():
    print("hello world")

    코드 블럭 안에 마크다운 문법도 있습니다: **bold**, _italic_, ~~strikethrough~~. 하지만 이것들은 무시되어야 합니다 즉 마크다운 문법으로 평가되지 않습니다
```

```
언어 없는 코드 블락
```

4. HTML 엔티티/특수 문자
	
&lt; &gt; &amp; &quot; &#39;


5. HTML 주석:
<!-- this should be removed -->

9. 각주 (멀티라인):
[^3]:
    This is a
    multi-line footnote.

8. 불완전한 마크다운:
**unclosed bold
*unclosed italic*
9. 이상한 표
| Header1 | Header2 |
|---------|---------|
| Data1   | 


10. 테이블 내부에 코드와 링크 섞임:
| Col1 | Col2 |
|------|------|
| `code` | [link](url) |

* 리스트 항목 1
* 리스트 항목 2

1. 번호 매기기 항목 1
2. 번호 매기기 항목 2

> 인용문입니다.
> 두 줄 이상일 수도 있습니다.
> > 중첩 인용문도 가능합니다.
> > 중첩 인용문 안에 코드 블록도 가능합니다: `nested_code`
> > ```python
> > def nested():
> >     pass
> > ```
> 인용문 내부에 리스트가 존재할 수 있습니다
> - 인용문 리스트 항목
> - 인용문 리스트 항목 2
> 1. 인용문 번호 매기기 항목 1
> 2. 인용문 번호 매기기 항목 2
>   1. 중첩된 번호 매기기 항목 1
>   2. 중첩된 번호 매기기 항목 2


![이미지](https://example.com/img.png)

링크: [OpenAI](https://openai.com)

각주 예시:
hello[^1]
[^1]: 이것은 각주입니다.


수식 예시: $E=mc^2$

---
`#hello`
`_hello_`
`*hello*`
`~~hello~~`
`<hello>`
"hello_hello"

---

### 표 예시:

| 표 헤더 1| 표는<br>줄바꿈이 될 수도 있어요 | 표안에서도 마크다운 문법이 있을 수 있어요 |
|-------------------------------|----------------------------------------|----------|
| **`id`** | `android:id="@/id/submit_button"` | `R.id.submit_button` |
| **`string`** | `res/values/strings.xml` | 텍스트 내용 관리, 다국어 지원 |

"""
    print(clean_markdown_for_search(sample_md))
