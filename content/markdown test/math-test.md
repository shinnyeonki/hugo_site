---
title: math test
date: 2025-10-24T20:53:44+09:00
lastmod: 2025-10-24T20:53:44+09:00
resource-path: markdown test/math-test.md
draft: true
---
# 수학 표현식 테스트

이 문서는 KaTeX 수학 렌더링 기능을 테스트하기 위한 파일입니다.

## 인라인 수학 표현식

다음은 인라인 수학 표현식입니다: $E = mc^2$

그리고 또 다른 예: $\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n$

## 블록 수학 표현식

아래는 블록 수학 표현식입니다:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

복잡한 방정식:

$$
\frac{d}{dx}\left( \int_{a}^{x} f(t) \, dt\right) = f(x)
$$

행렬:

$$
A = \begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

## 그리스 문자와 기호들

알파($\alpha$), 베타($\beta$), 감마($\gamma$), 델타($\delta$)

그리고 더 복잡한 표현식:

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

## 분수와 루트

분수: $\frac{a}{b}$, $\frac{x^2 + y^2}{z^2}$

루트: $\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt{x^2 + y^2}$

## 합과 곱

$$
\sum_{k=1}^{\infty} \frac{1}{k^2} = \frac{\pi^2}{6}
$$

$$
\prod_{p \text{ prime}} \frac{1}{1-p^{-s}} = \zeta(s)
$$

이 테스트를 통해 수학 표현식이 올바르게 렌더링되는지 확인할 수 있습니다.
