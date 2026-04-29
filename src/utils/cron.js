const cron = require('node-cron');
const { clearExpiredCaptchaEntries } = require('./cooldown');
const { info } = require('./logger');

function startHousekeepingTasks() {
  // Clean expired captcha answers every minute.
  cron.schedule('* * * * *', () => {
    clearExpiredCaptchaEntries();
    info('Expired captcha entries cleared.');
  });
}

module.exports = { startHousekeepingTasks };
