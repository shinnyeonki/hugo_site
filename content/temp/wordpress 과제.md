---
title: wordpress 과제
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: temp/wordpress 과제.md
draft: true
---
wordpress docker 이미지를 사용하되 컴포즈를 통해 내부 네트워크에서 db 컨테이너와 함께 사용하자

[맥 +docker compose 조합 compose 문서](https://docs.docker.com/compose/install/)


먼저 wordpress 폴더를 만들어서 들어가자 여기에 db 가 사용하는 data 폴더 docker compose yml 파일등이 들어간다
```bash
mkdir wordpress
cd wordpress
```


내부 네트워크에서 db와 wordpress 가 통신한다
오직 services.wordpress.port 가 현재 10202:80 으로 들어가 있는데 {접속포트}:80 이므로 접속할 포트(일반적으로 80) 로 설정한다
```yml
networks:
  wordpress:
    external: false

services:
  # 데이터베이스
  db:
    # We use a mariadb image which supports both amd64 & arm64 architecture
    image: mariadb:10.6.4-focal
    # If you really want to use MySQL, uncomment the following line
    #image: mysql:8.0.27
    container_name: mariadb_for_wordpress
    command: '--default-authentication-plugin=mysql_native_password'
    environment:
      - MYSQL_ROOT_PASSWORD=somewordpress
      - MYSQL_DATABASE=wordpress
      - MYSQL_USER=wordpress
      - MYSQL_PASSWORD=wordpress
    restart: always
    networks:
      - wordpress
    volumes:
      - ./db_data:/var/lib/mysql
  # 워드프레스
  wordpress:
    image: wordpress:latest
    container_name: wordpress
    ports:
      - 10202:80
    restart: always
    environment:
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_USER=wordpress
      - WORDPRESS_DB_PASSWORD=wordpress
      - WORDPRESS_DB_NAME=wordpress
    networks:
      - wordpress
    depends_on:
      - db
```


컨테이너 실행
```bash
docker-compose -f wordpress-compose.yml up -d
```


브라우저에서 localhost:{설정한 포트} 접속


삭제할때 data 파일 까지 완전 삭제
```bash
docker-conpose -f wordpress-compose.yml down --rmi all
```
