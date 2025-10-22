---
title: c,c++ vs code
aliases:
  - tasks.json
  - launch.json
tags:
  - setting
  - vscode
created: 2023-12-28T19:11:00+09:00
modified: 2025-10-11T07:35:42+09:00

---

컴파일 시에 다음과 같은 3가지 환경 설정이 필요하다(project 내부에서만 작동)

  
- ==c_cpp_properties.json== (compiler path and IntelliSense settings)
- ==tasks.json== ==(build instructions)
- ==launch.json== ==(debugger settings)==



## mac 기준
task.json

```json
{
    "tasks": [
        {
            //c++ 컴파일러
            "type": "shell",
            "label": "clang++ 빌드 및 터미널 실행",
            "command": "/usr/bin/clang++",
            "args": [
                "-std=c++17",
                "-fcolor-diagnostics",
                "-fansi-escape-codes",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}",
                // 파일 실행부
                "&&",
                "${fileDirname}/${fileBasenameNoExtension}",

            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "직접 실행 task"
        },
        {
            //c 컴파일러
            "type": "shell",
            "label": "clang 빌드 및 터미널 실행",
            "command": "/usr/bin/clang",
            "args": [
                "-std=c11",
                "-fcolor-diagnostics",
                "-fansi-escape-codes",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}",
                // 파일 실행부
                "&&",
                "${fileDirname}/${fileBasenameNoExtension}",
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "직접 실행 task"
        },
        {
            //디버깅시에 사용되는 cpp 빌드 설정
            "type": "cppbuild",
            "label": "C/C++: clang++ 활성 파일 빌드",
            "command": "/usr/bin/clang++",
            "args": [
                "-std=c++17",
                "-fcolor-diagnostics",
                "-fansi-escape-codes",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "디버거에서 생성된 작업입니다."
        },
        {
            //디버깅시에 사용되는 c 빌드 설정
            "type": "cppbuild",
            "label": "C/C++: clang 활성 파일 빌드",
            "command": "/usr/bin/clang",
            "args": [
                "-std=c11",
                "-fcolor-diagnostics",
                "-fansi-escape-codes",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "디버거에서 생성된 작업입니다."
        },
        {
            //실행용
            "label": "exec",
            "type": "shell",
            "command": "${fileDirname}/${fileBasenameNoExtension}",
            "group": {
              "kind": "build",
              "isDefault": true
            }
          }
    ],
    "version": "2.0.0"
}
```

launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "name": "c++ 디버그",
        "type": "lldb",
        "request": "launch",
        "program": "${fileDirname}/${fileBasenameNoExtension}",
        "args": [],
        "preLaunchTask": "C/C++: clang++ 활성 파일 빌드",
        "stdio": [null, null, null],
        "terminal": "integrated"
      },
      {
        "name": "c 디버그",
        "type": "lldb",
        "request": "launch",
        "program": "${fileDirname}/${fileBasenameNoExtension}",
        "args": [],
        "preLaunchTask": "C/C++: clang 활성 파일 빌드",
        "stdio": [null, null, null],
        "terminal": "integrated"
      },
      {
        "name": "g++ - Build and debug active file",
        "type": "cppdbg",
        "request": "launch",
        "program": "${fileDirname}/${fileBasenameNoExtension}",
        "args": [],
        "stopAtEntry": true,
        "cwd": "${workspaceFolder}",
        "environment": [],
        "externalConsole": true,
        "MIMode": "lldb",
        "preLaunchTask": "C/C++: g++ build active file"
      }
    ]
  }
```