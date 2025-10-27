---
title: universal clipboard
resource-path: universal clipboard.md
keywords:
tags:
date: 2025-04-17T00:43:00+09:00
lastmod: 2025-06-03T10:17:57+09:00
---
#### **2.1. 중앙 서버 설계**

중앙 서버는 핵심적인 역할을 하며, 다음과 같은 기능을 제공해야 합니다.

1. **사용자 인증(Authentication)** :
    - 사용자를 식별하고 데이터를 보호하기 위해 OAuth 2.0 또는 JWT(JSON Web Token) 기반의 인증 시스템을 사용.
    - 각 사용자의 클립보드 데이터는 개인적으로 격리되어야 함.
2. **클립보드 데이터 저장** :
    - 데이터베이스에 클립보드 내용을 저장. 
    - 텍스트, 이미지 등 다양한 형식의 데이터를 처리할 수 있도록 설계.
    - 단순한 db 를 사용 sqlite, mongoDB
3. **실시간 동기화** :
    - 클라이언트가 클립보드 데이터를 변경하면 즉시 서버로 전송.
    - 다른 클라이언트는 서버로부터 최신 데이터를 받아옴.
    - sse 방식으로 동기화 빠른 재연결 수립
4. **데이터 보안** :
    - 이후 설계 : HTTPS를 통해 데이터를 암호화하여 전송.
    - 이후 설계 : 민감한 데이터는 AES 또는 RSA와 같은 암호화 알고리즘으로 암호화.

#### **2.2. 클라이언트 애플리케이션 설계**

각 플랫폼별로 클라이언트 애플리케이션을 개발해야 합니다. 각 플랫폼의 특성을 고려하여 구현해야 합니다.
1. **macOS/iOS** :
    - **클립보드 모니터링** : `NSPasteboard` (macOS), `UIPasteboard` (iOS)를 사용하여 클립보드 변경을 감지.
    - **백그라운드 실행** : macOS에서는 앱이 백그라운드에서 실행되도록 설정.
    - **네트워크 통신** : URLSession 또는 Alamofire를 사용하여 서버와 통신.
2. **Android** :
    - **클립보드 모니터링** : `ClipboardManager`를 사용하여 클립보드 변경을 감지.
    - **서비스 실행** : Foreground Service를 사용하여 앱이 백그라운드에서도 동작하도록 설정.
    - **네트워크 통신** : Retrofit 또는 OkHttp를 사용하여 서버와 통신.
3. **Windows** :
    - **클립보드 모니터링** : `System.Windows.Forms.Clipboard` 또는 WinAPI를 사용하여 클립보드 변경을 감지.
    - **백그라운드 실행** : Windows 서비스 또는 BackgroundWorker를 사용.
    - **네트워크 통신** : HttpClient를 사용하여 서버와 통신.