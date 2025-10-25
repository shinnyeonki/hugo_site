---
title: 학교 database 강의
resource-path: 00.Data View and Bases/학교 database 강의.md
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

