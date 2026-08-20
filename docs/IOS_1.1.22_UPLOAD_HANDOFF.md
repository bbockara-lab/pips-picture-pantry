# iOS 1.1.22 upload handoff

Prepared on 2026-08-19 from the local Developer workspace. OneDrive was not used or modified.

## Upload artifact

- Marketing version: **1.1.22**
- Build: **5**
- Bundle ID: `com.sunnyspoonstudios.pipspicturepantry`
- IPA: `release-artifacts/ios-1.1.22-5-mailbox-home-polish-review-fixed/export/App.ipa`
- Size: 24,722,202 bytes
- SHA-256: `882C45CFA3A8293778FEE97BFD0E0C877546B868AC280B842CE093D494B51D0E`
- Archive: `release-artifacts/ios-1.1.22-5-mailbox-home-polish-review-fixed/PipsPicturePantry-1.1.22-5.xcarchive`
- The earlier `release-artifacts/ios-1.1.22-5-mailbox-home-polish/export/App.ipa` predates the release-review fixes and is superseded; **do not upload it**.
- Archive and export completed successfully using the Apple Distribution identity and the App Store distribution profile.
- Exported IPA metadata was inspected and matches version 1.1.22, build 5, and the production bundle ID.
- Release-review corrections are included: narrow 360/390px home headers no longer overlap the spoon balance, and mailbox unread badges clear immediately after opening a letter.
- Full candidate/final verification passed with 60 Vitest files / 370 tests, 3 Functions tests, Android and iOS identity gates, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.

## What's New — English

Pip's Pantry has a new mailbox!

- Read a warm letter from the developers.
- Revisit Pip's stories and guides after you discover them.
- Enjoy a clearer Play button and an improved home layout.
- See the installed app version in Settings.
- Includes small navigation and stability improvements.

## 새로운 기능 — 한국어

핍의 팬트리에 새 편지함이 생겼어요!

- 개발자가 전하는 따뜻한 첫 편지를 만나 보세요.
- 게임에서 만난 핍의 이야기와 안내를 편지함에서 다시 볼 수 있어요.
- 플레이 버튼이 더 눈에 잘 띄고 홈 화면 배치가 자연스러워졌어요.
- 설정에서 설치된 앱 버전을 확인할 수 있어요.
- 네비게이션과 안정성을 개선했어요.

## App Store Connect sequence

1. Upload `App.ipa` with Transporter.
2. Wait for processing, then select build **5** on the iOS 1.1.22 version page.
3. Paste and save both localized What's New texts above.
4. Keep automatic release and immediate availability if the current release policy is unchanged.
5. Add for Review, verify the submission contains iOS App 1.1.22 (5), and submit.
