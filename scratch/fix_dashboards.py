import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# 3. University Dashboard: Increase font weight and color intensity of "AI Match"
old_ai_match = '''<div className="font-black text-base" style={{ color: "var(--green)" }}>{c.match}%</div>'''
new_ai_match = '''<div className="font-black text-xl" style={{ color: "var(--success)" }}>{c.match}%</div>'''
app_code = app_code.replace(old_ai_match, new_ai_match)

# Also check for p.match (in smart match screen or other places if any, but the prompt says "inside the project cards" in University Dashboard)
# Let's replace any AI match rendering if it looks like that:
app_code = app_code.replace(
    '''<div className="font-black text-xl" style={{ color: "var(--green)" }}>{p.match}%</div>''',
    '''<div className="font-black text-2xl" style={{ color: "var(--success)" }}>{p.match}%</div>'''
)

# 4. Industry Dashboard: Change "Partner" to "Collaborate"
old_industry_cta = '''<Btn onClick={() => onNav("partnership-form")} className="text-xs" icon={<Users size={13} />}>Partner</Btn>'''
new_industry_cta = '''<Btn onClick={() => onNav("partnership-form")} className="text-xs" icon={<Users size={13} />}>Collaborate</Btn>'''
app_code = app_code.replace(old_industry_cta, new_industry_cta)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
