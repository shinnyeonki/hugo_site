---
title: spring View 구현체
aliases: 
tags:
  - spring
  - reference
created: 2025-03-10T00:27:00+09:00
modified: 2025-03-10T00:27:00+09:00

---
스프링 MVC의 **`View`**는 **모델 데이터를 클라이언트에게 렌더링하는 최종 형식**을 결정하는 인터페이스입니다.  
아래에서 언급된 21개의 `View` 구현체를 **목적별로 체계적으로 정리**했습니다:

---

### 1. **기본 추상 클래스**
#### 1.1 **`AbstractView`**
- **역할**: **모든 뷰 구현체의 기본 추상 클래스**.
- **특징**:
  - `render()` 메서드를 구현해 모델 데이터를 응답으로 변환합니다.
  - 커스텀 뷰를 만들 때 상속받아 사용합니다.
- **사용 예시**:
  ```java
  public class CustomCsvView extends AbstractView {
      @Override
      protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {
          // CSV 생성 로직
      }
  }
  ```

---

### 2. **피드(Feed) 뷰**
#### 2.1 **`AbstractAtomFeedView`**
- **역할**: **Atom 형식의 피드**를 생성합니다.
- **특징**:
  - Atom 1.0 스펙을 준수하는 XML 피드를 생성합니다.
  - `Rome` 라이브러리를 내부적으로 사용합니다.
- **예시**: 블로그 글 목록을 Atom 피드로 제공.

#### 2.2 **`AbstractRssFeedView`**
- **역할**: **RSS 형식의 피드**를 생성합니다.
- **특징**:
  - RSS 2.0 스펙을 준수하는 XML 피드를 생성합니다.
  - `Rome` 라이브러리를 사용합니다.
- **예시**: 뉴스 사이트의 RSS 피드.

#### 2.3 **`AbstractFeedView`**
- **역할**: **Atom/RSS 피드의 공통 로직**을 제공합니다.
- **특징**:
  - `AbstractAtomFeedView`와 `AbstractRssFeedView`의 부모 클래스입니다.

---

### 3. **JSON/XML 뷰**
#### 3.1 **`MappingJackson2JsonView`**
- **역할**: **JSON 형식의 응답**을 생성합니다.
- **특징**:
  - Jackson 2 라이브러리를 사용해 모델 데이터를 JSON으로 변환합니다.
  - `@ResponseBody` 대신 뷰를 통해 JSON을 반환할 때 사용됩니다.
- **예시**:
  ```java
  @Bean
  public View jsonView() {
      return new MappingJackson2JsonView();
  }
  ```

#### 3.2 **`MappingJackson2XmlView`**
- **역할**: **XML 형식의 응답**을 생성합니다.
- **특징**:
  - Jackson 2의 XML 확장을 사용해 모델 데이터를 XML로 변환합니다.
- **예시**: 레거시 시스템과의 XML 통신.

#### 3.3 **`MarshallingView`**
- **역할**: **XML/JSON 변환을 위한 마샬링 뷰**.
- **특징**:
  - JAXB, Castor 등 다양한 마샬러를 지원합니다.
  - `Marshaller` 인터페이스를 구현한 라이브러리를 사용합니다.

---

### 4. **PDF 뷰**
#### 4.1 **`AbstractPdfView`**
- **역할**: **PDF 문서**를 생성합니다.
- **특징**:
  - `iText` 라이브러리를 사용해 PDF를 생성합니다.
  - 모델 데이터를 테이블, 텍스트 등으로 렌더링합니다.
- **예시**:
  ```java
  public class InvoicePdfView extends AbstractPdfView {
      @Override
      protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer) {
          // PDF 문서 생성 로직
      }
  }
  ```

#### 4.2 **`AbstractPdfStamperView`**
- **역할**: **기존 PDF 템플릿에 데이터 채우기**.
- **특징**:
  - `iText`의 `PdfStamper`를 사용해 정적 PDF 양식을 동적으로 채웁니다.
  - 계약서, 청구서 등 고정된 양식에 데이터를 입력할 때 사용됩니다.

---

### 5. **엑셀 뷰**
#### 5.1 **`AbstractXlsView`**
- **역할**: **레거시 Excel(.xls) 파일** 생성.
- **특징**:
  - `Apache POI` 라이브러리를 사용해 Excel 97-2003 형식(.xls)을 생성합니다.
- **예시**: 재무 데이터 보고서.

#### 5.2 **`AbstractXlsxView`**
- **역할**: **Excel 2007+ 형식(.xlsx) 파일** 생성.
- **특징**:
  - `Apache POI`의 `XSSF` API를 사용해 최신 Excel 형식을 지원합니다.

#### 5.3 **`AbstractXlsxStreamingView`**
- **역할**: **대용량 Excel 파일 스트리밍**.
- **특징**:
  - 메모리 사용을 최소화하기 위해 데이터를 스트리밍 방식으로 작성합니다.
  - 수십만 행의 데이터를 처리할 때 유용합니다.

---

### 6. **템플릿 뷰**
#### 6.1 **`FreeMarkerView`**
- **역할**: **FreeMarker 템플릿**을 렌더링합니다.
- **특징**:
  - `FreeMarkerViewResolver`와 함께 사용됩니다.
  - HTML, 텍스트 등 다양한 형식을 지원합니다.
- **예시**: 동적 HTML 페이지 생성.

#### 6.2 **`GroovyMarkupView`**
- **역할**: **Groovy 템플릿**을 렌더링합니다.
- **특징**:
  - Groovy Markup Template을 사용해 뷰를 생성합니다.
  - 간결한 문법으로 XML/HTML을 생성합니다.

#### 6.3 **`ScriptTemplateView`**
- **역할**: **스크립트 기반 템플릿**(예: React, Nashorn)을 지원합니다.
- **특징**:
  - JavaScript 엔진을 사용해 뷰를 렌더링합니다.
  - 서버 측에서 React 컴포넌트를 렌더링할 때 사용됩니다.

---

### 7. **JSP/리소스 뷰**
#### 7.1 **`InternalResourceView`**
- **역할**: **JSP 파일**을 렌더링합니다.
- **특징**:
  - `InternalResourceViewResolver`와 함께 사용됩니다.
  - `JstlView`의 부모 클래스입니다.

#### 7.2 **`JstlView`**
- **역할**: **JSTL 태그를 지원하는 JSP 뷰**.
- **특징**:
  - JSTL의 `<fmt:message>`, `<c:forEach>` 등을 사용할 수 있습니다.

---

### 8. **특수 목적 뷰**
#### 8.1 **`RedirectView`**
- **역할**: **HTTP 리다이렉트**를 수행합니다.
- **특징**:
  - `redirect:/newPath` 또는 외부 URL(`https://example.com`)로 이동합니다.
  - Post/Redirect/Get 패턴 구현에 사용됩니다.
- **예시**:
  ```java
  return new ModelAndView(new RedirectView("/home"));
  ```

#### 8.2 **`XsltView`**
- **역할**: **XML 데이터를 XSLT로 변환**합니다.
- **특징**:
  - XML 데이터와 XSLT 스타일시트를 결합해 HTML 등을 생성합니다.

---

### 📌 **요약**
| 뷰 클래스                  | 주요 형식          | 사용 사례                          |
|---------------------------|-------------------|-----------------------------------|
| `MappingJackson2JsonView` | JSON              | REST API 응답                     |
| `AbstractPdfView`         | PDF               | 계약서, 보고서 생성               |
| `AbstractXlsxView`        | Excel(.xlsx)      | 데이터 분석 리포트                 |
| `FreeMarkerView`          | HTML              | 동적 웹 페이지                    |
| `RedirectView`            | HTTP 리다이렉트    | Post-Redirect-Get 패턴            |

---

### 💡 **핵심 포인트**
- **JSON/XML**은 **`MappingJackson2JsonView`** 로 처리합니다.
- **PDF/Excel**은 **`AbstractPdfView`**, **`AbstractXlsxView`** 를 확장해 구현합니다.
- **리다이렉트**는 **`RedirectView`** 를 사용합니다.
- **템플릿 엔진**은 각각 전용 뷰 클래스(예: `FreeMarkerView`)를 사용합니다.