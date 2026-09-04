export type Lang = "en" | "hi" | "sa";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  hi: "हिंदी",
  sa: "Santali",
};

type Translations = Record<string, Record<string, string>>;

const T: Translations = {
  // Language modal
  "lang.title": { en: "Choose Your Language", hi: "अपनी भाषा चुनें", sa: "Apna Bhasa Chuwo", kh: "Apan Bhasha Chunin", na: "Apan Bhasha Chuno" },
  "lang.continue": { en: "Continue", hi: "जारी रखें", sa: "Jari", kh: "Aage Chalo", na: "Aage Bado" },

  // Header
  "nav.portal": { en: "NavJhar", hi: "NavJhar", sa: "NavJhar" },
  "nav.subtitle": { en: "हर समस्या का नया समाधान", hi: "हर समस्या का नया समाधान", sa: "हर समस्या का नया समाधान" },
  "nav.language": { en: "Language", hi: "भाषा", sa: "Bhasa", kh: "Bhasha", na: "Bhasha" },
  "nav.darkmode": { en: "Dark Mode", hi: "डार्क मोड", sa: "Dark Mode", kh: "Dark Mode", na: "Dark Mode" },
  "nav.accessibility": { en: "Accessibility", hi: "सुगमता", sa: "Sahuliyat", kh: "Suvidhaa", na: "Suvidhaa" },
  "nav.help": { en: "Help", hi: "सहायता", sa: "Madat", kh: "Madad", na: "Madad" },
  "nav.logout": { en: "Sign Out", hi: "लॉग आउट", sa: "Bahar", kh: "Bahar Jao", na: "Bahar Jao" },

  // Landing
  "landing.tagline": { en: "From Local Problems to Scalable Solutions", hi: "स्थानीय समस्याओं से व्यापक समाधान तक", sa: "Gaam Ko Samasyao Theke Hal Talash", kh: "Gaon Ki Samasya Se Hal Tak", na: "Gaon Ki Samasya Ke Samadhan Tak" },
  "landing.sub": { en: "Report local challenges. Connect them with the right people. Build solutions together.", hi: "स्थानीय समस्याएं बताएं। सही लोगों से जोड़ें। मिलकर समाधान बनाएं।", sa: "Apan samasya batao. Sahi lok se jodo. Milke hal banao.", kh: "Apan samasya batao. Sahi manush se jodo. Milke hal banao.", na: "Apan samasya batao. Sahi log se jodo. Milke samadhan banao." },
  "landing.demodata": { en: "Demo / Sample Data", hi: "डेमो / नमूना डेटा", sa: "Demo Data", kh: "Demo Data", na: "Demo Data" },
  "landing.how": { en: "How would you like to continue?", hi: "आप कैसे जारी रखना चाहते हैं?", sa: "Aap kaise jari rakhenge?", kh: "Aap kaise aage badhna chahte hain?", na: "Aap kaise aage badhna chahte hain?" },
  "landing.victim": { en: "Register a Problem", hi: "समस्या दर्ज करें", sa: "Samasya Darj Karo" },
  "landing.victim.sub": { en: "Report a local problem", hi: "स्थानीय समस्या रिपोर्ट करें", sa: "Apan samasya batao" },
  "landing.solver": { en: "Problem Solver", hi: "समाधान प्रदाता", sa: "Hal Wala", kh: "Samasya Hal Karne Wala", na: "Samadhan Dene Wala" },
  "landing.solver.sub": { en: "Help solve a local problem", hi: "स्थानीय समस्या सुलझाने में मदद करें", sa: "Samasya hal karne me madad karo", kh: "Samasya suljhane me madad karo", na: "Samasya suljhane me madad karo" },
  "landing.govt.link": { en: "Government / Administration Login", hi: "सरकार / प्रशासन लॉगिन", sa: "Sarkar Login", kh: "Sarkar Login", na: "Sarkar Login" },
  "landing.stats.reported": { en: "Problems Reported", hi: "समस्याएं रिपोर्ट हुईं", sa: "Samasya Batail", kh: "Samasya Batail", na: "Samasya Batail" },
  "landing.stats.deployed": { en: "Solutions Deployed", hi: "समाधान लागू हुए", sa: "Hal Lagel", kh: "Hal Lagel", na: "Samadhan Lagu" },
  "landing.stats.benefited": { en: "People Benefited", hi: "लोग लाभान्वित हुए", sa: "Log Labhanwit", kh: "Log Faydemand Bhele", na: "Log Faydemand Bhele" },

  // Victim role select
  "victim.who": { en: "Who are you?", hi: "आप कौन हैं?", sa: "Aap ke hain?", kh: "Aap kaun hain?", na: "Aap kaun hain?" },
  "victim.citizen": { en: "Individual Citizen", hi: "व्यक्तिगत नागरिक", sa: "Vyaktigat Nagrik" },
  "victim.citizen.sub": { en: "Report a problem from your area", hi: "अपने क्षेत्र से समस्या रिपोर्ट करें", sa: "Apan jagha ke samasya batao" },
  "victim.panchayat": { en: "Panchayati Raj", hi: "पंचायती राज", sa: "Panchayat" },
  "victim.panchayat.sub": { en: "Report or manage problems at Panchayat level", hi: "पंचायत स्तर पर समस्याएं रिपोर्ट करें या प्रबंधित करें", sa: "Panchayat ke naam pe samasya batao" },
  "victim.localorg": { en: "Local Organisation (RWA)", hi: "स्थानीय संगठन (RWA)", sa: "Local Sangathan (RWA)" },
  "victim.localorg.sub": { en: "Report community issues through a local organisation", hi: "स्थानीय संगठन के माध्यम से सामुदायिक समस्याएं रिपोर्ट करें", sa: "Samudaay ke taraf se samasya batao" },

  // Solver role select
  "solver.who": { en: "How would you like to help?", hi: "आप कैसे मदद करना चाहते हैं?", sa: "Aap kaise madad karenge?", kh: "Aap kaise madad karna chahte hain?", na: "Aap kaise madad karna chahte hain?" },
  "solver.university": { en: "Institute / University", hi: "संस्थान / विश्वविद्यालय", sa: "Vishwavidyalaya", kh: "University", na: "University" },
  "solver.university.sub": { en: "Research, expertise and student innovation", hi: "अनुसंधान, विशेषज्ञता और छात्र नवाचार", sa: "Research aur student innovation", kh: "Research aur student innovation", na: "Research aur student innovation" },
  "solver.industry": { en: "Industry", hi: "उद्योग", sa: "Industry", kh: "Industry", na: "Industry" },
  "solver.industry.sub": { en: "Technology, mentorship, funding and co-development", hi: "तकनीक, मेंटरशिप, फंडिंग और सह-विकास", sa: "Technology aur funding", kh: "Technology aur funding", na: "Technology aur funding" },
  "solver.org": { en: "Organisation", hi: "संगठन", sa: "Sangathan", kh: "Sangathan", na: "Sangathan" },
  "solver.org.sub": { en: "Expertise, implementation and community support", hi: "विशेषज्ञता, क्रियान्वयन और सामुदायिक सहायता", sa: "Expertise aur community support", kh: "Expertise aur community support", na: "Expertise aur community support" },

  // Auth
  "auth.mobile": { en: "Mobile Number", hi: "मोबाइल नंबर", sa: "Mobile Number", kh: "Mobile Number", na: "Mobile Number" },
  "auth.sendotp": { en: "Send OTP", hi: "OTP भेजें", sa: "OTP Pathao", kh: "OTP Bhejo", na: "OTP Bhejo" },
  "auth.enterotp": { en: "Enter OTP", hi: "OTP दर्ज करें", sa: "OTP Likhao", kh: "OTP Dalo", na: "OTP Dalo" },
  "auth.verify": { en: "Verify & Continue", hi: "जांचें और आगे बढ़ें", sa: "Verify karo", kh: "Verify karo", na: "Verify karo" },
  "auth.demootp": { en: "Demo: any OTP works", hi: "डेमो: कोई भी OTP काम करेगा", sa: "Demo: koi OTP chalega", kh: "Demo: koi bhi OTP chalega", na: "Demo: koi bhi OTP chalega" },
  "auth.noemail": { en: "No email or password required", hi: "ईमेल या पासवर्ड की जरूरत नहीं", sa: "Email ke jarurat nahi", kh: "Email ki jaroorat nahi", na: "Email ki jaroorat nahi" },

  // Citizen dashboard
  "cit.namaste": { en: "Welcome", hi: "नमस्ते", sa: "Johar", kh: "Namaskar", na: "Namaskar" },
  "cit.report": { en: "Report a Problem", hi: "समस्या बताएं", sa: "Samasya Batao", kh: "Samasya Batao", na: "Samasya Batao" },
  "cit.myproblems": { en: "My Problems", hi: "मेरी समस्याएं", sa: "Apan Samasya", kh: "Hamra Samasya", na: "Apan Samasya" },
  "cit.track": { en: "Track My Problem", hi: "समस्या ट्रैक करें", sa: "Samasya Dekhao", kh: "Samasya Track Karo", na: "Samasya Track Karo" },
  "cit.nearby": { en: "Problems Near Me", hi: "पास की समस्याएं", sa: "Kolo ke Samasya", kh: "Kareeb ke Samasya", na: "Naya Samasya" },
  "cit.foranother": { en: "Report for Someone Else", hi: "किसी और के लिए रिपोर्ट करें", sa: "Dosar ke lel", kh: "Kissi aur ke liye", na: "Kissi aur ke liye" },
  "cit.notifications": { en: "Notifications", hi: "सूचनाएं", sa: "Khabar", kh: "Khabar", na: "Khabar" },
  "cit.submitted": { en: "Submitted", hi: "जमा किया", sa: "Jama Kail", kh: "Jama Kail", na: "Jama Kail" },
  "cit.underreview": { en: "Under Review", hi: "समीक्षाधीन", sa: "Janch me", kh: "Review me", na: "Review me" },
  "cit.inprogress": { en: "In Progress", hi: "प्रगति में", sa: "Chal ta", kh: "Chal raha hai", na: "Chal raha hai" },
  "cit.resolved": { en: "Resolved", hi: "सुलझ गई", sa: "Hal Hoiel", kh: "Hal Hogel", na: "Hal Hogel" },

  // Report flow
  "rep.step1.title": { en: "What is the problem?", hi: "समस्या क्या है?", sa: "Kaa samasya?", kh: "Kaa samasya hei?", na: "Kaa samasya hei?" },
  "rep.step1.voice": { en: "Speak the Problem", hi: "बोलकर बताएं", sa: "Bol ke Batao", kh: "Bol ke Batao", na: "Bol ke Batao" },
  "rep.step1.type": { en: "Type the Problem", hi: "टाइप करें", sa: "Likh ke Batao", kh: "Likh ke Batao", na: "Likh ke Batao" },
  "rep.step1.category": { en: "Category (optional)", hi: "श्रेणी (वैकल्पिक)", sa: "Kisam (optional)", kh: "Kisam (zaruri nahi)", na: "Kisam (zaruri nahi)" },
  "rep.step1.photo": { en: "Add Photo / Video", hi: "फोटो/वीडियो जोड़ें", sa: "Photo Jodo", kh: "Photo Jodo", na: "Photo Jodo" },
  "rep.step1.next": { en: "Next", hi: "आगे", sa: "Aage", kh: "Aage", na: "Aage" },
  "rep.step2.title": { en: "Where is the problem?", hi: "समस्या कहाँ है?", sa: "Samasya kahaan?", kh: "Samasya kahan hei?", na: "Samasya kahan hei?" },
  "rep.step2.gps": { en: "Use My Current Location", hi: "वर्तमान स्थान उपयोग करें", sa: "Apan Jagha", kh: "Apan Jagha Use Karo", na: "Apan Jagha Use Karo" },
  "rep.step2.map": { en: "Select Location on Map", hi: "नक्शे पर चुनें", sa: "Nakshe pe Chunao", kh: "Map pe Chunao", na: "Map pe Chunao" },
  "rep.step2.manual": { en: "Select Village Manually", hi: "गाँव मैन्युअली चुनें", sa: "Gaon Chunao", kh: "Gaon Chunao", na: "Gaon Chunao" },
  "rep.step2.confirm": { en: "Confirm Location", hi: "स्थान पक्का करें", sa: "Jagha Pakka Karo", kh: "Jagha Confirm Karo", na: "Jagha Confirm Karo" },
  "rep.step3.title": { en: "Review & Submit", hi: "जाँचें और जमा करें", sa: "Check karo aur Jama karo", kh: "Check karo aur Submit karo", na: "Check karo aur Submit karo" },
  "rep.submit": { en: "Submit Problem", hi: "समस्या जमा करें", sa: "Samasya Jama Karo", kh: "Samasya Submit Karo", na: "Samasya Submit Karo" },
  "rep.confirm": { en: "Confirm & Submit", hi: "पक्का करें और जमा करें", sa: "Confirm karo", kh: "Confirm karo", na: "Confirm karo" },
  "rep.edit": { en: "Edit", hi: "बदलाव करें", sa: "Badlo", kh: "Edit Karo", na: "Edit Karo" },

  // Success
  "success.title": { en: "Problem Successfully Submitted!", hi: "समस्या सफलतापूर्वक जमा हुई!", sa: "Samasya Jama Hoiel!", kh: "Samasya Submit Hogel!", na: "Samasya Submit Hogel!" },
  "success.trackbtn": { en: "Track Problem", hi: "समस्या ट्रैक करें", sa: "Samasya Dekhao", kh: "Track Karo", na: "Track Karo" },
  "success.homebtn": { en: "Go to Home", hi: "होम पर जाएं", sa: "Ghar Jao", kh: "Home Jao", na: "Home Jao" },

  // General
  "btn.back": { en: "Back", hi: "वापस", sa: "Pichhe", kh: "Waapas", na: "Waapas" },
  "btn.next": { en: "Next", hi: "आगे", sa: "Aage", kh: "Aage", na: "Aage" },
  "btn.save": { en: "Save Draft", hi: "ड्राफ्ट सेव करें", sa: "Save Karo", kh: "Save Karo", na: "Save Karo" },
  "btn.submit": { en: "Submit", hi: "जमा करें", sa: "Jama Karo", kh: "Submit Karo", na: "Submit Karo" },
  "btn.accept": { en: "Accept", hi: "स्वीकार करें", sa: "Maan Lio", kh: "Accept Karo", na: "Accept Karo" },
  "btn.reject": { en: "Reject", hi: "अस्वीकार करें", sa: "Na Mano", kh: "Reject Karo", na: "Reject Karo" },
  "btn.approve": { en: "Approve", hi: "अनुमोदन करें", sa: "Approve Karo", kh: "Approve Karo", na: "Approve Karo" },
  "btn.viewall": { en: "View All", hi: "सभी देखें", sa: "Sab Dekhao", kh: "Sab Dekho", na: "Sab Dekho" },
  "btn.viewdetails": { en: "View Details", hi: "विवरण देखें", sa: "Jankari Dekhao", kh: "Details Dekho", na: "Details Dekho" },
  "btn.feedback": { en: "Give Feedback", hi: "प्रतिक्रिया दें", sa: "Feedback Do", kh: "Feedback Do", na: "Feedback Do" },
  "btn.login": { en: "Login", hi: "लॉग इन", sa: "Login", kh: "Login", na: "Login" },

  // Status badges
  "status.submitted": { en: "Submitted", hi: "जमा किया", sa: "Jama", kh: "Jama", na: "Jama" },
  "status.underreview": { en: "Under Review", hi: "समीक्षाधीन", sa: "Review Me", kh: "Review Me", na: "Review Me" },
  "status.inprogress": { en: "In Progress", hi: "प्रगति में", sa: "Chal ta hei", kh: "Progress Me", na: "Progress Me" },
  "status.resolved": { en: "Resolved", hi: "सुलझा गई", sa: "Hal Hoiel", kh: "Hal Hogel", na: "Hal Hogel" },
  "status.ontrack": { en: "On Track", hi: "सही रास्ते पर", sa: "Sahi raste", kh: "Sahi track pe", na: "Sahi track pe" },
  "status.atrisk": { en: "At Risk", hi: "जोखिम में", sa: "Risk me", kh: "Risk me", na: "Risk me" },
  "status.delayed": { en: "Delayed", hi: "विलंबित", sa: "Deri me", kh: "Late", na: "Late" },
  "status.validated": { en: "Validated", hi: "सत्यापित", sa: "Satyapit", kh: "Validated", na: "Validated" },
  "status.matched": { en: "Matched", hi: "मिलान हुआ", sa: "Match Hoiel", kh: "Match Hogel", na: "Match Hogel" },
  "status.deployed": { en: "Deployed", hi: "तैनात", sa: "Lagel", kh: "Lagu", na: "Lagu" },
  "status.new": { en: "New", hi: "नया", sa: "Nawa", kh: "Naya", na: "Naya" },

  // Panchayat dashboard
  "panch.dashboard": { en: "Panchayat Dashboard", hi: "पंचायत डैशबोर्ड", sa: "Panchayat Dashboard", kh: "Panchayat Dashboard", na: "Panchayat Dashboard" },
  "panch.problems": { en: "Problems in My Panchayat", hi: "मेरी पंचायत में समस्याएं", sa: "Hamra Panchayat ke Samasya", kh: "Hamra Panchayat me Samasya", na: "Hamra Panchayat me Samasya" },
  "panch.verify": { en: "Verify Problem", hi: "समस्या सत्यापित करें", sa: "Samasya Jaancho", kh: "Samasya Verify Karo", na: "Samasya Verify Karo" },
  "panch.behalf": { en: "Report on Behalf of Citizen", hi: "नागरिक की ओर से रिपोर्ट करें", sa: "Nagrik ke lel batao", kh: "Nagrik ke liye batao", na: "Nagrik ke liye batao" },
  "panch.village": { en: "View Village Problems", hi: "गाँव की समस्याएं देखें", sa: "Gaon ke Samasya Dekhao", kh: "Gaon ke Samasya Dekho", na: "Gaon ke Samasya Dekho" },
  "panch.trackproject": { en: "Track Projects", hi: "परियोजनाएं ट्रैक करें", sa: "Project Dekhao", kh: "Project Track Karo", na: "Project Track Karo" },

  // AI labels
  "ai.processing": { en: "Understanding your problem…", hi: "आपकी समस्या समझी जा रही है…", sa: "Apan samasya samjha ja raha hei...", kh: "Apan samasya samjha ja raha hei...", na: "Apan samasya samjha ja raha hei..." },
  "ai.category": { en: "AI Detected Category", hi: "AI द्वारा पहचानी श्रेणी", sa: "AI Wala Kisam", kh: "AI Wala Kisam", na: "AI Wala Kisam" },
  "ai.priority": { en: "Priority Score", hi: "प्राथमिकता स्कोर", sa: "Priority", kh: "Priority Score", na: "Priority Score" },
  "ai.duplicate": { en: "Possible Duplicate Reports", hi: "संभावित डुप्लिकेट रिपोर्ट", sa: "Same Samasya", kh: "Same Samasya", na: "Same Samasya" },
  "ai.dna": { en: "Challenge DNA", hi: "चैलेंज DNA", sa: "Challenge DNA", kh: "Challenge DNA", na: "Challenge DNA" },

  // Govt dashboard
  "govt.dashboard": { en: "Government Control Room", hi: "सरकारी नियंत्रण कक्ष", sa: "Sarkar Control Room", kh: "Sarkar Control Room", na: "Sarkar Control Room" },
  "govt.validation": { en: "Challenge Validation", hi: "चुनौती सत्यापन", sa: "Challenge Validation", kh: "Challenge Validation", na: "Challenge Validation" },
  "govt.challenges": { en: "Total Challenges", hi: "कुल चुनौतियां", sa: "Total Samasya", kh: "Total Samasya", na: "Total Samasya" },
  "govt.validated": { en: "Validated", hi: "सत्यापित", sa: "Satyapit", kh: "Validated", na: "Validated" },
  "govt.activeprojects": { en: "Active Projects", hi: "सक्रिय परियोजनाएं", sa: "Chalte Project", kh: "Active Projects", na: "Active Projects" },
  "govt.completed": { en: "Completed", hi: "पूर्ण", sa: "Pura Hoiel", kh: "Complete", na: "Complete" },
  "govt.universities": { en: "Universities", hi: "विश्वविद्यालय", sa: "Vishwavidyalaya", kh: "University", na: "University" },
  "govt.industry": { en: "Industry Partners", hi: "उद्योग भागीदार", sa: "Industry Saathi", kh: "Industry Partner", na: "Industry Partner" },

  // University
  "uni.dashboard": { en: "University Dashboard", hi: "विश्वविद्यालय डैशबोर्ड", sa: "University Dashboard", kh: "University Dashboard", na: "University Dashboard" },
  "uni.newchallenges": { en: "New Challenges", hi: "नई चुनौतियां", sa: "Nawa Challenge", kh: "Naya Challenge", na: "Naya Challenge" },
  "uni.accept": { en: "Accept Challenge", hi: "चुनौती स्वीकार करें", sa: "Challenge Mano", kh: "Challenge Accept Karo", na: "Challenge Accept Karo" },

  // Industry
  "ind.dashboard": { en: "Industry Dashboard", hi: "उद्योग डैशबोर्ड", sa: "Industry Dashboard", kh: "Industry Dashboard", na: "Industry Dashboard" },
  "ind.mentorship": { en: "Offer Mentorship", hi: "मेंटरशिप प्रदान करें", sa: "Mentorship Do", kh: "Mentorship Do", na: "Mentorship Do" },
  "ind.funding": { en: "Provide Funding", hi: "फंडिंग प्रदान करें", sa: "Paisa Do", kh: "Funding Do", na: "Funding Do" },
  "ind.partner": { en: "Submit Partnership Offer", hi: "साझेदारी प्रस्ताव भेजें", sa: "Partnership Bhejo", kh: "Partnership Offer Bhejo", na: "Partnership Offer Bhejo" },

  // Org dashboard
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

  // Impact
  "impact.people": { en: "People Benefited", hi: "लाभान्वित लोग", sa: "Faydemand Log", kh: "Faydemand Log", na: "Faydemand Log" },
  "impact.villages": { en: "Villages Covered", hi: "ग्राम कवर हुए", sa: "Gaon Cover", kh: "Gaon Cover", na: "Gaon Cover" },
  "impact.solutions": { en: "Solutions Deployed", hi: "समाधान लागू", sa: "Hal Lagel", kh: "Samadhan Lagu", na: "Samadhan Lagu" },
  "impact.savings": { en: "Estimated Savings", hi: "अनुमानित बचत", sa: "Bachat", kh: "Bachat", na: "Bachat" },

  // Notifications
  "notif.title": { en: "Notifications", hi: "सूचनाएं", sa: "Khabar", kh: "Khabar", na: "Khabar" },
  "notif.unread": { en: "unread", hi: "अपठित", sa: "Nawa", kh: "Nahi Padha", na: "Nahi Padha" },

  // Feedback
  "feedback.title": { en: "Give Feedback", hi: "प्रतिक्रिया दें", sa: "Raay Do", kh: "Feedback Do", na: "Feedback Do" },
  "feedback.submit": { en: "Submit Feedback", hi: "प्रतिक्रिया भेजें", sa: "Feedback Pathao", kh: "Feedback Submit Karo", na: "Feedback Submit Karo" },
  "feedback.thanks": { en: "Thank you for your feedback!", hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!", sa: "Dhanyawad!", kh: "Shukriya!", na: "Shukriya!" },

  // Tracking
  "track.title": { en: "Problem Status", hi: "समस्या की स्थिति", sa: "Samasya Haal", kh: "Samasya Status", na: "Samasya Status" },

  // Profile setup
  "profile.name": { en: "Full Name", hi: "पूरा नाम", sa: "Pura Naam" },
  "profile.gender": { en: "Gender", hi: "लिंग", sa: "Gender" },
  "profile.dob": { en: "Date of Birth", hi: "जन्म तिथि", sa: "Janam Tarik" },
  "profile.address": { en: "Address", hi: "पता", sa: "Pata" },
  "profile.housenumber": { en: "House Number", hi: "मकान नंबर", sa: "Ghar Number" },
  "profile.city": { en: "City", hi: "शहर / कस्बा", sa: "Sahar" },
  "profile.pincode": { en: "Pincode", hi: "पिनकोड", sa: "Pincode" },
  "profile.landmark": { en: "Nearest Landmark", hi: "नजदीकी पहचान स्थल", sa: "Naya Jagha" },
  "profile.getstarted": { en: "Get Started", hi: "शुरू करें", sa: "Shuru Karo" },

  // Repository
  "repo.title": { en: "Solution Repository", hi: "समाधान भंडार", sa: "Solution Store", kh: "Solution Bhandar", na: "Solution Bhandar" },
  "repo.search": { en: "Search solutions…", hi: "समाधान खोजें…", sa: "Hal Khojo...", kh: "Solution Khojo...", na: "Solution Khojo..." },
  "repo.view": { en: "View Solution", hi: "समाधान देखें", sa: "Hal Dekhao", kh: "Solution Dekho", na: "Solution Dekho" },
  "repo.reuse": { en: "Reuse Solution", hi: "समाधान पुनः उपयोग करें", sa: "Hal Phir Use Karo", kh: "Solution Reuse Karo", na: "Solution Reuse Karo" },

  // Location
  "loc.village": { en: "Village", hi: "गाँव", sa: "Gaon", kh: "Gaon", na: "Gaon" },
  "loc.panchayat": { en: "Panchayat", hi: "पंचायत", sa: "Panchayat", kh: "Panchayat", na: "Panchayat" },
  "loc.block": { en: "Block", hi: "प्रखंड", sa: "Block", kh: "Block", na: "Block" },
  "loc.district": { en: "District", hi: "जिला", sa: "District", kh: "Jila", na: "Jila" },
  "loc.detected": { en: "Location Detected", hi: "स्थान मिल गया", sa: "Jagha Mili", kh: "Jagha Mili", na: "Jagha Mili" },
  "loc.confirmed": { en: "Problem Location Confirmed", hi: "समस्या का स्थान पक्का हुआ", sa: "Jagha Pakka Hoiel", kh: "Jagha Confirm Hogel", na: "Jagha Confirm Hogel" },

  // Smart match
  "match.title": { en: "Recommended Institutions", hi: "अनुशंसित संस्थान", sa: "Recommended University", kh: "Recommended University", na: "Recommended University" },
  "match.why": { en: "Why This Match?", hi: "यह मिलान क्यों?", sa: "Iss Match Ka Kaaran?", kh: "Ye Match Kyun?", na: "Ye Match Kyun?" },
  "match.assign": { en: "Assign Challenge", hi: "चुनौती सौंपें", sa: "Challenge Deo", kh: "Challenge Assign Karo", na: "Challenge Assign Karo" },

  // Project
  "proj.title": { en: "Project Dashboard", hi: "परियोजना डैशबोर्ड", sa: "Project Dashboard", kh: "Project Dashboard", na: "Project Dashboard" },
  "proj.health": { en: "View Progress", hi: "प्रगति देखें", sa: "Progress Dekho" },
  "proj.progress": { en: "Overall Progress", hi: "कुल प्रगति", sa: "Kul Progress", kh: "Total Progress", na: "Total Progress" },
  "proj.update": { en: "Update Progress", hi: "प्रगति अपडेट करें", sa: "Progress Update Karo", kh: "Progress Update Karo", na: "Progress Update Karo" },
  "proj.upload": { en: "Upload Deliverable", hi: "दस्तावेज़ अपलोड करें", sa: "Document Upload Karo", kh: "Document Upload Karo", na: "Document Upload Karo" },
  "proj.extension": { en: "Request Extension", hi: "विस्तार अनुरोध करें", sa: "Extension Maango", kh: "Extension Maango", na: "Extension Maango" },

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
};

export function translate(key: string, lang: Lang): string {
  if (T[key] && T[key][lang]) return T[key][lang];
  if (T[key] && T[key]["en"]) return T[key]["en"];
  return key;
}

export function makeT(lang: Lang) {
  return (key: string) => translate(key, lang);
}
