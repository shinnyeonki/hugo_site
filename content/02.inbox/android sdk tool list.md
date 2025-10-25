---
title: android sdk tool list
resource-path: 02.inbox/android sdk tool list.md
aliases:
tags:
  - android
  - 잡지식
date: 2025-09-08T14:54:08+09:00
lastmod: 2025-09-08T14:56:26+09:00
share_link: https://share.note.sx/69ay5h9s#00f5E3CyCrcG6NrV20fPP1D7UjkUvERu7w63RqY5TEQ
share_updated: 2025-09-08T15:07:46+09:00
---
### `{sdk location}/platform-tools`
#### ⭐ 핵심 도구 (가장 중요하고 자주 사용)

##### 1. `adb` (Android Debug Bridge)

**가장 중요하고 다재다능한 도구**입니다. 실행 중인 안드로이드 기기(에뮬레이터 포함)와 통신하기 위한 클라이언트-서버 프로그램입니다. PC에서 실행하는 `adb`는 클라이언트, 기기에서 실행되는 `adbd`는 데몬(서버) 역할을 합니다. USB 케이블이나 Wi-Fi를 통해 연결됩니다.

**주요 기능 및 사용 사례:**

*   **기기 연결 확인:**
    *   `adb devices`: 현재 PC에 연결된 기기 목록을 확인합니다. 기기가 정상적으로 인식되었는지 확인할 때 가장 먼저 사용하는 명령어입니다.
*   **앱 설치 및 삭제:**
    *   `adb install [앱이름].apk`: PC에 있는 APK 파일을 기기에 설치합니다.
    *   `adb uninstall [패키지이름]`: 기기에 설치된 앱을 삭제합니다.
*   **파일 전송:**
    *   `adb push [PC 경로] [기기 경로]`: PC의 파일을 기기로 복사합니다.
    *   `adb pull [기기 경로] [PC 경로]`: 기기의 파일을 PC로 복사합니다.
*   **쉘(Shell) 접근:**
    *   `adb shell`: 기기의 리눅스 쉘에 원격으로 접속합니다. 이를 통해 기기 내부의 파일 시스템을 탐색하거나, 각종 시스템 명령어를 실행할 수 있습니다. (예: `adb shell ls /sdcard/`)
*   **로그 확인 (디버깅):**
    *   `adb logcat`: 기기에서 실시간으로 발생하는 시스템 로그를 출력합니다. 앱 개발 시 에러나 동작을 추적하는 데 필수적입니다.
*   **기기 제어:**
    *   `adb reboot`: 기기를 재부팅합니다.
    *   `adb reboot recovery`: 리커버리 모드로 재부팅합니다.
    *   `adb reboot bootloader`: 부트로더(패스트붓) 모드로 재부팅합니다.
*   **기타 고급 기능:**
    *   **포트 포워딩:** `adb forward tcp:[PC 포트] tcp:[기기 포트]` - PC의 특정 포트로 들어오는 요청을 기기의 포트로 전달합니다. 디버깅 시 유용합니다.
    *   **스크린샷/녹화:** `adb shell screencap` (스크린샷), `adb shell screenrecord` (화면 녹화).

##### 2. `fastboot` (Fastboot Protocol Tool)

**부트로더(Bootloader) 상태의 기기와 통신**하는 도구입니다. 운영체제(OS)가 부팅되기 전의 단계에서 기기의 파티션을 수정하거나 펌웨어(ROM)를 설치(플래싱)할 때 사용됩니다. `adb`가 OS가 켜진 상태에서 통신하는 것과 달리, `fastboot`는 더 낮은 수준(low-level)에서 기기를 제어합니다.

**주요 기능 및 사용 사례:**

*   **부트로더 언락/락:**
    *   `fastboot flashing unlock` 또는 `fastboot oem unlock`: 기기의 부트로더를 언락하여 커스텀 펌웨어를 설치할 수 있는 상태로 만듭니다. (※ 기기 데이터가 초기화됩니다!)
    *   `fastboot flashing lock`: 부트로더를 다시 잠급니다.
*   **펌웨어 이미지 플래싱:**
    *   `fastboot flash [파티션 이름] [이미지 파일]`: 특정 파티션에 이미지 파일을 덮어씌웁니다. 예를 들어, 시스템 파티션에 새로운 OS 이미지를 설치할 때 사용합니다.
    *   예시: `fastboot flash system system.img`, `fastboot flash boot boot.img`
*   **기기 정보 확인:**
    *   `fastboot getvar all`: 기기의 시리얼 번호, 부트로더 버전 등 다양한 하드웨어 정보를 확인합니다.
*   **재부팅:**
    *   `fastboot reboot`: 기기를 일반 모드로 재부팅합니다.
    *   `fastboot reboot bootloader`: 현재의 부트로더 모드로 다시 재부팅합니다.

---

#### 🛠️ 보조 및 전문 도구

##### 3. `sqlite3`

안드로이드 앱이 데이터를 저장하는 데 널리 사용하는 **SQLite 데이터베이스를 관리하기 위한 커맨드 라인 도구**입니다. `adb shell`을 통해 기기에 접속한 후, 이 도구를 사용하여 앱의 데이터베이스 파일(.db)을 직접 열고 SQL 쿼리를 실행할 수 있습니다.

*   **사용 사례:** 앱 개발 중 데이터가 올바르게 저장되고 있는지 확인하거나, 데이터베이스 스키마를 검사하고, 데이터를 직접 수정할 때 유용합니다.
*   **예시:** `adb shell`로 접속 후, `sqlite3 /data/data/[앱 패키지]/databases/mydatabase.db` 명령어로 DB에 접근하여 `.tables`로 테이블 목록을 보거나 `SELECT * FROM my_table;` 같은 쿼리를 실행할 수 있습니다.

##### 4. `hprof-conv` (HPROF Converter)

안드로이드 앱의 **메모리 힙 덤프(Heap Dump) 파일을 변환**하는 도구입니다. 안드로이드 스튜디오의 프로파일러에서 생성된 `.hprof` 파일은 안드로이드 고유의 형식을 사용합니다. 이 파일을 `jhat`과 같은 표준 Java 힙 분석 도구에서 사용 가능한 형식으로 변환할 때 사용됩니다.

*   **사용 사례:** 메모리 누수(Memory Leak) 분석과 같은 고급 메모리 프로파일링 작업을 할 때 필요할 수 있습니다.

##### 5. `etc1tool`

**ETC1 형식의 텍스처 압축 및 해제**를 위한 도구입니다. ETC1은 안드로이드가 지원하는 텍스처 압축 형식으로, GPU 메모리를 효율적으로 사용하는 데 도움을 줍니다.

*   **사용 사례:** 게임 개발이나 그래픽 집약적인 앱을 만들 때, PNG와 같은 일반 이미지 파일을 ETC1 형식(.pkm)으로 압축하거나, 압축된 파일을 다시 디코딩하여 확인하는 용도로 사용됩니다.

---

#### 🔩 시스템 및 파일 시스템 관련 도구 (일반 개발자는 거의 사용하지 않음)

이 도구들은 안드로이드 OS 자체를 빌드하거나, 시스템 이미지를 생성하는 등 매우 낮은 수준의 작업을 할 때 사용됩니다. 일반적인 앱 개발자는 직접 사용할 일이 거의 없습니다.

##### 6. `make_f2fs` / `make_f2fs_casefold`

**F2FS(Flash-Friendly File System) 파일 시스템을 생성**하는 도구입니다. F2FS는 플래시 메모리(SSD, eMMC 등)에 최적화된 파일 시스템으로, 최신 안드로이드 기기에서 널리 사용됩니다.
*   `make_f2fs_casefold`: 파일 이름의 대소문자를 구분하지 않는(case-insensitive) F2FS 파일 시스템을 생성합니다.

##### 7. `mke2fs` / `mke2fs.conf`

**ext2, ext3, ext4 파일 시스템을 생성**하는 도구입니다. 과거 안드로이드 기기들은 ext4를 주로 사용했습니다.
*   `mke2fs.conf`: `mke2fs`가 파일 시스템을 생성할 때 참조하는 설정 파일입니다.

---

#### 📂 기타 파일 및 디렉토리

##### 8. `lib64`

64비트 시스템에서 위 도구들이 실행되는 데 필요한 **공유 라이브러리(Shared Libraries)** 파일들이 들어있는 디렉토리입니다. (예: `.dylib` on macOS, `.so` on Linux, `.dll` on Windows)

##### 9. `NOTICE.txt`

`platform-tools`에 포함된 오픈소스 소프트웨어들의 라이선스 및 저작권 관련 **고지 사항**이 담긴 텍스트 파일입니다.

##### 10. `package.xml` / `source.properties`

안드로이드 SDK 매니저가 이 패키지를 관리하기 위해 사용하는 **메타데이터 파일**입니다. 패키지의 버전, 설명, 의존성 등의 정보가 기록되어 있습니다. SDK 매니저가 업데이트를 확인하거나 패키지를 설치/삭제할 때 이 파일들을 참조합니다.

---

#### 요약

| 이름                      | 종류        | 설명                                      |
| :---------------------- | :-------- | :-------------------------------------- |
| **`adb`**               | **핵심 도구** | 실행 중인 안드로이드 기기와 통신 (앱 설치, 파일 전송, 디버깅 등) |
| **`fastboot`**          | **핵심 도구** | 부트로더 상태의 기기와 통신 (펌웨어 플래싱, 부트로더 언락 등)    |
| `sqlite3`               | 전문 도구     | 안드로이드 기기 내의 SQLite 데이터베이스를 관리           |
| `hprof-conv`            | 전문 도구     | 안드로이드 메모리 힙 덤프 파일을 표준 형식으로 변환           |
| `etc1tool`              | 전문 도구     | ETC1 텍스처 압축/해제                          |
| `make_f2fs` 등           | 시스템 도구    | F2FS, ext4 등 안드로이드 파일 시스템 이미지를 생성       |
| `lib64`, `NOTICE.txt` 등 | 지원 파일     | 라이브러리, 라이선스, SDK 매니저용 메타데이터             |

결론적으로, 일반적인 안드로이드 개발이나 기기 관리를 위해서는 **`adb`와 `fastboot` 두 가지의 사용법만 확실히 알아두어도 대부분의 작업을 수행**할 수 있습니다. 나머지 도구들은 특정 목적을 위한 보조적인 역할을 합니다.



### `{sdk location}/build-tools/{sdk version}`

네, 제공해주신 `build-tools` 디렉토리 구조를 매우 상세하게 설명해 드리겠습니다. 이 디렉토리는 Android 앱을 개발하고 빌드하는 데 있어 가장 핵심적인 역할을 하는 도구들을 모아놓은 곳입니다.

#### 1. 개요: `build-tools` 디렉토리의 역할

`build-tools`는 Android SDK(소프트웨어 개발 키트)의 일부로, 개발자가 작성한 소스 코드(Java/Kotlin), 리소스 파일(XML 레이아웃, 이미지 등), 그리고 라이브러리들을 실제 Android 기기에서 실행될 수 있는 패키지 파일(`.apk` 또는 `.aab`)로 변환하는 데 필요한 모든 명령줄 도구들을 포함하고 있습니다.

Gradle과 같은 현대적인 빌드 시스템이 이 도구들을 자동으로 호출하여 빌드 프로세스를 진행하지만, 각 도구의 역할을 이해하는 것은 고급 빌드 최적화나 문제 해결에 매우 중요합니다.

---

#### 2. 버전별 디렉토리 구조 (`35.0.0`, `36.0.0`, `36.1.0-rc1`)

`build-tools`는 하위 호환성을 유지하고 프로젝트별로 특정 버전의 도구를 사용할 수 있도록 버전별로 폴더가 나뉘어 있습니다.

*   **`35.0.0`, `36.0.0`**: 안정화된 릴리스 버전입니다.
*   **`36.1.0-rc1`**: `rc1`은 "Release Candidate 1"을 의미하며, 정식 출시 전의 테스트 버전입니다.
*   프로젝트의 `build.gradle` 파일에 있는 `buildToolsVersion "35.0.0"`과 같은 설정은 빌드 시 사용할 이 디렉토리 버전을 지정하는 역할을 합니다.

각 버전 폴더 안의 내용은 대부분 비슷하며, 버전이 올라갈수록 버그 수정, 성능 향상, 새로운 Android 플랫폼 기능 지원 등이 추가됩니다.

---

#### 3. 주요 도구 상세 설명 (버전 폴더 최상위)

각 버전 폴더 안에 있는 핵심 도구들의 역할은 다음과 같습니다.

*   **`aapt` / `aapt2` (Android Asset Packaging Tool)**
    *   **역할**: Android 앱 빌드 과정에서 가장 중요한 도구 중 하나입니다.
    *   리소스 파일(`res` 디렉토리의 XML, 이미지 등)을 분석하고 바이너리 형식으로 컴파일합니다.
    *   `AndroidManifest.xml` 파일을 처리합니다.
    *   리소스 ID를 담고 있는 `R.java` (또는 `R.kt`) 파일을 생성하여 코드에서 리소스를 참조할 수 있게 합니다.
    *   `aapt2`는 `aapt`의 개선된 버전으로, 증분 리소스 처리(incremental resource processing)를 지원하여 빌드 속도를 크게 향상시켰습니다. 현재는 `aapt2`가 기본으로 사용됩니다.

*   **`apksigner` (APK Signer)**
    *   **역할**: 생성된 APK 파일에 디지털 서명을 합니다.
    *   Android 시스템은 앱을 설치하거나 업데이트할 때 이 서명을 확인하여 앱의 무결성(변조되지 않았음)과 개발자 신원을 보장합니다. 서명되지 않은 앱은 기기에 설치할 수 없습니다.

*   **`zipalign`**
    *   **역할**: APK 패키지 파일을 최적화하는 도구입니다.
    *   APK 내부의 압축되지 않은 데이터(예: 이미지 리소스)를 4바이트 경계에 맞게 정렬합니다. 이 작업을 통해 앱 실행 시 메모리 사용량이 줄어들고 리소스 접근 속도가 빨라집니다.
    *   **중요**: `zipalign`은 반드시 `apksigner`로 서명하기 **전**에 실행해야 합니다. (Google Play에 업로드할 때는 서명 후에 실행해도 Google이 재정렬 및 재서명을 해줍니다.)

*   **`d8` (DEXer)**
    *   **역할**: Java 또는 Kotlin 컴파일러가 생성한 `.class` 파일(자바 바이트코드)을 Android 런타임(ART)이 실행할 수 있는 `.dex` 파일(Dalvik Executable) 형식으로 변환합니다.
    *   이 과정에서 코드 최적화, 축소(shrinking), 그리고 Java 8+의 새로운 언어 기능을 이전 Android 버전에서도 사용할 수 있도록 디슈가링(desugaring)하는 작업도 수행합니다. `d8`은 이전의 `dx` 도구를 대체한 더 빠르고 효율적인 도구입니다.

*   **`aidl` (Android Interface Definition Language)**
    *   **역할**: 앱의 여러 프로세스 간 통신(IPC)을 위한 인터페이스를 생성하는 데 사용됩니다.
    *   개발자가 `.aidl` 파일에 인터페이스를 정의하면, 이 도구가 해당 인터페이스를 구현하는 Java 코드를 자동으로 생성해 줍니다. 서비스(Service)와 다른 앱 컴포넌트 간의 통신에 주로 사용됩니다.

*   **`dexdump`**
    *   **역할**: `.dex` 파일의 내용을 사람이 읽을 수 있는 형태로 덤프(출력)하는 디버깅 도구입니다. 앱의 바이트코드를 직접 분석하거나 최적화 문제를 확인할 때 유용합니다.

*   **`*-ld` 파일들 (Linkers)**
    *   `aarch64-linux-android-ld`, `arm-linux-androideabi-ld`, `i686-linux-android-ld`, `x86_64-linux-android-ld` 등
    *   **역할**: NDK(Native Development Kit)를 사용하여 C/C++ 코드를 빌드할 때 사용되는 **링커**입니다.
    *   컴파일된 네이티브 목적 파일(`.o`)들을 모아서 공유 라이브러리(`.so`)나 실행 파일을 만듭니다. 각 파일은 특정 CPU 아키텍처(arm64, armv7, x86 등)에 해당합니다.

*   **`lld` / `lld-bin`**
    *   **역할**: LLVM 프로젝트에서 개발한 새로운 고성능 링커입니다. 기존의 `ld` 링커보다 빠르며, NDK 빌드에서 사용됩니다.

---

#### 4. `renderscript` 디렉토리 상세 설명

**RenderScript**는 고성능 컴퓨팅, 특히 이미지 처리나 계산 집약적인 작업을 위해 만들어진 프레임워크입니다. **중요: RenderScript는 API 레벨 31부터 공식적으로 Deprecated(사용 중단)되었습니다.** 하지만 하위 호환성을 위해 도구들은 여전히 포함되어 있습니다.

*   **`llvm-rs-cc`**: RenderScript 소스 코드(`.rs` 파일)를 LLVM 비트코드로 컴파일하는 컴파일러입니다.
*   **`clang-include`**: RenderScript 컴파일 시 필요한 Clang/LLVM 관련 C/C++ 헤더 파일들입니다. `*intrin.h` 파일들은 CPU 고유의 명령어(intrinsics)를 사용해 코드를 최적화하기 위한 헤더입니다.
*   **`include`**: `rs_*.rsh` 파일들이 있으며, RenderScript 코드 내에서 사용할 수 있는 표준 API(수학, 시간, 변환 등)를 정의한 헤더 파일입니다.
*   **`lib`**: RenderScript 지원 라이브러리들이 모여 있습니다.
    *   **`bc`**: 각 CPU 아키텍처별로 사전 컴파일된 RenderScript 핵심 라이브러리 비트코드(`libclcore.bc`)가 있습니다.
    *   **`packaged`**: RenderScript를 사용하는 앱에 포함되는 네이티브 라이브러리(`.so`)입니다. `libRSSupport.so`는 RenderScript API를 이전 Android 버전에서도 사용할 수 있도록 하는 호환성 라이브러리입니다.
    *   `androidx-rs.jar`, `renderscript-v8.jar`: RenderScript를 Java/Kotlin 코드에서 호출하기 위한 자바 라이브러리입니다.

---

#### 5. `lib` 및 `lib64` 디렉토리

이 디렉토리들은 `build-tools`에 포함된 명령줄 도구들이 내부적으로 사용하는 라이브러리를 담고 있습니다.

*   **`lib`**: Java 라이브러리(`.jar`)가 위치합니다.
    *   `d8.jar`: `d8` 도구의 핵심 로직이 담긴 자바 라이브러리입니다.
    *   `apksigner.jar`: `apksigner` 도구의 핵심 로직입니다.
*   **`lib64`**: 네이티브 공유 라이브러리(`.dylib` for macOS, `.so` for Linux, `.dll` for Windows)가 위치합니다.
    *   `libc++.dylib`: C++ 표준 라이브러리.
    *   `libLLVM_android.dylib`: RenderScript 컴파일러와 같은 도구들이 사용하는 LLVM/Clang 라이브러리입니다.

---

#### 6. 기타 파일

*   **`NOTICE.txt`**: 이 도구들에 사용된 오픈소스 라이브러리의 라이선스 및 저작권 정보가 담겨 있습니다.
*   **`package.xml`, `source.properties`, `runtime.properties`**: Android SDK Manager가 이 패키지를 인식하고 관리하기 위한 메타데이터 파일입니다. 패키지의 버전, 설명, 종속성 등의 정보가 포함됩니다.

#### 결론

`build-tools` 디렉토리는 Android 앱의 "생산 공장"과 같습니다. 개발자가 제공한 설계도(소스 코드)와 재료(리소스)를 받아, `aapt2`로 부품을 가공하고, `d8`으로 엔진(로직)을 만들며, 이 모든 것을 `zipalign`으로 최적화된 상자(`.apk`)에 담아 `apksigner`로 품질 보증 도장(서명)을 찍는, 전체 빌드 과정의 핵심 엔진 역할을 수행하는 곳입니다.