# fractal verify 確認システム

> 認証 › a modular discord verification bot built with discord.js v14. custom panels, server lockdown, role gating, captcha support, and full admin controls.

[![license: mit](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen)](https://nodejs.org)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2)](https://discord.js.org)

---

## features

- custom verification panel with modal-based flow
- full server lockdown on setup — categories hidden from `@everyone` until verified
- captcha mode with math questions, or simple agree-based verification
- blacklist and whitelist system per user
- cooldowns, attempt limits, and automatic timeouts
- persistent storage via sqlite
- rich verification logs with per-event embeds
- dm notifications on successful verification
- scheduled housekeeping with `node-cron`
- iconsax custom emoji support throughout all embeds

---

## requirements

node.js `v18.0.0` or higher and a discord bot token with the following intents enabled in the developer portal:

- `guilds`
- `guild members`
- `guild messages`
- `message content`

the bot also needs these permissions in your server:

- `manage roles`
- `manage channels`
- `moderate members`
- `send messages`
- `view channel`
- `embed links`
- `use application commands`

---

## setup

clone the repo and install dependencies

```bash
git clone https://github.com/fr4ct4ldemo/glorious.git
cd glorious
npm install
```

create a `.env` file in the root directory

```env
TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

deploy slash commands then start the bot

```bash
npm run deploy-commands
npm start
```

---

## commands

| command | description |
|---|---|
| `/setup-verify` | send the verification panel and lock all categories for `@everyone` |
| `/verify-config` | configure role, log channel, rules, captcha, timeouts, and cooldowns |
| `/verify-panel` | resend the verification panel to the configured channel |
| `/verify-stats` | view guild-wide verification statistics and activity |
| `/verify-lookup` | inspect an individual user's verification history |
| `/verify-reset` | reset a user's verification attempt history |
| `/verify-whitelist` | add a user to the whitelist for instant role bypass |
| `/verify-blacklist` | block a user from completing verification |
| `/unverify` | remove the verified role from a user |

---

## how it works

run `/setup-verify` to send the panel and automatically lock all guild categories for `@everyone`, granting `ViewChannel` only to the verified role. users click **確認 › verify me**, fill out the modal, and receive the role instantly on success. all events are logged to your configured log channel.

---

## project structure

```
src/
├── commands/          slash command files
├── components/        embed builders for every state
├── handlers/          button and modal interaction handlers
├── utils/             database, cooldown, cron, logger
├── deploy-commands.js register slash commands
└── index.js           entry point
```

---

## license

[mit](./LICENSE) — free to use, modify, and distribute.

---

<p align="center">⌘ 確認システム ｜ built by <a href="https://github.com/fr4ct4ldemo">fr4ct4ldemo</a></p>
