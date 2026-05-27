import re
import os

files = [
    'src/secuencia/js/models/Script.js',
    'src/secuencia/js/models/TextBox.js',
    'src/secuencia/js/ui/GlyphEditor.js',
    'src/secuencia/js/ui/Buttons.js',
    'src/secuencia/js/utils/Export.js',
    'src/secuencia/js/utils/Animation.js',
]

# Only globals from app.js that need to be read/written by modules
globals_to_prefix = [
    "scriptName_DEFAULT", "script_xHeight_DEFAULT", "script_ascenderHeight_DEFAULT", "script_descenderHeight_DEFAULT",
    "script_glyphWidth_DEFAULT", "script_wordSpace_DEFAULT",
    "script_xHeight", "script_ascenderHeight", "script_descenderHeight", "script_defaultGlyphWidth", "script_defaultWordSpace",
    "basicLatin", "updateInterface_glyphSet_boxes", "activeScript",
    "size", "wordSpace", "lineHeight", "gridColor", "missingColor", "scriptStrokeWeight", "scriptColor",
    "glyphEditor_gridSize_DEFAULT", "glyphEditor_gridsPerSegment_DEFAULT", "glyphEditor_scriptStrokeWeight_DEFAULT",
    "glyphEditor_buttonSizeBig_DEFAULT", "glyphEditor_buttonSizeSmall_DEFAULT", "activeGlyph",
    "updateInterface_glyphEditorContext_state", "updateInterface_glyphEditorTools_state", "glyphEditor_guideColor",
    "backgroundColor", "hoverColor", "glyphEditor_anchorColor", "activeColor", "scripts",
    "updateInterface_textBoxSettings_state", "updateInterface_textBoxSettings_label",
    "wordSpace_DEFAULT", "letterSpace_DEFAULT", "letterWidth_DEFAULT", "letterHeight_DEFAULT", "slant_DEFAULT",
    "randomSize_DEFAULT", "randomLetterSpace_DEFAULT", "randomLetterWidth_DEFAULT", "randomLetterHeight_DEFAULT",
    "randomSlant_DEFAULT", "randomBaselineOffset_DEFAULT", "precision_DEFAULT",
    "letterSpace", "letterWidth", "letterHeight", "slant", "randomSize", "randomLetterSpace", "randomLetterWidth",
    "randomLetterHeight", "randomSlant", "randomBaselineOffset", "precision", "animations", "activeScriptIndex"
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    for g in globals_to_prefix:
        # Don't replace if preceded by `let `, `const `, `var `, `this.` or `.`
        # Don't replace if followed by `:` (object key)
        pattern = r'(?<!let\s)(?<!const\s)(?<!var\s)(?<!this\.)(?<!\.)\b' + g + r'\b(?!\s*:)'
        content = re.sub(pattern, f'_p5.env.{g}', content)
        
    with open(f, 'w') as file:
        file.write(content)

print("Done replacing.")
