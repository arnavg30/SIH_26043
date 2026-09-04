import sys
sys.stdout.reconfigure(encoding='utf-8')

i18n_path = 'src/i18n.ts'
with open(i18n_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace proj.health translation with View Progress
content = content.replace(
    '\"proj.health\": { en: \"Project Health\", hi: \"परियोजना स्वास्थ्य\", sa: \"Project Health\", kh: \"Project Health\", na: \"Project Health\" },',
    '\"proj.health\": { en: \"View Progress\", hi: \"प्रगति देखें\", sa: \"Progress Dekho\" },'
)

# New keys to add before closing of T object
new_keys = '''
  // Newly added keys for NavJhar refinement
  "proj.view_progress": { en: "View Progress", hi: "प्रगति देखें", sa: "Progress Dekho" },
  "proj.progress_analysis": { en: "Project Progress", hi: "परियोजना प्रगति", sa: "Project Progress" },
  "panch.report": { en: "Report a Problem", hi: "समस्या रिपोर्ट करें", sa: "Samasya Report Karo" },
  "panch.my_problems": { en: "My Problems", hi: "मेरी समस्याएं", sa: "Apan Samasya" },
  "panch.track": { en: "Track Problems", hi: "समस्याएं ट्रैक करें", sa: "Samasya Track Karo" },
  "panch.panchayat_problems": { en: "Problems in My Panchayat", hi: "मेरी पंचायत में समस्याएं", sa: "Hamra Panchayat ke Samasya" },
  "localorg.submit": { en: "Submit a Community Problem", hi: "सामुदायिक समस्या दर्ज करें", sa: "Samudaay Samasya Darj Karo" },
  "localorg.my_problems": { en: "My Problems", hi: "मेरी समस्याएं", sa: "Apan Samasya" },
  "localorg.track": { en: "Track Problems", hi: "समस्याएं ट्रैक करें", sa: "Samasya Track Karo" },
  "localorg.area_problems": { en: "Problems in My Area", hi: "मेरे क्षेत्र में समस्याएं", sa: "Apan Area ke Samasya" },
  "localorg.dashboard": { en: "Local Organisation Dashboard", hi: "स्थानीय संगठन डैशबोर्ड", sa: "Local Sangathan Dashboard" },
  "uni.expertise_areas": { en: "Expertise Areas", hi: "विशेषज्ञता क्षेत्र", sa: "Expertise Areas" },
  "ind.verify_email_title": { en: "Verify Your Official Company Email", hi: "अपना आधिकारिक कंपनी ईमेल सत्यापित करें", sa: "Apan Official Company Email Verify Karo" },
  "ind.verify_email_sub": { en: "Enter your official company email to begin registration", hi: "पंजीकरण शुरू करने के लिए अपना आधिकारिक कंपनी ईमेल दर्ज करें", sa: "Registration shuru karne ke liye official email dalo" },
  "ind.send_code": { en: "Send Verification Code", hi: "सत्यापन कोड भेजें", sa: "Verification Code Bhejo" },
  "ind.enter_code_title": { en: "Verification Code", hi: "सत्यापन कोड दर्ज करें", sa: "Verification Code Likhao" },
  "ind.enter_code_sub": { en: "A 6-digit code has been sent to your official email", hi: "आपके आधिकारिक ईमेल पर 6-अंकों का कोड भेजा गया है", sa: "Apan email me 6 digit code bhejal gaya hai" },
  "ind.verify_btn": { en: "Verify", hi: "सत्यापित करें", sa: "Verify Karo" },
  "ind.resend_btn": { en: "Resend Code", hi: "कोड पुनः भेजें", sa: "Code Phir Se Bhejo" },
  "ind.profile_setup": { en: "Industry Profile Setup", hi: "उद्योग प्रोफ़ाइल सेटअप", sa: "Industry Profile Setup" },
  "ind.official_email": { en: "Official Company Email", hi: "आधिकारिक कंपनी ईमेल", sa: "Official Company Email" },
  "ind.expertise_areas": { en: "Expertise Areas", hi: "विशेषज्ञता क्षेत्र", sa: "Expertise Areas" },
  "ind.spoc_name": { en: "SPOC Name", hi: "एसपीओसी का नाम", sa: "SPOC Name" },
  "ind.category": { en: "Category", hi: "श्रेणी", sa: "Category" },
  "ind.address": { en: "Address", hi: "पता", sa: "Thikana" },
'''

# Find the end of T object: "};\n\nexport function translate"
if "};\n\nexport function translate" in content:
    content = content.replace("};\n\nexport function translate", new_keys + "};\n\nexport function translate")
else:
    # fallback
    idx = content.rfind("};")
    content = content[:idx] + new_keys + content[idx:]

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("i18n.ts updated successfully.")
