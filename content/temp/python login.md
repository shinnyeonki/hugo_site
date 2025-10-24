---
title: python login
date: 2025-10-24T20:53:44+09:00
lastmod: 2025-10-24T20:53:44+09:00
resource-path: temp/python login.md
draft: true
---
`refresh_token`은 JWT 인증 시스템에서 중요한 역할을 합니다. 일반적으로 `access_token`은 짧은 유효 기간을 가지며, 클라이언트가 보호된 리소스에 접근할 때 사용됩니다. 반면, `refresh_token`은 긴 유효 기간을 가지며, 만료된 `access_token`을 갱신하는 데 사용됩니다. 이를 통해 사용자는 매번 로그인하지 않고도 안전하게 세션을 유지할 수 있습니다.

현재 코드에서는 `access_token`만 발행하고 있으며, `refresh_token`이 누락되어 있습니다. 이를 추가하여 완전한 JWT 인증 시스템을 구현해보겠습니다.

---

### 1. `refresh_token` 추가를 위한 설정

Flask-JWT-Extended는 `create_refresh_token()` 함수를 제공하며, 이를 사용하여 `refresh_token`을 생성할 수 있습니다. 또한, `@jwt_required(refresh=True)` 데코레이터를 사용하여 `refresh_token`을 검증하고 새로운 `access_token`을 발급할 수 있습니다.

---

### 2. 최종 코드 (Refresh Token 포함)

```python
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
    verify_jwt_in_request_optional,
)
import requests

app = Flask(__name__)

# JWT 설정
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # 실제 서비스에서는 보안적으로 안전한 값을 사용하세요.
jwt = JWTManager(app)

# 로그인 API 엔드포인트
@app.route('/login', methods=['POST'])
def login():
    # 클라이언트로부터 ID와 비밀번호 수신
    user_id = request.json.get('id', None)
    user_password = request.json.get('password', None)

    if not user_id or not user_password:
        return jsonify({"msg": "ID와 비밀번호를 입력해주세요."}), 400

    # 외부 API로 인증 요청
    try:
        response = requests.post(
            'https://sso1.mju.ac.kr/mju/userCheck.do',
            data={
                'id': user_id,
                'passwrd': user_password
            }
        )

        # JSON 응답 파싱
        api_response = response.json()

        # 로그인 성공 여부 확인
        if api_response.get('error') == '0000':
            # JWT 토큰 생성
            access_token = create_access_token(identity=user_id)
            refresh_token = create_refresh_token(identity=user_id)
            return jsonify(access_token=access_token, refresh_token=refresh_token), 200
        else:
            # 로그인 실패 메시지 반환
            error_message = api_response.get('error_message', '로그인 실패: 알 수 없는 오류')
            return jsonify({"msg": error_message}), 401

    except Exception as e:
        return jsonify({"msg": f"외부 API 요청 중 오류 발생: {str(e)}"}), 500


# Refresh Token으로 Access Token 갱신
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200


# before_request 훅을 사용하여 전역 보호 설정
@app.before_request
def protect_routes():
    # 로그인 경로와 Refresh Token 경로는 예외 처리
    if request.path in ['/login', '/refresh'] and request.method == 'POST':
        return

    # JWT 토큰 검증
    from flask_jwt_extended import verify_jwt_in_request
    try:
        verify_jwt_in_request()
    except Exception as e:
        return jsonify({"msg": "토큰이 유효하지 않거나 누락되었습니다."}), 401


# 테스트용 보호된 엔드포인트
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run(debug=True)
```

---

### 3. 코드 설명

#### 1) `refresh_token` 발행
- `/login` 엔드포인트에서 `create_refresh_token(identity=user_id)`를 사용하여 `refresh_token`을 생성합니다.
- 클라이언트에게 `access_token`과 함께 `refresh_token`을 반환합니다.

#### 2) `refresh_token`으로 `access_token` 갱신
- `/refresh` 엔드포인트를 추가하여 `refresh_token`을 검증하고 새로운 `access_token`을 발급합니다.
- `@jwt_required(refresh=True)` 데코레이터를 사용하여 `refresh_token`의 유효성을 검사합니다.

#### 3) 예외 처리
- `/login`과 `/refresh` 경로는 `@app.before_request` 훅에서 예외 처리하여 JWT 토큰 없이 접근할 수 있도록 합니다.

---

### 4. 실행 방법

1. Flask 애플리케이션을 실행합니다.
   ```bash
   python app.py
   ```

2. `/login`으로 POST 요청을 보내어 JWT 토큰을 발급받습니다.
   ```bash
   curl -X POST http://127.0.0.1:5000/login \
   -H "Content-Type: application/json" \
   -d '{"id": "rightId", "password": "rightPasswd"}'
   ```
   - **응답 예시**
     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

3. `refresh_token`을 사용하여 새로운 `access_token`을 발급받습니다.
   ```bash
   curl -X POST http://127.0.0.1:5000/refresh \
   -H "Authorization: Bearer <발급받은_refresh_token>"
   ```
   - **응답 예시**
     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

4. 보호된 엔드포인트(`/protected`)에 접근합니다.
   ```bash
   curl -X GET http://127.0.0.1:5000/protected \
   -H "Authorization: Bearer <발급받은_access_token>"
   ```
   - **응답 예시**
     ```json
     {
       "logged_in_as": "rightId"
     }
     ```

---

### 5. 주요 장점

1. **세션 유지**: `refresh_token`을 사용하여 사용자가 매번 로그인하지 않고도 안전하게 세션을 유지할 수 있습니다.
2. **보안 강화**: `access_token`의 유효 기간을 짧게 설정하여 보안성을 높이고, `refresh_token`을 통해 필요한 경우만 새로운 `access_token`을 발급합니다.
3. **유연성**: `refresh_token`을 관리하여 사용자 경험을 개선할 수 있습니다.

---

### 6. 주의사항

1. **유효 기간 설정**:
   - `access_token`과 `refresh_token`의 유효 기간을 적절히 설정해야 합니다.
   - Flask-JWT-Extended의 `JWT_ACCESS_TOKEN_EXPIRES`와 `JWT_REFRESH_TOKEN_EXPIRES` 설정을 사용하여 조정할 수 있습니다.
     ```python
     app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)  # 15분
     app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)    # 30일
     ```

2. **HTTPS 사용**: `refresh_token`은 민감한 정보이므로 HTTPS를 통해 통신해야 합니다.

3. **토큰 저장 및 관리**: 클라이언트 측에서 `refresh_token`을 안전하게 저장하고 관리해야 합니다. 일반적으로 HTTP-only 쿠키를 사용하는 것이 좋습니다.

---

이제 `refresh_token`을 포함한 완전한 JWT 인증 시스템을 구현했습니다. 이를 통해 사용자는 더 안전하고 편리하게 인증을 유지할 수 있습니다.














---
---
---

Flask 애플리케이션을 적절히 분리하고 구조화하는 것은 프로젝트의 유지보수성과 확장성을 높이는 데 매우 중요합니다. 아래에서는 Flask 애플리케이션을 모듈화하고, 데이터베이스 초기화 및 파일 구조를 설명하겠습니다.

---

### 1. **파일 분리의 목적**

Flask 프로젝트를 분리하는 주요 목적은 다음과 같습니다:
- **가독성**: 코드가 길어질수록 한 파일에 모든 코드를 작성하면 관리하기 어렵습니다.
- **재사용성**: 특정 기능(예: 데이터베이스 관리, 인증)을 별도의 모듈로 분리하면 다른 프로젝트에서도 쉽게 재사용할 수 있습니다.
- **유지보수성**: 코드를 기능별로 나누면 수정이나 디버깅이 용이해집니다.

---

### 2. **기본적인 파일 구조**

아래는 Flask 프로젝트를 분리한 기본적인 파일 구조입니다:

```
mju_ecs_test/
├── app/
│   ├── __init__.py          # Flask 앱 초기화
│   ├── models.py            # 데이터베이스 모델 정의
│   ├── routes.py            # API 엔드포인트 정의
│   ├── auth.py              # 인증 관련 로직 (JWT 포함)
│   └── db.py                # 데이터베이스 초기화 및 연결
├── migrations/              # 데이터베이스 마이그레이션 파일 (옵션)
├── config.py                # 환경 설정
├── requirements.txt         # 의존성 목록
└── run.py                   # 애플리케이션 실행 스크립트
```

---

### 3. **각 파일의 역할**

#### 1) `run.py` (애플리케이션 실행 스크립트)
- Flask 애플리케이션을 실행하는 진입점입니다.
- 데이터베이스 초기화를 여기서 수행할 수 있습니다.

```python
# run.py
from app import create_app
from app.db import init_db

app = create_app()

if __name__ == '__main__':
    # 데이터베이스 초기화
    init_db()
    app.run(debug=True)
```

---

#### 2) `app/__init__.py` (Flask 앱 초기화)
- Flask 애플리케이션 객체를 생성하고, 라우트와 확장을 등록합니다.

```python
# app/__init__.py
from flask import Flask
from flask_jwt_extended import JWTManager
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    
    # 환경 설정 로드
    app.config.from_object('config')

    # JWT 초기화
    jwt = JWTManager(app)

    # 라우트 등록
    register_routes(app)

    return app
```

---

#### 3) `config.py` (환경 설정)
- JWT 비밀 키, 데이터베이스 경로 등의 환경 설정을 관리합니다.

```python
# config.py
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_jwt_secret_key')
    DATABASE_PATH = os.getenv('DATABASE_PATH', 'users.db')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 900))  # 15분
    JWT_REFRESH_TOKEN_EXPIRES = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 2592000))  # 30일
```

---

#### 4) `app/db.py` (데이터베이스 초기화 및 연결)
- 데이터베이스 초기화 및 연결을 담당합니다.
- 처음 실행 시 데이터베이스가 없으면 자동으로 생성합니다.

```python
# app/db.py
import sqlite3
from config import Config

def init_db():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS USERS (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # 딕셔너리 형태로 결과 반환
    return conn
```

---

#### 5) `app/models.py` (데이터베이스 모델)
- 데이터베이스와 상호작용하는 함수를 정의합니다.

```python
# app/models.py
from .db import get_db_connection

def add_user_to_db(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT OR IGNORE INTO USERS (id) VALUES (?)', (user_id,))
    conn.commit()
    conn.close()

def is_user_in_db(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM USER WHERE id = ?', (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result is not None
```

---

#### 6) `app/auth.py` (인증 관련 로직)
- JWT 토큰 발행 및 갱신 로직을 포함합니다.

```python
# app/auth.py
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

def generate_tokens(user_id):
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token
```

---

#### 7) `app/routes.py` (API 엔드포인트 정의)
- `/login`, `/refresh`, `/protected` 같은 API 엔드포인트를 정의합니다.

```python
# app/routes.py
from flask import request, jsonify
from .auth import generate_tokens
from .models import add_user_to_db, is_user_in_db
import requests

def register_routes(app):
    @app.route('/login', methods=['POST'])
    def login():
        user_id = request.json.get('id', None)
        user_password = request.json.get('password', None)

        if not user_id or not user_password:
            return jsonify({"msg": "ID와 비밀번호를 입력해주세요."}), 400

        try:
            response = requests.post(
                'https://sso1.mju.ac.kr/mju/userCheck.do',
                data={'id': user_id, 'passwrd': user_password}
            )
            api_response = response.json()

            if api_response.get('error') == '0000':
                if not is_user_in_db(user_id):
                    add_user_to_db(user_id)
                access_token, refresh_token = generate_tokens(user_id)
                return jsonify(access_token=access_token, refresh_token=refresh_token), 200
            else:
                return jsonify({"msg": api_response.get('error_message', '로그인 실패')}), 401
        except Exception as e:
            return jsonify({"msg": f"외부 API 요청 중 오류 발생: {str(e)}"}), 500

    @app.route('/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify(access_token=new_access_token), 200

    @app.route('/protected', methods=['GET'])
    @jwt_required()
    def protected():
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200
```

---

### 4. **설명 요약**

1. **모듈화**:
   - 각 기능을 별도의 파일로 분리하여 관리합니다.
   - 예: 데이터베이스(`db.py`), 인증(`auth.py`), 라우트(`routes.py`) 등.

2. **초기화**:
   - `run.py`에서 애플리케이션을 실행하며, 데이터베이스 초기화를 수행합니다.
   - 데이터베이스가 없는 경우 자동으로 생성됩니다.

3. **환경 설정**:
   - `config.py`에서 환경 변수를 통해 설정을 관리합니다.

---

### 5. **추가 고려사항**

1. **테스트**:
   - 단위 테스트를 위해 각 모듈을 독립적으로 테스트할 수 있도록 설계합니다.

2. **확장성**:
   - SQLite 대신 MySQL 또는 PostgreSQL을 사용하려면 `db.py`를 수정하면 됩니다.

3. **마이그레이션 도구**:
   - 데이터베이스 스키마 변경을 관리하기 위해 Alembic 같은 마이그레이션 도구를 사용할 수 있습니다.

---

이렇게 파일을 분리하고 구조화하면 프로젝트가 더 체계적이고 유지보수가 쉬워집니다. 필요한 경우 추가적인 설명이나 코드를 요청해주세요!