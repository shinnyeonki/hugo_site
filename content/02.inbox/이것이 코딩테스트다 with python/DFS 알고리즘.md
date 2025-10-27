---
title: DFS 알고리즘
resource-path: 02.inbox/이것이 코딩테스트다 with python/DFS 알고리즘.md
keywords:
tags:
  - algorithm
  - cs
description:
series: 이것이 코딩테스트다 with python
series_weight: 18
finish:
date: 2023-12-26T07:59:00+09:00
lastmod: 2023-12-26T07:59:00+09:00
---
![1_GT9oSo0agIeIj6nTg3jFEA](../../08.media/20231228191101.gif)1.gif)
> stack vs recursion 풀이 2개로 나뉘며
> stack 의 경우 dfs 시 탐색해야할 나머지 노드를 stack 에 저장해두고 빼서 탐색하는 방식의 알고리즘
> recursion 의 경우
> 하위 트리가 없을 때 또는 자신이 null 일때 탈출조건을 준다면 recursion 풀이가 가능하다

## binary tree DFS

1. stack 기반 풀이
	1. 
2. recursion 기반 풀이
	1. 

## grath DFS
기본적으로 작은 숫자부터 탐색하는 것을 기본으로 한다

recursion 풀이
```cpp
using namespace std;
  
bool visited[9];
vector<int> graph[9];
  
// DFS 함수 정의
void dfs(int x) {
    // 현재 노드 방문 처리
    visited[x] = true;
    cout << x << ' ';
    // 현재 노드와 연결된 다른 노드를 재귀적으로 방문
    for (int i = 0; i < graph[x].size(); i++) {
        int y = graph[x][i];
        if (!visited[y]) dfs(y);
    }
}
  
int main() {
    // 각 노드의 인접 노드 정보를 초기화 리스트로 간단하게 할당
    graph[1] = {2, 3, 8};
    graph[2] = {1, 7};
    graph[3] = {1, 4, 5};
    graph[4] = {3, 5};
    graph[5] = {3, 4};
    graph[6] = {7};
    graph[7] = {2, 6, 8};
    graph[8] = {1, 7};

    dfs(1);
    return 0;
}
```

stack 풀이
```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

bool visited[9];
vector<int> graph[9];

void dfs_iterative(int start) {
    stack<int> s;
    s.push(start);

    while (!s.empty()) {
        int x = s.top();
        s.pop();
        
        if (!visited[x]) {
            visited[x] = true;
            cout << x << ' ';

	    // 재귀 DFS와 동일한 방문 순서를 위해 인접 노드를 역순으로 스택에 넣습니다.
            for (auto it = graph[x].rbegin(); it != graph[x].rend(); ++it) {
                int y = *it;
                if (!visited[y])
                    s.push(y);
            }
        }
    }
}

int main() {
    // 각 노드의 인접 노드 정보를 초기화 리스트로 간단하게 할당
    graph[1] = {2, 3, 8};
    graph[2] = {1, 7};
    graph[3] = {1, 4, 5};
    graph[4] = {3, 5};
    graph[5] = {3, 4};
    graph[6] = {7};
    graph[7] = {2, 6, 8};
    graph[8] = {1, 7};

    dfs_iterative(1);
    return 0;
}

```


