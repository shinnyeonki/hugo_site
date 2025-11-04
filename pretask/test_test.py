import re
text = "**unclosed bold"
print(re.sub(r'(\*\*|__)(.*?)\1', r'\2', text))  # 출력: **unclosed bold (변함 없음)