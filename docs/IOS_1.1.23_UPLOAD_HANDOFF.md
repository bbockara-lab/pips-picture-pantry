# iOS 1.1.23 upload handoff

## Upload artifact

- Version: **1.1.23**
- Build: **6**
- Bundle ID: `com.sunnyspoonstudios.pipspicturepantry`
- IPA: `release-artifacts/ios-1.1.23-6-controls-replay-fixes/export/App.ipa`
- Size: **25,710,646 bytes**
- SHA-256: `5BD5E5E99ADCE7B593780519675AA17972B662297FED7537EDE3AB4958083C0C`
- Archive: `release-artifacts/ios-1.1.23-6-controls-replay-fixes/PipsPicturePantry-1.1.23-6.xcarchive`

The Xcode archive and App Store export completed successfully with the Apple Distribution identity and the App Store provisioning profile. The exported IPA reports the version, build, and bundle identifier above. A standalone local deep `codesign` check reports `CSSMERR_TP_NOT_TRUSTED` because of the local certificate trust chain; the Xcode archive signing and App Store export themselves succeeded.

## Release scope

- Switch between touch and directional controls directly from the puzzle screen.
- Hold a direction to move continuously and use Trail Painting to fill multiple cells.
- Explain both controls in Pip's first directional-control guide.
- Fix the third clean Replay reward and final Replay transition.
- Reset the scroll position consistently when entering menus and puzzles.
- Include accessibility, navigation, and stability improvements.
- Korean Harvest remains a separately gated `candidate` theme and is not active in this build.

## Store release notes

### English

Puzzle controls are easier and faster to use.

- Switch between touch and directional controls directly from the puzzle screen.
- Hold a direction to move continuously, and use Trail Painting to fill multiple cells smoothly.
- Fixed the third Replay reward and improved screen positioning when opening menus and puzzles.
- Includes accessibility, navigation, and stability improvements.

### Korean

퍼즐 조작이 더 쉽고 빠르게 개선되었어요.

- 퍼즐 화면에서 터치 조작과 방향키 조작을 바로 전환할 수 있어요.
- 방향키를 길게 눌러 연속 이동하고, 이어 칠기로 여러 칸을 부드럽게 채울 수 있어요.
- 다시 풀기 세 번째 보상 문제와 메뉴·퍼즐 진입 시 화면 위치 문제를 수정했어요.
- 접근성, 네비게이션, 안정성을 개선했어요.

## Verification

- `npm run qa:candidate`: passed.
- `npm run qa:release:final`: passed.
- 66 Vitest files / 393 tests and 3 Functions tests passed.
- Android and iOS release identity gates passed.
- Mobile visual QA passed at 360x740, 390x844, 430x932, and 675x900.

The iOS build can be uploaded now. The Android versionCode 52 artifact must wait until versionCode 51 completes Play review.
