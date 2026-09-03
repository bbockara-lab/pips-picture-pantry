# Sunny Spoon Store Release Monitor

`sunny-spoon-pantry` Firebase 프로젝트에서 30분마다 Google Play 프로덕션과 App Store Connect 상태를 확인하고, 전용 Telegram 봇으로 변경 알림을 보내는 모니터입니다.

## 동작

- 예약: 30분마다 (`America/New_York`)
- Android: 프로덕션 트랙 출시 상태와 version code
- Apple: iOS 앱 버전 상태와 인앱결제 상태
- 최초 성공: 현재 상태를 기준선으로 1회 알림
- 이후: 상태 fingerprint가 바뀔 때만 알림
- 오류: 새로운 오류는 즉시, 같은 오류는 최대 6시간에 한 번 알림
- 상태 저장: Firestore `storeReleaseMonitor/current`

## 1. 전용 Telegram 봇

1. Telegram에서 `@BotFather`를 열고 `/newbot` 실행
2. 표시 이름 예: `Sunny Spoon Store Monitor`
3. username 예: `sunny_spoon_store_monitor_bot`
4. 새 봇과의 채팅을 열고 `/start` 전송
5. 봇 토큰은 저장소나 채팅에 붙이지 말고 아래 Firebase Secret 입력 단계에서만 사용

첫 예약 실행이 가장 최근 `/start` 메시지에서 chat id를 자동으로 찾아 Firestore에 저장합니다. chat id를 별도로 찾거나 입력할 필요가 없습니다.

## 2. Firebase Secret

프로젝트 루트에서 실행합니다.

```bash
firebase functions:secrets:set STORE_MONITOR_TELEGRAM_BOT_TOKEN
firebase functions:secrets:set APP_STORE_CONNECT_PRIVATE_KEY --data-file /absolute/path/AuthKey_XXXXXXXXXX.p8
```

일반 parameter는 배포 시 입력하거나 `functions/.env.sunny-spoon-pantry`에 둘 수 있습니다.

```dotenv
APP_STORE_CONNECT_ISSUER_ID=...
APP_STORE_CONNECT_KEY_ID=...
STORE_MONITOR_BUNDLE_ID=com.sunnyspoonstudios.pipspicturepantry
```

`functions/.env*`는 gitignore 처리되어 있습니다.

## 3. Google Play 권한

Cloud Function 실행 서비스 계정에 Google Play Console의 해당 앱 조회 권한을 부여하고 Android Publisher API를 활성화합니다. JSON 서비스 계정 키를 저장소에 추가하지 않습니다.

## 4. 설치와 검증

```bash
cd functions
npm install
npm run check
cd ..
firebase deploy --only functions:storeReleaseMonitor
```

배포 후 Google Cloud Scheduler에서 `firebase-schedule-storeReleaseMonitor-us-central1`을 한 번 강제 실행합니다. 첫 성공 시 Telegram에 `스토어 감시 시작` 메시지가 오고 Firestore에 기준 상태가 생성됩니다.

## 보안

- 토큰, Apple `.p8`, chat id는 커밋 금지
- 민감정보는 Firebase Secret Manager에만 보관
- 동일한 Telegram 봇을 다른 업무 시스템과 공유하지 않음
