# Android app

This project can be built as a small native Android WebView app. The Android
shell loads the existing `index.html` from local app assets, so the vocabulary
app still works offline and keeps progress in WebView local storage.

## Build

1. Install Android Studio with JDK 17 or newer.
2. Open this repository folder in Android Studio.
3. Let Gradle sync finish.
4. Run the `app` configuration on an emulator/device, or build an APK from
   `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

From a terminal with Java and Android SDK configured:

```powershell
gradle :app:assembleDebug
```

## Notes

- `index.html`, `manual.html`, and `qr-code.png` are copied into Android assets
  during Gradle's `preBuild` step.
- The sound button uses the browser Web Speech API in a normal browser and the
  Android native TextToSpeech bridge inside the WebView app.
- Progress and wrong-note data are stored on the device through WebView
  `localStorage`.
- Browser/GitHub Pages progress is not automatically shared with the Android
  WebView app. Use the in-app backup and restore buttons to move progress.

## Validate vocabulary data

```powershell
npm run validate
```

The validation checks that the app still has 60 days, 20 words per day, no
empty entries, and no duplicate English headwords.
