---
title: Doxyzen 키워드
aliases:
  - 주석 키워드
tags:
  - reference
  - 잡지식
created: 2025-10-19T21:54:56+09:00
modified: 2025-10-19T22:15:15+09:00

---

| 키워드               | 용도                              |
| ----------------- | ------------------------------- |
| `@brief`          | 짧은 설명                           |
| `@param`          | 매개변수 설명                         |
| `@return`         | 반환값 설명                          |
| `@pre`            | 함수를 호출하기 전에 만족되어야 할 조건 (호출자 책임) |
| `@post`           | 함수 실행 후 보장되는 상태 (구현자 책임)        |
| `@throws`         | 예외 명시                           |
| `@note`           | 부가 정보                           |
| `@warning`        | 경고                              |
| `@see`/`@ref`     | 관련 항목 참조                        |
| `@deprecated`     | 사용 중단 알림                        |
| `@todo`           | 향후 작업                           |
| `@invariant`      | 불변 조건 (클래스용)                    |
| `@author`,`@date` | 메타 정보                           |

### `@brief`

**용도**: 함수, 클래스, 변수 등의 간결한 요약 설명을 제공합니다. 자동 생성 문서에서 제목처럼 사용되며, 첫 문장으로 쓰는 것이 일반적입니다. 길이 제한은 없지만 한 문장이 이상적입니다.

**예시**:

```cpp
/**
 * @brief 정수 배열을 힙 정렬로 오름차순 정렬합니다.
 */
void heapSort(std::vector<int>& arr);
```

---

### `@param`

**용도**: 함수의 매개변수에 대한 설명을 제공합니다. 매개변수의 이름, 의미, 제약 조건 등을 명시하며, 여러 매개변수가 있을 경우 각각에 대해 기술합니다.

**예시**:

```cpp
/**
 * @param arr 정렬할 정수 배열 (참조로 전달됨)
 * @param ascending true면 오름차순, false면 내림차순
 */
void sortArray(std::vector<int>& arr, bool ascending);
```

---

### `@return`

**용도**: 함수의 반환값이 의미하는 바를 설명합니다. `void` 함수에는 사용하지 않으며, 반환 타입이 복잡하거나 의미가 명확하지 않을 때 특히 중요합니다.

**예시**:

```cpp
/**
 * @brief 두 수의 최대공약수를 반환합니다.
 * @param a 양의 정수
 * @param b 양의 정수
 * @return a와 b의 최대공약수 (항상 ≥ 1)
 */
int gcd(int a, int b);
```

---

### `@pre`

**용도**: 함수를 호출하기 전에 반드시 만족되어야 하는 조건을 명시합니다. 이는 호출자의 책임이며, 조건을 위반할 경우 정의되지 않은 동작(undefined behavior)이 발생할 수 있습니다.

**예시**:

```cpp
/**
 * @brief 배열의 중앙값을 반환합니다.
 * @param arr 비어 있지 않은 정렬된 배열
 * @pre arr.size() > 0
 * @return 중앙값
 */
int median(const std::vector<int>& arr);
```

---

### `@post`

**용도**: 함수 실행이 완료된 후 보장되는 상태를 설명합니다. 이는 구현자의 책임이며, 출력, 부작용, 객체 상태 변화 등을 명확히 할 때 사용됩니다.

**예시**:

```cpp
/**
 * @brief 힙에 새 요소를 삽입합니다.
 * @param value 삽입할 값
 * @post 힙 속성이 유지되며, size()가 1 증가함
 */
void push(int value);
```

---

### `@throws` (또는 `@exception`)

**용도**: 함수가 던질 수 있는 예외의 종류와 그 조건을 명시합니다. 예외 안전성(exception safety)을 이해하고 안정적인 코드를 작성하는 데 중요합니다.

**예시**:

```cpp
/**
 * @brief 인덱스로 요소에 접근합니다.
 * @param i 접근할 인덱스
 * @throws std::out_of_range i가 [0, size()) 범위를 벗어날 경우
 * @return 참조된 요소
 */
int& at(size_t i);
```

---

### `@note`

**용도**: 부가 정보, 알고리즘 특성, 시간/공간 복잡도, 사용 팁 등을 기술합니다. `@warning`보다 덜 강조적이며, 참고용 정보를 담을 때 적합합니다.

**예시**:

```cpp
/**
 * @note 시간 복잡도: O(n log n), 공간 복잡도: O(1)
 * @note 불안정 정렬입니다 (같은 값의 순서가 바뀔 수 있음)
 */
void heapSort(std::vector<int>& arr);
```

---

### `@warning`

**용도**: 심각한 부작용, 데이터 손실, 성능 문제 등 사용자가 꼭 알아야 할 경고를 강조합니다. 주의를 강하게 요구할 때 사용합니다.

**예시**:

```cpp
/**
 * @warning 이 함수는 원본 배열을 파괴적으로 수정합니다.
 * 정렬 전 백업이 필요하면 복사본을 사용하세요.
 */
void destructiveSort(std::vector<int>& arr);
```

---

### `@see` / `@ref`

**용도**: 관련된 함수, 클래스, 문서 등을 참조하도록 안내합니다.  
- `@see`: 일반 텍스트로 참조  
- `@ref`: Doxygen이 자동으로 하이퍼링크를 생성 (HTML 문서에서 클릭 가능)

**예시**:

```cpp
/**
 * @brief 힙을 구성합니다.
 * @see heapSort
 * @ref pushDown 함수도 참조하세요.
 */
void buildHeap(std::vector<int>& arr);
```

---

### `@deprecated`

**용도**: 더 이상 사용하지 말아야 할(구식) API임을 명시합니다. 대체 수단을 함께 제시하는 것이 좋습니다.

**예시**:

```cpp
/**
 * @deprecated
 * @brief 구버전 정렬 함수 (비효율적)
 * @see heapSort 대신 사용하세요.
 */
void oldSort(int* arr, int n);
```

---

### `@todo`

**용도**: 향후 구현하거나 개선해야 할 사항을 기록합니다. 개발 중인 기능, 리팩토링 계획, 확장 포인트 등을 문서화할 때 유용합니다.

**예시**:

```cpp
/**
 * @todo C++20 ranges 지원 추가
 * @todo 병렬화 (std::execution::par)
 */
void advancedSort(std::vector<int>& arr);
```

---

### `@invariant`

**용도**: 클래스 전체에서 항상 유지되어야 하는 불변 조건(invariant)을 명시합니다. 생성자, 모든 public 메서드 호출 전후에 이 조건이 항상 참이어야 합니다.

**예시**:

```cpp
/**
 * @class MaxHeap
 * @brief 최대 힙 자료구조
 * @invariant 모든 i에 대해: arr[i] >= arr[2*i+1] 및 arr[i] >= arr[2*i+2]
 * @invariant size() == arr.size()
 */
class MaxHeap { /* ... */ };
```

---

### `@author`, `@date`, `@version`

**용도**: 파일 또는 프로젝트 수준의 메타 정보를 제공합니다. 주로 파일 상단의 헤더 주석에 사용되며, 유지보수 및 버전 관리에 도움이 됩니다.

**예시**:

```cpp
/**
 * @file heap_sort.cpp
 * @author 신년기
 * @date 2025-10-19
 * @version 1.2
 * @brief 힙 정렬 알고리즘 구현 (Doxygen 문서화 완료)
 */
```

--- 

이 스타일로 주석을 작성하면 코드의 가독성, 유지보수성, 협업 효율성이 크게 향상됩니다.
