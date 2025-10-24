---
title: android studio build sequence
date: 2025-09-08T15:10:44+09:00
lastmod: 2025-10-13T13:22:05+09:00
resource-path: android studio build sequence.md
aliases:
tags:
  - ai-content
---
네, 제공해주신 Android Gradle 빌드 로그의 각 단계를 매우 자세하게 설명해 드리겠습니다. 이 로그는 Android Studio에서 'Run' 버튼을 누르거나 터미널에서 `./gradlew assembleDebug` 명령을 실행했을 때 나타나는 과정입니다.

### **핵심 개념: 증분 빌드 (Incremental Build) 와 `UP-TO-DATE`**

로그를 이해하기 전에 가장 중요한 개념은 Gradle의 **증분 빌드** 기능입니다.

*   **정의**: Gradle은 각 작업(Task)의 입력(input)과 출력(output)을 기억합니다. 다음 빌드를 실행할 때, Gradle은 각 작업의 입력 파일(예: 소스 코드, 리소스 파일)이 마지막 빌드 이후 변경되었는지 확인합니다.
*   **`UP-TO-DATE`의 의미**: 만약 입력 파일에 아무런 변경이 없다면, Gradle은 해당 작업을 다시 실행하는 대신 이전에 생성했던 출력물을 그대로 재사용합니다. 이때 로그에 `UP-TO-DATE`라고 표시됩니다.
*   **결과**: 이 기능 덕분에 코드를 전혀 수정하지 않고 다시 빌드하면, 모든 작업이 `UP-TO-DATE`가 되어 빌드가 매우 빠르게(로그에서는 1초) 완료됩니다.

---

### **빌드 단계별 상세 설명**

빌드 과정은 크게 **리소스 처리 → 매니페스트 처리 → 코드 컴파일 → DEX 변환 → APK 패키징**의 순서로 진행됩니다.

#### **1단계: 준비 및 설정 (Preparation & Setup)**

*   `> Task :app:preBuild` & `> Task :app:preDebugBuild`
    *   **역할**: 본격적인 빌드 전에 필요한 준비 작업을 수행합니다. 예를 들어, 빌드 과정에서 생성될 파일들을 저장할 폴더(`build/` 디렉토리)를 만들거나 초기 환경 설정을 합니다. `preDebugBuild`는 'debug' 빌드 유형에 특화된 준비 작업입니다.

*   `> Task :app:checkKotlinGradlePluginConfigurationErrors`
    *   **역할**: Kotlin Gradle 플러그인 설정에 오류가 없는지 확인합니다.
    *   **`SKIPPED`**: 이 작업은 특정 조건에서만 실행되거나, 필요 없다고 판단되면 건너뜁니다. 문제가 있는 상태가 아닙니다.

#### **2단계: 리소스 처리 (Resource Processing)**

이 단계에서는 앱의 모든 리소스(레이아웃 XML, 이미지, 문자열 등)를 처리합니다. 주로 `aapt2` 도구가 사용됩니다.

*   `> Task :app:checkDebugAarMetadata`
    *   **역할**: 프로젝트가 의존하는 라이브러리(`.aar` 파일)들의 메타데이터가 올바른지 확인합니다.

*   `> Task :app:processDebugNavigationResources` & `> Task :app:compileDebugNavigationResources`
    *   **역할**: Android Jetpack의 Navigation Component를 사용하는 경우, `res/navigation` 폴더 안의 XML 파일들을 처리하고 컴파일합니다.

*   `> Task :app:generateDebugResValues` & `> Task :app:generateDebugResources`
    *   **역할**: `build.gradle` 파일에 정의된 `resValue` 같은 동적으로 생성되는 리소스 값들을 실제 리소스 파일로 만듭니다.

*   `> Task :app:mergeDebugResources`
    *   **역할**: 매우 중요한 단계입니다. 프로젝트의 기본 리소스(`src/main/res`), 디버그용 리소스(`src/debug/res`), 그리고 모든 라이브러리(AAR)에 포함된 리소스들을 하나로 합쳐서 단일 폴더에 모읍니다. 만약 같은 이름의 리소스가 여러 곳에 있다면, 정해진 우선순위에 따라 하나를 선택합니다.

*   `> Task :app:packageDebugResources`
    *   **역할**: `aapt2`가 본격적으로 동작하는 핵심 단계입니다. `mergeDebugResources`에서 합쳐진 모든 리소스를 컴파일하고 연결(link)합니다. 이 과정에서 `R.java` 파일이 생성되고, 모든 리소스가 바이너리 형식으로 포함된 `resources.ap_`라는 중간 결과물이 만들어집니다.

*   `> Task :app:parseDebugLocalResources`
    *   **역할**: `packageDebugResources` 이후 생성된 리소스들을 파싱하여 다음 단계를 준비합니다.

#### **3단계: 매니페스트 처리 (Manifest Processing)**

*   `> Task :app:createDebugCompatibleScreenManifests`
    *   **역할**: 앱의 화면 호환성(screen compatibility)과 관련된 매니페스트 조각을 생성합니다.

*   `> Task :app:extractDeepLinksDebug`
    *   **역할**: 매니페스트와 코드 내 어노테이션에서 딥링크(Deep Link) 정보를 추출합니다.

*   `> Task :app:processDebugMainManifest`, `> Task :app:processDebugManifest`, `> Task :app:processDebugManifestForPackage`
    *   **역할**: 리소스 병합과 유사하게 `AndroidManifest.xml` 파일을 병합합니다. `src/main/AndroidManifest.xml`을 기본으로, 라이브러리의 매니페스트와 `src/debug/` 폴더의 매니페스트 조각들을 합칩니다. 이 과정에서 `build.gradle`에 정의된 `applicationId`, `versionCode` 같은 플레이스홀더 값들을 실제 값으로 교체하여 최종 매니페스트를 완성합니다.

#### **4단계: 코드 컴파일 및 DEX 변환 (Code Compilation & Dexing)**

이 단계에서는 Kotlin/Java 소스 코드를 컴파일하고, Android 런타임이 이해할 수 있는 DEX 파일로 변환합니다.

*   `> Task :app:compileDebugKotlin`
    *   **역할**: Kotlin 컴파일러(`kotlinc`)를 사용하여 프로젝트의 모든 `.kt` 파일을 `.class` 파일(자바 바이트코드)로 컴파일합니다.

*   `> Task :app:compileDebugJavaWithJavac`
    *   **역할**: Java 컴파일러(`javac`)를 사용하여 `.java` 파일을 `.class` 파일로 컴파일합니다.
    *   **`NO-SOURCE`**: 이 작업은 실행되었지만, 컴파일할 `.java` 소스 파일이 하나도 없었다는 의미입니다. 프로젝트가 100% Kotlin으로 작성되었을 가능성이 높습니다.

*   `> Task :app:mergeDebugShaders`, `> Task :app:compileDebugShaders`
    *   **역hal**: OpenGL 셰이더(`.glsl` 파일)가 있다면 컴파일하고 병합합니다. (여기서는 `NO-SOURCE`이므로 셰이더 파일이 없습니다.)

*   `> Task :app:mergeDebugAssets`
    *   **역할**: `assets` 폴더의 내용물을 병합합니다.

*   `> Task :app:checkDebugDuplicateClasses`
    *   **역할**: 컴파일된 클래스 파일과 라이브러리들 사이에 중복된 클래스가 있는지 검사합니다. 중복 클래스는 앱 실행 시 충돌을 일으킬 수 있으므로 중요한 검증 과정입니다.

*   `> Task :app:desugarDebugFileDependencies`
    *   **역할**: Java 8 이상의 최신 언어 기능(람다, 스트림 API 등)을 이전 버전의 Android에서도 동작하도록 변환(Desugaring)하는 준비 작업을 합니다. `d8` 도구가 이 역할을 수행합니다.

*   `> Task :app:dexBuilderDebug`, `> Task :app:mergeProjectDexDebug`, `> Task :app:mergeExtDexDebug`, `> Task :app:mergeLibDexDebug`
    *   **역할**: **DEXing** 단계입니다. `d8` 도구를 사용하여 프로젝트의 모든 `.class` 파일(내 코드 + 라이브러리 코드)을 Dalvik Executable(`.dex`) 파일로 변환합니다. `.dex` 파일은 Android 런타임(ART)이 실행하는 파일 형식입니다. 클래스 파일이 매우 많으면 여러 개의 `.dex` 파일로 나뉠 수 있으며, 이 작업들은 그것들을 병합하는 역할도 합니다.

#### **5단계: 네이티브 코드 및 최종 패키징 (Native Code & Final Packaging)**

이제 모든 재료(컴파일된 리소스, DEX 파일, 매니페스트 등)를 모아 최종 APK 파일을 만듭니다.

*   `> Task :app:mergeDebugJniLibFolders` & `> Task :app:mergeDebugNativeLibs`
    *   **역할**: C/C++로 작성된 네이티브 라이브러리(`.so` 파일)가 있다면, 모든 소스(내 프로젝트, 라이브러리)에서 가져와 아키텍처별(arm64-v8a, x86_64 등)로 정리하여 병합합니다.

*   `> Task :app:stripDebugDebugSymbols`
    *   **역할**: 네이티브 라이브러리에서 디버깅 심볼을 제거하여 파일 크기를 줄입니다. (디버그 빌드에서는 보통 이 작업이 최소한으로 수행되거나 건너뜁니다.)

*   `> Task :app:validateSigningDebug`
    *   **역할**: APK에 서명할 준비가 되었는지 확인합니다. 디버그 빌드의 경우, 보통 SDK에 포함된 기본 디버그 키스토어로 자동 서명됩니다.

*   `> Task :app:packageDebug`
    *   **역할**: **최종 APK 생성 단계입니다.** 지금까지 만들어진 모든 결과물—컴파일된 리소스(`resources.ap_`), DEX 파일, 최종 매니페스트, 네이티브 라이브러리(`.so`), `assets`—을 하나의 압축 파일(`.apk`)로 묶습니다. 이 단계에서 `apksigner`를 사용하여 디버그 키로 APK에 서명하고, `zipalign`으로 최적화하는 과정도 포함됩니다.

*   `> Task :app:createDebugApkListingFileRedirect`
    *   **역할**: 생성된 APK 파일의 내용물 목록을 담은 메타데이터 파일을 생성합니다.

*   `> Task :app:assembleDebug`
    *   **역할**: 최종 집계(aggregator) 작업입니다. 이 작업 자체는 아무 일도 하지 않지만, 디버그 APK를 만드는 데 필요한 위의 모든 작업들에 대한 의존성을 가지고 있습니다. 따라서 `assembleDebug` 작업이 성공적으로 완료되었다는 것은 디버그 APK가 성공적으로 생성되었음을 의미합니다.

### **최종 결과**

*   **`BUILD SUCCESSFUL in 1s`**: 빌드가 1초 만에 성공적으로 완료되었습니다.
*   **`36 actionable tasks: 36 up-to-date`**: Gradle이 실행해야 할 작업은 총 36개였지만, 입력 파일이 변경되지 않았기 때문에 36개 모두 이전 결과물을 재사용하여 작업을 완료했다는 의미입니다.
*   **`Build Analyzer results available`**: Android Studio는 이 빌드 과정의 성능을 분석한 결과를 제공합니다. 빌드가 느릴 때 원인을 파악하는 데 유용한 도구입니다.
