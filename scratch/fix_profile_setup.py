import re

app_path = 'src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Fix Panchayat form translations
app_code = app_code.replace('{t("profile.panchayat_name")}', 'Panchayat Name')
app_code = app_code.replace('{t("profile.mukhiya_name")}', 'Mukhiya / Sarpanch Name')
app_code = app_code.replace('{t("profile.office_address")}', 'Office Address')
app_code = app_code.replace('{t("profile.official_phone")}', 'Official Phone Number')

# Fix LocalOrg form translations
app_code = app_code.replace('{t("profile.org_name")}', 'Organisation Name')
app_code = app_code.replace('{t("profile.spoc_name")}', 'SPOC Name')
app_code = app_code.replace('{t("profile.spoc_designation")}', 'SPOC Designation')
# And remove Phone Number from LocalOrg
# Looking for:
# <div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Phone Number <span style={{ color: "var(--error)" }}>*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} /></div>
local_org_phone_pattern = r'<div className="mb-3"><label className="block text-xs font-medium mb-1" style={{ color: "var\(--text\)" }}>Phone Number <span style={{ color: "var\(--error\)" }}>\*</span></label><input className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var\(--input-bg\)", borderColor: "var\(--border\)", color: "var\(--text\)" }} /></div>'
app_code = re.sub(local_org_phone_pattern, '', app_code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
