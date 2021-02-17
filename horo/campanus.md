# キャンパナスシステムでのカスプの計算

## 記号

### 地平座標系

- Φ：緯度
- A: 方位角 北を0度とし、西回り増加する 0度 ~ 360度
- z: 高度　水平線を0度とし、天頂方向に増加する　-90度 ~ 90度

### 赤道座標系

- δ:赤緯
- α:赤経

### その他

- s: 恒星時
- t: 時角

## 地表座標系 → 赤道座標系

$\begin{aligned}sin(δ) &= sin(Φ)cos(z) - cos(Φ)sin(z)cos(A)\\
δ &= sin^{-1}(sin(Φ)cos(z) - cos(Φ)sin(z)cos(A)) \end{aligned}$

$\begin{aligned}cos(δ)cos(t) &= cos(Φ)cos(z) + sin(Φ)sin(z)cos(A)\\
cos(δ)sin(t) &= sin(z)sin(A)\\
    tan(t) &= \frac{cos(δ)sin(t)}{cos(δ)cos(t)} \\
    &= \frac{sin(z)sin(A)}{cos(Φ)cos(z) + sin(Φ)sin(z)cos(A)} \\
    t &= tan^{-1}\left(\frac{sin(z)sin(A)}{cos(Φ)cos(z) + sin(Φ)sin(z)cos(A)}\right)\\
    α &= s - t
\end{aligned}$
