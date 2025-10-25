---
title: android 이벤트 처리 코드 분리
resource-path: android 이벤트 처리 코드 분리.md
aliases:
tags:
date: 2025-10-16T16:04:39+09:00
lastmod: 2025-10-16T16:09:26+09:00
---
네, 말씀하신 내용이 바로 **'관심사의 분리(Separation of Concerns)'** 원칙을 UI 계층에 적용하는 아주 훌륭한 접근 방식입니다. Activity/Fragment는 오케스트라의 지휘자처럼 어떤 뷰와 어떤 로직 핸들러(ViewModel)를 연결할지 '조율'만 하고, 실제 이벤트 처리 로직은 모두 ViewModel에, UI 내부의 세부 이벤트 감지는 커스텀 뷰 자체에 위임하는 구조입니다.

이 목표를 달성하기 위한 가장 이상적이고 현대적인 방법을 단계별로 설명해 드리겠습니다.

**핵심 전략: Custom View + Callback Interface + ViewModel**

1.  **Custom View**: 내부에 포함된 여러 위젯(ImageView, TextView 등)의 이벤트를 감지합니다.
2.  **Callback Interface**: Custom View에서 발생한 이벤트를 외부로 알리기 위한 '약속(Contract)'입니다. "프로필 이미지가 눌렸다", "팔로우 버튼이 눌렸다" 와 같은 의미 있는(semantic) 이벤트로 추상화합니다.
3.  **ViewModel**: Callback Interface를 구현하여 실제 비즈니스 로직을 처리합니다.
4.  **Activity/Fragment**: Custom View와 ViewModel을 연결(setup)하는 역할만 담당합니다.

---

### 단계별 구현 방법

간단한 '프로필 뷰'를 예시로 들어보겠습니다. 이 뷰는 프로필 이미지와 팔로우 버튼으로 구성됩니다.

#### Step 1: 이벤트 콜백 인터페이스 정의 (계약서 작성)

어떤 이벤트가 발생할 수 있는지 명확하게 정의하는 인터페이스를 만듭니다.

```kotlin
// ProfileViewEvents.kt
interface ProfileViewEvents {
    fun onProfileImageClicked(userId: String)
    fun onFollowButtonClicked(userId: String)
}
```

- `onClick` 같은 일반적인 이름 대신 `onProfileImageClicked` 처럼 의미를 담아 정의하는 것이 중요합니다.

#### Step 2: 커스텀 뷰(Custom View) 제작

이 뷰는 내부의 클릭 이벤트를 감지하고, 외부로 약속된 인터페이스(ProfileViewEvents)를 통해 이벤트를 전달하는 역할만 합니다.

```xml
<!-- view_profile.xml (커스텀 뷰의 레이아웃) -->
<merge xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    tools:parentTag="androidx.constraintlayout.widget.ConstraintLayout">

    <ImageView
        android:id="@+id/profile_image"
        android:layout_width="80dp"
        android:layout_height="80dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        tools:src="@tools:sample/avatars" />

    <Button
        android:id="@+id/follow_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Follow"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</merge>
```

```kotlin
// ProfileView.kt (커스텀 뷰 클래스)
class ProfileView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : ConstraintLayout(context, attrs, defStyleAttr) {

    private val binding: ViewProfileBinding
    private var eventListener: ProfileViewEvents? = null
    private var userId: String = "default_user" // 예시 데이터

    init {
        binding = ViewProfileBinding.inflate(LayoutInflater.from(context), this, true)
        setupInternalClicks()
    }

    // 뷰 내의 세부적인 클릭 리스너 설정
    private fun setupInternalClicks() {
        binding.profileImage.setOnClickListener {
            // 외부로 약속된 이벤트를 호출
            eventListener?.onProfileImageClicked(userId)
        }

        binding.followButton.setOnClickListener {
            // 외부로 약속된 이벤트를 호출
            eventListener?.onFollowButtonClicked(userId)
        }
    }

    // 데이터를 설정하는 함수
    fun setProfileData(user: User) {
        this.userId = user.id
        // Glide, Coil 등으로 이미지 로드
        // binding.userName.text = user.name
    }

    // 외부에서 이벤트 핸들러(ViewModel)를 주입받는 통로
    fun setEventListener(listener: ProfileViewEvents) {
        this.eventListener = listener
    }
}
```

#### Step 3: ViewModel에서 이벤트 핸들러 구현

ViewModel은 View가 무슨 모양인지 전혀 몰라도 됩니다. 오직 `ProfileViewEvents`라는 약속만 보고 로직을 구현합니다.

```kotlin
// ProfileViewModel.kt
class ProfileViewModel : ViewModel(), ProfileViewEvents { // 인터페이스 구현

    private val _toastMessage = MutableLiveData<Event<String>>()
    val toastMessage: LiveData<Event<String>> = _toastMessage

    // 약속된 이벤트가 호출되면 실행될 실제 로직
    override fun onProfileImageClicked(userId: String) {
        _toastMessage.value = Event("프로필 이미지 클릭: $userId")
        // ex) 프로필 상세 화면으로 이동하는 로직 트리거
    }

    override fun onFollowButtonClicked(userId: String) {
        // ex) API 호출하여 팔로우/언팔로우 처리
        _toastMessage.value = Event("팔로우 버튼 클릭: $userId")
    }
}
```

#### Step 4: Activity/Fragment에서 '조율' 작업

Activity는 그저 지휘자입니다. `ProfileView`와 `ProfileViewModel`을 연결해 주기만 합니다. **이벤트 처리 로직은 단 한 줄도 없습니다.**

```xml
<!-- activity_main.xml -->
<LinearLayout ...>

    <com.example.yourapp.ProfileView
        android:id="@+id/profile_view"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

</LinearLayout>
```

```kotlin
// MainActivity.kt
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val viewModel: ProfileViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // --- 지휘자의 역할: 뷰와 뷰모델 연결 (Setup) ---
        binding.profileView.setEventListener(viewModel)
        // ---------------------------------------------

        // 데이터가 있다면 뷰에 설정
        val user = User(id = "user-123", name = "Android")
        binding.profileView.setProfileData(user)

        observeViewModel()
    }

    // ViewModel의 상태 변화를 감지하여 UI에 반영
    private fun observeViewModel() {
        viewModel.toastMessage.observe(this, EventObserver { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        })
    }
}
```

### 이 구조의 강력한 장점

1.  **완벽한 책임 분리**:
    *   **Activity**: 뷰와 로직의 연결, 생명주기 관리.
    *   **Custom View**: 자기 내부의 UI 이벤트 감지 및 외부로 추상화된 이벤트 전달.
    *   **ViewModel**: "무엇을 할 것인가"에 대한 비즈니스 로직만 담당.
2.  **재사용성 극대화**:
    *   `ProfileView`는 어떤 화면에서든 가져다 쓸 수 있는 독립적인 부품이 됩니다.
    *   `ProfileViewModel`의 로직도 다른 뷰에서 재사용될 수 있습니다.
3.  **테스트 용이성**:
    *   `ProfileViewModel`은 Android 프레임워크에 대한 의존성이 거의 없으므로(인터페이스만 구현), JVM 환경에서 손쉽게 유닛 테스트를 할 수 있습니다.
4.  **가독성 및 유지보수성**:
    *   `MainActivity`는 매우 간결해지며, 전체적인 구조를 파악하기 쉬워집니다. 새로운 기능을 추가하거나 수정할 때 어디를 봐야 할지 명확해집니다.

---

### 심화: 데이터 바인딩으로 연결(Setup) 코드도 제거하기

데이터 바인딩을 사용하면 Activity의 `setEventListener` 호출 코드마저 XML로 옮겨 완전히 자동화할 수 있습니다.

**1. BindingAdapter 생성**

```kotlin
// ProfileViewBindingAdapter.kt
@BindingAdapter("onProfileEvent")
fun setOnProfileEvent(view: ProfileView, listener: ProfileViewEvents) {
    view.setEventListener(listener)
}
```

**2. XML 레이아웃 수정**

```xml
<!-- activity_main.xml -->
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <data>
        <variable
            name="viewModel"
            type="com.example.yourapp.ProfileViewModel" />
    </data>

    <LinearLayout ...>

        <com.example.yourapp.ProfileView
            android:id="@+id/profile_view"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:onProfileEvent="@{viewModel}" /> <!-- ViewModel을 리스너로 직접 바인딩 -->

    </LinearLayout>
</layout>
```

**3. Activity 수정**
`binding.profileView.setEventListener(viewModel)` 코드가 필요 없어집니다.

```kotlin
// MainActivity.kt
// ...
binding.viewModel = viewModel // 바인딩 변수에 뷰모델 할당
// binding.profileView.setEventListener(viewModel) <- 이 줄 삭제!
```

이 방법을 사용하면 Activity는 그야말로 뷰-모델 바인딩과 생명주기 관리만 하는, 매우 이상적인 'Dumb View'가 됩니다.
