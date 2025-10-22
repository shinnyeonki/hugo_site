---
title: spring bean 조회
aliases: 
tags: 

created: 2025-06-27T19:39:35+09:00
modified: 2025-09-05T17:38:41+09:00

---

![](../08.media/20240202105604.png|spring bean 조회-20240202105604)

최상위 BeanFactory 인터페이스를 구현한 모든 클래스들은
bean 들을 관리하는 컨테이너이다
HierarchicalBeanFactory: 빈 계층구조 관리
ListableBeanFactory : 빈 여러개 조회 가능
ApplicationContext : 컨테이너 + 기능추가
AnnotationConfigApplicationContext : 어노테이션을 설정 정보로 하는 컨테이너

이때 컨테이너에 존재하는 bean 들을 조회하는 방법이다

```java
class BeanFactory: //최상위 컨테이너
T getBean(Class<T> requiredType); // 타입으로 조회
Object getBean(String name); // 이름으로 조회
T getBean(Class<T> requiredType, Object... args); //이름과 타입으로 조회
=============
class ListableBeanFactory: // 여러개 조회가능 컨테이너
int getBeanDefinitionCount() //팩토리에 정의된 빈 개수를 반환합니다.
String getBeanDefinitionNames() //이 팩토리에 정의된 모든 Bean의 이름을 반환합니다.
<T> Map<String,T> getBeansOfType(Class <T> type) //타입으로 모든 Bean 조회
```

>추가적으로 bean들의 설정 정보를 담고 있는 BeanDefinition 클래스가 있다
>getRole(), 등등의 설정 정보를 담고 있는 클래스이다 getBeanDefinition()  메서드를 통해 얻을 수 있다