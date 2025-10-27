---
title: hugo template 시스템 경우의 수로 비교한 자세한 설명
resource-path: hugo template 시스템 경우의 수로 비교한 자세한 설명.md
keywords:
tags:
  - hugo
series: hugo
series_weight: 5
date: 2025-10-27T15:27:43+09:00
lastmod: 2025-10-27T18:04:10+09:00
---
### 전제

hugo 는 기본적으로 md 파일을 html 로 렌더링(컴파일) 하여 정적인 사이트를 만들수 있는 도구이다 이중 template 관련 개념이 복잡하여 이를 제대로 정리한다  
md->html 변환 과정중 적절한 template 를 선택하여 적절한 html 로 만들때 사용하는 것이 template 이다
  
[hugo 기본 전제](hugo%20기본%20전제.md) 를 먼저 보고 오자

### 우선순위
일단 이해가 안되더라도 이것부터 보고 넘어가자 이 순서대로 우선순위가 적용된다
1. 커스텀 레이아웃 프런트머터에 설정된`layout`값
2. [페이지 종류(Page kinds)](https://gohugo.io/methods/page/kind/) `home`,`section`,`taxonomy`,`term`,`page`중 하나
3. 표준 레이아웃 1 `list`또는`single` 
4. 출력 형식(Output format) `html`,`rss`등
5. 표준 레이아웃 2 `all`
6. 언어(Language) `en`등
7. 미디어 타입(Media type) `text/html`등
8. [페이지 경로(Page path)](https://gohugo.io/methods/page/path/) 예:`/blog/mypost`
9. 타입(Type) 프런트머터에 설정된`type`값

### 모든 경우의 수로 알아본 template 선택 시스템









### 실제 코드 template 우선순위 판단 코드 분석
이 시스템은 크게 **주요 점수(`w1`)**와 두 단계의 **동점자 처리 점수(`w2`, `w3`)**로 나뉩니다.

#### `w1` 점수: 주요 우선순위표 (The Main Scoreboard)

**`w1`은 템플릿의 핵심적인 우선순위를 결정하는 가장 중요한 점수입니다.** 이 점수가 높은 템플릿이 거의 항상 선택됩니다. 점수는 아래 항목들이 일치할 때마다 **누적**됩니다.

*(모든 유효한 템플릿은 기본 점수 1점으로 시작합니다)*

| 우선순위 | 추가 점수 | 일치 조건 (Attribute Match) | 코드 내 상수 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **+6점** | **커스텀 `layout`** (Front Matter) | `weightcustomLayout` | 페이지의 Front Matter에 `layout: "mylayout"`이 있고, 템플릿명이 `mylayout.html`일 때. **가장 강력한 점수.** |
| **1** | **+6점** | **Render Hook 종류** (Variant 1) | `weightVariant1` | Render Hook(`_markup`) 템플릿이 렌더링 대상의 종류와 일치할 때. (예: 링크 렌더링 시 `render-link.html`) |
| **2** | **+5점** | **페이지 `Kind`** | `weightKind` | 페이지의 종류(`home`, `section`, `page` 등)가 템플릿명과 일치할 때. (예: 홈페이지가 `home.html`을 만난 경우) |
| **3** | **+4점** | **표준 `Layout`** (`single`, `list`) | `weightLayoutStandard` | 페이지의 표준 레이아웃(`single`, `list`)이 템플릿명과 일치할 때. (예: 단일 페이지가 `single.html`을 만난 경우) |
| **3** | **+4점** | **`Output Format`** | `weightOutputFormat` | 페이지의 출력 형식(`rss`, `json` 등)이 템플릿명과 일치할 때. (예: RSS 피드가 `*.rss.xml`을 만난 경우) |
| **3** | **+4점** | **Render Hook 세부사항** (Variant 2) | `weightVariant2` | Render Hook이 렌더링 대상의 세부 속성과 일치할 때. (예: Go 코드 블록이 `render-codeblock-go.html`을 만난 경우) |
| **4** | **+2점** | **`all` 레이아웃** | `weightLayoutAll` | 템플릿명이 만능 레이아웃인 `all.html`일 때. |
| **5** | **+1점** | **`Language`** | `weightLang` | 페이지의 언어(`en`, `ko` 등)가 템플릿명과 일치할 때. |
| **5** | **+1점** | **`Media Type`** | `weightMediaType` | 페이지의 미디어 타입(`text/html` 등)이 템플릿의 확장자와 일치할 때. (예: HTML 페이지가 `.html` 템플릿을 만난 경우) |
| **기본** | **+1점** | (모든 유효 템플릿) | `w.w1++` | 실격 처리 라운드를 통과한 모든 템플릿이 기본으로 받는 점수. |

---

#### `w2` 점수: 1차 동점자 처리표 (The First Tie-Breaker)

**`w2`는 `w1` 점수가 동일할 때 사용되는 첫 번째 동점자 처리 점수입니다.** 이 점수는 **경로 특이성(Path Specificity)**과 함께 사용되어, "핵심적인 속성이 일치하는 템플릿이 경로 싸움에서 약간의 우위를 가진다"는 의미를 부여합니다. `w2` 점수는 누적되지 않고, 아래 조건에 따라 **값이 설정**됩니다.

| 우선순위 | `w2` 설정값 | 일치 조건 (Attribute Match) | 코드 내 상수 | 역할 및 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **2점** | **커스텀 `layout`** (Front Matter) | `weight2Group2` | `layout` Front Matter로 지정된, 가장 구체적인 종류의 일치가 발생했음을 나타냅니다. |
| **2** | **1점** | **페이지 `Kind`** 또는 **표준 `Layout`** | `weight2Group1` | `home`, `section`, `single`, `list`, `all` 등 일반적이지만 중요한 속성이 일치했음을 나타냅니다. |

---

#### `w3` 점수: 2차 동점자 처리표 (The Final Tie-Breaker)

**`w3`는 `w1` 점수와 경로 특이성까지 모두 동일한, 아주 드문 경우에 사용되는 최종 동점자 처리 점수입니다.** `w3`는 부가적인 속성들이 얼마나 많이 일치하는지를 세는 **카운터** 역할을 하며, 점수는 **누적**됩니다.

| 추가 점수 | 일치 조건 (Attribute Match) | 코드 내 상수 | 역할 및 설명 |
| :--- | :--- | :--- | :--- |
| **+1점** | **`Language`** | `weight3` | 페이지와 템플릿의 언어가 일치하면 1점 추가. |
| **+1점** | **`Output Format`** | `weight3` | 페이지와 템플릿의 출력 형식이 일치하면 1점 추가. |
| **+1점** | **`Media Type`** | `weight3` | 페이지와 템플릿의 미디어 타입이 일치하면 1점 추가. |

---

#### 종합적인 결정 과정 요약

1.  **`w1` 점수 계산**: 모든 후보 템플릿의 `w1` 점수를 계산합니다.
2.  **최고 `w1` 점수 확인**: `w1` 점수가 가장 높은 템플릿(들)을 찾습니다.
3.  **동점자 처리 1 (경로)**: 최고 점수 템플릿이 여러 개일 경우, **페이지 경로와 가장 가까운(더 구체적인) 템플릿**이 승리합니다. (`w2` 점수는 이 과정에 영향을 줄 수 있습니다.)
4.  **동점자 처리 2 (`w3`)**: 경로까지 완전히 동일한 템플릿이 있다면, **`w3` 점수가 더 높은 템플릿**이 최종 승자가 됩니다.
