---
title: hash set, unordered_set 구현체
aliases: 
tags:
  - algorithm
  - cpp
created: 2025-01-22T07:44:00+09:00
modified: 2025-06-25T15:48:02+09:00

---
**MD-5**나 **SHA** 가 유명한 해시 알고리즘


[insert](https://modoocode.com/238), [erase](https://modoocode.com/240), [find](https://modoocode.com/261) 모두가 $O(1)$ 으로 수행

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <functional>

template <typename T>
class MyUnorderedSet {
private:
    std::vector<std::list<T>> table;
    size_t current_size;
    float load_factor;
    size_t capacity;

    size_t hash(const T& value) const {
        auto temp = std::hash<T>()(value) % capacity;
        return temp;
    }

    void rehash() {
        capacity *= 2;
        std::vector<std::list<T>> new_table(capacity);
        
        for (const auto& bucket : table) {
            for (const auto& value : bucket) {
                size_t new_index = std::hash<T>()(value) % capacity;
                new_table[new_index].push_back(value);
            }
        }
        table = std::move(new_table);
    }

public:
    MyUnorderedSet(size_t init_capacity = 8, float load_factor = 0.75)
        : capacity(init_capacity), load_factor(load_factor), current_size(0) {
        table.resize(capacity);
    }

    bool insert(const T& value) {
        if (contains(value)) return false;

        if (current_size >= capacity * load_factor) {
            rehash();
        }

        size_t index = hash(value);
        table[index].push_back(value);
        current_size++;
        return true;
    }

    bool contains(const T& value) const {
        size_t index = hash(value);
        for (const auto& item : table[index]) {
            if (item == value) {
                return true;
            }
        }
        return false;
    }

    bool erase(const T& value) {
        size_t index = hash(value);
        auto& bucket = table[index];
        
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (*it == value) {
                bucket.erase(it);
                current_size--;
                return true;
            }
        }
        return false;
    }

    size_t size() const {
        return current_size;
    }

    bool empty() const {
        return current_size == 0;
    }
};

int main() {
    MyUnorderedSet<int> my_set;
    my_set.insert(1);
    my_set.insert(2);
    my_set.insert(3);

    std::cout << "Contains 2: " << my_set.contains(2) << std::endl;
    std::cout << "Size: " << my_set.size() << std::endl;

    my_set.erase(2);
    std::cout << "Contains 2 after erase: " << my_set.contains(2) << std::endl;
    std::cout << "Size after erase: " << my_set.size() << std::endl;

    return 0;
}

```