---
title: scp 명령어
resource-path: 02.inbox/Notion/Notion/파일 시스템/scp 명령어.md
---
`**scp**` (Secure Copy Protocol) 명령어는 로컬 시스템과 원격 시스템 간에 파일 및 디렉토리를 안전하게 복사하는 데 사용됩니다. 아래는 몇 가지 `**scp**` 명령어 예제입니다.

1. local to server
    ```
    scp /path/to/local/file.txt username@remote_server:/path/to/remote/directory/
    ```
    
    - `**/path/to/local/file.txt**`: 로컬 시스템에서 복사하려는 파일 경로
    - `**username**`: 원격 서버의 사용자 이름
    - `**remote_server**`: 원격 서버의 호스트 이름 또는 IP 주소
    - `**/path/to/remote/directory/**`: 원격 서버에서 복사하려는 디렉토리 경로
2. server to local
    
    ```
    scp username@remote_server:/path/to/remote/file.txt /path/to/local/directory/
    ```
    
    - `**username**`: 원격 서버의 사용자 이름
    - `**remote_server**`: 원격 서버의 호스트 이름 또는 IP 주소
    - `**/path/to/remote/file.txt**`: 원격 서버에서 복사하려는 파일 경로
    - `**/path/to/local/directory/**`: 로컬 시스템에서 복사하려는 디렉토리 경로
3. directory
    
    ```shell
    scp -r username@remote_server:/path/to/remote/directory/ /path/to/local/
    ```
    
    - `**r**` 옵션은 디렉토리를 재귀적으로 복사하도록 합니다.
4. server to server
    
    ```
    scp username@remote_server:/path/to/remote/file.txt username@local_server:/path/to/local/directory/
    ```
    
    이 명령은 원격 서버에서 파일을 로컬 서버로 가져올 때 사용됩니다.
    

위의 예제들은 `**scp**` 명령어를 사용하여 파일 및 디렉토리를 복사하는 기본적인 방법을 보여줍니다. 사용 사례 및 요구 사항에 따라 다양한 옵션을 사용할 수 있으며, SSH 키 인증 및 비밀번호 인증을 지원합니다.