# Implementation Verification Protocol

Use these states for every reported bug:

1. **Reproduced** ? the failure is observed in the named build and state.
2. **Candidate fix** ? source changed, but the installed app is not yet verified.
3. **Automated verified** ? focused tests measure the reported behavior, not only source text.
4. **Device verified** ? the exact AAB/build is confirmed on the affected device.
5. **Resolved** ? only after device verification. Otherwise report the highest state reached.

Rules:

- Never report ?fixed,? ?resolved,? or a check mark from grep/source presence alone.
- Record the commit hash, visible version, Android versionCode/versionName, and AAB hash for device tests.
- For CSS defects, inspect final computed style and geometry at every affected viewport; selector presence is insufficient.
- For touch defects, verify the real event sequence or an equivalent browser integration test; helper-unit tests are insufficient.
- For persisted UI, test both a fresh profile and the returning-user state that reproduced the issue.
- Reviews must distinguish code review from runtime verification and must not convert one into the other.
- A failed or incomplete verification must be reported explicitly, including the unverified layer.
- Do not append a final override until conflicting selectors are identified. Prefer replacing or consolidating the actual winning rule.

## Mandatory Signed-AAB Commit Gate

- Run `node scripts/release_commit_gate.js` before release QA and again immediately before Android build/sync.
- The signed AAB path must refuse a dirty worktree, untracked files, package/UI version mismatch, release versions absent from HEAD, a missing matching CONTEXT entry, or a HEAD subject that does not name the release version.
- Remove the previous exact AAB only after the commit gate and QA gates pass. Never use an existing bundle as evidence for a new build.
- “Included in AAB” and “committed” are separate claims. Report each only with its own evidence.
