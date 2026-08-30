# Korean Harvest 2026 store-event upload packet

Event window: September 17 through October 4, 2026 (`America/New_York`). The in-game 50-spoon gift uses the same local-calendar window.

## Ready files

- Apple event card: `upload/apple/event-card-1920x1080.png`
- Apple event details: `upload/apple/event-detail-1080x1920.png`
- Google Play primary image: `upload/google-play/primary-image-1920x1080.jpg` (under 1 MB)
- English/Korean copy and dates: `metadata.json`

The art contains no baked-in text, store UI, borders, rounded corners, or generic screenshot framing. Pip, the bojagi gift, spoon and full moon remain within Google's central crop-safe region.

## Submission sequence

1. Submit the new binary and store version first, with the event content reachable from the first Workshop screen.
2. Apple: create or update the In-App Event, add both localizations, upload both Apple media files, use a Special Event badge, select all intended storefronts, associate the new app version, and submit the event with the app version.
3. Google Play: create or update Promotional content as an Event, add both localizations, upload the Google image, select the same countries as the production release, and submit at least four days before it begins. A featuring request should be sent at least 14 days before the start if the console still offers that option.
4. Confirm the public store pages and installed release before raising either remote `minimumSupportedBuild`. Never force players to a store build that is still processing or unavailable in their region.
5. Once both exact binaries are downloadable in every selected region, deploy the activation update policy from the release handoff.

## Artwork provenance

The source images in `source/` were generated specifically for this event from the approved Pip Korean Harvest home and Chuseok gift artwork. Runtime artwork was not overwritten. The upload files are exact store derivatives and were visually inspected after cropping.
