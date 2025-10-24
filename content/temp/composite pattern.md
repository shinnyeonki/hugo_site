---
title: composite pattern
date: 2024-02-06T04:27:00+09:00
lastmod: 2024-02-06T04:27:00+09:00
resource-path: temp/composite pattern.md
aliases: 
tags:
  - design_patterns
---
복합 객체와 단일 객체를 동일하게 취급하고 싶다
과일과 과일박스를 동일한 과일박스 안에 넣고 싶다
트리 형태로 퍼져나간다

```python
class animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass
  

class dog(animal):
    def speak(self):
        print(self.name)
  
class cat(animal):
    def speak(self):
        print(self.name)

class animal_group(animal):
    def __init__(self):
        self.animals = []

    def add(self, animal):
        self.animals.append(animal)

    def speak(self):
		print("group speak")
        for animal in self.animals:
            animal.speak()

group1 = animal_group()
group1.add(dog("dog1"))
group1.add(dog("dog2"))
group1.add(cat("cat1"))

group2 = animal_group()
group2.add(cat("cat2"))
group2.add(group1)

group2.speak()

====
group speak
cat2
group speak
dog1
dog2
cat1
```
