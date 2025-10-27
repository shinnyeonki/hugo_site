---
title: pragma
resource-path: 02.inbox/pragma.md
keywords:
tags:
  - c
  - cpp
  - language
date: 2024-01-04T12:18:00+09:00
lastmod: 2024-01-04T12:18:00+09:00
---
사용할 일은 잦은데~ 너무 무관심한 척 한 것 같다~ 

  

매번 매번 사용해도 헷갈리는 pragma의 용법에 대해 모아 총정리 하였다.

  

\#pragma는 define 이나 include와 같이 \#으로 시작하는 전처리구문(precompiler)의 하나이다.  

 컴파일러에 종속적인 구문이라 컴파일러가 변경되었을 경우 제대로된 동작을 보장하지 못하므로 프로젝트 진행중에 서로 다른 컴파일러를 사용한다면 사용하지 않음이 바람직 하겠다.  

 - 대신 대체하는 문법을 사용해야 되겠다.

  

**\#pragma once  

** 이것은 "컴파일러에게 한번만 컴파일해!" 라고 명령한다.  

 헤더의 중복을 막아준다.  

 무슨말인가 하면

  

> a.h를 구현한 a.cpp, a.h는 독립적이다.(include가 없다.)  

> b.h를 구현한 b.cpp, c.h, a.h순서로 include  

> c.h를 구현한 c.cpp, a.h를 include

  

 컴파일하면 b.h에서 c.h를 포함시키라고 되어있네? 하고 c.h에 들어가고 어? a.h를 포함하라고 그러네? 이러고 a.h를 포함한 c.h가 b.h로 돌아온다 그리고 a.h를 포함하라는 명령을 받고 a.h를 추가하다보면 같은 변수와 함수선언이 되어있다. 에러에러~  

 같은 선언이 두 번 반복되니 당연히 충돌이 난다. 컴파일러가 똑똑하여 단순히 경고 처리만 해주고 알아서 하나로 종합해줄 수도 있지만 대부분의 기본적인 컴파일러는 이건 아니잖아~ 한다.

  

 이럴 때 써주는 것이다. pragma once  

 이는 c기본문법을 사용하여 구현할 수 있다.

  

> \#ifdef \_MYCOMPILECK  

> \#define \_MYCOMPILECK  

> // 헤더 파일의 내용 선언  

> \#endif  

  

**\#pragma comment()  

**기본적인 pragma comment()의 형식은 다음과 같다.

  

> \#pragma comment( comment-type, \["comment string"\] )

  

\[\] 안의 구문은 comment-type에 따라 필요할 경우 사용하는 것이다.  

comment type에는 compiler, exestr, lib, linker, user 등이 올 수 있다.  

  

> \#pragma comment( linker, "/subsystem:windows" )  

> \#pragma comment( linker, "/subsystem:console" )

  

linker 를 사용하면 프로젝트를 console application인지 win32 application인지 명시해줄 수 있다.

  

또한 섹션의 설정을 할 수 있다.

  

> \#pragme comment( linker, "SECTION:.SHAREDATA,RWS" )

  

\#pragma data\_seg("SHAREDATA") 와 함께 사용하여 공유 메모리를 생성한다.  

위의 명령어 대신 def 파일 안에 아래와 같이 해주어도 된다.

  

> SECTIONS  

>  SHAREDATA READ WRITE SHARED  

  

이 중 가장 대표적인 사용법은 명시적인 라이브러리의 링크이다.

  

> \#pragma comment(lib, "xxxx.lib")

  

와 같이 사용하여 해당 라이브러리를 링크시켜 준다.  

 여러사람이 같이 수행하는 프로젝트의 경우 이와 같은 방법을 사용하여 lib를 링크하는 것이 라이브러리가 링크되어있다는 사실을 알기에도 좋고 굳이 주석다라 설명할 필요도 없어 좋지 않나 싶다. (있다는 사실은 알지만 아직 프로젝트 수행중 실제로 사용해 본적은 없음)

  

**\#pragma data\_seg()  

**pragma data\_seg()의 형식은 다음과 같다.

  

> \#pragma data\_seg( \["section-name"\[, "section-class"\] \] )

  

> \#pragma data\_seg( "SHAREDATA" )  

>  int x;  

>  char y;  

> \#pragma data\_seg()

  

 DLL 파일을 만들어보면서 제일 많이 사용해 보았고 가장 헷갈려 했던 부분이기도 하다.  

 DLL의 데이터 공유를 하기 위해 사용한다.  

 공유할 섹션을 만드는 것이다. 위의 명령어는 필수적으로 위에서 사용된 두 가지중 한가지 방법과 함께 사용 되어야 한다.

  

> \#pragme comment( linker, "SECTION:.SHAREDATA,RWS" )

  

> SECTIONS  

>  SHAREDATA READ WRITE SHARED  

  

 둘 다 해당 SECTION(SHAREDATA)의 허용 범위(?속성?)를 설정하는 것이다. READ, WRITE, SHARED 세 가지를 쓴다는 의미~  

 해당 사항에 대해 msdn에서 자세한 정보를 발견하지 못해 적지 못하였다(검색능력의 부족!!)  

 이제 변수 x와 y는 해당 dll을 사용하는 외부 파일과 같이 공유할 수 있는 변수가 되었다.(외부에서 접근 가능하게 되었다.)

  

 이렇게 공유하는 변수는 물론 new로 메모리를 할당한 변수도 공유 가능하다.  

 특히 new 나 memalloc(이건 아직 미확인이지만 같은 메모리 할당이므로 가능할 것으로 본다)으로 메모리할당한 변수들은 dll외부에서도 해제(delete) 가능하다.  

  

**\#pragma warning**  

특정 경고를 끄고 싶을 때 사용한다.  

비쥬얼 스튜디오의 버전이 다르기 때문에 뜨는 경고는 더더욱이 귀찮은 존재이다.(하지만 수정해서 손해볼 것은 없다. 그것이 곧 버그로 이어질 수 있기 때문이다. 특히 형변환의 경우 강제 캐스팅하여 확실히 명시해주는 것이 좋다. 일부러 그 값을 떼어낸다는 프로그래머의 의지를 컴파일러에게 보여주자. 부지런할수록 후에 손이 가는 일이 적어진다. 노력하자~)

  

형식은 이와 같다.

  

> \#pragma warning( warning-specifier : warning-number-list \[; warning-specifier : warning-number-list...\] )  

> \#pragma warning( push\[ ,n \] )  

> \#pragma warning( pop )

  

실제 사용은 아래와 같이 한다.

  

> \#pragma warning( disable:4996 )

  

**\#pragma message()  

**컴파일 중에 메세지를 뿌려준다.  

 말이 필요없다-.-/

  

> \#pragma message("merong")

  

Takes from: [http://mayu.tistory.com/8](http://mayu.tistory.com/8)  

  

선행처리기중의 하나인 pragma에 관한 사용법을 정리하여 올립니다.  

문법은 다음과 같습니다.

  

**\#pragma directive-name**

  

\#pragma는 이것을 지원하는 다른 compiler에서 방해가 없이 C++ Builder에서 원하는  

지시어를 정의할 수 있도록 해줍니다. 만일 지시명을 인식하지 못한다면 에러 또는  

경고 메세지를 수반하지 않고서 \#pragma의 지시를 무시하게 됩니다.

  

Borland C++ Builder에서 지원하는 \#pragma지시어는 모두 18가지가 있습니다.  

이제부터 그것들을 하나 하나 살펴보기로 하겠습니다.

  

1\. \#pragma anon\_struct  

    . 사용법   

      \#pragma anon\_struct on  

      \#pragma anon\_struct off  

    . Class에 익명의 구조체를 포함하여 compile하는것을 허락할 것인지를  

      지시합니다. 익명이란 tag를 갖지 않는다는것을 의미합니다.  

    ex)  

    \#pragma anon\_struct on  

    struct S {  

       int i;  

       struct {  // 익명구조체를 포함한다.  

          int   j ;  

          float x ;  

       };  

       class {  // 익명 클래스를 포함한다.  

       public:  

          long double ld;  

       };  

    S() { i = 1; j = 2; x = 3.3; ld = 12345.5;}  

    };  

    \#pragma anon\_struct off

  

    void main() {  

       S mystruct;  

       mystruct.x = 1.2;  // 포함된 data에 값을 할당한다.  

   }

  

//--------------------------------------------------------------------------  

2\. \#pragma argsused  

    . argsused 프라그마는 함수 정의 사이에서만 허용되고 바로 다음 함수에만  

      영향을 미치며 경고 메세지를 disable시킵니다.  

      이 pragma를 사용하지 않은 경우 사용되지 않은 argument가 있으면  

      "Parameter name is never used in function func-name"  

      라는 경고 메세지를 표시하게 됩니다.  

    ex)  

    \#pragma argsused  

    void \_\_fastcall TImageForm::FileEditKeyPress(TObject\* Sender, Char &Key)  

    {     if (Key == 0x13) {  

             FileListBox1->ApplyFilePath(FileEdit->Text);  

             Key = 0x0;  

          }  

    }  

    위의 예에서는 함수내에서 Sender라는 인수가 사용되지 않았지만 경고 메세지가  

    표시되지 않습니다.

  

//--------------------------------------------------------------------------  

**3\. \#pragma codeseg  

**    . 사용법  

      \#pragma codeseg <seg\_name> <"seg\_class"> <group>  

    . codeseg 프라그마는 함수들을 위치시킬 group, class 또는 segment의 이름을  

      줄수 있도록 지시합니다. 만일 option없이 사용하였다면 함수의 배치를 위해서  

      default code segment가 사용되어질것입니다. 결국 이 pragma를 사용하지 않는  

      경우와 동일한 결과를 가져옵니다.

  

//--------------------------------------------------------------------------

  

**4\. \#pragma comment  

**    . 사용법   

      \#pragma comment (comment type, "string")  

    . comment 프라그마는 출력되어지는 file에 주석을 기록시킬것을 지시합니다.  

      comment type에 올수 있는 값들은 다음중의 하나가 될것입니다.  

      \* exestr  

        linker가 ".OBJ" file에 string을 기록합니다. 이렇게 기록된 string은  

        실행파일내부에 기록되어지며, 이것은 결코 메모리로 load되지 않습니다.  

        하지만 적당한 파일 검색 유틸리티를 사용하여 실행파일에서 string을  

        찾아볼 수 있습니다.  

      \* lib  

        ".OBJ" file에 주석의 내용을 기록합니다.  

        library에 새로운 module을 추가하는 경우 에만 comment 프라그마를 사용하여  

        linker에게 결과 file에 명시할 수 있도록 지시할 수 있습니다. 다시 말하면  

        기존에 작성되어진 module에는 comment 프라그마를 사용하여 string을 추가  

        시킬수 없습니다. 새롭게 library를 작성한다면 예외일 수 있겠지요.  

        linker는 최종의 library에서 string에 명시된 library module 이름을 포함  

        합니다. 여러개의 module들도 이름지어질 수 있으며 이름을 만들기 위하여  

        linke되어집니다.

  

        예) comment ( lib, \* ) : comment로 사용할 수 있는 명령은 여러 개 있는데, 그중 가장 대표적인 것이 lib 으로, 해당 라이브러리를 링크시켜준다 .

  

             즉, 지정된 라이브러리 화일을 포함하여 컴파일한다. 프로젝트 설정에 라이브러리를 포함하는 것과 같다.

  

        예2) comment( lib, "ws2\_32" )   

              이것은, 컴파일시 ws2\_32.lib 파일을 링크하라는 명령입니다. 보통 Visual studio같은  

              IDE 개발환경에서는, 프로젝트 셋팅에서 해주지만, 혹 그런부분을 빼먹거나 환경이  

              바뀔때를 대비해서 이렇게 해두면 편하죠.

  

        예3) \#pragma comment( "comment-type" \[, commentstring\] )

  

              comment type에는 compiler, exestr, lib, linker, user 등이 올 수 있습니다.

  

              그 중 질문에서의 lib는 library file을 지정하는 것이라고 생각하시면 됩니다. comment string이라는 부분에는 file의 이름이나 path를 넣으시면 됩니다. ".lib" file 아시죠?

  

               그러니까 굳이 project settings에서 link tab에 있는 input에 .lib file을 쓰지 않고 \#pragma comment ( lib, "xxx.lib" ) 라고 써도 된다는 거죠..

  

      \* user  

        compiler는 ".OBJ" file에 string을 기록합니다. 하지만 linker에 의해  

        string은 무시되어집니다. object 파일에만 그 내용이 남게 됩니다.

  

//--------------------------------------------------------------------------

  

**5\. \#pragma exit  

**    . 사용법  

      \#pragma startup function-name <priority>  

      \#pragma exit function-name <priority>  

    . 이들 두 프라그마는 프로그램이 프로그램 시동시(main이 호출되기 전) 호출  

      되어야 할 함수와 프로그램 탈출(프로그램이 \_exit를 통해 종료하기 바로 전)  

      을 명시할 수 있도록 합니다. 명시된 function-name은 반드시 인수를 취하지  

      않고 void를 return하는 미리 선언된 함수여야합니다. 다시 말하면 다음과  

      같이 선언될 수 있습니다.  

      void func (void);  

      priority는 반드시 64-255의 범위 내에 있는 정수여야하며 최상의 우선권은  

      0입니다. 0-63사이의 priority는 C library에서 사용하므로 사용자가 이를  

      사용해서는 안됩니다. 최상위 우선권을 가진 함수는 시동시에 맨 먼저 호출  

      되고 탈출시에 맨 마지막으로 호출됩니다. 우선권을 명시해 주지 않을 경우  

      기본적으로 100의 우선권을 갖게 됩니다. pragma startup 또는 exit에 사용된  

      함수명은 반드시 프라그마 라인에 도달하기 전에 정의(또는 선언)되어야함에  

      주의하십시요.  

    ex)  

      \#include <stdio.h>  

      void startFunc(void)  

      {  

          printf("Startup Function.\\n");  

      }  

      \#pragma startup startFunc 64 //우선권 64로 시동시에 맨 먼저 호출됩니다.

  

      void exit Func(void)  

      {  

          pirntf("Wrapping up execution.\\n");  

      }  

      \#pragma exit exitFunc //기본적으로 우선권이 100으로 지정됩니다.

  

      void main(void)  

      {  

          printf("This is main.\\n");  

      }

  

//--------------------------------------------------------------------------

  

**6\. \#pragma hdrfile**  

    . 사용법  

      \#pragma hdrfile "filename.CSM"  

    . 이 지시어는 프리컴파일된 헤더를 저장할 파일의 이름을 설정합니다. IDE  

      프로젝트를 위한 디폴트 파일명은 <projectname>.CSM이고 command line용  

      으로는 BC32DEF.CSM이라는 이름을 갖습니다.  프리컴파일된 헤더를 사용하지  

      않으면 이 지시어는 효력이 없으며 명령라인 컴파일러 옵션 -H=filename 또는  

      프리 컴파일된 헤더를 사용하면 프리 컴파일된 헤더를 저장하기 위해 사용되는  

      파일명을 변경할 수 있습니다.  

      명령라인 옵션은 다음과 같습니다.  

      \* 프리컴파일드 헤더를 사용하는 경우  

        -H=filename  

      \* 프리컴파일드 헤더를 사용은 하지만 새로운 프리컴파일드 헤더파일을  

        변환하지 않는 경우  

        -Hu  

      \* 프리컴파일드 헤더를 사용하지 않거나 새로운 프리컴파일드 헤더파일을  

        변환하지 않는 경우. (기본값)  

        -H-

  

//--------------------------------------------------------------------------

  

**7\. \#pragma hdrstop**  

    . 사용법  

      \#pragma hdrstop  

    . 이 지시어는 프리컴파일에 적합한 헤더 파일의 목록을 종료시키는데, 이것을  

      사용하면 프리컴파일된 헤더가 사용하는 디스크 공간의 양을 줄일 수 있습니다.  

      프리컴파일드 헤더파일은 \#pragma hdrstop이 선언되기 전에 \#include를  

      사용하여 포함된 헤더파일들을 동일하게 프로젝트 내의 source들간에 공유시킬  

      수 있습니다. 그러므로 \#pragma hdrstop전에 일반적인 헤더파일들을 포함하면  

      최상의 콤파일러의 성능을 얻을 수 있습니다. 확실하게 \#pragma hdrstop 전에  

      \#include를 사용한다면 모든 source file들에게 동일하게 적용되거나 아주  

      조그마한 변화만이 있을 것입니다. IDE 환경에서는 강화된 프리컴파일드 헤더의  

      성능을 가지는 코드로 변환합니다. 예를 들자면 다음의 New Application의 소스  

      파일인 "Unit1.cpp"는 다음과 같이 될것입니다.

  

      \#include <vcl.h> // 일반적인 헤더파일  

      \#pragma hdrstop  // 헤더파일의 리스트는 여기서 끝난다.

  

      \#include "Unit1.h" // 헤더파일의 명시  

      //....  

      이 pragma 지시어는 오직 source file에서만 사용하며, 헤더파일에서 사용했다  

      면 아무런 효과도 없을 것입니다.

  

//--------------------------------------------------------------------------

  

**8\. \#pragma inline  

**    . 사용법  

      \#pragma inline  

    . 이 지시어는 명령 라인 콤파일러 옵션 -B 또는 IDE의 인라인 옵션과 동일  

      합니다. 이것은 컴파일러에게 프로그램 내에 인라인 어셈블리 언어 코드가  

      있음을 알려줍니다. 컴파일러는 \#pragma inline을 만날때 -B옵션을 사용하여  

      스스로 재시동하므로 이 지시어는 파일의 상단에 배치되는 것이 최선입니다.  

      실제로 -B옵션과 \#pragma inline을 모두 off시켜둘 수 있습니다. 그러면  

      컴파일러는 asm문을 만나자마자 스스로 재시동합니다. 이 옵션과 지시어의  

      목적은 컴파일 시간을 다소 절약하는 것입니다.

  

//--------------------------------------------------------------------------

  

**9\. \#pragma intrinsic  

**    . 사용법  

      \#pragma intrinsic \[-\]function-name  

    . \#pragma intrinsic를 사용하면 함수의 inline화를 위해 command-line 스위치나  

      IDE의 옵션이 무시되어집니다.  intrinsic함수를 인라인화할 때는 그 함수를  

      사용하기 전에 반드시 그것을 위한 원형을 포함시켜야만 합니다. 이것은  

      인라인화 할 때 컴파일러가 인라인화한 함수를 내부적으로 인식하는 함수로  

      개명하는 매크로를 실제로 생성하기 때문입니다. 가령 strcpy 함수를 인라인  

      화 하기 위하여 다음과 같은 문장을 사용하였다면  

      \#pragma intrinsic strcpy  

      컴파일러는 다음과 같은 매크로를 생성합니다.  

      \#define strcpy \_\_strcpy\_\_  

      컴파일러는 두 선행 밑줄과 두 후미 밑줄을 사용하여 함수 호출을 인식하고  

      그 함수의 원형을 내부적으로 저장해 둔 원형과 부합시키려 합니다. 그러므로  

      원형을 공급하지 않거나 공급한 원형이 콤파일러 내부의 원형과 부합되지 않을  

      경우, 콤파일러는 그 함수를 인라인화 하려는 시도를 불식시키고 에러를  

      발생시킵니다. 이 프라그마 사용의 궁극적인 목적은 함수 호출에 대한  

      오버헤드를 줄위기 위한것입니다. 함수호출은 빨라지겠지만 그만큼 크기는  

      증가하게 될것입니다.  

      ex)  

      \#pragma intrinsic strcpy  

      \#pragma intrinsic -strcpy

  

//--------------------------------------------------------------------------

  

**10.\#pragma link**  

    . 사용법  

      \#pragma link "\[path\]modulename\[.ext\]"  

    . 이 지시어는 실행화일에 파일을 링크시킬것을 링커에세 지시합니다.  

      기본적으로 링커는 -L옵션으로 지정된 패스와 로칼 디렉토리에서 modulename을  

      찾습니다. path 아규먼트를 이용하여 디렉토리를 지정할 수도 있습니다. 또한  

      링커는 확장자를 ".obj"를 기본으로 간주합니다.

  

//--------------------------------------------------------------------------

  

**11.** **\#pragma message**

  

     컴파일 도중에 지정된 내용을 VC의 아웃풋 윈도우에 출력시켜 준다. 컴파일시 특정 문장을 표시  

    . 사용법  

      \#pragma message ("text" \["text"\["text" ...\]\])  

      \#pragma message text  

    . \#pragma message는 프로그램 코드 내에서 사용자 정의 메세지를 명시합니다.  

      첫번째 형식은 하나 이상의 스트링 상수들로 구성된 문장을 필요로 하고  

      메세지는 괄호안에 싸여있어야만 합니다.(이 형식은 MSC와 호환됩니다.)  

      두번째 형식은 경고 메세지의 문장을 위해 \#pragma에 연속되는 문장을  

      사용합니다. \#pragma의 두가지 형태와 함께 다른 메크로의 참조는 메세지가  

      디스플레이 되기전에 확장되어집니다.  사용자 정의 메세지가 디스플레이  

      되는것은 기본치이며 명령 라인 옵션의 Show Warnings를 사용하여  

      on/off 시킬 수 있습니다. 이 옵션은 콤파일러의 -wmsg에 해당합니다.

  

    ex)  

      // msacm.h  

      \#if defined(UNICODE) && !defined(\_UNICODE)  

      \#ifndef RC\_INVOKED  

      \#pragma message("MSACM.H: defining \_UNICODE  

                       because application defined UNICODE")  

      \#endif  

      \#define \_UNICODE  

      \#endif

  

      // ustring.h  

      \#pragma message osl/ustring.h has been replaced by winsys/string.h  

      \#include <winsys/string.h>

  

//--------------------------------------------------------------------------

  

**12.\#pragma obsolete**  

    . 사용법  

      \#pragma obsolete identifier  

    . \#pragma obsolete 프로그램 코드에서 pragma의 선언 이후에 마주치게 되는  

      identifier의 첫번째 사용에 대해서 경고를 발생합니다. 경고는 identifier를  

      쓸모없는 상태로 만듭니다.  

    ex)  

    // io.h  

    \#if !defined(RC\_INVOKED)

  

    /\* Obsolete functions \*/  

    \#pragma obsolete \_chmod  

    \#pragma obsolete \_close  

    \#pragma obsolete \_creat  

    \#pragma obsolete \_open  

    \#pragma obsolete \_read  

    \#pragma obsolete \_write

  

    /\* restore default packing \*/  

    \#pragma pack(pop)

  

    \#if defined(\_\_STDC\_\_)  

    \#pragma warn .nak  

    \#endif

  

    \#endif  /\* !RC\_INVOKED \*/

  

//--------------------------------------------------------------------------

  

**13.\#pragma option  

**    . 사용법  

      \#pragma option options  

      \#pragma option push options  

      \#pragma option pop  

    . \#pragma option은 프로그램 원시 코드 내에 명령라인 옵션을 포함시키고자  

      할 때 사용하며 push 또는 pop 옵션과 함께 사용되어질 수 있습니다.  

      options는 임의의 명령라인 옵션(단, 아래에 수록된 것은 제외합니다.)이며  

      하나의 지시어 내에서 여러개의 option들을 나타낼 수 있습니다.  

      예를 들자면 다음과 같습니다.

  

      \#pragma option -C  

      \#pragma option -C -A

  

      toggle option(-a, -K같은)은 comman line에서 on/off될수 있습니다.  

      이들 toggle option들은 option 다음에 마침표를 두면 그 명령라인, 구성 파일,  

      옵션 메뉴 설정값에 대해 옵션을 리털할 수 있으며 이를 이용하면 정확한  

      설정값을 기억하지 않고도(혹은 알 필요가 없거나) 옵션을 임시로 변경했다가  

      다시 그것을 디폴트로 복귀시킬 수 있습니다.

  

      pragma optino에 포함하여 나타날 수 없는 옵션들은 다음과 같습니다.  

      -B   -c   -dname  

      -Dname=string   -efilename   -E  

      -Fx  -h   -lfilename  

      -lexset   -M   -o  

      -P   -Q   -S  

      -T   -Uname   -V  

      -X   -Y  

      다음의 경우에 \#pragmas, \#indluces, \#define과 약간의 \#ifs를 사용할 수  

      있습니다.  

      \* \#if, \#ifdef, \#ifndef 또는 \#elif지시어 내에서 두 밑줄로 시작하는 매크로명  

        (그리고 그에 따른 내장 매크로도 가능합니다.)의 사용 전.  

      \* 첫번째 실재 token이 발생하기 전(첫번째 C 또는 C++ 선언문)

  

      특정 명령 라인 옵션은 이들 사건 앞의 \#pragma option 내에서만 나타날 수  

      있는데 그러한 option들은 다음과 같습니다.  

      -Efilename        -f      -i\#  

      -m\*   -npath   -ofilename  

      -u   -W   -z

  

      다른 option들은 어디서나 변경될 수 있는데 다음 option들은 함수 또는 대상  

      선언문 사이에서 변경될 경우 컴파일러에만 영향을 미칩니다.  

      -1        -h      -r  

      -2   -k   -rd  

      -a   -N   -v  

      -ff  -O   -y  

      -G   -p   -Z

  

      다음의 option들은 언제든지 변경될 수 있으며 즉시 영향을 미칠 수 있습니다.  

      -A   -gn   -zE  

      -b   -jn   -zF  

      -C   -K   -zH  

      -d   -wxxx  

      이들 option들은 그 명령 라인 상태로 재설정하기 위해 점(.)앞에 추가로  

      나타날 수 있습니다.

  

      push 또는 pop을 사용한 \#pragma option  

      18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)18:41, 21 February 2007 (PST)~~  

      또한 콤파일러 지시어들을 쉽게 변경할 수 있도록 push 그리고 pop 아규먼트들  

      과 함께 \#pragma option 지시어를 사용할 수도 있습니다.

  

      잠재적으로 많은 컴파일러 옵션과 경고들을 변경하는 파일들을 포함하기 위해  

      \#pragma option push를 사용할 수 있고, \#pragma option pop은 단일 문장으로서  

      이전의 상태를 되돌려준다. 예를 들자면 다음과 같다.

  

      \#pragma option push  

      \#include <theworld.h>  

      \#pragma option pop  

      \#include "mystuff.h"

  

      \#pragma option push 지시어는 첫번째로 모든 콤파일러 옵션들과 경고 설정들을  

      스택에 push한 후에 다른 옵션들이 존재한다면 이를 처리한다. 다음의 예는  

      \#pragma option push가 옵션들을 사용하거나 혹은 그렇지 않을수 있음을  

      보여줍니다.

  

      \#pragma option push -C -A  

      \#pragma option push

  

      \#pragma option pop directive은 스택으로부터 옵션들과 경고들의 마지막 설정  

      을 pop함으로서 컴파일러 옵션과 경고들을 변경합니다. 만일 스택이 비어있고  

      option pop과 일치하는 option push가 없으며 아무것도 발생하지 않은경우  

      경고가 주어집니다. 다음은 빈 스택에대해서 경고를 발생시킵니다.

  

      \#pragma option push  

      \#pragma option pop  

      \#pragma option pop      /\* 경고가 발생합니다.

  

      권장하지는 않지만 지시어를 사용하여 이 경고를 off시킬 수 있습니다.  

      \#pragma warn -nop.

  

      만일 pop의 다음에 어떤 옵셥들을 명시할려고 한다면 에러가 발생하게되며  

      pragma option pop 다음에는 어떤것도 허락하지 않습니다. 예를 들면, 다음은  

      에러를 발생합니다.

  

      \#pragma option pop -C         /\* ERROR  

      만일 push된 옵션들의 스택이 파일의 시작과 마지막이 동일하지 않다면  

      다음과 같은 경고메세지가 발생합니다.

  

      Previous options and warnings not restored.

  

      이 경고메세지를 off시키기 위하여 지시어 \#pragma nopushoptwarn를 사용할  

      수 있습니다.

  

//--------------------------------------------------------------------------

  

**14\. \#pragma pack**

  

    변수 정렬을 인위적으로 변경시킨다.(보통은 4바이트로 지정되어 있다.)  

    . 사용법  

      \#pragma pack(n)

  

         위에서, n의 값으로, 1,2,4,8등이 올수 있으며, 특히 네트웍통신쪽을 개발할때  

         구조체의 멤버들 align할때 사용하는 것으로서, 빈번하게 사용됩니다.  

         구조체 정렬부분은 중요하지만, 여기서는 그쪽까지 언급하기에는 양이 많아서  

         여기까지만 설명함.  

      \#pragma pack(push, n)

  

      \#pragma pack(pop)  

    . \#pragma pack 지시어는 콤파일러 옵션 -a와 함께 \#pragma option을 사용하는  

      것과 동일합니다. n은 콤파일러가 저장된 메모리에 데이터를 정렬하는 방법을  

      결정하는 byte의 정렬이다. 보다 자세한 사항은 -a 콤파일러 옵션에 관한  

      내용을 참고하십시요. \#pragma pack은 또한 \#pragma option지시어에 push나  

      pop을 사용하는것과 동일한 기능을 제공 하도록 push나 pop 아규먼트와 함께  

      사용할 수 있습니다.  아래의 내용은 \#pragma pack과 \#pragma option을 비교한  

      내용입니다.  

      ━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━  

      \#pragma pack              ┃     \#pragma option  

      ━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━  

      \#pragma pack(n)           ┃     \#pragma option -an  

      \#pragma pack(push, n)     ┃     \#pragma option push -an  

      \#pragma pack(pop)         ┃     \#pragma option pop  

      ━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━

  

    예) \#pragma pack(push, before\_pack, 1)  

        구조체 정렬을 1 바이트로 만든다. 1 바이트로 맞추기 전의 정렬 기준을 before\_pack에 저장한다

  

         \#pragma pack(pop, before\_pack)  

        위와 같이 한쌍으로 사용된다. before\_pack에 저장된 정렬 기준으로 복원한다.

  

        다음과 같이 사용할 수도 있다.  

         \#pragma pack(push, 1)  

         \#pragma pack(pop)

  

        다음과 같이 복원없이 지정할 수도 있다.  

         \#pragma pack(1)

  

    예) \#pragma pack(pop) 이라...아마 이거랑 쌍이 되는게 있을텐데요  

         \#pragma pack(push,1) 이라던지요.  

         이건 구조체를 1바이트로 바이트 정렬하는 겁니다. 디폴트로는 8바이트로 되어 있을겁니다.  

         뭐 구조체 크기가 실제로 계산한 것과 맞지 않는 경우가 있는데..이 바이트 정렬 떄문입니다.  

         따라서..반드시 맞아야 할 경우는... 위의 코드를 구조체 아래위로 써야 합니다.  

//--------------------------------------------------------------------------

  

**15.\#pragma package  

**    . 사용법  

      \#pragma package(smart\_init)  

      \#pragma package(smart\_init, weak)  

    . smart\_init 아규먼트  

      \#pragma package(smart\_init)는 패키지된 유닛들이 의존할 순서를 결정하기위해  

      초기화 되어집니다.(패키지 소스파일 내에 기본적으로 포함됩니다.)  

      일반적으로, 패키지들을 생성하는 .CPP 파일들에 \#pragma package를 사용할 수  

      있습니다.  

      이 프라크마는 유닛을 콤파일하는기위한 초기의 순서에 영향을 미칩니다.  

      초기화는 다음의 순서에 의하여 발생합니다.  

      1. 만일 unitA가 unitB에 의존한다면 unitB는 반드시 unitA전에 초기화  

         되어져야만하는 사용("uses")에 의존합니다.  

      2. 링크의 순서(The link order)  

      3. unit에서의 우선권의 순서.(Priority order within the unit.)

  

      보통의 .OBJ 파일들은(unit들로 생성하지 않은), 첫째로 우선권의 순서에 따라  

      초기화가 일어나고서 링크가 됩니다. .OBJ 파일들의 링크 순서의 변경은  

      글로발 오브젝트가 호출되어져 생성되는 순서에 의해 변경됩니다.

  

      다음의 예는 보통의 .OBJ 파일들과 unit들의 초기화에 어떤 차이점이 있는가를  

      보여줍니다. 세개의 unit 파일들 A,B,C가 \#pragma package(smart\_init)를  

      사용하여 "smart initialized"되고 우선권은 10, 20, 30의 값을 갖는다고  

      예를 듭니다. 함수는 우선권의 값과 parent .OBJ에 의하여 이름지어져 a10,  

      a20, a30, b10등과 같은 이름을 갖습니다. 세가지는 모두 unit들이며 A는 B와  

      C를 사용하며 A,B,C의 순서로 링크되고 초기화의 순서는 다음과 같습니다.  

           B10 B20 B30 C10 C20 C30 A10 A20 A30  

      위와 같이 되었다면 .OBJ 파일들은 (unit들이 아니다)다음의 순서가 되어질  

      것입니다.  

           A10 B10 C10 A20 B20 C20 A30 B30 C30  

      \#pragma package(smart\_init)를 사용한 .CPP 파일들은 또한 \#pragma package  

      (smart\_init)를 정의한 .CPP 파일로부터 다른 .OBJ 파일들을 참조하는 \#pragma  

      link를 필요로 하며 unit에 의해 결정되어져야만 합니다. \#pragma link는, 결정  

      되지 않은 .OBJ는 라이브러리 등에 의하여 여전히 결정되어질 수 있도록 참조  

      할 수 있습니다.  

    . weak packages  

      \#pragma package(smart\_init, weak)지시어는 .OBJ 파일이 패키지의 .BPI와  

      .BPL 파일들에 정장되는 방법에 영향을 미칩니다. 만일 \#pragma package(smart\_  

      init, weak)가 unit파일 내에 나타난다면 콤파일러는 가능하다면 BPL들로부터  

      unit을 생략하고, 다른 에플리케이션이나 패키지에 의해 필요로 할 때면  

      비 패키지화된(non-packaged) 로칼 복사본의 unit을 생성합니다. 유닛이 이  

      지시어와 함께 콤파일 되었다는 것은 약하게 패키지화 되었음을 이야기 합니다.  

      ("weakly packaged")  

      \#pragma package(smart\_init, weak)는 동일한 외부 라이브러리(external librar  

      y)들에 의존할수 있는 여러 패키지들 사이에서의 충돌을 제거하는데 사용되어  

      집니다.  \#pragma package(smart\_init, weak) 지시어를 가지는 unit 파일들은  

      글로발 변수들을 갖지 않아야 합니다.

  

//--------------------------------------------------------------------------  

**16.\#pragma resource**  

    . 사용법  

      \#pragma resource "\*.dfm"  

    . 이 프라그마는 form unit에 의해 선정되어지는 파일로서 일치되는 .DFM 파일과  

      헤더파일을 필요로 합니다. 이러한 모든 파일들은 IDE에 의해 관리되어집니다.  

      만일 폼을 위한 다른 변수들을 필요로한다면 pragma resource가 사용되어지고난  

      후에 즉시 선언되어져야만 합니다. 선언은 반드시 form이 되어져야만 합니다.  

          TFormName \*Formname;

  

//--------------------------------------------------------------------------  

**17.\#pragma startup  

**    . 사용법  

      \#pragma startup function-name <priority>  

      \#pragma exit function-name <priority>  

    . \#pragma exit의 내용을 참조하십시요.

  

//--------------------------------------------------------------------------  

**18.\#pragma warn**  

    . 사용법  

      \#pragma warn \[+:-:.\]www  

    . warn지시어를 이용하면 특정 명령라인 옵션 -wxxx를 우선할 수 있습니다.  

      \#pragma warn -aus 스위치를 사용하면 함수 단위로 취급됩니다. 개별적인  

      변수들을 위해서 함수 내부에서 경고를 off시킬수는 없습니다. 함수 전체를  

      off시키거나 혹은 그렇지 않거나 둘중 하나입니다.  

    ex)  

    \#pragma warn +xxx  

    \#pragma warn -yyy  

    \#pragma warn .zzz

  

    위의 예에서는 xxx경고문은 on되고 yyy경고문은 off되며 zzz경고문은 파일의  

    컴파일이 시작할 때 갖고 있던 값으로 재저장됩니다.

  

//----- End of Document ----------------------------------------------------   

**19\. \#pragma once**

  

 1. 한번 컴파일 되면 더 이상 컴파일 하지 않는다는 뜻입니다.  

 여러개의 cpp파일이 있을때, 하나의 cpp화일이 수정되면, 그 화일만 컴파일하고  

 나머지는 하지말아란 뜻이죠.   ( 여러 번 인클루드 되는 것을 컴파일러 차원에서 막아줌 )

  

 2. \#ifndef ~ \#endif 와 같은 역할을 한다.

  

 3. 매크로들의 중복 정의를 막고, 전역변수에 static 키워드를 써줄 필요가 없어짐.

  

 4. VC++ 에서는 되고, 다른 컴파일러는 안될 수도 있음.

  

 5. 분할 컴파일시

  

이것을 사용하면 빌드시 컴파일러에 의해 해당 파일을 단 한번만 열게 된다... 그러므로 컴파일 타임을 줄일 수 있고 모듈에서 가장 먼저 나온 \#include문에서 해당 파일을 열게 되므로 재정의에 의한 오류를 방지할 수 있다...

  

예제)

  

// exam.h file

  

\#ifndef \_\_EXAM\_\_

  

\#define \_\_EXAM\_\_

  

...

  

\#endif

  

\->

  

// exam.h file

  

\#pragma once

  

...

  

//--------------------------------------------------------------------------

  

**20\. \#pragma data\_seg**

  

   dll에서 데이터 공유하고자 할 때 쓰임

  

  예) 실행파일에는 코드영역과 데이터영역이 구분되어 있다는 것은 아시지요.  

┌───────┐  

│                     │  

│                     │  

│   데이터영역   │  

│                     │  

│                     │  

├───────┤  

│                     │  

│                     │  

│     코드 영역   │  

│                     │  

│                     │  

└───────┘  

   이런 식의 그림은 아마 어디선가 많이 보셨을겁니다.(그림이 깨지네요.편집할 땐 제대로 보였는데...)  

   이런 영역을 section이라고 하지요. 위의 설명에 나오는 section이라는 용어가 이것입니다.  

   실제로 데이터 영역과 코드 영역외에도 exe나 dll에는 여러 section을 포함할 수 있습니다.  

   이건 dumpbin이라는 툴로 살펴볼 수 있습니다.  

   제 컴(Windows XP)에서 dumpbin c:\\windows\\notepadd.exe 를 해 보았더니

  

   2000 .data  

   2000 .rsrc  

   7000 .text

  

   이렇게 나오는 군요.

  

   여기서 .data에는 초기화된 데이터가 .rsrc에는 리소스들이, .text에 코드가 들어갑니다.  

   이러한 .data, .rsrc, .text 등은 일반적으로 정해져 있는 것들입니다.  

   위 MSDN의 설명에 있는 section-name이라는 것이 바로 .data, .rsrc, .text 등을 뜻하는 겁니다.  

   즉, \#pragma code\_seg( .data ) 처럼 사용한다는 거지요.  

   그리고 Specifies a code section where functions are to be allocated.라는 설명은 Specifies a section where functions or data or etc. are to be allocated. 이렇게 이해하면 더 나을 듯 하네요.

  

   그런데 이런 정해진 이름말고도 사용자가 새로운 영역을 정할 수 있습니다.

  

   \#pragma data\_seg("Shared")  

   DWORD g\_dwThreadIdPMRestore = 0;  

   HWND g\_hwnd = NULL;  

   \#pragma data\_seg()

  

   이런 식으로 하면 g\_dwThreadIdPMRestored와 g\_hwnd가 디폴트 데이터 섹션인 .data에 배치되지 않고, Shared라는 이름으로 만들어진 섹션에 배치되는 것입니다.

  

//--------------------------------------------------------------------------

  

**21.** \#pragma warning

  

    컴파일시에 어떤 조건(\#if, \#ifndef)에의해 개발자에게 어떤것을 알려주고 싶을 경우 사용.

  

    예) \#pragma warning(disable:xxxx)  

         지정된 xxxx번대의 경고 메세지를 디스플레이하는 것을 막는다. (xxxx는 번호)

  

          warning( disable : 4705 )

  

          : 특정 warnning 을 체크하지 않음, 이럴 경우 4705번 warnning은 나타나지 않는다

  

         \#pragma warning(default:xxxx)  

         지정된 xxxx번의 경고 메세지의 설정을 원래의 프로젝트 설정으로 복원한다

  

//--------------------------------------------------------------------------

  

**22\. \#pragma code\_seg**

  

   MSDN에 있는 내용  

   \#pragma code\_seg( \["section-name"\[,"section-class"\] \] )

  

   Specifies a code section where functions are to be allocated. The code\_seg pragma specifies the default section for functions. You can, optionally, specify the class as well as the section name. Using \#pragma code\_seg without a section-name string resets allocation to whatever it was when compilation began.

  

//--------------------------------------------------------------------------

  

**23\. \#pragma deprecated**

  

    C\#의 Obsolete attribute와 비슷한 의미입니다.  

    즉, 경고가 발생한 클래스 혹은 메서드 등이 이후에는 지원되지 않음을 나타내는 의미입니다.  

    그러므로 당장은 문제가 없습니다.

  

    컴파일러 specific 한..그런 옵션 지시자라고 보시면 됩니다.

  

//--------------------------------------------------------------------------

  

\#pragma는 표준 C/C++ 문법인데 각 compiler 마다 다른 명령을 제공한다... 고로 Linux나 Unix의 cc에서는 작동하지 않을 수도 있다는 것! (Visual C++에선 언제나 call...)

  

1.  pragma 는 \#로 시작하는 전처리구문 지시자 중 컴파일러에 종속적인 명령으로, 컴파일러에 특정한 옵션 명령을 내리기 위해 사용한다.

  

이것은 컴파일러에 종속적이기 때문에 컴파일러를 변경했을 경우 실행을 보장하지 못한다.

  

pragma 의 의미를 action 으로 많이들 알고 계시는데, 인터넷에서 제가 알아본바로는, 사전적인 의미는 "만능" 입니다.  어원설명 원문은, 아래를 참고하세요.

  

A pragma (from the Greek word meaning action) is used to  

direct the actions of the compiler in particular ways, but  

has no effect on the semantics of a program (in general).

  

Pragmas are used to control listing, to define an object  

configuration (for example, the size of memory), to control  

features of the code generated (for example, the degree of  

optimization or the level of diagnostics), and so on.

  

Such directives are not likely to be related to the rest of  

the language in an obvious way. Hence the form taken should  

not intrude upon the language, but it should be uniform.

  

Thus, the general form of pragmas is defined by the language.  

They start with the reserved word pragma followed by a pragma  

identifier, optionally followed by a list of arguments enclosed  

by parentheses, and terminated by a semicolon.

  

The overall syntax of the pragma identifier and arguments is  

similar to that of a procedure call. Pragmas are allowed at  

places where a declaration or a statement is allowed; also at  

places where other constructs that play the role of declarations  

(for example clauses) are allowed.

  

pragma 는 컴파일에게 그 뒤에오는 내용에 따라 어떤일을 하라는 전처리명령입니다.

  

C++는 컴파일하고 나면 함수의 이름이 바뀌게 되는데 이것을 name mangling이라고 합니다.

  

그래서 만일 dll로 작성한 함수를 불러 사용하게 되면 같은 이름을 찾을 수 없다는 오류가 나게 됩니다.

  

만일 dll에서 printString라는 함수를 만들었다고 가정을 합니다. 그러면 컴파일하고 난 후의 함수의 이름은 [**printString@@YAXXZ**](mailto:printString@@YAXXZ)와 같은 형태로 만들어 집니다.  

그런데 이 함수를 불러 사용하는 곳은 printString이라는 것만 알지 위의 것과 같은 알지 못합니다. 그래서 \#pragma라는 키워드를 사용해서 name mangling을 방지하게 되는 것입니다.  

이 mangling된 이름을 찾기 위해서는 VC++ Tool에 보면 depends를 실행하고 만들dll을 drag&drop하면 이것을 찾을 수 있습니다.

  

1.  pragma comment(linker, "/export:printString=?printString@@YAXXZ")와 같이사용하면됩니다.

  

즉 \#pragma는 원래의 함수 이름을 c++의 암호명에 대한 별칭으로 추가하도록 지시하며 링커에게 /export옵션을 전달해 주는것입니다.  

그리고 dll에서는 원래의 함수를 export(수출??말이 좀 이상하지만 대부분 이렇게 많이 쓰니까..^^)해야 하고 이 함수를 호출하는 쪽에서는 import(수입) 옵션을 써 주어야만 함수를 제대로 호출할 수 있습니다.

  

pragma 앞에 \#이 있는 걸 보면 아시겠지만 pragma는 precompiler입니다.

  

compile할 때 platform이 틀려지거나 cpu가 틀려지거나 할 때 compile option을 주게 됩니다.

  

vc++을 써보셨으면 아실텐데, project settings( ALT+F7 )에서 c/c++ tab에 보면 project options이 있습니다. link tab에도 project options가 있죠.

  

pragma가 바로 그런 역할을 하는 precompiler입니다.

  

vc++이야 ide니까 project settings라는 편한 환경을 지원하지만 만약 code호환성을 생각한다면 pragma를 쓰는 게 좋죠.

  

< api나 mfc의 구분과 관계없이 해당 컴파일러에서 사용하는 명령 >

  

\#pragma warn- // warning 디스어블

  

1.  pragma warn+ // warning 인에이블

2.  pragma opt- // 최적화 안 함

3.  pragma opt+ // 최적화 함

4.  pragma savereg- // 레지스터 저장 안 함

5.  pragma savereg+ // 레지스터 저장 함

6.  pragma library mylib.lib // 링크 라이브러리 지정

  

※  MSDN  /  "Programming Applications for Microsoft Windows"(Jeffrey Richer 저) 참조