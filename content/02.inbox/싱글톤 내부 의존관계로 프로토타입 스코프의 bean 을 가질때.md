---
title: 싱글톤 내부 의존관계로 프로토타입 스코프의 bean 을 가질때
resource-path: 02.inbox/싱글톤 내부 의존관계로 프로토타입 스코프의 bean 을 가질때.md
aliases:
tags:
  - spring
date: 2024-02-02T15:27:00+09:00
lastmod: 2025-08-19T22:14:19+09:00
---
```java
@Scope("singleton")
static class ClientBean {
    @Autowired
    private ObjectProvider<PrototypeBean> prototypeBeanProvider; // 객체를 필요한 시점에 찾아서 주입받는 경우에 사용
    // private final PrototypeBean prototypeBean;
    // @Autowired
    // public ClientBean(PrototypeBean prototypeBean){ // 생성시점에 주입
    //     this.prototypeBean = prototypeBean;
    // }
    public int logic(){
        PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
	    //ApplicationContext ac = 
			    //new AnnotationConfigApplicationContext();
		//ac.getBean(PrototypeBean.class);
        }
    }
}
@Scope("prototype")
static class PrototypeBean {
    private int count = 0;
    public int addCount(){
        return ++count;
    }
    public int getCount(){
        return count;
    }
}
```

> Prototype 타입의 객체는 지속적으로 객체를 새로 생성하고자 하는 목적으로 만들었으나 @Autowired 속성, ClientBean 의 singleton scope 속성으로 인해 bean 의존관계 단계에서 미리 생성되어 버림 그리고 다시 생성되지 않음

ObjectFatory 부모
ObjectProvider 자식
객체를 생성하는 시기를 조절 가능 **DL** dependency Lookup
스프링 의존적'

```java
@Test
    void SingletonClientUsePrototype(){
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(ClientBean.class, PrototypeBean.class);
        ClientBean clientBean1 = ac.getBean(ClientBean.class);
        int count1 = clientBean1.logic();

        ClientBean clientBean2 = ac.getBean(ClientBean.class);
        int count2 = clientBean2.logic();
        assertThat(count2).isEqualTo(1);
    }

    @Scope("singleton")
    static class ClientBean {
        // private final PrototypeBean prototypeBean;
  
        // @Autowired // 컨테이너를 새로 만들어서 prototypeBean을 주입받는 경우
        // private ApplicationContext ac;
        // @Autowired
        // public ClientBean(PrototypeBean prototypeBean){ // 생성시점에 주입
        //     this.prototypeBean = prototypeBean;
        // }
  
        @Autowired
        private Provider<PrototypeBean> prototypeBeanProvider; // 객체를 필요한 시점에 찾아서 주입받는 경우에 사용
  
        public int logic(){
            PrototypeBean prototypeBean = prototypeBeanProvider.get();
            prototypeBean.addCount();
            return prototypeBean.getCount();
        }
  
        @PostConstruct
        public void init(){
            System.out.println("SingletonTest.SingletonBean.init() + " + this);
        }
  
        @PreDestroy
        public void destroy(){
            System.out.println("SingletonTest.SingletonBean.destroy() + " + this);
        }
    }
    @Scope("prototype")
    static class PrototypeBean {
        private int count = 0;

        public int addCount(){
            return ++count;
        }

        public int getCount(){
            return count;
        }

        @PostConstruct
        public void init(){
            System.out.println("SingletonTest.PrototypeBean.init() + " + this);
        }
        @PreDestroy
        public void destroy(){
            System.out.println("SingletonTest.PrototypeBean.destory() + " + this);
        }
    }
```