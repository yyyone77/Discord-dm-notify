# Discord DM Unread & Content Notifier

This userscript sends notifications for Discord direct messages (DMs):

- When viewing a DM conversation, it notifies the content of new messages.
- When outside the DM view, it notifies the unread DM count for a specific user.

## How to Use

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Copy the code from `discord-dm-notify.js` and create a new userscript in Tampermonkey.
3. Replace `YOUR_NTFY_URL` in the script with your own [ntfy.sh](https://ntfy.sh/) topic URL.
4. Replace `TARGET_USER_ID` with the Discord user ID you want to monitor.
5. Open [Discord Web](https://discord.com/channels/@me) in your browser.

## Notes

- Notifications are sent via ntfy.sh.
- Only works on the Discord web client.
- You must be logged in to Discord for the script to function.
