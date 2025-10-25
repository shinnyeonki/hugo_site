---
title: spring ViewResolver 구현체
resource-path: 02.inbox/spring ViewResolver 구현체.md
aliases:
tags:
  - spring
  - reference
date: 2025-03-10T00:23:00+09:00
lastmod: 2025-03-10T00:23:00+09:00
---
스프링 MVC의 **`ViewResolver`** 는 **뷰 이름을 실제 `View` 객체로 변환**하는 역할을 합니다.  
다양한 구현체가 있으며, 각각의 특징과 사용 사례를 체계적으로 정리했습니다:

---

### 1. **`AbstractCachingViewResolver`**
- **역할**: **뷰 캐싱 기능을 제공하는 추상 클래스**.
- **특징**:
  - 뷰 객체를 캐시하여 **반복적인 뷰 생성을 방지**합니다.
  - 하위 클래스(예: `UrlBasedViewResolver`)가 캐싱 로직을 재사용할 수 있도록 합니다.
- **사용 예시**:  
  `InternalResourceViewResolver`가 이 클래스를 상속받아 JSP 뷰 캐싱을 처리합니다.

---

### 2. **`AbstractTemplateViewResolver`**
- **역할**: **템플릿 기반 뷰(예: JSP, Thymeleaf)를 처리하는 추상 클래스**.
- **특징**:
  - 템플릿 엔진 설정(예: `prefix`, `suffix`)을 공통으로 관리합니다.
  - `UrlBasedViewResolver`와 함께 사용됩니다.
- **사용 예시**:  
  `FreeMarkerViewResolver`가 이 클래스를 상속받아 FreeMarker 템플릿을 처리합니다.

---

### 3. **`BeanNameViewResolver`**
- **역할**: **스프링 빈 이름으로 뷰를 조회**합니다.
- **특징**:
  - 뷰 이름이 스프링 빈 이름과 일치하는 `View` 객체를 찾아 반환합니다.
  - 커스텀 뷰(예: PDF 생성 뷰)를 빈으로 등록해 사용할 때 유용합니다.
- **예시**:
  ```java
  @Bean
  public View pdfView() {
      return new AbstractPdfView() { // PDF 뷰 구현
          @Override
          protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer) {
              // PDF 생성 로직
          }
      };
  }
  ```

---

### 4. **`ContentNegotiatingViewResolver`**
- **역할**: **요청의 `Accept` 헤더 또는 쿼리 파라미터에 따라 뷰를 선택**합니다.
- **특징**:
  - 클라이언트가 원하는 형식(JSON, XML, HTML 등)에 맞는 뷰를 반환합니다.
  - 내부적으로 다른 `ViewResolver`를 조합해 동작합니다.
- **예시**:
  ```java
  @Configuration
  public class WebConfig implements WebMvcConfigurer {
      @Override
      public void configureViewResolvers(ViewResolverRegistry registry) {
          registry.enableContentNegotiation(new JsonView(), new XmlView());
      }
  }
  ```

---

### 5. **`FreeMarkerViewResolver`**
- **역할**: **FreeMarker 템플릿**을 처리합니다.
- **특징**:
  - 뷰 이름을 FreeMarker 템플릿 파일 경로(예: `views/user.ftl`)로 변환합니다.
  - `FreeMarkerConfigurer`와 함께 설정됩니다.
- **예시**:
  ```java
  @Bean
  public FreeMarkerViewResolver freeMarkerViewResolver() {
      FreeMarkerViewResolver resolver = new FreeMarkerViewResolver();
      resolver.setPrefix("/WEB-INF/views/");
      resolver.setSuffix(".ftl");
      return resolver;
  }
  ```

---

### 6. **`GroovyMarkupViewResolver`**
- **역할**: **Groovy 템플릿**을 처리합니다.
- **특징**:
  - Groovy Markup Template(예: `user.tpl`)을 렌더링합니다.
  - `GroovyMarkupConfigurer`로 템플릿 설정을 관리합니다.
- **예시**:
  ```java
  @Bean
  public GroovyMarkupViewResolver groovyViewResolver() {
      GroovyMarkupViewResolver resolver = new GroovyMarkupViewResolver();
      resolver.setPrefix("/views/");
      resolver.setSuffix(".tpl");
      return resolver;
  }
  ```

---

### 7. **`InternalResourceViewResolver`**
- **역할**: **JSP 뷰**를 처리하는 가장 일반적인 리졸버.
- **특징**:
  - 뷰 이름을 JSP 파일 경로(예: `/WEB-INF/views/home.jsp`)로 변환합니다.
  - `prefix`와 `suffix`로 경로를 설정합니다.
- **예시**:
  ```java
  @Bean
  public InternalResourceViewResolver viewResolver() {
      InternalResourceViewResolver resolver = new InternalResourceViewResolver();
      resolver.setPrefix("/WEB-INF/views/");
      resolver.setSuffix(".jsp");
      return resolver;
  }
  ```

---

### 8. **`ResourceBundleViewResolver`**
- **역할**: **프로퍼티 파일**로 뷰를 정의합니다.
- **특징**:
  - `views.properties` 파일에 뷰 이름과 클래스 정보를 저장합니다.
  - 다국어 뷰 또는 외부 설정이 필요한 경우에 사용됩니다.
- **예시**:
  ```properties
  # views.properties
  home.class=org.springframework.web.servlet.view.JstlView
  home.url=/WEB-INF/views/home.jsp
    ```


---

### 9. **`ScriptTemplateViewResolver`**
- **역할**: **스크립트 기반 템플릿**(예: Nashorn, React)을 처리합니다.
- **특징**:
  - JavaScript 또는 다른 스크립트 엔진으로 뷰를 렌더링합니다.
  - `ScriptTemplateConfigurer`로 스크립트 엔진을 설정합니다.
- **예시**:
  ```java
  @Bean
  public ScriptTemplateViewResolver scriptViewResolver() {
      ScriptTemplateViewResolver resolver = new ScriptTemplateViewResolver();
      resolver.setPrefix("templates/");
      resolver.setSuffix(".jsx");
      return resolver;
  }
  ```

---

### 10. **`UrlBasedViewResolver`**
- **역할**: **URL 기반 뷰**를 직접 매핑합니다.
- **특징**:
  - 뷰 이름을 URL 경로로 직접 변환합니다.
  - `InternalResourceViewResolver`의 부모 클래스입니다.
- **예시**:
  ```java
  @Bean
  public UrlBasedViewResolver urlBasedViewResolver() {
      UrlBasedViewResolver resolver = new UrlBasedViewResolver();
      resolver.setViewClass(JstlView.class);
      resolver.setPrefix("/WEB-INF/views/");
      resolver.setSuffix(".jsp");
      return resolver;
  }
  ```

---

### 11. **`ViewResolverComposite`**
- **역할**: **다중 `ViewResolver`를 조합**합니다.
- **특징**:
  - 여러 리졸버를 순차적으로 실행해 적절한 뷰를 찾습니다.
  - 우선순위를 설정할 수 있습니다.
- **예시**:
  ```java
  @Bean
  public ViewResolverComposite compositeResolver() {
      ViewResolverComposite composite = new ViewResolverComposite();
      composite.addResolver(new InternalResourceViewResolver());
      composite.addResolver(new FreeMarkerViewResolver());
      return composite;
  }
  ```

---

### 12. **`XmlViewResolver`**
- **역할**: **XML 파일**로 뷰를 정의합니다.
- **특징**:
  - `views.xml`과 같은 XML 설정 파일에서 뷰 빈을 로드합니다.
  - `ResourceBundleViewResolver`와 유사하지만 XML 형식을 사용합니다.
- **예시**:
  ```xml
  <!-- views.xml -->
  <beans>
      <bean id="home" class="org.springframework.web.servlet.view.JstlView">
          <property name="url" value="/WEB-INF/views/home.jsp"/>
      </bean>
  </beans>
  ```

---

### 13. **`XsltViewResolver`**
- **역할**: **XSLT(XML 변환)** 뷰를 처리합니다.
- **특징**:
  - XML 데이터를 XSLT 스타일시트로 변환합니다.
  - `XsltView` 클래스를 사용해 렌더링합니다.
- **예시**:
  ```java
  @Bean
  public XsltViewResolver xsltViewResolver() {
      XsltViewResolver resolver = new XsltViewResolver();
      resolver.setPrefix("/WEB-INF/xsl/");
      resolver.setSuffix(".xsl");
      return resolver;
  }
  ```

---

### 📌 **요약**
| 리졸버명                        | 주요 기능                                                                 |
|---------------------------------|--------------------------------------------------------------------------|
| `InternalResourceViewResolver`  | JSP 뷰 처리 (가장 일반적)                                              |
| `FreeMarkerViewResolver`        | FreeMarker 템플릿 처리                                                 |
| `ContentNegotiatingViewResolver`| 요청 형식(JSON/XML)에 따라 뷰 선택                                      |
| `BeanNameViewResolver`          | 스프링 빈 이름으로 뷰 조회                                             |
| `ViewResolverComposite`         | 다중 리졸버 조합                                                       |
| `XsltViewResolver`              | XML을 XSLT로 변환                                                      |

---

### 💡 **핵심 포인트**
- **JSP**는 **`InternalResourceViewResolver`** 로 처리합니다.
- **템플릿 엔진**(FreeMarker, Groovy)은 각각 전용 리졸버를 사용합니다.
- **다중 포맷 지원**(JSON, XML)은 **`ContentNegotiatingViewResolver`** 로 구현합니다.
- **커스텀 뷰**는 `BeanNameViewResolver` 또는 `ResourceBundleViewResolver`로 관리합니다.