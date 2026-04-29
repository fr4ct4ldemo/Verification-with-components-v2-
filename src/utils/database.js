const path = require('path');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');

const dbPath = path.resolve(__dirname, '../fractal-verify.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

function initializeDatabase() {
  db.defaults({ guild_config: [], user_history: [], verification_logs: [] }).write();
  logger.info('Database initialized at', dbPath);
}

function getGuildConfig(guildId) {
  return db.get('guild_config').find({ guild_id: guildId }).value() || null;
}

function upsertGuildConfig(config) {
  const existing = db.get('guild_config').find({ guild_id: config.guild_id }).value();
  if (existing) {
    db.get('guild_config').find({ guild_id: config.guild_id }).assign(config).write();
  } else {
    db.get('guild_config').push(config).write();
  }
}

function upsertUserHistory(history) {
  const existing = db.get('user_history').find({ guild_id: history.guild_id, user_id: history.user_id }).value();
  if (existing) {
    db.get('user_history').find({ guild_id: history.guild_id, user_id: history.user_id }).assign(history).write();
  } else {
    db.get('user_history').push(history).write();
  }
}

function getUserHistory(guildId, userId) {
  return db.get('user_history').find({ guild_id: guildId, user_id: userId }).value() || null;
}

function resetUserHistory(guildId, userId) {
  db.get('user_history').remove({ guild_id: guildId, user_id: userId }).write();
}

function setUserFlag(guildId, userId, field, value) {
  const history = getUserHistory(guildId, userId) || {
    guild_id: guildId,
    user_id: userId,
    verified_at: null,
    attempts_taken: 0,
    answer: null,
    age_range: null,
    mode: null,
    whitelisted: 0,
    blacklisted: 0,
    last_failed_at: null,
    timeout_until: null
  };
  history[field] = value;
  upsertUserHistory(history);
}

function recordVerificationEvent(guildId, userId, eventType, detail) {
  db.get('verification_logs').push({ guild_id: guildId, user_id: userId, event_type: eventType, detail, created_at: Date.now() }).write();
}

function getVerificationStats(guildId) {
  const now = Date.now();
  const msDay = 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * msDay;
  const allTime = db.get('user_history').filter((item) => item.guild_id === guildId && item.verified_at != null).size().value();
  const today = db.get('user_history').filter((item) => item.guild_id === guildId && item.verified_at != null && item.verified_at >= now - msDay).size().value();
  const week = db.get('user_history').filter((item) => item.guild_id === guildId && item.verified_at != null && item.verified_at >= weekAgo).size().value();
  const failed = db.get('verification_logs').filter({ guild_id: guildId, event_type: 'fail' }).size().value();
  const timeouts = db.get('verification_logs').filter({ guild_id: guildId, event_type: 'timeout' }).size().value();
  return { allTime, today, week, failed, timeouts };
}

function getHourlyActivity(guildId) {
  const rows = db.get('verification_logs').filter({ guild_id: guildId }).value();
  const counts = {};
  rows.forEach((item) => {
    const date = new Date(item.created_at);
    const hour = date.getUTCHours().toString().padStart(2, '0');
    counts[hour] = (counts[hour] || 0) + 1;
  });
  return Object.keys(counts)
    .sort()
    .map((hour) => ({ hour, count: counts[hour] }));
}

module.exports = {
  initializeDatabase,
  getGuildConfig,
  upsertGuildConfig,
  getUserHistory,
  upsertUserHistory,
  resetUserHistory,
  setUserFlag,
  recordVerificationEvent,
  getVerificationStats,
  getHourlyActivity
};
