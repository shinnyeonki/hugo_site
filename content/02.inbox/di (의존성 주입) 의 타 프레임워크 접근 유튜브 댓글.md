---
title: di (의존성 주입) 의 타 프레임워크 접근 유튜브 댓글
date: 
lastmod: 2025-10-24T20:53:41+09:00
resource-path: 02.inbox/di (의존성 주입) 의 타 프레임워크 접근 유튜브 댓글.md
aliases: 
tags:
  - 잡지식
---
영상을보다가 좀 답답해서 글을 써봅니다. 호돌맨과 항로님이 그냥 코딩에대한 감각이 없는것같다는 생각이 듭니다. 두분이 좋아하는 방식은 데이터를 다루는 영역에서 유효한 방식인데 그게 두분 전문분야인 웹 백엔드죠. 그러다보니 조금 착각이 일어나시는 것 같습니다. 우선 백엔드의 환경에 대해서 알아야하는데 웹 백엔드는 환경을 통제하기 쉽고(내 서버에 배포) 일종의 요청의 처음과 끝이 존재하는 심플한 방식이고 데이터를 가공해서 스토리지에 저장하는것이 주 목적입니다. 이런 환경에서는 말씀하시는 클래스와 DI같은 레이어링을 위한 추상화 방식이 유효해집니다. 스토리지는 인터페이스는 같지만 실제 구현체가 여러종류일 수 있고 (다형성) 그런 구현체를 주입하기위한 DI는 유효할 수 있습니다, 두분이 좋아하시는 자바 스프링의 어노테이션은 나름 괜찮은 표현력을 제공하죠. 저도 어떤 환경에서 프로그래밍을 하던 데이터 레이어가 복잡해지면 그와 같은 방식을 선호합니다. 나쁘지않은 방식이죠 근데 웹 프론트 환경에서의 클래스와 DI는 복잡도를 더 높입니다. 두분이 선호하는 클래스와 DI방식의 프레임워크로는 앵귤러가 있는데요, 앵귤러는 어노테이션 DI 다 스프링처럼 제공합니다. 근데 앵귤러가 왜 시장에서 외면받았느냐를 분석해드리겠습니다. 실제로 웹 프론트엔드 환경에서 코딩을 해보시면 아시겠지만 js환경에서 앵귤러와같은 표현력을 제공하려면 추상화비용에서 오는 손실이 백엔드보다 더 큽니다. 랜더링이라는 개념이 있고 데이터와 상호작용을 해야해하고 이러한 구현들은 클라이언트 전체적인 아키텍쳐와 상호작용합니다. (백엔드와는 이런 부분들이 다르죠). 예를들어 클라이언트에선 뭔가 백그라운드에서 돌아가고 있을 수 도 있고, 거기에 필요한 데이터 영역이 UI와 상호작용할수도 있습니다. 이 뿐만 아니라 컴포넌트끼리의 상호작용까지 있습니다. 이런 환경에서 과도하게 추상화된 영역은 버그를 일으키고 의존성을 파악하기도 힘들어집니다. 디버깅도 어려워지죠. 작성하기 귀찮은 보일러플레이트는 덤이구요. 그래서 앵귤러는 웹 프론트엔드 환경에서 외면받았습니다. react에서도 mobx와 같은 도구들이 있는데요 컨셉은 좋습니다, 클래스로 탄탄하게 데이터를 다루는 표현력을 제공하겠다, 너무 좋죠. 근데 이게 생각보다 간단하지않습니다. 이런 도구들이 react와 붙으려면 역시 복잡한 의존관계를 관리해야하고 규모가 커질수록 이는 파악하기 어려워집니다. 앵귤러와 비슷한 딜레마가 있습니다, 그래서 메이저가 되진 못했죠. 결론적으로 자연스럽게 코딩하다보면, 호돌맨님과 향로님이 제시하시는 방식은 외면받을 수 밖에 없다는걸 깨달을 때가 되신것같은데 아직 깨닫지못했다는게 정말 신기할 따름입니다. 아키텍쳐만 정해주고 직접 코딩하시진 않아서 그런걸까요? 정말로 리액트에서 클래스랑 DI를 사용하는 방식이 생산성이높다는 생각이든다면 뭔가 어거지 보일러 플레이트를 만들면서 잘못 코딩하고 계신거같고 제 생각엔 그냥 효율성 안나오지만 보일러플레이트 정형화되게 착착 쌓고 이러다보니 아 코딩하기 편하군 이라는 착각에 빠져계신 것 같습니다. 실제 웹 프론트엔드에서 생산성높게 일하는 회사가 어떤 방식을 취하고 계신지 한번 살펴보기를 권합니다.

간략히

28

답글

답글 17개

![](https://yt3.ggpht.com/ytc/AIdro_mDeuS8EY7LASVKqkzucqkZ45yO-0C97NDK8d9WWHGAz0WacqMu6YsQO3jUNUz_RirqkA=s88-c-k-c0x00ffffff-no-rj)

### [@worldhello-o4w](https://www.youtube.com/@worldhello-o4w)

[2주 전(수정됨)](수정됨))

길게 적다보니 알아듣기 힘들것같은 분들을 위해 데이터와 스토리지를 다루는 백엔드 영역에서 클래스와 DI는 유효한 방법이고 그러한 레이어에서는 필자도 그것을 즐겨 씀 그러나 처음과 끝이 있는 심플한 백엔드와는 다르게 클라이언트는 끝이없는 사용자와의 무한한 상호작용이고, 구현은 클라이언트 전체 아키텍쳐와 상호작용함 이런 환경에서 지불해야하는 DI와 클래스 방식의 추상화비용은 직접 코딩하는사람들에게는 불편함을 불러일으킴, 불편함 대비 이득이 큰 것도 아님 고로 DI와 클래스 접근방식은 웹 프론트엔드 환경에서는 맞지않음. 물론 웹 프론트엔드에서도 데이터를 다루는 영역이 복잡해진다면 해당 레이어는 그러한 접근방법을 택함, 그러나 UI와는 격리함

간략히

7

답글

![](https://yt3.ggpht.com/ytc/AIdro_mOxLD4XxnNo_ySlEkQk-dGl2nlSkiFaJu8Rg-vFqry5w=s88-c-k-c0x00ffffff-no-rj)

### [@user-vc5vo4ol2g](https://www.youtube.com/@user-vc5vo4ol2g)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEr6_LwOMK1)

호돌맨은 내가 누군지 모르겠고, 향로님이 코딩에 대한 감각이 없어요?ㅋㅋㅋㅋ 얘 5년차 안됐네

답글

![](https://yt3.ggpht.com/ytc/AIdro_mDeuS8EY7LASVKqkzucqkZ45yO-0C97NDK8d9WWHGAz0WacqMu6YsQO3jUNUz_RirqkA=s88-c-k-c0x00ffffff-no-rj)

### [@worldhello-o4w](https://www.youtube.com/@worldhello-o4w)

[2주 전(수정됨)](수정됨))

 [@user-vc5vo4ol2g](https://www.youtube.com/channel/UCz0vNDHP6MOTTrTYf5jrYfw)  "클래스나 DI 같은걸로 복잡도를 낮출 수 있는데 왜 웹 프론트엔드에서는 안하는지 모르겠다, 오히려 복잡도를 늘리는 방향으로 가고 있다" 라고 발언하셔서 코딩감각이 없구나(향로님이 말씀하신 방식은 오히려 복잡도를 늘리는 방식) 라고 판단했고 이유는 위에 적었습니다. 호돌맨님은 옆에 같이 방송하는 분이십니다. 최소 동영상은 보고 답글 달아주시면 좋을 것 같습니다. 마지막으로 인신공격을 하려면 적절한 근거를 부탁드립니다. 감사합니다.

2

답글

![](https://yt3.ggpht.com/ytc/AIdro_mDeuS8EY7LASVKqkzucqkZ45yO-0C97NDK8d9WWHGAz0WacqMu6YsQO3jUNUz_RirqkA=s88-c-k-c0x00ffffff-no-rj)

### [@worldhello-o4w](https://www.youtube.com/@worldhello-o4w)

[2주 전(수정됨)](수정됨))

 [@min-j4d-h3u](https://www.youtube.com/channel/UCqbggW3oNHHMvgT4BJTcb-A)  의견 감사합니다. 우선 OOP에 대해서 말씀드리면 댓글분의 말씀이 틀리진않습니다. OOP라는게 거기에서만 유효한 방법은 아니지요 다만 스프링과 백엔드에서 제시하는 OOP는 대부분 행동과 개체를 묘사하기 위한 OOP라기보다는 데이터와 스토리지를 다루는데 특화된 부분으로 진화되어 있습니다. 그래서 그런 부분을 프론트엔드에 강제로 적용하려는 방식은 오히려 개발자들의 불편을 불러일으킨다고 말씀드릴 수 있겠습니다. Unreal엔진같은 게임엔진에서 제시하는 OOP스타일도 한번 보신다면 흐름 자체가 상당히 많은 부분이 다르다는것을 알 수 있습니다. 물론 기초가 되는 개념 자체는 비슷할 수 있겠지만 게임쪽에서는 어떤 한 방법론만을 따르지않기때문에 여러가지 영감을 얻어보실 수 있을 겁니다. 향로님이 영상에서 말씀하신 것 처럼 "클래스나 DI 같은걸로 복잡도를 낮출 수 있는데 왜 웹 프론트엔드에서는 안하는지 모르겠다, 오히려 복잡도를 늘리는 방향으로 가고 있다" 라는 웹 프론트 생태계를 싸잡아 비난하는 태도도 좋은 접근은 아닌것같습니다, 심지어 구독자수도 꽤 되는 채널에서 말이죠. 이러면 이 채널을 보는 많은 신입 개발자들에게 혼란을 줍니다. 심지어 틀린말씀이라 조금 강하게 지적해보았습니다. 추가로 네임드 개발자분과 다른관점 이라고 하셨는데 사실 향로님과 호돌맨님은 그냥 평범한 백엔드 개발자시지 정말 최전선의 개발 생태계에 큰 영향을 끼치시는 분들은 아닙니다, 본인들도 그건 잘 알고 있을겁니다. 오히려 글로벌 빅 테크회사에서 웹 프론트엔드 생태계 프레임워크를 개발하는분들이 전 세계적인 네임드 개발자시기때문에 이 경우에는 향로님과 호돌맨님이 그분들과 다른의견을 내고 계산상황, 즉 도전자라고 보는것이 옳을 것 같습니다. 생산성 높게 일하는 회사들로는 한국에서는 당근, 토스, 그리고 해외에서는 대표적으로 react를 만든 메타가 있을것같습니다. 그 외 빅테크들도 react를 적절하게 활용하고 있으니 어떤 방식으로 다루는지 보면 좋겠지요. 이 회사들에서 외부에 공개해놓은 자료들을 참고해보신다면 어떤 얘기들을 하고있는지 확인해볼 수 있습니다. 마침 토스에서 공개해놓은 자료도 있으니 링크를 첨부해봅니다. https://frontend-fundamentals.com/code/examples/form-fields.html 대안의 경우는 특별히 대안이 있다기보단 일반적인 웹 프론트생태계의 흐름에 호돌맨님과 향로님이 반박을 하고 계신상황이기에, 일반적인 웹 프론트 생태계의 아키텍쳐나 코드구조 멘탈모델을 확인해보시면 좋을것같습니다.

간략히

3

답글

![](https://yt3.ggpht.com/ytc/AIdro_nKNOP8jqeP_dCNKCXak3gmw0Et95G0rcDquypihroNrMY=s88-c-k-c0x00ffffff-no-rj)

### [@elecricecooker](https://www.youtube.com/@elecricecooker)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEss3OXVtZ7)

첫문장 들이박는거 보고 바로 쭉내렸습니다

1

답글

![](https://yt3.ggpht.com/ytc/AIdro_nEA3k4IjsXlIim_nOom2OZnRf7_flkTjeSHYy4Li6mayaF7PBFInqKLmvo5jSBdPugcTk=s88-c-k-c0x00ffffff-no-rj)

### [@user-xk4jb8si8w](https://www.youtube.com/@user-xk4jb8si8w)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEt2LeMDW_Y)

의존성 주입에 대해 좀 더 공부해보시는 게 좋을 거 같아요.. react에서 의존성 주입 라이브러리를 사용해서 프로젝트가 더 복잡해졌다고 하는데 애초에 의존성 주입 자체가 서로 간의 영향을 덜 받기위해 사용하는 기법이에요.. react에서 사용이 불편하단건 해당 라이브러리의 문제지 의존성 주입의 문제가 아닙니다.. 의존성 주입을 하기 위해 만드는 코드를 보일러 플레이트 코드라고 생각하시는 거 자체가 의존성 주입에 대한 이해도가 부족하다고 생각해요.. 혼자서 하는 단일 프로젝트는 속도를 위해 의존성 주입없이 하는게 편하긴 하지만 이 개념이 나온 이유에 대해 공부해보시는 걸 추천해요..

답글

![](https://yt3.ggpht.com/ytc/AIdro_mDeuS8EY7LASVKqkzucqkZ45yO-0C97NDK8d9WWHGAz0WacqMu6YsQO3jUNUz_RirqkA=s88-c-k-c0x00ffffff-no-rj)

### [@worldhello-o4w](https://www.youtube.com/@worldhello-o4w)

[2주 전(수정됨)](수정됨))

 [@user-xk4jb8si8w](https://www.youtube.com/channel/UCMVnKyZl2LDEPl2x3otdpeA)  제 얘기는 영상을 찍으신 두 분이 제시하시는 DI방식에 대한 얘기였구요. 의존성 주입 이라는 개념자체를 배제하는것은 아닙니다. react에서도 props로 여러 요소들(함수 컴포넌트 등등)을 받는것도 의존성 주입이죠. 근데 DI framework같은 것들을 사용해서 뭔가 환경과 맞지않는 규격을 도입하려고하는게 좋지않은거구요, 그러므로 인해 멋들어지게 그런 개념을 도입해봤자 그 복잡성이라는것이 사라지지는 않는다는 뜻입니다. 그리고 코딩하기 불편하면 그냥 그 상황에서 안 좋은겁니다. react의 문제라기보단 react는 그런 방식의 코딩을 의도하지 않는거죠, 때문에 거기서 억지로 사용해야할 방법이 아니구요. (그럼 앵귤러는 잘 살아남았어야 합니다 DI를 편하게 지원하니깐) 개념은 훌륭한데 사용하기 불편해서 사용하지않는경우는 굉장히 많이 있습니다. 예를들어 effect-ts라는 라이브러리를 보시면 함수형 프로그래밍의 개념을 도입하여 부수 효과들을 어떻게 다룰지에 대한 굉장히 훌륭한 개념을 제시하고있습니다, rust에서 코딩하는것처럼 코딩할 수 있죠. 컨셉은 한번 보시길 추천드립니다. 근데 js에서 그런 개념을 네이티브하게 지원하지않고 해당 라이브러리에 대한 멘탈모델에 대한 학습비용, 그러한 개념을 js 환경에서 지원 안함으로써 커버해야하는 부분들, 이런 이유때문에 역시 메이저가 되진 못합니다. 대부분 이런것들은 어디선가 잘 작동하던 멘탈모델을 그대로 옮겨오고싶은것에서 기인하지만, 결국 사용이 불편한것들은 사용되지않습니다. 훌륭한 개념이라고 모든것을 도입해야하는것은 아닙니다. 전반적인 생태계에 대한 이해와 생태계가 주는 한계점을 파악하고, 적절한 코드와 인터페이스를 제시해야하죠. 경험과 공부를 더 해보는것을 추천드립니다, 특히 코딩은 좀 더 해보셔야할것같네요.

자세히 보기

1

답글

![](https://yt3.ggpht.com/ytc/AIdro_nEA3k4IjsXlIim_nOom2OZnRf7_flkTjeSHYy4Li6mayaF7PBFInqKLmvo5jSBdPugcTk=s88-c-k-c0x00ffffff-no-rj)

### [@user-xk4jb8si8w](https://www.youtube.com/@user-xk4jb8si8w)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEt6G9fLlk8)

 [@worldhello-o4w](https://www.youtube.com/channel/UCixjI7rZIGLxPNM5BGlvZ8g)  저는 훌륭한 개념이라고 어디든 도입해야 한다고 말한적 없습니다. 의존성 주입자체의 개념이 특정 객체에 대한 연결성과 해당 class에 대한 변화가 있으면 그거에 영향을 받는 부분들을 고려해서 사용되는 겁니다. 이런거 고려해서 react라고 무조건 의존성 주입 사용하라거나 하지말라는게 아니라 프로젝트 규모나 인원에 따라서 사용할지 안할지 고려하는 거구요. 본인 아는 만큼 보이는거니까 이해하겠지만 남들이 다른 이야기할때는 그 부분에 대해서도 생각해보시길 바랍니다.

답글

![](https://yt3.ggpht.com/ytc/AIdro_nEA3k4IjsXlIim_nOom2OZnRf7_flkTjeSHYy4Li6mayaF7PBFInqKLmvo5jSBdPugcTk=s88-c-k-c0x00ffffff-no-rj)

### [@user-xk4jb8si8w](https://www.youtube.com/@user-xk4jb8si8w)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEt6Uz9Gmf6)

 [@worldhello-o4w](https://www.youtube.com/channel/UCixjI7rZIGLxPNM5BGlvZ8g)  저는 공부하라고 말씀드린 것도 정말 의존성 주입에 대한 이해가 부족한 거 같아 말씀드리는 건데.. 이렇게 비꼬시는거 보면 더이상 이야기할 가치를 못 느낍니다.

1

답글

![](https://yt3.ggpht.com/ytc/AIdro_mDeuS8EY7LASVKqkzucqkZ45yO-0C97NDK8d9WWHGAz0WacqMu6YsQO3jUNUz_RirqkA=s88-c-k-c0x00ffffff-no-rj)

### [@worldhello-o4w](https://www.youtube.com/@worldhello-o4w)

[2주 전(수정됨)](수정됨))

 [@user-xk4jb8si8w](https://www.youtube.com/channel/UCMVnKyZl2LDEPl2x3otdpeA)  죄송한데 어떤말을 하고싶으신지 잘 모르겠습니다. 그래서 호돌맨님과 향로님의 접근방식이 맞다, 당신이 틀렸다 인지. 아니면 그저 의존성주입이라는 지식을 자랑하고 싶으셨던것인지 (솔직히 제가 당신보다는 많이 알것같긴합니다) 전자라면 이미 시장에서 여러가지 이유로 외면받는 구조라는것을 말씀드렸구요 후자면 대화를 더 해볼필요는 없을 것 같습니다. 대화할땐 의도를 명확하게 말씀해주시는걸 추천드립니다. 그리고 프로젝트 규모가 커진다고 스프링에서 사용하는 DI방식이 웹 프론트엔드에서 유효한건 아닙니다. 참고로 말씀드리면 저는 수백명의 엔지니어들이 작업하고있는 코드베이스에서 작업하고있습니다. 감사합니다.

자세히 보기

답글

![](https://yt3.ggpht.com/ytc/AIdro_mTFRi1NCyJ-FMS4AQRPbeIQ8nMH6dKlBp23HoG1rY=s88-c-k-c0x00ffffff-no-rj)

### [@아무것도몰라요-d3l](https://www.youtube.com/@%EC%95%84%EB%AC%B4%EA%B2%83%EB%8F%84%EB%AA%B0%EB%9D%BC%EC%9A%94-d3l)

[2주 전(수정됨)](수정됨))

자바스크립트를 많이 안해봐서 생기는 오해라고 봅니다. 자바랑 자바스크립트는 겉으로 보면 for, if, class 같은 문법이 공통으로 있지만 본질은 다른 언어이죠. 자바스크립트는 웹을 위해 태어났고 HTML문서를 다루기 위해 만들어진 언어입니다. 그래서 플랫폼도 다르고 사용 용도도 다르고 언어의 철학도 많이 다릅니다. 자바스크립트는 본질적으로 타입이 없는 동적 언어이며 객체지향보다는 함수형 프로그래밍에 더 가깝습니다. ES6부터 클래스 문법을 지원하지만 신택스 슈거일 뿐이고 근본은 프로토타입 기반 함수 중심 패러다임입니다. 문제를 DI로 해결할수도 있지만 자바스크립트는 일급 함수를 기본으로 제공하기 때문에 대부분의 경우 함수형 패러다임을 활용하면 간단하고 직관적으로 문제 해결이 가능하죠. 안드로이드나 IOS처럼 코드가 컴파일된 후에 실행되는 구조가 아니기 때문에 언제든 쉽게 외부 툴로 인해 변경될 수 있는 환경이고, 이럴때는 오히려 동적 언어가 더 큰 장점이 되죠 솔직히 말하면 안드로이드에서 XML로 UI를 구성하고 자바로 컨테이너 만들어서 쿵짝쿵짝 하는 코드보다가 일반적인 웹프론트엔드 HTML,CSS,JS로 조합딘 코드를 보면 코드수도 적고 더 직관적이고 더 유지보수가능하고 더 효율적인것을 많이 간과하고 있는것 같아요 문제를 DI를 통해서도 풀 수 있지만 DI를 쓰지 않아서 복잡도가 높아졌다고 주장하는건 공감이 안갑니다. 같은 추상화 레벨이고 Android코드 보고 웹 JS코드보면 DI로 푼거나 함수형 프로그래밍으로 풀어낸거나 비슷비슷합니다. 오히려 DI쪽이 보일러플레이트도 많고 디버깅하기에 더 복잡합니다. 자바스크립트가 기본으로 제공하는 일급 함수, 함수형 패러다임만으로도 문제를 더 간결하게 해결할 수 있다는걸 경험이 부족해 받아들이지못하는것으로 보입니다.

자세히 보기

5

답글

![](https://yt3.ggpht.com/ytc/AIdro_lu44-2lK8iE3sk3KNOnfIjbhszeJ9lDWwcJMYGJIXJlhFjFEGwCMeCW8cRAlCspzwbkw=s88-c-k-c0x00ffffff-no-rj)

### [@user-yl7oh4jb7k](https://www.youtube.com/@user-yl7oh4jb7k)

[2주 전](https://www.youtube.com/watch?v=uY3cn0gv2wc&lc=Ugx8-Nrvdy9W_O7ccUZ4AaABAg.AEpznk5UvajAEtEACtMtZA)

저는 7년차 프론트 개발자 입니다, 허나 그간 BE 경험도 적지 않게 있습니다. 프론트와 백엔드의 궁국적인 차이는 결국 주체가 되는 부분이 무엇이냐에 갈리는것 이라고 생각합니다. 백엔드의 경우 리얼월드에 있는 기능과 관계 그리고 연관짓는거에 더 큰 관점을 둡니다. 프론트의 경우는 ui의 구조와 사용자 편의성 혹은 디자인에 큰 관심사를 지니며, 이런 관점에서 구조 및 추상화를 진행하게됩니다, 또한 사용자에게 보여지는 UI 는 떄때로 회사의 전략적인 이유로 변경을 하기도 합니다. 즉 각각의 개발자가 봐야하는 진리의 원천이 매번 변경된다는것을 의미하기도 하는데요. 이런 배경을 바탕으로 보았을때 OOP에서 사용하는 방식으로 못하지는 않습니다, 다만 진리의 원천이 매변 변경되는 상황에서 DI와 같은 방식이 어렵게 느껴집니다. 또한 많이 사용하게 되는 typescript 의 경우 데코레이터 및 OOP를 위한 타입을 보조해주는 기능이 적습니다. 개발에는 당연히 불가능하다는 거히 없다고 생각합니다만, 업계에서 자주 이야기되는 패러타임을 굳이 거스를 이유또한 없다고 생각합니다.

간략히

4

답글

![](https://yt3.ggpht.com/ytc/AIdro_nwWS3SywQvAtmJ17hG7SOcR0ArnZem0WO_HYSKI4A=s88-c-k-c0x00ffffff-no-rj)

### [@tjrals6665](https://www.youtube.com/@tjrals6665)

[2주 전(수정됨)](수정됨))

음..지나가는 입장에서 일단 과한 표현들을 다 빼고 클래스와 (스프링 같은)DI를 사용하면 복잡도를 낮출수 있는가? 라고 하면 그렇지 않다고 생각합니다. 1. 클래스 실제로 클래스 기반 React가 hooks나오기 전에 주류였고요. hooks가 나오고 난 후 간결해지는 코드에 환영하며 다들 넘어갔지요. 저는 클래스로 대표되는 "상속"모델이 복잡도를 낮출 수 있는가에 대해 회의적인 입장입니다. 특히 UI를 다루는데 있어서요. 간단하게 안드로이드에서 머터리얼 버튼을 생각해볼까요? 대략 다음 구조를 가지고 있습니다. 아름답죠? ``` // Framework Button public class Button extends TextView { ... } // AppCompat implementation public class AppCompatButton extends Button implements TintableBackgroundView { ... } // Material Design variant public class MaterialButton extends AppCompatButton implements Checkable, Shapeable { ... } ``` 하지만 실제 사용은 어떨까요? 스타일의 우선순위 문제가 생길 수 있죠. 라이프사이클쪽도 문제가 생길 수 있고요. https://github.com/material-components/material-components-android/issues/1013 게다가 Class 방식의 상속은 필요치 않은 메서드나 동작들도 상속하게 되는데요. 요구사항이 복잡해질수도록 Sideeffect가 끼어들 가능성이 매우 높습니다. 때문에 가능하면 합성을 하라고 하지요. (하지만 합성을 선호한다면, function 대신 class를 써야할 타당한 이유가 없습니다) 그 후에 나온 SwiftUI, JetpackCompose는 왜 Class모델을 안쓰려고 할까요? Class를 충분히 쓸수 있는 기반을 가진 플랫폼들인데도요? Native 기준으로 Class는 성능 문제도 일으킵니다. 포인터 동등성으로 인한 리렌더링 어려움은 물론이고, 컴파일러 최적화에서도 이득을 보기가 힘듭니다. 때문에 UIKit와 달리 SwiftUI에서는 Struct기반으로 넘어갔어요. https://wwdcnotes.com/documentation/wwdcnotes/wwdc15-414-building-better-apps-with-value-types-in-swift/ C++에서는 성능문제를 극복하기 위해 CRTP, EBO등 괴상한 최적화 방법을 사용해야 함은 물론 생성/소멸자의 예기치 못한 동작등 때문에 Rust도 Class 모델을 포기한거고요. https://blog.rust-lang.org/2015/05/11/traits.html 어찌되었건 다시 돌아오자면 UI에서 Class로 얻는 이득이 크지 않습니다. React 기준 hooks보다 성능이 살짝 좋다고는 하는데, 복잡도를 줄여주는가에는 의문이 듭니다. 2. DI DI는 이미 React Context로 되고 있습니다. https://ko.react.dev/learn/passing-data-deeply-with-context 때문에 Spring or Dagger 스타일의 DI가 필요하다는 뜻이겠지요? 프론트에서 Dagger와 같은 컴파일타임 DI는 Typescript 특성상 쉽지 않을 것 같아 제외하구요. Spring 스타일이라 하더라도 크게 복잡성을 개선시킬 수 있을지 모르겠네요. 그래도 Async Context는 기대하고 있어요. https://github.com/tc39/proposal-async-context 저는 Kotlin context parameters나 Racket Parameterize와 같이 언어 레벨에서 대부분 DI 문제는 해결해주는게 맞다는 입장이라서요. https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md https://docs.racket-lang.org/guide/parameterize.html 정말로 복잡도를 낮추고 간단하게 만들고 싶다면, 다음과 같은 라이브러리나 기술을 탐색/투자해보시기 바랍니다. - 서버상태: tanstack-query, Relay(GraphQL), Isograph - 라이프타임 매니저: Bunshi, Bunja - 폼이나 오버레이: react-hook-form, useFunnel/useOverlay 그렇게 되면 상당한 보일러 플레이트 코드가 줄 가능성이 높다고 봅니다.