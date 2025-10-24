---
title: Rewrite as tweet thread
date: 2025-10-17T22:42:39+09:00
lastmod: 2025-10-17T22:46:42+09:00
resource-path: copilot/copilot-custom-prompts/Rewrite as tweet thread.md
aliases:
tags:
copilot-command-context-menu-enabled: false
copilot-command-slash-enabled: false
copilot-command-context-menu-order: 1120
copilot-command-model-key: ""
copilot-command-last-used: 0
---
Convert {} into a Twitter thread following these rules:
    1. Each tweet must be under 240 characters
    2. Start with "THREAD START" on its own line
    3. Separate tweets with "

---

"
    4. End with "THREAD END" on its own line
    5. Make content engaging and clear
    Return only the formatted thread.
