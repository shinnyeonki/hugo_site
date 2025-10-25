---
title: 학교 database 강의
date: 2025-10-26T01:27:29+09:00
lastmod: 2025-10-26T01:27:29+09:00
resource-path: 00.Data View and Bases/학교 database 강의.md
draft: true
---
```dataview
table sequence
where source = "database(university)" and ("00" < sequence and "10" > sequence)
sort sequence
```

```dataview
table sequence
where source = "database(university)" and ("10" <= sequence and "20" > sequence)
sort sequence
```

