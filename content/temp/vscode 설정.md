---
title: vscode 설정
date: 2024-10-06T03:00:00+09:00
lastmod: 2024-10-06T03:00:00+09:00
resource-path: temp/vscode 설정.md
aliases: 
tags:
  - vscode
---
keybindings.json
```json
// Toggle between terminal and editor focus
{ "key": "ctrl+'", "command": "workbench.action.terminal.focus"},
{ "key": "ctrl+'", "command": "workbench.action.focusActiveEditorGroup", "when": "terminalFocus"}
```
터미널 왔다리 갔다리





---
### 1. **`Ctrl + Space`**
#### **기능: 트리거 제안(Trigger Suggestions)**  
- **설명**: 현재 커서 위치에서 사용 가능한 코드 제안(Suggestions)을 수동으로 호출합니다. 이는 자동 완성(IntelliSense) 기능을 강제로 활성화하는 역할을 합니다.  
  - 예를 들어, 변수 이름이나 함수 이름을 입력 중일 때, VSCode가 자동으로 제안을 보여주지 않는 경우에 `Ctrl + Space`를 눌러 명시적으로 제안 목록을 열 수 있습니다.
  - 제안 목록에는 변수, 함수, 클래스, 메서드 등이 포함됩니다.

#### **단축키**:
- Windows/Linux: `Ctrl + Space`
- macOS: `Control + Space`

---

### 2. **`Tab`**
#### **기능: 자동 완성 선택 또는 들여쓰기(Indentation)**  
- **설명**: 
  1. **자동 완성 선택**: IntelliSense 제안 목록이 열려 있는 상태에서 `Tab` 키를 누르면 현재 선택된 제안을 확정하고 코드를 자동으로 완성합니다.  
     - 예: `pri`를 입력한 후 제안 목록에서 `print()`가 선택된 상태라면 `Tab`을 누르면 `print()`로 자동 완성됩니다.
  2. **들여쓰기**: 코드 블록에서 `Tab` 키를 누르면 줄을 오른쪽으로 들여씁니다(indent). 반대로 `Shift + Tab`은 줄을 왼쪽으로 밀어냅니다(unindent).

#### **단축키**:
- Windows/Linux/macOS: `Tab`

---

### 3. **인수 목록(Parameter Hints)**
#### **기능: 함수 또는 메서드의 매개변수 정보 표시**  
- **설명**: 함수 또는 메서드를 호출할 때, 인수 목록과 각 매개변수의 타입 및 설명을 툴팁 형태로 표시합니다.  
  - 예를 들어, Python에서 `print(`를 입력하면 `print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)`와 같은 매개변수 정보가 표시됩니다.
  - 이를 통해 함수 호출 시 필요한 인수와 그 순서를 쉽게 파악할 수 있습니다.

#### **단축키**:
- 기본적으로 매개변수 힌트는 함수 호출 시 자동으로 표시됩니다.
- 만약 자동으로 표시되지 않는다면, `Ctrl + Shift + Space`를 눌러 수동으로 매개변수 힌트를 열 수 있습니다.

#### **단축키**:
- Windows/Linux: `Ctrl + Shift + Space`
- macOS: `Command + Shift + Space`

---

### 4. **함수 설명(Function Documentation)**
#### **기능: 함수 또는 메서드에 대한 문서(Documentation) 표시**  
- **설명**: 특정 함수나 메서드에 대한 상세 설명을 확인할 수 있습니다. 이 설명에는 함수의 목적, 매개변수, 반환값, 예제 코드 등이 포함될 수 있습니다.  
  - 예를 들어, Python에서 `len(`를 입력하면 `len(object) -> int`와 같은 설명이 표시되며, 추가적으로 "Return the number of items in a container."와 같은 문서 내용을 볼 수 있습니다.

#### **단축키**:
- 기본적으로 함수 이름 위에 마우스를 올리거나, 함수 이름을 입력한 후 잠시 대기하면 자동으로 문서 힌트가 표시됩니다.
- 수동으로 문서 힌트를 열고 싶다면 `Ctrl + K, Ctrl + I`를 사용합니다.

#### **단속키**:
- Windows/Linux: `Ctrl + K, Ctrl + I` (두 키를 순차적으로 누름)
- macOS: `Command + K, Command + I`

---

### 요약
| 기능               | 설명                                                                 | 단축키 (Windows/Linux) | 단축키 (macOS)          |
|--------------------|----------------------------------------------------------------------|------------------------|-------------------------|
| 트리거 제안        | IntelliSense 제안 목록을 수동으로 호출                              | `Ctrl + Space`         | `Control + Space`       |
| 자동 완성/들여쓰기 | 제안 목록에서 선택하거나 코드를 들여쓰기                           | `Tab`                  | `Tab`                   |
| 인수 목록          | 함수 호출 시 매개변수 정보 표시                                     | `Ctrl + Shift + Space` | `Command + Shift + Space` |
| 함수 설명          | 함수 또는 메서드의 문서 및 설명 표시                                | `Ctrl + K, Ctrl + I`   | `Command + K, Command + I` |

---

위 기능들은 VSCode의 기본 설정을 기준으로 설명되었습니다. 필요에 따라 단축키를 사용자 정의할 수 있으며, `File > Preferences > Keyboard Shortcuts` (또는 `Code > Preferences > Keyboard Shortcuts` on macOS)에서 단축키를 변경할 수 있습니다.

---


