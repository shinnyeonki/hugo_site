---
title: two pointer 알고리즘
aliases:
  - 투 포인터
tags:
  - algorithm
created: 2024-12-31T13:09:00+09:00
modified: 2024-12-31T13:09:00+09:00

---
# two pointer 알고리즘
1차원 배열에서 각자 다른 원소를 가리키는 2개의 포인터를 사용하여 목표값을 구한다
$O(n^2)$ => $O(n)$ 해결하는 기법

이분탐색 vs 투포인터




## 문제 예시
```
주어진 정수 배열 height의 길이를 n이라고 할 때, n개의 수직 선이 그려져 있습니다. i번째 선의 두 끝점은 (i, 0)과 (i, height[i])입니다.
두 개의 선을 선택하여 x축과 함께 컨테이너를 형성했을 때, 이 컨테이너가 최대한 많은 물을 저장할 수 있도록 두 선을 찾는 문제입니다.
최대 물의 양을 반환하세요.
컨테이너를 기울일 수 없다는 점에 유의하세요.

예시 1:
입력: height = [1,8,6,2,5,4,8,3,7]
출력: 49
설명: 위의 수직 선들은 배열 [1,8,6,2,5,4,8,3,7]로 표현됩니다. 이 경우, 물이 저장될 수 있는 최대 면적은 49입니다.

예시 2:
입력: height = [1,1]
출력: 1

제약 조건:
n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4
```

이중 반복문 $O(n^2)$ => $O(n)$ 반복 1회
```cpp
int maxArea(vector<int>& height) {
    int ret = 0;
    for(int i = 0 ; i< height.size()-1 ; i++){
        for(int j = i + 1; j < height.size() ; j++){
            int width = j - i;
            int length = min(height[i], height[j]);
            int area = width * length;
            if(ret < area) ret = area;
        }
    }
	return ret;
}
```