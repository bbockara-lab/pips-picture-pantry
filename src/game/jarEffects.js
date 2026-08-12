const EFFECT_BY_RARITY = Object.freeze({
  common: Object.freeze({ target: 8, dailyLimit: 1, reward: 1 }),
  rare: Object.freeze({ target: 7, dailyLimit: 1, reward: 1 }),
  special: Object.freeze({ target: 6, dailyLimit: 2, reward: 1 }),
  luxury: Object.freeze({ target: 5, dailyLimit: 2, reward: 1 })
});

export const JAR_EFFECT_COMPLETION_RETENTION = 1200;

export function getJarEffectDefinition(jar) {
  return EFFECT_BY_RARITY[jar?.rarity] || null;
}

export function getJarEffectProgress(save, jar, dateKey) {
  const jarId = jar?.id || null;
  const definition = getJarEffectDefinition(jar);
  const daily = save?.jarEffectDaily?.date === dateKey
    ? save.jarEffectDaily
    : { date: dateKey, count: 0 };
  return {
    progress: Math.max(0, Number(save?.jarEffectProgress?.[jarId] || 0)),
    dailyCount: Math.max(0, Number(daily.count || 0)),
    target: definition?.target || 0,
    dailyLimit: definition?.dailyLimit || 0
  };
}

export function applyJarCompletionEffect(save, jar, completionKey, dateKey) {
  const definition = getJarEffectDefinition(jar);
  const base = {
    activeJarId: jar?.id || null,
    jarEffectReward: 0,
    jarEffectAdvanced: false,
    jarEffectTriggered: false,
    jarEffectProgress: 0,
    jarEffectTarget: definition?.target || 0,
    jarEffectDailyCount: 0,
    jarEffectDailyLimit: definition?.dailyLimit || 0
  };
  if (!definition || !completionKey || !dateKey) return base;

  save.jarEffectProgress ||= {};
  save.jarEffectCompletionKeys = Array.isArray(save.jarEffectCompletionKeys)
    ? save.jarEffectCompletionKeys
    : [];
  if (save.jarEffectCompletionKeys.includes(completionKey)) {
    return { ...base, jarEffectProgress: Math.max(0, Number(save.jarEffectProgress[jar.id] || 0)) };
  }
  if (save.jarEffectDaily?.date !== dateKey) save.jarEffectDaily = { date: dateKey, count: 0 };

  const dailyCount = Math.max(0, Number(save.jarEffectDaily.count || 0));
  let progress = Math.max(0, Number(save.jarEffectProgress[jar.id] || 0));
  save.jarEffectCompletionKeys = [...save.jarEffectCompletionKeys, completionKey]
    .slice(-JAR_EFFECT_COMPLETION_RETENTION);
  progress += 1;
  base.jarEffectAdvanced = true;

  // The daily limit caps payouts, not eligible completion progress. Normal
  // puzzles only have one first-completion opportunity, so dropping progress
  // here would make that contribution unrecoverable after the cap is reached.
  if (progress >= definition.target && dailyCount < definition.dailyLimit) {
    progress -= definition.target;
    save.jarEffectDaily.count = dailyCount + 1;
    save.pantrySpoons += definition.reward;
    base.jarEffectReward = definition.reward;
    base.jarEffectTriggered = true;
  }
  save.jarEffectProgress[jar.id] = progress;
  return {
    ...base,
    jarEffectProgress: progress,
    jarEffectDailyCount: Math.max(0, Number(save.jarEffectDaily.count || 0))
  };
}
