// ==UserScript==
// @name         Discord DM Unread & Content Notifier (Content Only in DM View)
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  Notifies DM content in DM view, and unread count in server channels
// @match        https://discord.com/channels/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*
 * This userscript sends notifications for Discord direct messages (DMs).
 * - When viewing a DM conversation, it notifies the content of new messages.
 * - When outside the DM view, it notifies the unread DM count for a specific user.
 * 
 * To use:
 * 1. Replace 'YOUR_NTFY_URL' with your own ntfy.sh topic URL.
 * 2. Replace 'TARGET_USER_ID' with the Discord user ID you want to monitor.
 */

(function() {
    'use strict';

    const ntfyUrl = "https://ntfy.sh/YOUR_NTFY_URL"; // <-- Replace with your ntfy.sh topic
    const targetUserId = "TARGET_USER_ID"; // <-- Replace with the target Discord user ID
    let lastUnreadCount = 0;
    let lastMessageId = null;

    function sendNtfy(message) {
        GM_xmlhttpRequest({
            method: "POST",
            url: ntfyUrl,
            data: message,
        });
    }

    setInterval(() => {
        // Check if current view is DM with target user
        const urlMatch = location.pathname.match(/\/channels\/@me\/(\d+)/);
        const isDmView = urlMatch && urlMatch[1] === targetUserId;

        // 1. Notify DM content in DM view
        if (isDmView) {
            const messageItems = document.querySelectorAll('li.messageListItem__5126c');
            if (messageItems.length === 0) return;
            const lastMsgItem = messageItems[messageItems.length - 1];
            const lastMsgContent = lastMsgItem.querySelector('.messageContent_c19a55');
            const messageId = lastMsgItem.id;

            if (lastMsgContent && messageId && messageId !== lastMessageId) {
                sendNtfy(`New DM: ${lastMsgContent.innerText}`);
                lastMessageId = messageId;
            }
            // Do not notify unread count in DM view
            return;
        }

        // 2. Notify unread DM count outside DM view
        if (!isDmView) {
            const icons = document.querySelectorAll('img.icon__6e9f8');
            icons.forEach(icon => {
                if (icon.src.includes(targetUserId)) {
                    const wrapper = icon.closest('.wrapper__6e9f8');
                    if (!wrapper) return;
                    const parent = wrapper.parentElement?.parentElement?.parentElement;
                    if (!parent) return;
                    const badge = parent.querySelector('.numberBadge__2b1f5');
                    let unreadCount = 0;
                    if (badge) {
                        unreadCount = parseInt(badge.innerText, 10);
                    }

                    if (unreadCount > lastUnreadCount) {
                        sendNtfy(`New DM: ${unreadCount} unread messages`);
                    }

                    if (unreadCount === 0) {
                        lastUnreadCount = 0;
                    } else {
                        lastUnreadCount = unreadCount;
                    }
                }
            });
        }
    }, 1000);
})();