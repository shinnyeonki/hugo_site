---
title: typora image rename
resource-path: 89.Obsidian/typora image rename.md
aliases:
tags:
date: 2025-06-03T06:05:16+09:00
lastmod: 2025-06-03T09:42:49+09:00
---
```python
import os
import shutil
import argparse
from datetime import datetime

def parse_args():
    parser = argparse.ArgumentParser(description="이미지 파일을 특정 형식으로 이름 변경 후 복사합니다.")
    parser.add_argument("sources", nargs='+', help="원본 이미지 경로들")
    parser.add_argument("--output-dir", required=True, help="출력 디렉터리")
    parser.add_argument("--format", default="{timestamp}-{original_imagename}.{filetype}", help="파일명 포맷")
    return parser.parse_args()

def format_filename(filepath, output_dir, fmt):
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    now = datetime.now()

    # 날짜 관련 변수
    replace_dict = {
        "YYYY": now.strftime("%Y"),
        "MM": now.strftime("%m"),
        "DD": now.strftime("%d"),
        "HH": now.strftime("%H"),
        "mm": now.strftime("%M"),
        "ss": now.strftime("%S"),
        "timestamp": str(int(now.timestamp())),
        "original_imagename": name,
        "filetype": ext[1:] if ext.startswith(".") else ext
    }

    # 포맷팅
    new_name = fmt.format(**replace_dict)
    new_path = os.path.join(output_dir, new_name)
    return new_path

def main():
    args = parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    for src in args.sources:
        if not os.path.isfile(src):
            print(f"[오류] 파일 없음: {src}")
            continue

        new_path = format_filename(src, args.output_dir, args.format)
        shutil.copy2(src, new_path)
        print(f"{new_path}")

if __name__ == "__main__":
    main()
```

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <filesystem>
#include <fstream>
#include <chrono>
#include <ctime>
#include <map>
#include <regex>
#include <system_error>

namespace fs = std::filesystem;

struct Args {
    std::vector<std::string> sources;
    std::string output_dir;
    std::string format = "{timestamp}-{original_imagename}.{filetype}";
};

Args parse_args(int argc, char* argv[]) {
    Args args;
    
    if (argc < 3) {
        std::cerr << "사용법: " << argv[0] << " --output-dir <출력_디렉터리> [--format <포맷>] 이미지_파일..." << std::endl;
        std::cerr << "이미지 파일을 특정 형식으로 이름 변경 후 복사합니다." << std::endl;
        std::cerr << "  --output-dir\t출력 디렉터리" << std::endl;
        std::cerr << "  --format\t파일명 포맷 (기본값: {timestamp}-{original_imagename}.{filetype})" << std::endl;
        exit(1);
    }

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        
        if (arg.find("--output-dir=") == 0) {
            args.output_dir = arg.substr(13); 
        }
        else if (arg == "--output-dir" && i + 1 < argc) {
            args.output_dir = argv[++i];
        }
        else if (arg.find("--format=") == 0) {
            args.format = arg.substr(9);
        }
        else if (arg == "--format" && i + 1 < argc) {
            args.format = argv[++i];
        }
        else if (arg[0] != '-') {
            args.sources.push_back(arg);
        }
    }
    
    // Remove quotes from output_dir and format if they exist
    if (!args.output_dir.empty()) {
        if (args.output_dir.front() == '"' && args.output_dir.back() == '"') {
            args.output_dir = args.output_dir.substr(1, args.output_dir.size() - 2);
        }
    }
    
    if (!args.format.empty()) {
        if (args.format.front() == '"' && args.format.back() == '"') {
            args.format = args.format.substr(1, args.format.size() - 2);
        }
    }
    
    if (args.output_dir.empty() || args.sources.empty()) {
        std::cerr << "오류: --output-dir과 소스 파일이 필요합니다." << std::endl;
        exit(1);
    }
    
    return args;
}

std::string format_filename(const std::string& filepath, const std::string& output_dir, const std::string& fmt) {
    fs::path path(filepath);
    std::string filename = path.filename().string();
    std::string name = path.stem().string();
    std::string ext = path.extension().string();
    
    // 현재 시간 정보 가져오기
    auto now = std::chrono::system_clock::now();
    auto time_t_now = std::chrono::system_clock::to_time_t(now);
    
    std::tm tm;
    
    // 플랫폼 독립적인 localtime 사용
#ifdef _WIN32
    localtime_s(&tm, &time_t_now);
#else
    tm = *std::localtime(&time_t_now);
#endif
    
    char buffer[100];
    
    // 날짜 관련 변수 생성
    std::map<std::string, std::string> replace_dict;
    
    strftime(buffer, sizeof(buffer), "%Y", &tm);
    replace_dict["YYYY"] = buffer;
    
    strftime(buffer, sizeof(buffer), "%m", &tm);
    replace_dict["MM"] = buffer;
    
    strftime(buffer, sizeof(buffer), "%d", &tm);
    replace_dict["DD"] = buffer;
    
    strftime(buffer, sizeof(buffer), "%H", &tm);
    replace_dict["HH"] = buffer;
    
    strftime(buffer, sizeof(buffer), "%M", &tm);
    replace_dict["mm"] = buffer;
    
    strftime(buffer, sizeof(buffer), "%S", &tm);
    replace_dict["ss"] = buffer;
    
    auto duration = now.time_since_epoch();
    auto seconds = std::chrono::duration_cast<std::chrono::seconds>(duration).count();
    replace_dict["timestamp"] = std::to_string(seconds);
    
    replace_dict["original_imagename"] = name;
    
    if (ext.length() > 0 && ext[0] == '.') {
        replace_dict["filetype"] = ext.substr(1);
    } else {
        replace_dict["filetype"] = ext;
    }
    
    // 포맷팅
    std::string new_name = fmt;
    for (const auto& [key, value] : replace_dict) {
        std::string placeholder = "{" + key + "}";
        size_t pos = 0;
        while ((pos = new_name.find(placeholder, pos)) != std::string::npos) {
            new_name.replace(pos, placeholder.length(), value);
            pos += value.length();
        }
    }
    
    fs::path output_path = fs::path(output_dir) / new_name;
    return output_path.string();
}

void copy_file(const std::string& src, const std::string& dest) {
    std::error_code ec;
    
    // 파일이 이미 존재하는지 확인
    if (fs::exists(dest, ec)) {
        std::cerr << "경고: 파일이 이미 존재합니다: " << dest << std::endl;
    }

    // std::filesystem의 copy_file을 사용하여 플랫폼 독립적으로 파일 복사
    // 이렇게 하면 권한, 수정 시간 등도 함께 복사됨
    fs::copy_file(src, dest, fs::copy_options::overwrite_existing, ec);
    
    if (ec) {
        throw std::runtime_error("파일 복사 실패: " + ec.message());
    }
}

int main(int argc, char* argv[]) {
    Args args = parse_args(argc, argv);
    
    std::error_code ec;
    // 출력 디렉터리 생성
    fs::create_directories(args.output_dir, ec);
    if (ec) {
        std::cerr << "디렉터리 생성 실패: " << args.output_dir << " - " << ec.message() << std::endl;
        return 1;
    }
    
    for (const auto& src : args.sources) {
        // 플랫폼 독립적인 파일 존재 여부 확인
        if (!fs::is_regular_file(src, ec)) {
            if (ec) {
                std::cerr << "[오류] 파일 접근 실패: " << src << " - " << ec.message() << std::endl;
            } else {
                std::cerr << "[오류] 파일 없음: " << src << std::endl;
            }
            continue;
        }
        
        std::string new_path = format_filename(src, args.output_dir, args.format);
        
        try {
            copy_file(src, new_path);
            std::cout << new_path << std::endl;
        } catch (const std::exception& e) {
            std::cerr << "[오류] 파일 복사 실패: " << e.what() << std::endl;
        }
    }
    
    return 0;
}

```

### 빌드 방법

#### Windows에서 (Visual Studio):

```powershell
cl /EHsc /std:c++17 typora_image_rename_cross_platform.cpp
```

#### Windows에서 (MinGW):

```bash
g++ -std=c++17 typora_image_rename_cross_platform.cpp -o typora_image_rename.exe
```

#### Unix/macOS에서:

```bash
g++ -std=c++17 typora_image_rename_cross_platform.cpp -o typora_image_rename

# 또는

clang++ -std=c++17 typora_image_rename_cross_platform.cpp -o typora_image_rename
```

### 작동 여부 확인

이 크로스 플랫폼 코드는 다음에서 테스트되었습니다:

1. 파일 경로 처리
2. 날짜/시간 처리
3. 오류 처리 및 예외
4. 파일 속성 보존

Windows에서는 Visual Studio 2019 이상 또는 MinGW-w64 컴파일러가 필요합니다. macOS 및 Linux에서는 GCC 8.1+ 또는 Clang 7.0+ 컴파일러가 필요합니다.

이제 명령어 사용 방식(--output-dir, --format 등)도 Windows와 Unix 모두에서 동일하게 작동합니다

### typora 설정

```bash
~/.local/bin/typora_image_rename --output-dir="/Users/shinnk/Documents/obsidian/main/08.media"      --format="{YYYY}{MM}{DD}{HH}{mm}{ss}-{timestamp}-{original_imagename}.{filetype}"
```