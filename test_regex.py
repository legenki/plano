import re
g = "scriptName_DEFAULT"
pattern = r'(?<!let\s)(?<!const\s)(?<!var\s)(?<!this\.)(?<!\.)\b' + g + r'\b(?!\s*:)'
s = "this.name = this.name == null ? scriptName_DEFAULT : this.name;"
print("Original:", s)
print("Replaced:", re.sub(pattern, f'_p5.env.{g}', s))
