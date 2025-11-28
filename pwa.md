모바일 브라우저에는 설정에 '홈 화면에 추가' 기능이 있다.

이를 클릭하면 장치 홈 화면에 바로가기 링크가 생성이 된다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbERABX%2FbtszxsOfwzq%2FAAAAAAAAAAAAAAAAAAAAAAVklEJ9-nKjjJUjQ7lPAGObpQXakZt8E1drCSVVVi_c%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3Dr%252BeGwbqUR5P1Jh3V8MhEhHTQLao%253D)

크롬 브라우저 설정

홈 화면에 추가 기능을 자동으로 구현하려고 스터디 중 PWA 개념을 알게 되었다.

구현하고자 하는 기능은 A2HS(Add to Home Screen) 이라고도 부른다.

결론부터 먼저 말하자면,

사용자가 설정에 들어가서 '홈 화면에 추가'를 클릭하는 행위와 동일한 기능 구현은 불가능 했다.

대신 웹사이트에 PWA라는 정체성을 입혀 웹 앱으로 만들어 '앱 설치'를 통해 장치에 추가를 할 수 있다.

PWA란 Progressive Web App, 직역하자면 진보적인 웹 앱이다.

#### 홈 화면의 추가 vs 앱 설치 차이점

- 홈 화면에 추가 - 홈 화면에 바로가기 링크 추가, 기본 브라우저에서 북마크된 링크 실행
- 앱 설치 - 장치에 설치되어 앱 목록에 추가, 독립형 앱으로 실행

#### PWA의 특징

- 웹 플랫폼 기술을 사용하여 구축되었지만 \*플랫폼별 앱 과 같은 사용자 경험을 제공하는 앱
- 웹에서 직접 액세스 가능하므로 앱 스토어를 거치지 않고 장치의 홈 화면에 설치 가능
- 설치된 앱은 네이티브 앱과 유사한 형태로 제공되어 브라우저가 아닌 독립형 앱으로 실행 가능
- 브라우저 UI 없이 표시되지만 기술적인 측면에서는 웹사이트이므로 실행하기 위해서는 브라우저 엔진 필요
- 백그라운드 및 오프라인에서 작동 가능

\* 플랫폼별 앱: iOS 또는 Android 기기와 같은 특정 운영 체제 전용으로 개발되어 앱 스토어를 통해 배포되는 앱

참고: [https://developer.mozilla.org/en-US/docs/Web/Progressive\_web\_apps/Guides/Making\_PWAs\_installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

[

Making PWAs installable - Progressive web apps | MDN

One of the defining aspects of a PWA is that it can be installed on the device, and then appears to users as a platform-specific app, a permanent feature of their device which they can launch directly from the operating system like any other app.

developer.mozilla.org

](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

PWA를 통해 많은 기능을 구현할 수 있으나, 내가 필요한 기능은 오직 '홈 화면에 추가'이다.

오프라인에서 작동하기 위한 캐싱, 푸시 알림 및 앱 스토어에 배포 기능은 '가능하다' 정도로만 알고 넘어갔다.

그리고 웹사이트의 특정 경로에서만 앱설치가 가능하도록 하고 싶었다. (이 때는 몰랐지, 이걸로 삽질을 할 줄은)

#### PWA 기술 요구 사항

- 사이트가 HTTPS 를 통해 제공
- localhost, 127.0.0.1, file:// 와 같은 로컬 리소스도 허용
- Web app manifest 등록 (name 또는 short\_name, start\_url, display, 144x144 이상인 아이콘 필수)
- Service worker 등록

차근차근 삽질을 시작했다.

#### 1\. Web app manifest 등록

웹 앱 매니페스트 파일은 웹 앱이 어떻게 구동되고 작동되는지, 어떤 모양으로 보이는지를 설명하는 JSON 파일이다.

브라우저가 PWA를 설치하는데 필요한 충분한 정보를 담고 있다.

1) 디렉터리 루트에 manifest.webmanifest 파일 생성

> 권장 확장자는 webmanifest 이며, application/manifest+json 콘텐츠 유형 또는 다른 JSON 유효한 콘텐츠 유형(예: text/json)과 함께 제공되면 모든 파일 이름을 사용할 수 있다. 특히 오래된 PWA에서는 대신 manifest.json를 사용한다.

```bash
{
  "name": "My PWA",
  "start_url": "/",
  "display": "fullscreen",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "type": "image/png",
      "sizes": "192x192"
    }
    {
      "src": "images/icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

**\> manifest 파일의 필수/선택 속성들**

1\. 필수 속성

- name: 앱 이름
- start\_url: 앱 실행 시 로딩되는 첫 페이지의 경로
- display: 앱의 디스플레이 방식 정의 (fullscreen, standalone, minimal-ui, browser)
- icons: 앱 대표 이미지. 기기 해상도에 따라 명시된 icons 리스트 중 적절한 크기의 이미지 로딩됨. 대부분의 기기에서 잘 보이려면 최소한 192x192 크기와 512x512 크기 2개 정도 제공하는게 좋음 (한 개의 이미지만 제공한다면 512x512)

2\. 선택 속성

- short\_name: name이 너무 길어서 표시할 공간이 없을 때 사용되는 값이므로 15자 미만으로 작성
- description: 앱에 대한 설명
- background\_color: 앱 화면 배경색
- theme\_color: 디스플레이(상태 바 등)에 나타나는 색
- orientation: 화면 방향 (any, landscape, portrait, natural, primary, secondary)

2) manifest 파일 등록

```bash
<!-- index.html -->
<html>
  <head>
    <link rel="manifest" href="/manifest.webmanifest" crossorigin="anonymous"/>
  </head>
</html>
```

iOS의 사파리의 경우 manifest에 등록된 icons 리스트를 무시한다고 한다.

사파리에서도 아이콘을 사용하려면 아래와 같이 명시해줘야 한다.

나는 안드로이드 한정으로 구현했으므로 아래의 태그는 추가하지 않았다.

```bash
<link rel="apple-touch-icon" href="/images/icon-192.png" />
```

#### 2\. Service worker 등록

#### 서비스 워커의 특징

- 애플리케이션, 브라우저 및 네트워크 사이에 있는 프록시 서버 역할
- 네트워크 요청을 가로채서 미리 캐시 된 데이터를 먼저 내려준다든지 하는 등의 작업이 가능
- 오프라인 및 백그라운드 작업을 지원하므로 기기의 인터넷이 느리거나 끊긴 경우 이전에 받은 데이터를 캐싱해 뒀다가 보여줌으로써 마치 앱처럼 동작이 가능
```bash
<!-- sw.js -->
self.addEventListener("fetch", e => {});
```
```bash
<!-- index.html -->
<script>
  (function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log(registration);
      }, function (err) {
        console.log(err)
      });
    }
  })();
</script>
```

위의 sw.js는 빈 껍데기만 있지만, 캐싱 전략을 구현할 수도 있다.

예를 들면 이렇게

```bash
var CACHE_NAME = 'pwa-manager'; 
var urlsToCache = [
    '/index.html', 
    '/common.js',
    '/style.css'
];

// Install a service worker
self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
// Update a service worker
self.addEventListener('activate', event => {
    var cacheWhitelist = ['pwa-manager'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```

서비스워커에서 주로 사용하는 이벤트 리스너는 install, fetch, avtivate 가 있다.

그 외에 다른 이벤트도 있으니 간단하게 어떤 경우에 호출되는지만 알아놓고 난 여전히 빈 껍데기를 사용했다.

**\> Service worker event listeners 종류와 특징**

- Install: 서비스 워커가 최초로 등록될 때 발생하는 이벤트. 주로 캐시에 필요한 파일을 저장하거나 초기 설정 수행
- Fetch: 네트워크 요청이 발생할 때 발생하는 이벤트. 이를 통해 네트워크 요청을 가로채거나 캐시된 데이터를 반환하여 오프라인 및 캐싱 전략 구현 가능
- Activate: 새로운 서비스 워커가 활성화될 때 발생하는 이벤트. 이전 버전의 서비스 워커와 관련된 리소스를 정리하고 업데이트된 서비스 워커의 활성화 처리
- Push: 서버로부터 푸시 알림을 수신할 때 호출. 이를 사용하여 사용자에게 푸시 알림을 표시하거나 사용자 상호작용 유도 가능
- Sync: Background Sync를 통해 오프라인 상태에서 동기화 작업을 수행할 때 발생하는 이벤트. 동기화 작업을 수행하고 결과를 서버로 업로드 가능
- Message: 서비스 워커와 웹 페이지 간의 메시지 통신을 처리하기 위한 이벤트. 이를 사용하여 데이터를 주고받고 다양한 작업 수행 가능
- Error: 서비스 워커 내에서 에러가 발생할 때 처리하는 이벤트. 에러 핸들링 및 오류 디버깅에 사용

참고: [https://developer.mozilla.org/en-US/docs/Web/API/Service\_Worker\_API/Using\_Service\_Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

[

Using Service Workers - Web APIs | MDN

This article provides information on getting started with service workers, including basic architecture, registering a service worker, the installation and activation process for a new service worker, updating your service worker, cache control and custom

developer.mozilla.org

](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

여기까지 등록이 잘 되었다면, PC 브라우저에서 웹사이트 로딩 후 개발자도구에서 manifest와 service worker를 확인할 수 있다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fo4pd2%2Fbtszuwj9HXq%2FAAAAAAAAAAAAAAAAAAAAAEBGC2oI_9vIRGzQsmNkgwgGQM33A2pBebWiGM4-qzBm%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DgpmsRLaDZrqXx%252Fyzgk6VwF36yv0%253D)

크롬 개발자 도구(F12) > Application > Manifest

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGOBnf%2FbtszuxpP8Ae%2FAAAAAAAAAAAAAAAAAAAAAH75gC0BNwQvQ6G8SwEkk9i99T9VbRUJ20CymrkrxTTc%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DrldGwnKTTKabjKacpduw2Z3CfbM%253D)

크롬 개발자 도구(F12) > Application > Service workers

sw.js를 클릭하여 서비스 워커 내용이 잘 들어가 있는지 확인할 수 있다.

매니페스트 내용은 제일 밑의 Frames 메뉴에서 확인할 수 있다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FAFI7Y%2FbtszuFBnpGg%2FAAAAAAAAAAAAAAAAAAAAAOqUJFyQEOhJo-8f3JWRDimqj_MfwdOpsNgDcsfqdaHc%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DWtn5JRV%252FXzt84i86SiYkyS41Ve0%253D)

크롬 개발자 도구(F12) > Application > Frames > Manifest

또한 PC 브라우저 주소표시줄에 설치 아이콘이 추가된다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlbdXL%2FbtszpAHv3B9%2FAAAAAAAAAAAAAAAAAAAAAF21AEPL_tf4ye1LfIJHhIMZWZVQruvuDa1aeO-H7Dqv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3DZyzmIKoPI15ZwuR9KsXgtD75qOE%253D)

non-PWA website

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FboM3vH%2FbtszvjZdQCt%2FAAAAAAAAAAAAAAAAAAAAAAa2_onQXus8DY0NtnNXxYCU1xf5zzKOBOhUr2NCWlOc%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3Dr9kzEcnqWYaXDhE3NiEyTYDWYLg%253D)

PWA website

#### 3\. 버튼 만들기

이제 웹사이트 안에 홈 화면에 추가 버튼을 만들 수 있는 단계가 왔다.

```bash
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault();
  deferredPrompt = event;
});

$("#a2hs_btn").on("click", function(e){
  e.preventDefault();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choiceResult) {
      if (choiceResult.outcome === 'accepted') {
        deferredPrompt = null;
      }
    });
  } else {
    alert("홈 화면에 추가할 수 없습니다.")
  }
});
```

브라우저는 사이트가 A2HS라고 판단되면 beforeinstallprompt 이벤트를 호출한다.

이벤트가 호출된다면 deferredPrompt 변수에 event값을 할당하고, 버튼 클릭 시 이벤트에서 제공하는 프롬프트를 띄워 사용자에게 설치여부를 묻는다.

여기서 끝난 줄만 알았지.

몇 가지의 문제가 발생했다. (그럼 그렇지 한 번에 끝날 리가 없지)

1\. 앱 설치 후 브라우저에서 웹서핑 도중 갑자기 앱이 실행되는 문제

2\. 갤럭시 폴드에서는 앱이 아니라 바로가기 링크가 홈 화면에 추가되는 문제

3\. 삼성 인터넷에서 기능 실행이 안 되는 문제

휴

1번 문제는 manifest에 scope 속성을 추가하여 특정 경로에서만 앱이 실행되도록 수정하니 해결되었다.

(나는 웹사이트의 특정 페이지에서 홈 화면에 추가 기능을 제공하는 조건이 있었다)

```bash
"start_url": "/my-page",
"scope": "/my-page"
```

2번 문제는 알 수 없음.

여러 종류의 기기로 테스트하였으나 갤럭시 폴드에서만 발생했고, 다른 PWA 사이트 확인 시에도 동일하게 바로가기 링크로 생성이 되었다.

폴드 왜 이래ㅠ

3번 문제는 인프라 환경의 문제인 것 같다.

다른 환경에서 서비스되는 웹사이트에서는 문제없이 동작했으나, 이 프로젝트에서만 동작을 안 하는 걸 보면 인프라 환경 차이인 것 같다.

몇 가지 메모를 남기고 PWA 적용기를 마쳐본다... 간단하고도 긴 여정이었다.

- Service worker의 내용 변경 후 파일명을 변경하는 게 제일 확실하게 적용된다. (뒤에 버전 붙여도 소용없음)
- Service worker 등록 전에 모든 내용 지우고 싶다면 이렇게...
```bash
// 기존 서비스워커 제거
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});
```