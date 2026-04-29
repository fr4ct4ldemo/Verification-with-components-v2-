const chrono = new Map();

function getCooldownKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

function isOnCooldown(guildId, userId, config) {
  const key = getCooldownKey(guildId, userId);
  const expires = chrono.get(key);
  if (!expires) return false;
  if (expires <= Date.now()) {
    chrono.delete(key);
    return false;
  }
  return true;
}

function getRemainingCooldown(guildId, userId) {
  const key = getCooldownKey(guildId, userId);
  const expires = chrono.get(key);
  if (!expires) return 0;
  const remaining = expires - Date.now();
  return remaining > 0 ? remaining : 0;
}

function setCooldown(guildId, userId, ms) {
  chrono.set(getCooldownKey(guildId, userId), Date.now() + ms);
}

function getCaptchaMap() {
  return captchaMap;
}

const captchaMap = new Map();

function setCaptchaAnswer(guildId, userId, answer, expiryMs) {
  const key = getCooldownKey(guildId, userId);
  const expires = Date.now() + expiryMs;
  captchaMap.set(key, { answer, expires });
}

function getCaptchaAnswer(guildId, userId) {
  const key = getCooldownKey(guildId, userId);
  const record = captchaMap.get(key);
  if (!record) return null;
  if (record.expires <= Date.now()) {
    captchaMap.delete(key);
    return null;
  }
  return record.answer;
}

function clearExpiredCaptchaEntries() {
  const now = Date.now();
  for (const [key, value] of captchaMap.entries()) {
    if (value.expires <= now) {
      captchaMap.delete(key);
    }
  }
}

module.exports = {
  isOnCooldown,
  getRemainingCooldown,
  setCooldown,
  setCaptchaAnswer,
  getCaptchaAnswer,
  clearExpiredCaptchaEntries
};
