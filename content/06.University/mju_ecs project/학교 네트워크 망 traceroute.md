---
title: 학교 네트워크 망 traceroute
resource-path: 06.University/mju_ecs project/학교 네트워크 망 traceroute.md
aliases:
tags:
date: 2025-06-20T02:31:54+09:00
lastmod: 2025-06-27T19:51:49+09:00
---
학교 강의실별 와이파이 접속시

```bash
[ ~/source/projects/ryugod master ] $ traceroute google.com
traceroute to google.com (172.217.161.238), 64 hops max, 40 byte packets
 1  192.168.0.1 (192.168.0.1)  4.016 ms  10.352 ms  4.851 ms
 2  117.17.157.1 (117.17.157.1)  12.000 ms  5.915 ms  5.870 ms
 3  10.10.13.254 (10.10.13.254)  12.100 ms  3.874 ms  8.998 ms
 4  202.30.111.4 (202.30.111.4)  3.789 ms  8.036 ms  3.908 ms
 5  202.30.111.20 (202.30.111.20)  7.132 ms  3.753 ms  8.286 ms
```

mjuwlan 와이파이 접속시

```bash
[ ~/source/projects/ryugod master ] $ traceroute google.com
traceroute to google.com (142.250.76.142), 64 hops max, 40 byte packets
 1  192.168.42.253 (192.168.42.253)  5.708 ms  4.067 ms  3.655 ms
 2  10.10.10.254 (10.10.10.254)  5.003 ms  4.274 ms  3.686 ms
 3  * * *
```