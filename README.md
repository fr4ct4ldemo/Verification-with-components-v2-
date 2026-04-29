⌘ Fractal Verify 確認システム
> 認証 › A modular Discord verification bot built with discord.js v14. Custom panels, server lockdown, role gating, captcha support, and full admin controls — all in one system.
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2)
---
◈ Features
確認 — Custom verification panel with modal-based flow
安全 — Full server lockdown on setup, categories hidden from `@everyone` until verified
Captcha mode with math questions, or simple AGREE-based verification
Blacklist and whitelist system per user
Cooldowns, attempt limits, and automatic timeouts
Persistent storage via SQLite
Rich verification logs with per-event embeds
DM notifications on successful verification
Scheduled housekeeping with `node-cron`
Iconsax custom emoji support throughout all embeds
---
◈ Requirements
Node.js `v18.0.0` or higher
A Discord bot token with the following intents enabled in the Developer Portal:
`Guilds`
`Guild Members`
`Guild Messages`
`Message Content`
The bot must have these permissions in your server:
`Manage Roles`
`Manage Channels`
`Moderate Members`
`Send Messages`
`View Channel`
`Embed Links`
`Use Application Commands`
---
◈ Setup
1. Clone the repo
```bash
git clone https://github.com/fr4ct4ldemo/glorious.git
cd glorious
```
2. Install dependencies
```bash
npm install
```
3. Configure environment
Create a `.env` file in the root directory:
```env
TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```
4. Deploy slash commands
```bash
npm run deploy-commands
```
5. Start the bot
```bash
npm start
```
---
◈ Commands
Command	Description
`/setup-verify`	Send the verification panel and lock all server categories for `@everyone`
`/verify-config`	Configure role, log channel, rules text, captcha, timeouts, cooldowns, and more
`/verify-panel`	Resend the verification panel to the configured channel
`/verify-stats`	View guild-wide verification statistics and activity
`/verify-lookup`	Inspect an individual user's verification history
`/verify-reset`	Reset a user's verification attempt history
`/verify-whitelist`	Add a user to the whitelist for instant role bypass
`/verify-blacklist`	Block a user from completing verification
`/unverify`	Remove the verified role from a user
---
◈ How It Works
Run `/setup-verify` — sends the verification panel to your chosen channel and automatically sets all guild categories to private for `@everyone`, granting `ViewChannel` only to the verified role
Users click 確認 › Verify Me on the panel, fill out the modal, and receive the verified role instantly on success
The verified role grants access to all locked categories automatically via Discord's permission system
All events (success, fail, timeout) are logged to your configured log channel
---
◈ Project Structure
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
◈ License
This project is licensed under the MIT License — feel free to use, modify, and distribute.
---
<p align="center">⌘ 確認システム ｜ built by <a href="https://github.com/fr4ct4ldemo">fr4ct4ldemo</a></p>
