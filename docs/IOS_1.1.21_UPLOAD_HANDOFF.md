# iOS 1.1.21 App Store Connect upload handoff

Prepared: 2026-08-18

## Upload build

- App: Pip's Picture Pantry
- Bundle ID: `com.sunnyspoonstudios.pipspicturepantry`
- Version: `1.1.21`
- Build: `4`
- IPA: `release-artifacts/ios-1.1.21-4-purchase-ux/export/App.ipa`
- Archive: `release-artifacts/ios-1.1.21-4-purchase-ux/PipsPicturePantry-1.1.21-4.xcarchive`
- IPA size: 24,465,996 bytes
- IPA SHA-256: `aac6ea31a33016a7cd1f0acd388cef5374c0d17602a058e49d27ae080f8f04ae`
- Export method: App Store Connect
- Architecture: arm64
- Distribution certificate expires: 2027-08-05
- App Store provisioning profile expires: 2027-08-05
- Entitlements: distribution build (`get-task-allow=false`) with TestFlight beta reports enabled

The exported bundle was checked for the compact 54×54 quick-travel launcher, audio preference/lifecycle fix, and distinct purchase-window-opening feedback. Music is paused immediately when disabled and is not restarted on app resume while the saved music preference is off.

## Upload order

1. Open Xcode Organizer and select `PipsPicturePantry-1.1.21-4.xcarchive`, or upload `App.ipa` with Transporter.
2. Confirm the destination is App Store Connect and the detected identity is version 1.1.21, build 4.
3. Wait for App Store Connect processing to finish, then attach build 4 to the 1.1.21 version.
4. Do not upload the superseded local build 3. If App Store Connect says build 4 already exists, increment the build number and create a new archive rather than overwriting it.
5. Confirm App Privacy remains **Data Not Collected** for the app. Website consented analytics is separate from the app and is documented at the public privacy URL.
6. Verify the in-app purchases required by this version are available: `pip_cozy_support` and `pip_spoon_jar_small`.
7. Add the English and Korean release notes below, select the intended release timing, and submit for review.

## URLs

- Support URL: `https://sunny-spoon-pantry.web.app/`
- Privacy Policy URL: `https://sunny-spoon-pantry.web.app/privacy-policy.html`
- App Store product page: `https://apps.apple.com/app/id6798479149`

## What's New — English (U.S.)

Summer has arrived in Pip's Pantry!

- 100 new puzzles—600 in all across 27 stages
- 18 summer Pantry collectibles and 3 new badges
- A smaller, consistent navigation button that stays clear of puzzle controls
- Music now stays off when disabled, including after returning to the app
- A sunny new home scene and improved large-board controls
- No forced ads

## 새로운 기능 — 한국어

핍의 팬트리에 여름이 찾아왔어요!

- 새 퍼즐 100개 추가—27개 스테이지, 총 600개
- 여름 팬트리 수집품 18개와 새 배지 3개
- 퍼즐 조작을 가리지 않는 작고 일관된 이동 버튼
- 음악을 끄면 앱으로 돌아온 뒤에도 꺼진 상태 유지
- 산뜻한 여름 홈 화면과 큰 퍼즐 조작 개선
- 강제 광고 없음

## Screenshots ready for upload

Six direct app captures are available for each locale and device class:

- iPhone 6.9-inch, English: `store-assets/store-media/common-candidate-1.1.20/upload/app-store/iphone-6.9/en-US/`
- iPhone 6.9-inch, Korean: `store-assets/store-media/common-candidate-1.1.20/upload/app-store/iphone-6.9/ko-KR/`
- iPad 13-inch, English: `store-assets/store-media/common-candidate-1.1.20/upload/app-store/ipad-13/en-US/`
- iPad 13-inch, Korean: `store-assets/store-media/common-candidate-1.1.20/upload/app-store/ipad-13/ko-KR/`

Verified dimensions are 1290×2796 for iPhone and 2048×2732 for iPad. The screenshots show the current 600-puzzle summer content and remain valid for 1.1.21.

## Final checks already passed

- Xcode archive and App Store Connect export completed successfully.
- Version/build, bundle ID, arm64 architecture, distribution certificate, profile, and entitlements checked.
- IPA SHA-256 recorded above.
- The actual IPA web bundle contains the compact navigation and audio-off fixes.
- 59 Vitest files / 364 tests and 3 Functions tests passed.
- Live privacy policy matches the local policy.
- Screenshot manifests and checksums passed.
