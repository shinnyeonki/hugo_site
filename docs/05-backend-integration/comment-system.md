# 댓글 시스템 설계 명세서

이 문서는 Hugo 정적 사이트에 동적 댓글 기능을 추가하기 위한 백엔드 시스템의 완전한 설계를 기술합니다.

## 🎯 설계 목표

### 핵심 목표
1. **데이터 소유권 확보**: 모든 댓글 데이터를 자체 데이터베이스에 저장
2. **분리된 아키텍처**: 프론트엔드(Hugo)와 완전히 독립적인 마이크로서비스
3. **확장성**: 향후 기능 추가가 용이한 구조
4. **보안**: OAuth 2.0 + JWT 기반 안전한 인증/인가

### 비기능적 요구사항
- **성능**: 댓글 로딩 < 1초
- **가용성**: 99.9% uptime
- **확장성**: 동시 접속자 100명+ 지원
- **보안**: HTTPS, XSS/CSRF 방지

---

## 🗄️ 데이터베이스 설계

### 데이터베이스 선택: SQLite

**선택 이유**:
- ✅ 서버리스 (별도 DB 서버 불필요)
- ✅ 파일 기반 (백업 간편)
- ✅ 경량 (수 MB)
- ✅ 트랜잭션 지원
- ✅ 충분한 성능 (소규모 블로그)

**한계점 및 대응**:
- ⚠️ 동시 쓰기 제한 → WAL 모드 활성화
- ⚠️ 대규모 확장성 → 필요시 PostgreSQL 마이그레이션

### 스키마 설계

#### **users 테이블** - 사용자 정보

```sql
CREATE TABLE IF NOT EXISTS users (
    -- 구글로부터 받은 고유 사용자 ID (sub 클레임)
    id TEXT PRIMARY KEY,
    
    -- 사용자 기본 정보
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_picture_url TEXT,
    
    -- 권한 관리
    role TEXT NOT NULL DEFAULT 'user',  -- 'user' 또는 'admin'
    
    -- 타임스탬프
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 이메일 검색 최적화
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
```

**필드 설명**:

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | TEXT | Google OAuth `sub` 클레임 | `"112233445566778899"` |
| `name` | TEXT | 사용자 표시 이름 | `"신년기"` |
| `email` | TEXT | 이메일 주소 (고유) | `"user@example.com"` |
| `profile_picture_url` | TEXT | 프로필 이미지 URL | `"https://..."` |
| `role` | TEXT | 권한 등급 | `"user"` 또는 `"admin"` |
| `created_at` | DATETIME | 계정 생성 시간 | `"2025-01-30 12:00:00"` |

**역할(Role) 정의**:
- **`user`** (기본값): 일반 사용자
  - 댓글 작성 가능
  - 본인 댓글만 수정/삭제 가능 (10분 이내)
- **`admin`**: 관리자
  - 모든 댓글 수정/삭제 가능
  - 시간 제한 없음
  - 설정 파일(`config.py`)의 `ADMIN_EMAILS` 목록으로 지정

#### **comments 테이블** - 댓글 정보

```sql
CREATE TABLE IF NOT EXISTS comments (
    -- 자동 증가 댓글 ID
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- 어느 글에 달린 댓글인지 (마크다운의 'created' 타임스탬프)
    topic_id TEXT NOT NULL,
    
    -- 작성자 정보
    author_id TEXT NOT NULL,
    
    -- 대댓글 지원
    parent_id INTEGER DEFAULT NULL,
    
    -- 댓글 내용
    content TEXT NOT NULL,
    
    -- 타임스탬프
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- 외래 키 제약
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments (id) ON DELETE CASCADE
);

-- 특정 글의 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS idx_comments_topic_id ON comments (topic_id);

-- 사용자의 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments (author_id);

-- 대댓글 조회 최적화
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
```

**필드 설명**:

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | INTEGER | 댓글 고유 ID | `1`, `2`, `3`, ... |
| `topic_id` | TEXT | 글 식별자 (`created` frontmatter) | `"2025-01-30T12:00:00.000+09:00"` |
| `author_id` | TEXT | 작성자 ID (`users.id` 참조) | `"112233445566778899"` |
| `parent_id` | INTEGER | 부모 댓글 ID (대댓글용) | `NULL` (최상위) 또는 `1` |
| `content` | TEXT | 댓글 내용 | `"좋은 글 감사합니다!"` |
| `created_at` | DATETIME | 작성 시간 | `"2025-01-30 12:30:00"` |
| `updated_at` | DATETIME | 수정 시간 | `"2025-01-30 12:35:00"` |

**대댓글 구조 예시**:
```
- 댓글 1 (parent_id = NULL)
  - 대댓글 1-1 (parent_id = 1)
  - 대댓글 1-2 (parent_id = 1)
    - 대대댓글 1-2-1 (parent_id = 1-2의 id)
- 댓글 2 (parent_id = NULL)
```

---

## 🔌 API 설계

### 기본 정보

- **베이스 URL**: `https://api.yourdomain.com`
- **프로토콜**: HTTPS 필수
- **인증**: JWT (Bearer Token)
- **데이터 형식**: JSON

### 엔드포인트 명세

#### 1. **사용자 인증**

##### `GET /login/google`
**설명**: Google OAuth 로그인 프로세스 시작

**인증**: 불필요

**응답**: 구글 인증 페이지로 리디렉션

**흐름**:
```
Client → Backend → Google OAuth
```

---

##### `GET /auth/google/callback`
**설명**: Google OAuth 콜백, JWT 발급

**인증**: 불필요

**쿼리 파라미터**:
- `code`: Google이 발급한 인증 코드

**응답**: 
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "112233445566778899",
    "name": "신년기",
    "email": "user@example.com",
    "profile_picture_url": "https://...",
    "role": "user"
  }
}
```

**JWT Payload 구조**:
```json
{
  "sub": "112233445566778899",  // 사용자 ID
  "role": "admin",               // 사용자 역할
  "exp": 1678886400              // 만료 시간 (Unix timestamp)
}
```

---

#### 2. **댓글 조회**

##### `GET /api/comments`
**설명**: 특정 글의 모든 댓글 조회

**인증**: 불필요 (공개 API)

**쿼리 파라미터**:
- `topic_id` (required): 글 식별자

**요청 예시**:
```http
GET /api/comments?topic_id=2025-01-30T12:00:00.000+09:00
```

**응답 예시**:
```json
{
  "topic_id": "2025-01-30T12:00:00.000+09:00",
  "total": 3,
  "comments": [
    {
      "id": 1,
      "author": {
        "id": "112233445566778899",
        "name": "신년기",
        "profile_picture_url": "https://..."
      },
      "content": "좋은 글 감사합니다!",
      "parent_id": null,
      "created_at": "2025-01-30T12:30:00+09:00",
      "updated_at": "2025-01-30T12:30:00+09:00",
      "is_edited": false,
      "can_edit": true,    // 현재 사용자 수정 가능 여부
      "can_delete": true   // 현재 사용자 삭제 가능 여부
    },
    {
      "id": 2,
      "author": {
        "id": "998877665544332211",
        "name": "홍길동",
        "profile_picture_url": "https://..."
      },
      "content": "저도 궁금했던 내용이네요",
      "parent_id": 1,  // 대댓글
      "created_at": "2025-01-30T12:35:00+09:00",
      "updated_at": "2025-01-30T12:35:00+09:00",
      "is_edited": false,
      "can_edit": false,
      "can_delete": false
    }
  ]
}
```

---

#### 3. **댓글 작성**

##### `POST /api/comments`
**설명**: 새로운 댓글 작성

**인증**: 필수 (JWT)

**헤더**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**요청 본문**:
```json
{
  "topic_id": "2025-01-30T12:00:00.000+09:00",
  "content": "좋은 글 감사합니다!",
  "parent_id": null  // 대댓글이면 부모 댓글 ID
}
```

**응답** (201 Created):
```json
{
  "id": 1,
  "author": {
    "id": "112233445566778899",
    "name": "신년기",
    "profile_picture_url": "https://..."
  },
  "topic_id": "2025-01-30T12:00:00.000+09:00",
  "content": "좋은 글 감사합니다!",
  "parent_id": null,
  "created_at": "2025-01-30T12:30:00+09:00",
  "updated_at": "2025-01-30T12:30:00+09:00"
}
```

**에러 응답**:
- `401 Unauthorized`: JWT 없음 또는 유효하지 않음
- `400 Bad Request`: 필수 필드 누락
- `404 Not Found`: 부모 댓글이 존재하지 않음 (대댓글 작성 시)

---

#### 4. **댓글 수정**

##### `PUT /api/comments/{comment_id}`
**설명**: 기존 댓글 수정

**인증**: 필수 (JWT)

**인가 규칙**:
1. **Admin**: 언제나 가능
2. **User**: 본인 댓글 + 작성 후 10분 이내만 가능

**요청 예시**:
```http
PUT /api/comments/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "수정된 댓글 내용입니다"
}
```

**응답** (200 OK):
```json
{
  "id": 1,
  "content": "수정된 댓글 내용입니다",
  "updated_at": "2025-01-30T12:35:00+09:00",
  "is_edited": true
}
```

**에러 응답**:
- `401 Unauthorized`: JWT 없음 또는 유효하지 않음
- `403 Forbidden`: 
  - 다른 사용자의 댓글
  - 10분 초과 (일반 사용자인 경우)
- `404 Not Found`: 댓글이 존재하지 않음

---

#### 5. **댓글 삭제**

##### `DELETE /api/comments/{comment_id}`
**설명**: 댓글 삭제

**인증**: 필수 (JWT)

**인가 규칙**: 수정과 동일

**요청 예시**:
```http
DELETE /api/comments/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**응답** (204 No Content):
- 응답 본문 없음

**에러 응답**: 수정과 동일

**대댓글 처리**:
- `ON DELETE CASCADE` 설정으로 자동 삭제
- 또는 소프트 삭제 (`deleted_at` 필드) 구현 가능

---

## 🔐 인증 및 인가 시스템

### 인증 흐름 (Authentication Flow)

#### 1단계: Google OAuth 로그인

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Google

    User->>Frontend: "로그인" 버튼 클릭
    Frontend->>Backend: GET /login/google
    Backend->>Google: 인증 URL 요청
    Google-->>Backend: 인증 URL 반환
    Backend-->>Frontend: 리디렉션 (인증 URL)
    Frontend->>Google: 사용자 로그인 및 동의
    Google-->>Backend: GET /auth/google/callback?code=...
    Backend->>Google: code + Client Secret 전송
    Google-->>Backend: Access Token 발급
    Backend->>Google: 사용자 정보 요청 (Access Token)
    Google-->>Backend: 사용자 정보 (sub, name, email, picture)
    Backend->>Backend: DB에 사용자 저장/업데이트 + 역할 부여
    Backend->>Backend: JWT 생성 (sub, role, exp)
    Backend-->>Frontend: JWT 반환 + 원래 페이지로 리디렉션
    Frontend->>Frontend: JWT를 localStorage에 저장
```

#### 2단계: 역할 부여 로직

```python
# config.py
ADMIN_EMAILS = [
    "admin@example.com",
    "shinnk@example.com"
]

# auth.py
def assign_role(user_email: str) -> str:
    """이메일을 기반으로 역할 부여"""
    if user_email in ADMIN_EMAILS:
        return "admin"
    return "user"
```

#### 3단계: JWT 발급

```python
import jwt
from datetime import datetime, timedelta

def create_jwt(user_id: str, role: str) -> str:
    """JWT 생성"""
    payload = {
        "sub": user_id,           # 사용자 ID
        "role": role,             # 역할
        "exp": datetime.utcnow() + timedelta(hours=1)  # 1시간 후 만료
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
```

### 인가 흐름 (Authorization Flow)

#### JWT 검증

```python
from fastapi import Header, HTTPException

def verify_jwt(authorization: str = Header(...)) -> dict:
    """JWT 검증 및 페이로드 반환"""
    try:
        # "Bearer <token>" 형식에서 토큰 추출
        token = authorization.split(" ")[1]
        
        # JWT 검증
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="토큰이 만료되었습니다")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")
```

#### 권한 확인 로직

```python
from datetime import datetime, timedelta

def can_modify_comment(
    comment: Comment,
    user_id: str,
    user_role: str
) -> bool:
    """댓글 수정/삭제 권한 확인"""
    
    # 1. Admin은 언제나 가능
    if user_role == "admin":
        return True
    
    # 2. 본인 댓글이 아니면 불가능
    if comment.author_id != user_id:
        return False
    
    # 3. 작성 후 10분 이내인지 확인
    time_limit = timedelta(minutes=10)
    elapsed_time = datetime.utcnow() - comment.created_at
    
    if elapsed_time > time_limit:
        return False
    
    return True
```

---

## 🔗 Post ID 전략: `created` 타임스탬프

### 문제 정의

**요구사항**: 파일명이나 경로가 변경되어도 댓글이 유지되어야 함

**잘못된 접근**:
- ❌ URL 경로 사용: 파일 이동 시 댓글 소실
- ❌ 파일명 사용: 파일명 변경 시 댓글 소실
- ❌ 수동 ID 관리: 휴먼 에러 가능성

### 해결: `created` Frontmatter

**원칙**: 콘텐츠 생성 시점의 타임스탬프는 절대 변하지 않음

**포맷**: ISO 8601 (밀리초 포함)
```
YYYY-MM-DDTHH:mm:ss.sssZ07:00
```

**예시**:
```yaml
---
title: "Hugo로 블로그 만들기"
date: 2025-01-30
created: "2025-01-30T12:00:00.141+09:00"  # ← Post ID
tags: ["hugo", "blog"]
---
```

**Obsidian 자동 생성**:
- Templater 플러그인 사용
- `<% tp.date.now("YYYY-MM-DDTHH:mm:ss.SSSZ") %>`

**Hugo 템플릿에서 사용**:
```go-template
<!-- layouts/partials/comments.html -->
<div id="comments" data-topic-id="{{ .Params.created }}"></div>
```

**JavaScript에서 사용**:
```javascript
// static/js/comment-app.js
const topicId = document.getElementById('comments').dataset.topicId;

fetch(`/api/comments?topic_id=${encodeURIComponent(topicId)}`)
  .then(res => res.json())
  .then(data => renderComments(data.comments));
```

---

## 🎨 프론트엔드 통합

### HTML 구조

```html
<!-- layouts/partials/comments.html -->
<section id="comments-section" class="mt-12">
  <h2 class="text-2xl font-bold mb-4">댓글</h2>
  
  <!-- 로그인되지 않은 경우 -->
  <div id="comment-login" class="hidden">
    <a href="/login/google" class="btn btn-primary">
      Google 계정으로 로그인하여 댓글 작성
    </a>
  </div>
  
  <!-- 로그인된 경우 -->
  <div id="comment-form" class="hidden mb-6">
    <div class="flex items-center mb-2">
      <img id="user-avatar" src="" alt="" class="w-10 h-10 rounded-full">
      <span id="user-name" class="ml-2 font-semibold"></span>
    </div>
    <textarea 
      id="comment-input" 
      class="w-full p-3 border rounded"
      placeholder="댓글을 입력하세요..."
      rows="3"
    ></textarea>
    <button id="submit-comment" class="btn btn-primary mt-2">
      댓글 작성
    </button>
  </div>
  
  <!-- 댓글 목록 -->
  <div id="comments-list"></div>
</section>

<!-- topic_id 전달 -->
<script>
  window.TOPIC_ID = "{{ .Params.created }}";
</script>
<script src="/js/comment-app.js" defer></script>
```

### JavaScript 구현 (`comment-app.js`)

```javascript
const API_BASE_URL = 'https://api.yourdomain.com';
const TOPIC_ID = window.TOPIC_ID;

// 초기화
async function init() {
  const jwt = localStorage.getItem('jwt');
  
  if (jwt) {
    // 로그인 상태
    const user = parseJWT(jwt);
    showCommentForm(user);
  } else {
    // 비로그인 상태
    showLoginButton();
  }
  
  // 댓글 목록 로드
  await loadComments();
}

// JWT 파싱
function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(jsonPayload);
}

// 댓글 로드
async function loadComments() {
  const res = await fetch(
    `${API_BASE_URL}/api/comments?topic_id=${encodeURIComponent(TOPIC_ID)}`
  );
  const data = await res.json();
  renderComments(data.comments);
}

// 댓글 작성
async function submitComment() {
  const content = document.getElementById('comment-input').value;
  const jwt = localStorage.getItem('jwt');
  
  const res = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      topic_id: TOPIC_ID,
      content: content,
      parent_id: null
    })
  });
  
  if (res.ok) {
    document.getElementById('comment-input').value = '';
    await loadComments();
  }
}

// 댓글 렌더링
function renderComments(comments) {
  const container = document.getElementById('comments-list');
  container.innerHTML = comments.map(comment => `
    <div class="comment mb-4 p-4 border rounded" data-id="${comment.id}">
      <div class="flex items-center mb-2">
        <img src="${comment.author.profile_picture_url}" 
             class="w-8 h-8 rounded-full">
        <span class="ml-2 font-semibold">${comment.author.name}</span>
        <span class="ml-auto text-sm text-gray-500">
          ${new Date(comment.created_at).toLocaleString('ko-KR')}
        </span>
      </div>
      <div class="content">${escapeHtml(comment.content)}</div>
      ${comment.can_edit ? `
        <button onclick="editComment(${comment.id})" class="text-sm text-blue-600">
          수정
        </button>
      ` : ''}
      ${comment.can_delete ? `
        <button onclick="deleteComment(${comment.id})" class="text-sm text-red-600">
          삭제
        </button>
      ` : ''}
    </div>
  `).join('');
}

// XSS 방지
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 초기화 실행
init();
```

---

## 🔒 보안 고려사항

### 1. XSS (Cross-Site Scripting) 방지

**위협**: 악의적인 JavaScript 코드 삽입

**대응**:
```javascript
// 모든 사용자 입력을 HTML 이스케이핑
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### 2. CSRF (Cross-Site Request Forgery) 방지

**위협**: 인증된 사용자의 의도하지 않은 요청

**대응**:
- JWT 사용 (쿠키 기반 세션 대신)
- `SameSite` 쿠키 속성 (사용 시)

### 3. SQL Injection 방지

**위협**: 악의적인 SQL 쿼리 삽입

**대응**:
- ORM 사용 (SQLAlchemy 등)
- Prepared Statements
- 입력 검증 (Pydantic)

### 4. Rate Limiting

**위협**: DDoS, 스팸 댓글

**대응**:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/comments")
@limiter.limit("5/minute")  # 분당 5개 댓글만 허용
async def create_comment(...):
    ...
```

---

## 📊 데이터 흐름 다이어그램

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Hugo
    participant Backend
    participant DB

    Note over User,DB: 페이지 로드
    User->>Browser: 블로그 글 접속
    Browser->>Hugo: HTML 요청
    Hugo-->>Browser: 정적 HTML (topic_id 포함)
    Browser->>Backend: GET /api/comments?topic_id=...
    Backend->>DB: SELECT * FROM comments WHERE topic_id=...
    DB-->>Backend: 댓글 목록
    Backend-->>Browser: JSON 응답
    Browser->>Browser: 댓글 렌더링

    Note over User,DB: 로그인 (첫 댓글 작성 시)
    User->>Browser: "로그인" 클릭
    Browser->>Backend: GET /login/google
    Backend->>Browser: Google OAuth URL로 리디렉션
    Browser->>Google: 사용자 로그인
    Google-->>Browser: callback?code=...
    Browser->>Backend: GET /auth/google/callback?code=...
    Backend->>Google: code 교환 → Access Token
    Google-->>Backend: Access Token + 사용자 정보
    Backend->>DB: INSERT/UPDATE users
    Backend->>Backend: JWT 생성
    Backend-->>Browser: JWT 반환
    Browser->>Browser: localStorage에 JWT 저장

    Note over User,DB: 댓글 작성
    User->>Browser: 댓글 입력 후 "작성" 클릭
    Browser->>Backend: POST /api/comments (+ JWT)
    Backend->>Backend: JWT 검증
    Backend->>DB: INSERT INTO comments
    DB-->>Backend: 새 댓글 ID
    Backend-->>Browser: 새 댓글 데이터
    Browser->>Browser: UI 업데이트
```

---

## 🚀 다음 단계

### 구현 순서

1. **백엔드 구현** (8-16시간)
   - [ ] FastAPI 프로젝트 초기화
   - [ ] 데이터베이스 스키마 생성
   - [ ] OAuth 2.0 연동
   - [ ] API 엔드포인트 구현
   - [ ] 테스트 작성

2. **프론트엔드 구현** (4-8시간)
   - [ ] `comment-app.js` 작성
   - [ ] Hugo partial 템플릿
   - [ ] CSS 스타일링
   - [ ] 테스트

3. **배포** (4-8시간)
   - [ ] 환경 변수 설정
   - [ ] Fly.io/Railway 배포
   - [ ] CORS 설정
   - [ ] 모니터링 설정

### 관련 문서

- [api-architecture.md](api-architecture.md) - API 아키텍처 상세
- [../DESIGN_PRINCIPLES.md](../DESIGN_PRINCIPLES.md) - 설계 철학
- [README.md](README.md) - 백엔드 통합 개요

---

**마지막 업데이트**: 2025년 10월 30일
