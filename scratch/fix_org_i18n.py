import re

i18n_path = 'src/i18n.ts'
with open(i18n_path, 'r', encoding='utf-8') as f:
    i18n_code = f.read()

# Add Org dashboard translations
org_translations = '''  // Org dashboard
  "org.dashboard": { en: "Organisation Dashboard", hi: "संगठन डैशबोर्ड", sa: "Sangathan Dashboard" },
  "org.subtitle": { en: "Problem Solver", hi: "समस्या समाधानकर्ता", sa: "Samasya Hal Karnewala" },
  "org.recommended": { en: "Recommended Challenges", hi: "अनुशंसित चुनौतियां", sa: "Recommended Challenge" },
  "org.collabs": { en: "Active Collaborations", hi: "सक्रिय सहयोग", sa: "Chalte Collaborations" },
  "org.completed": { en: "Completed", hi: "पूर्ण", sa: "Pura" },
  "org.reach": { en: "Community Reach", hi: "सामुदायिक पहुँच", sa: "Community Reach" },
  "org.find_problems": { en: "Find Problems", hi: "समस्याएं खोजें", sa: "Samasya Khojo" },
  "org.support": { en: "Submit Support Offer", hi: "सहायता प्रस्ताव भेजें", sa: "Support Bhejo" },
  "org.expertise": { en: "Organisation Expertise", hi: "संगठन की विशेषज्ञता", sa: "Sangathan Expertise" },
  "org.domain": { en: "Organisation Domain / Sector", hi: "संगठन का क्षेत्र", sa: "Sangathan Domain" },
'''
i18n_code = i18n_code.replace('  // Impact', org_translations + '\n  // Impact')

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(i18n_code)
