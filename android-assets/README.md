# Android Vector Assets — V-Taper Athlete / V-Taping

Aset vektor Android resmi yang dikonversi dari artboard desain `Ikon aplikasi-html` dan `Logo utama-html`.

## File yang Tersedia

1. **`ic_launcher_background.xml`**:
   - Background Adaptive Icon Android (`#0A0A0A`).
   - Format: Vector Drawable (108dp x 108dp).
2. **`ic_launcher_foreground.xml`**:
   - Foreground Adaptive Icon resmi V-Taping.
   - Didesain dengan presisi skala `0.65` di tengah kanvas 108dp sehingga berada tepat di dalam **72dp Safe Zone** (lingkaran/squircle aman). Logo dijamin **tidak terpotong** oleh launcher OEM Android (Oppo ColorOS, Samsung OneUI, Google Pixel, Xiaomi HyperOS).
3. **`logo_v_taping_vector.xml`**:
   - Vektor utuh untuk layar in-app, splash screen Android 12+ (`windowSplashScreenAnimatedIcon`), atau native dialogs.

## Cara Pemasangan di Capacitor Android

Jika Anda menjalankan:
```bash
npx cap add android
```
Folder `android/` akan dibuat oleh Capacitor. Tempatkan file-file ini di lokasi berikut:

### 1. Adaptive Launcher Icon (Android 8.0 / API 26+)
Salin file ke:
- `android/app/src/main/res/drawable/ic_launcher_background.xml`
- `android/app/src/main/res/drawable/ic_launcher_foreground.xml`

Lalu di `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` dan `ic_launcher_round.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
```

### 2. In-App Drawable / Splash Screen
Salin `logo_v_taping_vector.xml` ke:
- `android/app/src/main/res/drawable/logo_v_taping_vector.xml`

Gunakan di `styles.xml` untuk tema Android 12+ Splash Screen:
```xml
<item name="android:windowSplashScreenAnimatedIcon">@drawable/logo_v_taping_vector</item>
<item name="android:windowSplashScreenBackground">#0A0A0A</item>
```
