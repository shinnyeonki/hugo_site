---
title: 임베디드 os 개발 프로젝트
date: 2025-01-23T08:42:00+09:00
lastmod: 2025-01-23T08:42:00+09:00
resource-path: temp/임베디드 os 개발 프로젝트.md
aliases: 
tags: 
---
[abi](../02.inbox/abi.md) 참조


realview-pb-a8 을 사용

컴퓨터의 전원이 들어오면 가장 먼저 시작하는 명령이 0000.. 번지의 리셋 벡터
32(word)를 읽어서 실행


어셈블
바이너리 덤프
hexdump
```bash
arm-none-eabi-as -march=armv7-a -mcpu=cortex-a8 -o Entry.o ./Entry.S
arm-none-eabi-objcopy -O binary Entry.o Entry.bin
hexdump Entry.bin
```




```asm
.text
	.code 32
	
	.global vector_start
	.global vector_end

	vector_start:
	 MOV R0, R1
	vector_end:
 	 .space 1024, 0
.end
```
`.text` : text 섹션임을 알림 섹션 종료 지시자인 `.end` 까지 
`.global` : c 언어의 extern 과 일치
`.code` : 명령어의 크기가 32 임을 알림
`vector_start`, `vector_end` : 레이블 설정
`MOV R0, R1` : r1 레지스터의 내용을 r0 레지스터로
`.space 1024, 0` : 현재 위치부터 1024 바이트를 0으로 채우라는 명령


[ELF 구조](ELF%20구조.md)
[ELF wikipidia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)
[ELF 나무 위키](https://namu.wiki/w/ELF)
```bash
$ arm-none-eabi-readelf -a Entry.o
```


```ld
ENTRY(vector_start)
SECTIONS
{
        . = 0x0;


        .text :
        {
                *(vector_start)
                *(.text .rodata)
        }
        .data :
        {
                *(.data)
        }
        .bss :
        {
                *(.bss)
        }
}
```