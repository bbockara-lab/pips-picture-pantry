# Telegram idea release gate — Korean Harvest 2026

Last reconciled: 2026-08-29
Release target: shared Korean Harvest Android/iOS update

This table is the owner-request reconciliation required before either native package is built. Historical or unrelated ideas may be deferred, but every item explicitly grouped into this update must be resolved here.

| Owner request | Release disposition | Evidence |
| --- | --- | --- |
| D-pad arrows should move safely on a quick tap and trail-paint only while deliberately held | Included | `src/ui/puzzleCursorControls.js`, cursor-control regression tests |
| Next Picture should react on the first tap, ignore duplicate transition taps, and continue from the current puzzle in authored order | Included | `src/game/puzzleSequence.js`, guarded completion transition in `src/ui/appShell.js`, sequence tests |
| Remove the confusing separate collectible-effect activation/selection concept; the home-displayed collectible is the one shown on normal completion | Included | Pantry/save/home/completion wiring and `tests/featuredPantryJar.test.js` |
| Explain the account-wide extra-spoon chance from the Pantry and from a displayed home collectible; show positive rates as `+N%`, never call 0% a bonus | Included | Pantry detail/home click routing, locked copy, bilingual guide tests |
| Retire obsolete Pantry room/neighbour guide triggers and mailbox stories; keep current guides in current order | Included | `src/ui/pantryGuideFlow.js`, `src/ui/guideDialog.js`, `src/data/mailboxMessages.js`, guide/mailbox tests |
| Completed stages should remain recognizable as substantial rectangular collapsed cards | Included | puzzle-picker collapsed summary/style and mobile QA contract |
| Replace background music and effects with the authored Korean Harvest set | Included | 322 runtime audio files, `src/ui/audioCatalog.js`, `src/ui/audio.js`, `npm run qa:audio` |
| Time Attack should communicate its start and use dedicated audio | Included | existing 3-2-1-Go overlay plus authored Time Attack music/countdown/stingers |
| Main seasonal Workshop background must visibly include Pip | Included | approved baked-in Pip background and asset-manifest invariant |
| Give one 50-spoon gift around Chuseok and identify it prominently as Pip's Korean Chuseok gift | Included | 2026-09-17–2026-10-04 local-date claim, dedicated gift art/modal, one-time save test |
| Make the shared Korean Harvest release mandatory on both Android and iOS | Included with safe remote activation | hosted policy source, checker, pre-live safe policy and post-live activation policy requirement |
| Prepare Apple/Google seasonal event follow-up | Included | bilingual metadata, exact Apple/Google event images and submission checklist |

## Release decision

**Telegram idea gate: PASS**

Packaging remains conditional on the full automated candidate gate, native simulator/device visual and audio review, exact version identity, signed artifact verification, and the rule that mandatory-update minimums are raised only after both store binaries are publicly downloadable.
