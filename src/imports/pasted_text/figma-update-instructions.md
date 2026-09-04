UPDATE THE EXISTING FIGMA PROTOTYPE ONLY.

DO NOT REBUILD THE WEBSITE FROM SCRATCH.
DO NOT REMOVE EXISTING WORKING SCREENS OR FLOWS UNLESS SPECIFICALLY REQUESTED BELOW.
PRESERVE THE CURRENT GOVERNMENT-STYLE DESIGN, LAYOUT QUALITY, RESPONSIVE BEHAVIOUR, AND EXISTING PROTOTYPE CONNECTIONS.

I NEED THE FOLLOWING SPECIFIC CHANGES:

====================================================
1. REMOVE THE AVATAR FROM THE LANDING PAGE
====================================================

On the main landing/home screen, there is currently a small human avatar/illustration above the “Jharkhand Societal Innovation Portal” heading.

REMOVE THAT AVATAR COMPLETELY.

Do not replace it with another avatar or emoji.

Keep the hero section clean and professional.

====================================================
2. CHANGE THE BRAND NAME
====================================================

Replace:

“JSIC Portal”

and any occurrence of:

“Jharkhand Societal Innovation Collaboration Portal”

with:

# NavJhar

Make “NavJhar” visually prominent and eye-catching, but still suitable for an official government platform.

Use the exact Hindi tagline:

“हर समस्या का नया समाधान”

English subtitle can remain secondary if needed:
“From Local Problems to Scalable Solutions”

The primary brand should now visually be:

NavJhar
हर समस्या का नया समाधान

Do not use the old JSIC branding anywhere in the visible interface.

Keep “Government of Jharkhand — Official Platform” as the government identity/badge where it already exists.

====================================================
3. LANGUAGE OPTIONS — REMOVE KHORTHA AND NAGPURI
====================================================

The language selector currently contains 5 languages.

Change it to ONLY these 3:

1. Hindi
2. English
3. Santhali

REMOVE:
- Khortha
- Nagpuri

The three remaining languages must work consistently throughout the entire website.

When a user selects a language:
- headings change
- navigation changes
- buttons change
- form labels change
- helper text changes
- dashboard text changes
- notifications change
- status text changes
- modal text changes

Do NOT leave random English text mixed into a selected-language interface.

Keep the language selector in the top-right header.

====================================================
4. KEEP DARK MODE
====================================================

Keep the existing Dark Mode button next to the language selector.

Do not remove it.

It should remain visually consistent with the header.

====================================================
5. REMOVE HELPLINE / HELP / VOICE GUIDE FROM THE LANDING PAGE
====================================================

At the bottom of the current landing page there are:

“1800-345-JSIC”
“Help”
“Voice Guide”

REMOVE ALL THREE FROM THE LANDING PAGE.

Do not replace them with another footer link in that same area.

Keep the bottom area clean.

====================================================
6. MAIN ROLE SELECTION — KEEP ONLY TWO OPTIONS
====================================================

The current landing page correctly contains two main options:

Problem Victim
Problem Solver

KEEP THESE TWO ONLY.

Do not bring back:
Citizen
Panchayat
University
Industry
Government

as five main landing cards.

The two primary choices must remain the first major decision for the user.

====================================================
7. RENAME “PROBLEM VICTIM”
====================================================

On the role-selection card/screen, replace:

“Problem Victim”

with:

“Register a Problem”

Subtitle:
“Report a local problem”

This should be the primary citizen-facing action.

Do NOT use the phrase “Problem Victim” in the visible citizen UI anymore.

====================================================
8. COLOR-CODE THE TWO PRIMARY OPTIONS
====================================================

Make the two role cards visually distinct while staying within the existing government design system.

For:

REGISTER A PROBLEM
Use:
Forest Green (#2E6B4E)

Reason:
Represents community, public welfare, local action and problem reporting.

For:

PROBLEM SOLVER
Use:
Deep Government Navy (#123B63)

Reason:
Represents institutions, expertise, research and professional collaboration.

Use subtle light tinted backgrounds or borders for the icon areas.

Use the existing Amber (#F2B84B) only as a CTA/highlight accent.

DO NOT use purple.
DO NOT use neon colours.
DO NOT use emoji.

The two cards should look equally important but clearly different.

====================================================
9. REGISTER A PROBLEM → USER TYPE
====================================================

When the user clicks:

REGISTER A PROBLEM

show:

“Who are you?”

Options:

1. Individual Citizen
   “Report a problem from your area”

2. Panchayati Raj
   “Report or manage problems at Panchayat level”

3. Local Organisation (RWA)
   “Report community issues through a local organisation”

Important:
Use EXACT label:

“Individual Citizen”

not simply “Citizen”.

For Local Organisation use:

“Local Organisation (RWA)”

Keep RWA in capital letters.

Do not use emojis.
Use clean professional icons.

====================================================
10. INDIVIDUAL CITIZEN PROFILE — UPDATE FIELDS
====================================================

On the Individual Citizen profile/setup page, replace the current profile fields with:

Full Name *
Gender *
Date of Birth *
Address *

For Address, create a structured address section containing:

House Number
City
Pincode
Nearest Landmark

Do not use the previous District / Block / Panchayat / Village fields on this specific PERSONAL PROFILE screen.

Keep Mobile Number handled by the existing authentication flow if already implemented.

Use clear required-field indicators.

====================================================
11. REMOVE MITRA FROM THE CITIZEN DASHBOARD
====================================================

On the citizen dashboard, there is currently a:

“Mitra — Digital Sahayak”

assistant card/section.

REMOVE MITRA COMPLETELY FROM THIS DASHBOARD.

Do not show the Mitra illustration.
Do not show the Mitra message.
Do not show the floating Mitra assistant.

For this current version, remove the digital assistant from the citizen dashboard.

====================================================
12. HIGHLIGHT “REPORT A PROBLEM”
====================================================

On the citizen dashboard, make:

“Report a Problem”

the strongest and most visually prominent action.

It should be an eye-catching primary CTA.

Recommended treatment:
- Amber (#F2B84B) primary background
- Deep Navy text
- bold typography
- large clickable area
- subtle shadow
- clear professional document/report icon

Keep:
“My Problems”
“Track My Problem”
“Problems Near Me”
etc. as secondary actions.

The citizen should immediately understand:

“This is the main action I need to take.”

Do not make the entire dashboard visually dominated by multiple competing buttons.

====================================================
13. AI ANALYSIS SCREEN — REMOVE AFFECTED PEOPLE
====================================================

On the AI Analysis / AI Detection Results screen, there is currently:

“Affected People”

REMOVE THIS FIELD/CARD COMPLETELY.

Do not show:
- Affected People
- Estimated people
- Affected population

on this specific AI result screen.

Keep the useful AI results such as:

AI Detected Category
Priority Score
Possible Duplicate Reports
Challenge DNA
Location
Required Skills
Expected Impact

Do not redesign the whole AI screen unnecessarily.

====================================================
14. PROBLEM SOLVER ROLE FLOW
====================================================

When the user clicks:

PROBLEM SOLVER

the existing role-selection flow should continue with:

1. Institute / University
2. Industry
3. Organisation

Keep this structure.

Do not show these roles under Register a Problem.

====================================================
15. UNIVERSITY / INSTITUTE LOGIN-PROFILE
====================================================

For:

Institute / University

REMOVE the current:

Phone Number
OTP

style registration if it is currently being used as the main information form.

Instead, the institution profile/setup screen should ask for exactly:

University Name
SPOC Name
University Address
SPOC Number

Then keep/add institutional capability information where already present:

Expertise
Departments
Research Facilities / Labs
Previous Projects

The profile should look professional and academic.

Do not mix the university profile with the citizen profile.

====================================================
16. INDUSTRY PROFILE
====================================================

For:

Industry

REMOVE the current:

Phone Number
OTP

style registration information if it is currently being shown as the profile information.

Use these fields:

Industry Name
SPOC Name
Category
Address

Keep the profile clean and professional.

Optional capability information can remain below:

Industry Expertise
Technology Capability
Mentorship
Funding / CSR
Co-development

====================================================
17. ORGANISATION
====================================================

Keep Organisation under:

PROBLEM SOLVER

Do not move it to the problem-victim section.

Use the existing organisation flow and profile structure unless required for consistency.

====================================================
18. IMPORTANT ROLE LOGIC
====================================================

The final visible role hierarchy must be:

MAIN LANDING:

REGISTER A PROBLEM
        ↓
Individual Citizen
Panchayati Raj
Local Organisation (RWA)

OR

PROBLEM SOLVER
        ↓
Institute / University
Industry
Organisation

Government / Administration Login can remain a separate secondary entry point.

Do not mix the roles across these two categories.

====================================================
19. PRESERVE JHARKHAND + GOVERNMENT VISUAL IDENTITY
====================================================

Keep the current deep navy + forest green + amber visual system.

Recommended:

Deep Navy:
#123B63

Forest Green:
#2E6B4E

Amber:
#F2B84B

Off White:
#F7F9FB

Dark Text:
#17212B

Do not introduce new flashy colors.

The website should feel:
- official
- trustworthy
- accessible
- modern
- calm
- citizen-friendly

====================================================
20. DO NOT USE EMOJIS
====================================================

Remove all emoji-style UI icons from the updated screens.

Do not use:
rocket
smiley
person emoji
factory emoji
graduation cap emoji
phone emoji
etc.

Use a consistent professional SVG/icon set instead.

====================================================
21. PRESERVE EXISTING FUNCTIONAL PROTOTYPE CONNECTIONS
====================================================

This is a modification task, not a static visual redesign.

All existing relevant prototype connections must remain functional.

Update interactions where labels have changed.

Examples:

Language selection
→ selected language
→ full interface translation

REGISTER A PROBLEM
→ role selection
→ Individual Citizen / Panchayati Raj / Local Organisation (RWA)

PROBLEM SOLVER
→ Institute / University / Industry / Organisation

Individual Citizen
→ updated profile
→ citizen dashboard

Report a Problem
→ problem reporting flow

University
→ university profile
→ university dashboard

Industry
→ industry profile
→ industry dashboard

Do not leave updated buttons disconnected.

====================================================
22. FINAL SCREEN-TEXT CHANGES SUMMARY
====================================================

OLD:
JSIC Portal

NEW:
NavJhar

OLD:
Jharkhand Societal Innovation Collaboration Portal

NEW:
NavJhar
हर समस्या का नया समाधान

OLD:
Problem Victim

NEW:
Register a Problem

OLD:
Citizen

NEW:
Individual Citizen

OLD:
Local Organisation

NEW:
Local Organisation (RWA)

REMOVE:
Khortha
Nagpuri
Helpline number
Help
Voice Guide
Mitra Digital Sahayak
Affected People

ADD/KEEP:
Hindi
English
Santhali
Dark Mode
Register a Problem
Problem Solver

UPDATE UNIVERSITY PROFILE TO:
University Name
SPOC Name
University Address
SPOC Number

UPDATE INDUSTRY PROFILE TO:
Industry Name
SPOC Name
Category
Address

UPDATE CITIZEN PERSONAL PROFILE TO:
Full Name
Gender
Date of Birth
Address
    House Number
    City
    Pincode
    Nearest Landmark

====================================================
23. FINAL UX PRIORITY
====================================================

The website is designed for Jharkhand citizens, including rural and first-time digital-service users.

Therefore:

Keep text simple.
Keep buttons large.
Avoid unnecessary fields.
Make “Register a Problem” immediately visible.
Keep the role selection understandable.
Do not overload the first-time citizen experience.

The website should communicate:

“Tell us your problem.
We will handle the complexity.”

Make the final result polished, consistent, responsive and government-appropriate.

IMPORTANT:
Modify the EXISTING FILE.
Do not create an entirely new unrelated design.
Do not remove existing pages that are not mentioned above.
Only implement the requested updates and preserve all other working functionality.