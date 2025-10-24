---
title: java 제네릭(generic)
date: 2024-01-29T05:00:00+09:00
lastmod: 2024-01-29T05:00:00+09:00
resource-path: 02.inbox/java 제네릭(generic).md
aliases:
  - non-feifiable
  - reifiable
  - supertype
  - subtype
  - variant
  - invariant
tags:
  - java
---
java 는 제네릭 배열을 생성하지 못한다

[java generic 원리](https://cla9.tistory.com/44) 중요!!!



- `Integer <: Number`
- `Double <: Number`
- `ArrayList<E> <:  List<E>`
- `Collection<E> <:  Iterable<E>`
Super type : Number 는 Integer  에 대해 Super type 이다
Sub type : Integer 는 Number 에 대해 Sub type 이다
variant 공변 : Number 와 Integer 는 공변한다
Invariant 불공변 : Integer 와 String 는 공변하지 않는다


 Java에서는 해당 경우에 Substitution Principle을 적용하지 않습니다
```java
public class Main{ 
	public void static main(int argc, String[] argv){ 
		List<Integer> ints = new ArrayList<>();
		ints.add(1); 
		ints.add(2);
		List<Number> nums = ints //Compile 에러 발생
		nums.add(3.14); // 이와 같은 연산을 막기 위해 위에서 미리 방지한다
	} 
}
```
>즉 List\<Integer\>는 List\<Number\>의 Subtype이 아니다
>하지만 List\<E\>는 Collection\<E\>를 상속받으므로 List\<Integer\>는 Collection\<Integer\>의 Subtype이다.

>java는 지정된 generic type parametor에 대해서는 invariant 하다
> 단 상위경계타입 파라미터를 통해 가능하다

=upper-bound Type Parameter
```java
class Data{ 
	private List<Number> list;
	public void addAll(List<Number> cols){
		this.list.addAll(cols);
	}
} 
public class Main {
	public static void main(String[] args) {
		Data data = new Data();
		List<Integer> ints = Arrays.asList(1, 2, 3);
		List<Double> dbls = Arrays.asList(1.0, 2.8);
		List<Number> nums = Arrays.asList(5,4.5);
		data.addAll(ints); //Compile 에러 발생
		data.addAll(dbls); //Compile 에러 발생
		data.addAll(nums);
	}
}
```
아래와 같이 코드를 변경
```java
class Data{ 
	private List<Number> list;
	public void addAll(List<Number> cols){
		this.list.addAll(cols);
	}
} 
public class Main {
	public static void main(String[] args) {
		Data data = new Data();
		List<Integer> ints = Arrays.asList(1, 2, 3);
		List<Double> dbls = Arrays.asList(1.0, 2.8);
		List<Number> nums = Arrays.asList(5,4.5);
		data.addAll(ints); //Compile 에러 발생
		data.addAll(dbls); //Compile 에러 발생
		data.addAll(nums);
	}
}
```
