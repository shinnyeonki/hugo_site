# API 아키텍처

이 문서는 댓글 백엔드 API의 전체 아키텍처와 구현 세부사항을 설명합니다.

## 🏗️ 아키텍처 개요

### 기술 스택

```
┌─────────────────────────────────────────┐
│         FastAPI Application              │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  Routers     │  │  Middleware     │ │
│  │  (Endpoints) │  │  - CORS         │ │
│  │              │  │  - Rate Limit   │ │
│  └──────────────┘  └─────────────────┘ │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  Services    │  │  Dependencies   │ │
│  │  (Logic)     │  │  - Auth         │ │
│  │              │  │  - DB           │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
                 │
                 ↓
        ┌─────────────────┐
        │   SQLite DB     │
        │   comments.db   │
        └─────────────────┘
```

### 디렉토리 구조

```
backend/
├── main.py                 # FastAPI 앱 진입점
├── config.py               # 설정 (환경 변수, 상수)
├── requirements.txt        # 의존성
│
├── app/
│   ├── __init__.py
│   ├── database.py         # DB 연결 및 세션
│   ├── models.py           # SQLAlchemy 모델
│   ├── schemas.py          # Pydantic 스키마
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py         # 인증 관련 엔드포인트
│   │   └── comments.py     # 댓글 관련 엔드포인트
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py # 인증 로직
│   │   └── comment_service.py # 댓글 로직
│   │
│   └── dependencies/
│       ├── __init__.py
│       └── auth.py         # JWT 검증 의존성
│
└── tests/
    ├── __init__.py
    ├── test_auth.py
    └── test_comments.py
```

---

## 🔧 주요 컴포넌트

### 1. FastAPI 애플리케이션 (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routers import auth, comments
from app.database import engine, Base
from config import settings

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(
    title="Comment API",
    description="Hugo 블로그 댓글 시스템 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 라우터 등록
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(comments.router, prefix="/api", tags=["Comments"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Comment API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### 2. 설정 관리 (`config.py`)

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # 기본 설정
    APP_NAME: str = "Comment API"
    DEBUG: bool = False
    
    # 데이터베이스
    DATABASE_URL: str = "sqlite:///./comments.db"
    
    # JWT 설정
    SECRET_KEY: str  # 환경 변수에서 로드
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 1
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "https://shinnyeonki.github.io",
        "http://localhost:1313"
    ]
    
    # Admin 이메일 목록
    ADMIN_EMAILS: List[str] = [
        "admin@example.com"
    ]
    
    # Rate Limiting
    RATE_LIMIT_COMMENTS: str = "5/minute"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 3. 데이터베이스 설정 (`app/database.py`)

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

# SQLite 엔진 생성 (WAL 모드 활성화)
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={
        "check_same_thread": False,  # SQLite용 설정
        "timeout": 10  # 락 대기 시간
    },
    echo=settings.DEBUG  # SQL 쿼리 로깅
)

# 세션 팩토리
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base 클래스
Base = declarative_base()

# Dependency: DB 세션 제공
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 4. 데이터 모델 (`app/models.py`)

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # Google sub
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    profile_picture_url = Column(String)
    role = Column(String, nullable=False, default="user")
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    topic_id = Column(String, nullable=False, index=True)
    author_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("comments.id", ondelete="CASCADE"), nullable=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
```

### 5. Pydantic 스키마 (`app/schemas.py`)

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    id: str
    profile_picture_url: Optional[str] = None
    role: str = "user"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    profile_picture_url: Optional[str]
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)

class CommentCreate(CommentBase):
    topic_id: str
    parent_id: Optional[int] = None

class CommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)

class CommentAuthor(BaseModel):
    id: str
    name: str
    profile_picture_url: Optional[str]
    
    class Config:
        from_attributes = True

class CommentResponse(BaseModel):
    id: int
    topic_id: str
    author: CommentAuthor
    parent_id: Optional[int]
    content: str
    created_at: datetime
    updated_at: datetime
    is_edited: bool
    can_edit: bool = False
    can_delete: bool = False
    
    class Config:
        from_attributes = True

class CommentsListResponse(BaseModel):
    topic_id: str
    total: int
    comments: List[CommentResponse]
```

---

## 🔐 인증 시스템

### JWT 유틸리티 (`app/services/auth_service.py`)

```python
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from config import settings

def create_access_token(data: dict) -> str:
    """JWT 생성"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> dict:
    """JWT 검증 및 페이로드 반환"""
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 만료되었습니다"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )

def assign_role(email: str) -> str:
    """이메일 기반 역할 부여"""
    if email in settings.ADMIN_EMAILS:
        return "admin"
    return "user"
```

### 인증 의존성 (`app/dependencies/auth.py`)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import verify_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """현재 인증된 사용자 정보 반환"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    return payload

async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Admin 권한 필요"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin 권한이 필요합니다"
        )
    return current_user
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### CORS란?

**문제**: 프론트엔드와 백엔드가 다른 도메인에 있을 때

```
프론트엔드: https://shinnyeonki.github.io
백엔드:    https://api.example.com

→ 브라우저의 Same-Origin Policy로 인해 요청 차단
```

**해결**: 백엔드에서 CORS 헤더 추가

### FastAPI CORS 설정

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    
    # 허용할 출처 (명시적으로 지정)
    allow_origins=[
        "https://shinnyeonki.github.io",  # 운영
        "http://localhost:1313"           # 개발
    ],
    
    # 자격 증명 (쿠키, Authorization 헤더) 허용
    allow_credentials=True,
    
    # 허용할 HTTP 메소드
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    
    # 허용할 헤더
    allow_headers=["*"],
    
    # 브라우저가 캐시할 수 있는 시간 (초)
    max_age=3600
)
```

### CORS Preflight 요청

**복잡한 요청**(POST + JSON + 커스텀 헤더)은 브라우저가 먼저 **OPTIONS** 요청을 보냄:

```http
OPTIONS /api/comments HTTP/1.1
Origin: https://shinnyeonki.github.io
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type
```

**백엔드 응답**:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://shinnyeonki.github.io
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

브라우저가 이 응답을 확인한 후 실제 POST 요청을 보냄.

### 보안 고려사항

**❌ 절대 하지 말 것**:
```python
# 모든 출처 허용 (보안 위험!)
allow_origins=["*"]

# 자격 증명 + 와일드카드 (불가능)
allow_origins=["*"]
allow_credentials=True  # 에러 발생
```

**✅ 권장 방법**:
```python
# 명시적 출처 지정
allow_origins=[
    "https://shinnyeonki.github.io",
    "http://localhost:1313"
]
allow_credentials=True
```

---

## 🚦 Rate Limiting

### 목적
- DDoS 공격 방지
- 스팸 댓글 방지
- 서버 리소스 보호

### 구현 (slowapi)

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/comments")
@limiter.limit("5/minute")  # IP당 분당 5개 요청
async def create_comment(...):
    ...
```

### 다양한 제한 전략

```python
# 1. 전역 제한
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 2. 엔드포인트별 제한
@limiter.limit("5/minute")  # 댓글 작성: 분당 5개
async def create_comment(...):
    ...

@limiter.limit("100/hour")  # 댓글 조회: 시간당 100개
async def get_comments(...):
    ...

# 3. 사용자별 제한 (JWT 기반)
def user_key_func(request: Request) -> str:
    token = request.headers.get("Authorization", "").split(" ")[1]
    payload = verify_token(token)
    return payload.get("sub", get_remote_address(request))

@limiter.limit("10/minute", key_func=user_key_func)
async def create_comment(...):
    ...
```

### Rate Limit 응답

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1677686460
Retry-After: 60

{
  "error": "Rate limit exceeded",
  "message": "분당 5개까지만 댓글을 작성할 수 있습니다."
}
```

---

## 📊 에러 처리

### 표준 에러 응답

```python
from fastapi import HTTPException

# 401 Unauthorized
raise HTTPException(
    status_code=401,
    detail="인증이 필요합니다"
)

# 403 Forbidden
raise HTTPException(
    status_code=403,
    detail="권한이 없습니다"
)

# 404 Not Found
raise HTTPException(
    status_code=404,
    detail="댓글을 찾을 수 없습니다"
)

# 422 Validation Error (Pydantic 자동)
# 요청 본문이 스키마와 맞지 않으면 자동 발생
```

### 커스텀 예외 핸들러

```python
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """전역 예외 처리"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.DEBUG else "서버 오류가 발생했습니다"
        }
    )
```

---

## 🚀 배포 전략

### 환경 변수 설정

```bash
# .env
SECRET_KEY=your-secret-key-here-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://api.example.com/auth/google/callback
ALLOWED_ORIGINS=["https://shinnyeonki.github.io","http://localhost:1313"]
ADMIN_EMAILS=["admin@example.com"]
DEBUG=False
```

### Fly.io 배포

1. **fly.toml 생성**:
```toml
app = "comment-api"

[build]
  builder = "paketobuildpacks/builder:base"

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

2. **배포 명령**:
```bash
fly deploy
fly secrets set SECRET_KEY=xxx
fly secrets set GOOGLE_CLIENT_ID=xxx
fly secrets set GOOGLE_CLIENT_SECRET=xxx
```

### Railway 배포

1. **GitHub 연동**
2. **환경 변수 설정** (Railway 대시보드)
3. **자동 배포** (Git push 시)

---

## 📈 모니터링 & 로깅

### 로깅 설정

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.post("/api/comments")
async def create_comment(...):
    logger.info(f"User {user_id} creating comment on {topic_id}")
    ...
```

### 헬스 체크

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected"  # DB 연결 확인
    }
```

---

## 🔮 향후 확장

### Phase 1 완료 후
- [ ] 댓글 좋아요/싫어요
- [ ] 댓글 신고 기능
- [ ] 이메일 알림
- [ ] Admin 대시보드

### Phase 2
- [ ] PostgreSQL 마이그레이션
- [ ] Redis 캐싱
- [ ] WebSocket 실시간 댓글
- [ ] Elasticsearch 검색

---

## 🔗 관련 문서

- [comment-system.md](comment-system.md) - 댓글 시스템 상세 설계
- [README.md](README.md) - 백엔드 통합 개요
- [../DESIGN_PRINCIPLES.md](../DESIGN_PRINCIPLES.md) - 설계 철학

---

**마지막 업데이트**: 2025년 10월 30일
