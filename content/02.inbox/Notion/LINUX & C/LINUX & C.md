---
title: LINUX & C
date: 2025-06-03T06:05:15+09:00
lastmod: 2025-06-08T19:43:54+09:00
resource-path: 02.inbox/Notion/LINUX & C/LINUX & C.md
aliases: 
tags: 
---
```dataviewjs
var currentFolder = dv.current().file.folder;
var filesInCurrentFolder = dv.pages('"'+currentFolder+'"').where(p => p.file != dv.current().file);

filesInCurrentFolder = filesInCurrentFolder.filter(p => {
    var relativePath = p.file.path.replace(currentFolder, '');
    var depth = (relativePath.match(/\//g) || []).length;
    var filenameWithoutExtension = p.file.name
    var folderName = p.file.folder.split("/").pop(); // 폴더의 이름을 가져옵니다.
    // console.log("파일이름  : " + filenameWithoutExtension);
    // console.log("폴더 이름  : " + folderName);
    return (depth == 1) || (depth == 2 && folderName === filenameWithoutExtension);
});

console.log(filesInCurrentFolder)

dv.table(["Folder", "File"](${p.file.name})`]|[p => [p.file.folder, `[${p.file.name}]]);
```

[ANSI 제어문자](ANSI%20제어문자.md)

[ascii code](../../ascii%20code.md)

  

[make](make.md)

[gcc](gcc.md)

[clang + llvm](clang%20+%20llvm.md)

  

[gnome 한글세팅](gnome%20한글세팅.md)

[find](find.md)

[Redirect](Redirect.md)

[meta character](meta%20character.md)

[file size](file%20size.md)

[demon](demon.md)

[install 명령어](install%20명령어.md)

[mkfs](mkfs.md)

[UTF-8](../../UTF-8.md)

[vim](vim.md)

[netstat](netstat.md)

[리눅스에서의 PID, PPID, PGID, SID](리눅스에서의%20PID,%20PPID,%20PGID,%20SID.md)

[file type](file%20type.md)

[systemd](systemd.md)

[shell](shell.md)

  

[shell 문법](shell%20문법.md)

[사용자및 파일 시스템 관리](사용자및%20파일%20시스템%20관리/사용자및%20파일%20시스템%20관리.md)

[리눅스 기타 명령어](리눅스%20기타%20명령어.md)

[설치 위치](설치%20위치.md)

[locale](locale.md)

[Dnf](Dnf/Dnf.md)

[hostname](hostname.md)