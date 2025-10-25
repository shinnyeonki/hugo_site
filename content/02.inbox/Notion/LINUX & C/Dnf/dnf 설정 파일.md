---
title: dnf 설정 파일
resource-path: 02.inbox/Notion/LINUX & C/Dnf/dnf 설정 파일.md
---
```
설정파일은 기본적으로 전역구성파일 /etc/dnf/dnf.conf 파일을 따르지만
각각의 저장소의 우선순위는 /etc/yum.repo.d/*.repo 파일을 우선적으로 따른다
```


```
[main]
; basic option
allow_vendor_change=True ; RPM 패키지를 업그레이드, 다운그레이드할 때 벤더(패키지 제공자)를 변경
arch=auto ; 시스템 아키텍처를 자동으로 감지
assumeno=False ; 대화형 질문에 "아니요"로 자동 응답
assumeyes=False ; 대화형 질문에 "예"로 자동 응답
autocheck_running_kernel=True ; DNF가 작동 중인 커널을 자동으로 확인하여 설치 중인 커널에 대한 업그레이드를 방지
basearch=auto ; 기본 아키텍처를 자동으로 설정
best=False ; 최적의 패키지 선택 사용 여부
cachedir= ; 패키지 캐시 디렉터리 설정
cacheonly=False ; 패키지 캐시만 사용하고 다운로드하지 않음
check_config_file_age=True ; dnf.conf 파일의 나이를 확인하여 리포지토리 메타데이터 갱신 여부 결정
clean_requirements_on_remove=True ; 패키지 삭제 시 해당 패키지의 요구사항도 삭제
config_file_path=/etc/dnf/dnf.conf ; DNF 설정 파일의 경로 설정
debuglevel=2 ; 디버그 레벨 설정
debug_solver=False ; 해결기 디버그 모드 사용 여부
defaultyes=False ; 대화형 질문에 기본으로 "예"로 응답
diskspacecheck=True ; 설치 공간 확인 사용 여부
errorlevel=3 ; 오류 메시지 레벨 설정
exclude_from_weak= ; 약한 의존성에서 제외할 패키지 목록
exclude_from_weak_autodetect=True ; 약한 의존성에서 자동으로 제외할 패키지 감지 사용 여부
exit_on_lock=False ; 다른 DNF 프로세스가 실행 중일 때 종료 여부
gpgkey_dns_verification=False ; GPG 키의 DNS 확인 사용 여부
group_package_types=default,mandatory ; 그룹 패키지 유형 설정
ignorearch=False ; 패키지 아키텍처 무시 여부
installonlypkgs= ; 설치 후 삭제하지 않을 패키지 목록
installonly_limit=3 ; 설치 후 삭제하지 않을 패키지 수 제한
installroot= ; 설치 루트 디렉터리 설정
install_weak_deps=True ; 약한 의존성 설치 여부
keepcache=False ; 패키지 캐시 보존 여부
logdir=/var/log ; 로그 디렉터리 설정
logfilelevel=9 ; 로그 파일 레벨 설정
log_compress=False ; 로그 압축 사용 여부
log_rotate=4 ; 로그 파일 로테이션 설정
log_size=1M ; 로그 파일 크기 설정
metadata_timer_sync= ; 메타데이터 타이머 동기화 설정
module_obsoletes=False ; 모듈 갱신 사용 여부
module_platform_id= ; 모듈 플랫폼 ID 설정
module_stream_switch=False ; 모듈 스트림 전환 사용 여부
multilib_policy=best ; 멀티립 정책 설정
obsoletes=True ; 오래된 패키지 대체 설정
persistdir=/var/lib/dnf ; 지속 디렉터리 설정
pluginconfpath=/etc/dnf/plugins ; 플러그인 설정 파일 경로 설정
pluginpath= ; 플러그인 경로 설정
plugins=True ; 플러그인 사용 여부
protected_packages= ; 보호된 패키지 목록
protect_running_kernel=True ; 실행 중인 커널 보호 여부
releasever= ; 릴리즈 버전 설정
reposdir= ; 리포지토리 디렉터리 설정
rpmverbosity=info ; RPM 패키지 설치 중 로그 레벨 설정
strict=True ; 엄격한 의존성 해결 사용 여부
tsflags= ; 트랜잭션 플래그 설정
upgrade_group_objects_upgrade=True ; 그룹 객체 업그레이드 사용 여부
varsdir=/etc/dnf/vars,/etc/yum/vars ; 변수 디렉터리 설정
zchunk=True ; Zchunk 패키지 포맷 사용 여부

; color option
color=auto ; 명령어 출력에 색상 사용 설정 (옵션: "auto", "never", "always")
color_list_available_downgrade=magenta ; 업그레이드 대상보다 오래된 사용 가능한 패키지 색상 설정
color_list_available_install=bold,cyan ; 설치 가능한 패키지 색상 설정
color_list_available_reinstall=bold,underline,green ; 재설치 가능한 패키지 색상 설정
color_list_available_upgrade=bold,blue ; 업그레이드 가능한 패키지 색상 설정
color_list_installed_extra=bold,red ; 설치된 패키지 중 사용 가능한 버전이 없는 패키지 색상 설정
color_list_installed_newer=bold,yellow ; 설치된 패키지 중 사용 가능한 버전보다 새로운 패키지 색상 설정
color_list_installed_older=yellow ; 설치된 패키지 중 사용 가능한 버전보다 오래된 패키지 색상 설정
color_list_installed_reinstall=cyan ; 재설치 가능한 설치된 패키지 색상 설정
color_search_match=bold,magenta ; 검색 결과에서 일치하는 패턴 색상 설정
color_update_installed=red ; 업데이트된 패키지 색상 설정
color_update_local=green ; @commandline 리포지토리에서 설치된 로컬 패키지 색상 설정
color_update_remote=bold,green ; 원격 리포지토리에서 설치/업그레이드/다운그레이드된 패키지 색상 설정

; duplicate option Repo 파일에도 사용가능하다
bandwidth=0 ; 다운로드 대역폭 제한 (0은 무제한)
countme=False ; 일주일에 한 번 무작위로 선택된 metalink/mirrorlist 쿼리에 특수 플래그 추가 여부
deltarpm=True ; 델타 RPM 파일 사용 여부
deltarpm_percentage=75 ; 델타 RPM 사용할 상대 크기 설정 (기본값 75%)
enablegroups=True ; 리포지토리에서 패키지 그룹 사용 여부
excludepkgs= ; 모든 작업에서 제외할 패키지 목록
fastestmirror=False ; 가장 빠른 미러 사용 여부
gpgcheck=False ; 리포지토리에서 패키지 GPG 서명 검증 여부
includepkgs= ; 모든 작업에 포함할 패키지 목록
ip_resolve= ; DNF가 호스트 이름을 해결하는 방법 설정 (옵션: '4', '6', 또는 비워둠)
localpkg_gpgcheck=False ; 로컬 패키지의 GPG 서명 검증 여부
max_parallel_downloads=3 ; 동시 다운로드 최대 개수 설정 (기본값 3, 최대 20)
metadata_expire= ; 리모트 리포지토리 메타데이터 업데이트 주기 설정
minrate=1000 ; 최소 속도 임계값 설정
password= ; 기본 HTTP 인증을 위한 비밀번호 설정
proxy= ; 프록시 서버 URL 설정
proxy_username= ; 프록시 서버 연결을 위한 사용자 이름 설정
proxy_password= ; 프록시 서버 연결을 위한 비밀번호 설정
proxy_auth_method=any ; 프록시 서버의 인증 메서드 설정
proxy_sslcacert= ; 프록시 SSL 인증서를 검증하기 위한 CA 인증서 파일 경로 설정
proxy_sslverify=True ; 프록시 서버 연결 시 SSL 인증 검증 여부
proxy_sslclientcert= ; 프록시 서버 연결을 위한 클라이언트 SSL 인증서 파일 경로 설정
proxy_sslclientkey= ; 프록시 서버 연결을 위한 클라이언트 SSL 개인 키 파일 경로 설정
repo_gpgcheck=False ; 리포지토리 메타데이터의 GPG 서명 검증 여부
retries=10 ; 패키지 다운로드 재시도 횟수 설정 (0은 무한 재시도)
skip_if_unavailable=False ; 사용 불가능한 리포지토리를 건너뛰고 계속 실행 여부
sslcacert= ; SSL 인증서 검증을 위한 CA 인증서 파일 경로 설정
sslverify=True ; 원격 SSL 인증서 검증 여부
sslverifystatus=False ; 서버 인증서의 폐지 상태 검증 여부
sslclientcert= ; 원격 사이트에 연결하기 위한 클라이언트 SSL 인증서 파일 경로 설정
sslclientkey= ; 원격 사이트에 연결하기 위한 클라이언트 SSL 개인 키 파일 경로 설정
throttle=0 ; 다운로드 속도 제한 설정 (0은 무제한)
timeout=30 ; 연결 대기 시간 제한 설정
username= ; 기본 HTTP 인증을 위한 사용자 이름 설정
user_agent= ; DNF가 HTTP 요청에 포함할 User-Agent 문자열 설정
```

  
test.repo  

```
[test repo]
baseurl=[] ; 저장소의 URL. 여기에 저장소의 URL을 입력하세요.
cost=1000 ; 이 저장소의 비용 설정 (낮을수록 선호됨)
enabled=True ; 이 저장소를 활성화 (True) 또는 비활성화 (False) 시킵니다.
gpgkey=[] ; GPG 키 파일의 URL 목록. 필요한 경우 여기에 GPG 키 파일의 URL을 입력하세요.
metalink=None ; 저장소의 메타링크 URL. 필요한 경우 여기에 메타링크 URL을 입력하세요.
mirrorlist=None ; 저장소의 미러 목록 URL. 필요한 경우 여기에 미러 목록 URL을 입력하세요.
module_hotfixes=False ; 모듈 RPM 필터링 비활성화 여부 (True 또는 False)
name=test repo ; 저장소의 이름. 여기에 저장소의 사람이 읽을 수 있는 이름을 입력하세요.
priority=99 ; 저장소의 우선순위 설정 (낮을수록 우선순위가 높음)
type=rpm-md ; 저장소 메타데이터 유형 (rpm-md 또는 다른 지원되는 값)

; duplicate option dnf.repo 파일에도 사용가능하다
bandwidth=0 ; 다운로드 대역폭 제한 (0은 무제한)
countme=False ; 일주일에 한 번 무작위로 선택된 metalink/mirrorlist 쿼리에 특수 플래그 추가 여부
deltarpm=True ; 델타 RPM 파일 사용 여부
deltarpm_percentage=75 ; 델타 RPM 사용할 상대 크기 설정 (기본값 75%)
enablegroups=True ; 리포지토리에서 패키지 그룹 사용 여부
excludepkgs= ; 모든 작업에서 제외할 패키지 목록
fastestmirror=False ; 가장 빠른 미러 사용 여부
gpgcheck=False ; 리포지토리에서 패키지 GPG 서명 검증 여부
includepkgs= ; 모든 작업에 포함할 패키지 목록
ip_resolve= ; DNF가 호스트 이름을 해결하는 방법 설정 (옵션: '4', '6', 또는 비워둠)
localpkg_gpgcheck=False ; 로컬 패키지의 GPG 서명 검증 여부
max_parallel_downloads=3 ; 동시 다운로드 최대 개수 설정 (기본값 3, 최대 20)
metadata_expire= ; 리모트 리포지토리 메타데이터 업데이트 주기 설정
minrate=1000 ; 최소 속도 임계값 설정
password= ; 기본 HTTP 인증을 위한 비밀번호 설정
proxy= ; 프록시 서버 URL 설정
proxy_username= ; 프록시 서버 연결을 위한 사용자 이름 설정
proxy_password= ; 프록시 서버 연결을 위한 비밀번호 설정
proxy_auth_method=any ; 프록시 서버의 인증 메서드 설정
proxy_sslcacert= ; 프록시 SSL 인증서를 검증하기 위한 CA 인증서 파일 경로 설정
proxy_sslverify=True ; 프록시 서버 연결 시 SSL 인증 검증 여부
proxy_sslclientcert= ; 프록시 서버 연결을 위한 클라이언트 SSL 인증서 파일 경로 설정
proxy_sslclientkey= ; 프록시 서버 연결을 위한 클라이언트 SSL 개인 키 파일 경로 설정
repo_gpgcheck=False ; 리포지토리 메타데이터의 GPG 서명 검증 여부
retries=10 ; 패키지 다운로드 재시도 횟수 설정 (0은 무한 재시도)
skip_if_unavailable=False ; 사용 불가능한 리포지토리를 건너뛰고 계속 실행 여부
sslcacert= ; SSL 인증서 검증을 위한 CA 인증서 파일 경로 설정
sslverify=True ; 원격 SSL 인증서 검증 여부
sslverifystatus=False ; 서버 인증서의 폐지 상태 검증 여부
sslclientcert= ; 원격 사이트에 연결하기 위한 클라이언트 SSL 인증서 파일 경로 설정
sslclientkey= ; 원격 사이트에 연결하기 위한 클라이언트 SSL 개인 키 파일 경로 설정
throttle=0 ; 다운로드 속도 제한 설정 (0은 무제한)
timeout=30 ; 연결 대기 시간 제한 설정
username= ; 기본 HTTP 인증을 위한 사용자 이름 설정
user_agent= ; DNF가 HTTP 요청에 포함할 User-Agent 문자열 설정
```