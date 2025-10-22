
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

