import re

def clean_markdown_for_search(content: str) -> str:
    """
    마크다운 텍스트를 검색 인덱싱에 최적화된 순수 텍스트로 정제합니다.
    '보호-처리-복원' 전략을 사용하여 코드(`...` 및 ```...```, ~~~...~~~)를 안전하게 격리하고,
    나머지 마크다운 문법만 제거하여 의미 있는 콘텐츠만 남깁니다.
    플레이스홀더를 마크다운 문법에 영향을 받지 않는 문자열로 변경하여 안정성을 높였습니다.
    테이블 구분선 제거를 추가하고, 코드 블록 패턴을 더 유연하게 수정했습니다.
    """
    if not content:
        return ""

    protected_fragments = []

    def protect_fragment(match):
        fragment = match.group(0)
        placeholder = f"PROTECTEDFRAGMENT{len(protected_fragments)}END"
        protected_fragments.append(fragment)
        return placeholder

    # 1단계: 코드 보호 — 인라인 코드와 코드 블록을 플레이스홀더로 대체
    # 먼저 ~~~ 코드 블록 처리
    content = re.sub(r'^\s*~~~[a-zA-Z0-9+-]*\s*\n[\s\S]*?^\s*~~~', protect_fragment, content, flags=re.MULTILINE)
    # 다음 ``` 코드 블록 처리 (멀티라인, 언어 식별자 포함 가능, 공백 허용)
    content = re.sub(r'^\s*```[a-zA-Z0-9+-]*\s*\n[\s\S]*?^\s*```', protect_fragment, content, flags=re.MULTILINE)
    # 인라인 코드: 단순 처리 (`code`)
    content = re.sub(r'`[^`]+?`', protect_fragment, content)

    # 2단계: 마크다운 문법 제거 (코드는 이미 보호됨)

    # Frontmatter (YAML) 제거 — 정확히 문서 시작에만 허용
    content = re.sub(r'^---\s*\n(?:.*\n)*?---\s*\n?', '', content, count=1, flags=re.MULTILINE)

    # 이미지: ![alt](url) → alt (alt가 비어 있으면 제거)
    content = re.sub(r'!\[([^\]]*?)\]\([^)]*?\)', lambda m: m.group(1) if m.group(1).strip() else '', content)

    # 링크: [text](url) → text
    content = re.sub(r'\[([^\]]+?)\]\([^)]*?\)', r'\1', content)

    # 헤더, 리스트, 인용문, 태스크 리스트 등 라인 시작 문법 제거
    content = re.sub(r'^\s*([#>*+-]|\d+\.)\s+', '', content, flags=re.MULTILINE)

    # 테이블: 파이프(|)를 공백으로 대체 → 셀 내용은 유지
    content = content.replace('|', ' ')

    # 테이블 구분선 제거 (--- 또는 :--: 등)
    content = re.sub(r'^\s*[-:=]+(?:\s*[-:=]+)*\s*$', '', content, flags=re.MULTILINE)

    # 볼드/이탤릭/취소선 — 단어 경계를 고려하여 손상 방지
    # __bold__ 또는 **bold**
    content = re.sub(r'(\*\*|__)(.+?)\1', r'\2', content)
    # _italic_ — 단어 경계 확인 (my_var는 건드리지 않음)
    content = re.sub(r'\b_([^_]+?)_\b', r'\1', content)
    # *italic* — 단어 경계 없이도 안전하게
    content = re.sub(r'\*([^*]+?)\*', r'\1', content)
    # ~~strikethrough~~
    content = re.sub(r'~~([^~]+?)~~', r'\1', content)

    # 수평선 제거
    content = re.sub(r'^\s*[-*_]{3,}\s*$', '', content, flags=re.MULTILINE)

    # HTML 태그 제거
    content = re.sub(r'<[^>]+>', '', content)

    # 3단계: 보호된 코드 조각 복원 — 코드 문법 제거, 내용만 추출
    for i, fragment in enumerate(protected_fragments):
        cleaned = fragment
        # 코드 블록: ```lang\n...\n``` 또는 ~~~lang\n...\n~~~ → ...
        if fragment.lstrip().startswith(('```', '~~~')):
            # 공백과 펜스 제거
            lines = fragment.split('\n')
            if len(lines) >= 2:
                # 첫 줄: ```lang 또는 ~~~lang → 제거
                # 마지막 줄: ``` 또는 ~~~ → 제거
                inner = '\n'.join(lines[1:-1]).strip()
                cleaned = inner
            else:
                cleaned = ''
        elif fragment.startswith('`') and fragment.endswith('`'):
            # 인라인 코드: `code` → code
            cleaned = fragment[1:-1]
        # 플레이스홀더 교체
        placeholder = f"PROTECTEDFRAGMENT{i}END"
        content = content.replace(placeholder, " " + cleaned + " ")

    # 4단계: 최종 정제
    # 연속된 공백/탭/개행 → 단일 공백
    content = re.sub(r'\s+', ' ', content)
    return content.strip()


# --- 테스트용 예시 실행 ---
if __name__ == "__main__":
    sample_md = """

---
title: Example
---

# 제목입니다

이것은 **굵은 글씨**와 *기울임체* 그리고 ~~취소선~~입니다.  
`inline_code` 도 있고, 아래는 코드 블록입니다:

```python
def hello():
    print("hello world")
```

* 리스트 항목 1
* 리스트 항목 2

> 인용문입니다.

![이미지](https://example.com/img.png)

링크: [OpenAI](https://openai.com)

| 헤더1 | 헤더2 |
| --- | --- |
| 값1  | 값2  |

수식 예시: $E=mc^2$

---
`#hello`
`_hello_`
`*hello*`
`~~hello~~`
`<hello>`
"hello_hello"

---

### 안드로이드 리소스 식별자 종류 및 사용 사례 종합표

| 리소스 유형<br>(Resource Type) | 정의 위치<br>(Resource Directory / File) | 주요 목적 | XML에서 사용 예 | 코드에서 참조 방식 | 실제 사용 사례 |
|-------------------------------|----------------------------------------|----------|------------------|---------------------|----------------|
| **`id`** | 레이아웃 XML 내부 (`android:id`) | 뷰를 코드에서 식별 | `android:id="@+id/submit_button"` | `R.id.submit_button` | `findViewById(R.id.submit_button)`로 버튼 제어 |
| **`string`** | `res/values/strings.xml` | 텍스트 내용 관리, 다국어 지원 | `android:text="@string/app_name"` | `R.string.app_name` | `getString(R.string.welcome)`로 메시지 표시 |
| **`color`** | `res/values/colors.xml` | 색상 값 정의 및 재사용 | `android:textColor="@color/primary"` | `R.color.primary` | `ContextCompat.getColor(context, R.color.error)` |
| **`dimen`** | `res/values/dimens.xml` | 여백, 크기, 글자 크기 정의 | `android:padding="@dimen/activity_margin"` | `R.dimen.activity_margin` | `resources.getDimension(R.dimen.text_size)` |
| **`style`** | `res/values/styles.xml` | 뷰 또는 앱 전체의 디자인 규칙 정의 | `style="@style/CustomButton"` | `R.style.CustomButton` | 액티비티 테마: `android:theme="@style/Theme.MyApp"` |
| **`layout`** | `res/layout/` 폴더 내 XML 파일 | 화면 UI 구조 정의 | — (파일 자체가 리소스) | `R.layout.activity_main` | `setContentView(R.layout.activity_main)` |
"""
    print(clean_markdown_for_search(sample_md))

