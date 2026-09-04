REDESIGN AND EXTEND THE EXISTING FIGMA PROTOTYPE FOR:

“JSIC Portal”
Jharkhand Societal Innovation Collaboration Portal

Tagline:
“From Local Problems to Scalable Solutions”
Hindi:
“स्थानीय समस्याओं से व्यापक समाधान तक”

IMPORTANT:
Use the existing uploaded/current design as the visual starting point, but restructure the user journey and role selection exactly as described below.

This is a GOVERNMENT WEBSITE FOR JHARKHAND.
The primary citizen audience includes rural users and first-time digital-service users.
The interface must therefore be extremely simple, trustworthy, accessible, multilingual, and mobile-friendly.

Do NOT make it look like a commercial startup, gaming website, or social-media app.

====================================================
1. FIRST SCREEN — LANGUAGE SELECTION MUST COME FIRST
====================================================

When the website opens for the first time, DO NOT immediately show the current role-selection screen.

Instead, show a centered LANGUAGE SELECTION MODAL / POPUP overlay.

Background:
The homepage should be visible but slightly dimmed behind the modal.

Modal title:

“Choose Your Language”

Hindi:
“अपनी भाषा चुनें”

Show exactly these 5 language options:

1. Hindi
2. English
3. Santhali
4. Khortha
5. Nagpuri

Use clean text labels only.
Do NOT use emoji icons.

Recommended presentation:
Large selectable language cards or radio-style buttons.

Selected state:
Clearly visible with a checkmark or border.

Primary button:
“Continue”

Behavior:
When the user selects a language and presses Continue:
- Change the ENTIRE WEBSITE interface to that selected language.
- Navigation
- Buttons
- Forms
- Labels
- Messages
- Headings
- Helper text
- Validation messages
- Dashboard text
- Notifications
Everything should switch consistently.

Persist the language selection for the session.

Add a small language selector in the top-right navigation so the user can change language later.

Example:
“हिंदी”
“English”
“Santhali”
“Khortha”
“Nagpuri”

IMPORTANT:
Do not mix languages on the same screen after a language is selected, except where unavoidable for names or official terms.

====================================================
2. TOP NAVIGATION — LANGUAGE + DARK MODE
====================================================

The existing top-right language control should remain.

Next to the language control add:

🌙 Dark Mode toggle

BUT DO NOT USE EMOJI.
Use a proper moon/sun UI icon.

States:
Light
Dark

The Dark Mode toggle should actually switch the visual theme across the prototype.

Ensure:
- readable contrast
- accessible text
- buttons remain clearly visible
- maps/cards/forms remain usable
- no loss of information in dark mode

Top navigation should contain:

JSIC Portal
Jharkhand Societal Innovation Collaboration Portal

Right side:
Language
Dark Mode
Accessibility / Access

====================================================
3. IMPORTANT CHANGE — REMOVE THE CURRENT 5 ROLE CARDS
====================================================

On the current homepage there are 5 large options:

Citizen
Panchayat / ULB
University
Industry / CSR
Government

REMOVE THIS CURRENT FIVE-CARD ROLE SELECTION FROM THE MAIN LANDING AREA.

Replace it with ONLY TWO PRIMARY OPTIONS:

================================
A. PROBLEM VICTIM
================================

Subtitle:
“Report a local problem”

================================
B. PROBLEM SOLVER
================================

Subtitle:
“Help solve a local problem”

These two should be the main choices.

NO emojis.
NO rocket icons.
NO smiley faces.
NO decorative cartoon emojis.

Use clean professional line icons or subtle illustrations instead.

The two cards should be large and easy to understand.

====================================================
4. PROBLEM VICTIM — CONDITIONAL ROLE SELECTION
====================================================

When the user clicks:

PROBLEM VICTIM

open a second screen/modal:

“Who are you?”

Show exactly these options:

1. Citizen
2. Panchayati Raj
3. Local Organisation

For Local Organisation example label:
“Local Organisation (e.g. RWA)”

Do not show University, Industry or Government here.

Use large simple cards with:
- title
- one-line explanation
- professional icon
- no emojis

Descriptions:

Citizen:
“Report a problem from your area”

Panchayati Raj:
“Report or manage problems at Panchayat level”

Local Organisation:
“Report community issues on behalf of a local group”

====================================================
5. CITIZEN FLOW
====================================================

When Citizen is selected:

Show Citizen Login / Registration.

Keep the login extremely simple for rural users.

LOGIN:
Mobile Number
[ Send OTP ]

Then:
OTP
[ Verify & Continue ]

Do NOT require email and password.

After first login, collect only necessary details:

Full Name
Mobile Number
Preferred Language
District
Block
Panchayat
Village

Make non-essential demographic information optional.

Do not force users to enter too many details before they can report a problem.

Citizen dashboard should contain only the most important actions:

[ Report a Problem ]
[ My Problems ]
[ Track My Problem ]
[ Problems Near Me ]
[ Report for Someone Else ]

Use very large, clear buttons.

====================================================
6. PANCHAYATI RAJ FLOW
====================================================

When “Panchayati Raj” is selected:

Show official login:

Official Mobile Number / Registered ID
[ Send OTP ]

After authentication:

Panchayat Profile:

Panchayat Name
Village(s)
Sarpanch / Mukhiya Name
Office Address
Official Phone Number

Dashboard:

Problems in My Panchayat
Pending Verification
In Progress
Resolved

Primary actions:

[ Report a Problem ]
[ Report on Behalf of Citizen ]
[ Verify Problem ]
[ View Village Problems ]
[ Track Projects ]

Important:
Panchayat users should be able to submit a problem on behalf of a citizen who may not have a smartphone or digital access.

====================================================
7. LOCAL ORGANISATION FLOW
====================================================

When Local Organisation is selected:

Registration / Login fields:

Organisation Name
SPOC Name
SPOC Designation
Organisation Address
Phone Number
District
Block
Panchayat / Area

Example text:
“Local Organisation (e.g. RWA)”

Dashboard:

[ Submit Community Problem ]
[ View Reported Problems ]
[ Track Problems ]
[ Notifications ]

====================================================
8. PROBLEM SOLVER — SECOND MAIN PATH
====================================================

When the user selects:

PROBLEM SOLVER

show these options:

1. Institute / University
2. Industry
3. Organisation

Do NOT include Citizen, Panchayat or ULB here.

Descriptions:

Institute / University:
“Research, expertise and student innovation”

Industry:
“Technology, mentorship, funding and co-development”

Organisation:
“Expertise, implementation and community support”

====================================================
9. INSTITUTE / UNIVERSITY PROFILE
====================================================

When Institute / University is selected:

Login:
Institutional Email / Registered ID
Password or OTP-based verified login
Keep the interface professional.

After login, collect/show:

Institute Name
SPOC Name
Address of Institute
SPOC Phone Number

Also add an important “Expertise & Capability” section:

Areas of Expertise
Departments
Research Centres
Labs / Facilities
Faculty Expertise
Previous Projects
Student Skills
Location

Example:

Institute Name:
Birsa Institute of Technology

SPOC Name:
Dr. ______

Institute Address:
________

SPOC Number:
________

Expertise:
Agriculture
Water Management
IoT
AI/ML

Departments:
Civil Engineering
Computer Science
Environmental Science

Use structured cards/tags, not large paragraphs.

====================================================
10. INDUSTRY PROFILE
====================================================

When Industry is selected:

Fields:

Industry Name
SPOC Name
Category
Address
Phone Number
Website / Email (optional)

Then:

Industry Expertise
Technology Capabilities
Products / Services
Available Resources
Mentorship Capability
Funding / CSR Capability
Field Testing Capability

Dashboard:
[ Recommended Projects ]
[ Find Problems ]
[ My Partnerships ]
[ Mentorship ]
[ Funding ]

====================================================
11. ORGANISATION AS PROBLEM SOLVER
====================================================

For Organisation as Problem Solver, include:

Organisation Name
SPOC Name
Category
Address
Phone Number

Organisation Expertise
Services
Community Reach
Areas of Operation
Resources
Implementation Capability

Then dashboard:
[ Recommended Challenges ]
[ Find Problems ]
[ Active Collaborations ]
[ Submit Support Offer ]

====================================================
12. REMOVE ALL EMOJI-BASED UI
====================================================

Remove:
rocket emojis
smiley emojis
person emojis
factory emojis
building emojis
graduation-cap emojis
phone emojis
etc.

Use:
- professional SVG/line icons
- simple government-style icons
- subtle illustrations
- consistent icon family

Do not use emoji as navigation icons.

====================================================
13. CITIZEN PROBLEM REPORTING — KEEP TO 3 SIMPLE STEPS
====================================================

After Citizen login, the main reporting flow should be:

STEP 1 — WHAT IS THE PROBLEM?

Large heading:
“What is the problem?”

Provide two main input methods:

[ 🎙 Voice Input ]
but use a proper microphone icon, NOT emoji.

[ Type the Problem ]

Example:
“Hamare gaon ka handpump kharab hai.”

Optional category suggestions:
Water
Agriculture
Road
Healthcare
Education
Sanitation
Environment
Electricity
Other

Category should NOT be mandatory.

Allow:
[ Add Photo / Video ]

Continue:
[ Next ]

--------------------------------

STEP 2 — WHERE IS THE PROBLEM?

Heading:
“Where is the problem?”

Three options:

[ Use My Current Location ]

[ Select Location on Map ]

[ Select Village Manually ]

GPS behavior:
When “Use My Current Location” is clicked:
simulate obtaining latitude and longitude.

Then automatically display:

Village
Panchayat
Block
District

Example:
ABC Village
Kanke Panchayat
Kanke Block
Ranchi District

Do NOT require the citizen to understand coordinates.

For map:
Allow a visible map pin to represent the problem location.

IMPORTANT:
The problem location must be separate from the user’s home/profile address.

Continue:
[ Confirm Location ]

--------------------------------

STEP 3 — REVIEW & SUBMIT

Show:

Problem Description
Photo / Video
Location
Basic information

Primary:
[ Submit Problem ]

After clicking:
Show AI processing state:

“Understanding your problem…”

Then show:

AI Detected Category
Priority Score
Possible Duplicate
Location
Affected Population
Required Expertise

Example:

Category:
Water Management

Priority:
87 / 100 — High

Possible Duplicate Reports:
4

Then:

Challenge DNA

Domain
Severity
Location
Affected Population
Required Skills
Expected Impact

Buttons:
[ Confirm & Submit ]
[ Edit ]

====================================================
14. LOCATION UX — VERY IMPORTANT
====================================================

For every problem report, support these three methods:

1. GPS:
“Use My Current Location”

2. Map:
“Select Location on Map”

3. Manual:
“Select Village Manually”

Manual hierarchy:

District
↓
Block
↓
Panchayat
↓
Village

After location selection, show:

“Problem Location Confirmed”

Example:
Village XYZ
Panchayat ABC
Block Kanke
District Ranchi

This should be clear and visual.

====================================================
15. AI PROBLEM PROCESSING
====================================================

After submission, show AI processing.

AI automatically performs:

1. Categorization
2. Prioritization
3. Deduplication
4. Problem Structuring

If duplicate:
Show:

“4 similar reports found”

Options:

[ Merge with Existing Problem ]
[ Continue as New Problem ]

For sensitive/low-confidence cases:
Show:

“Needs Verification”

and route for human validation.

====================================================
16. SMART UNIVERSITY MATCHING
====================================================

After validation, show:

“Recommended Institutions”

Top three matches:

University A — 92%
University B — 86%
University C — 79%

Show:
- Expertise match
- Faculty availability
- Research/lab capability
- Previous project similarity
- Student capability
- Location relevance

Button:
[ Why This Match? ]

Open an explanation modal:

University A — 92%

Faculty Expertise: 95%
Research Facility: 90%
Past Projects: 88%
Student Skills: 94%
Location Relevance: 92%

Text:
“University A is recommended because its verified expertise, facilities and previous projects closely match this challenge.”

Important:
AI must never invent faculty or institutional expertise.
Use verified profile data in the prototype.

====================================================
17. UNIVERSITY WORKFLOW
====================================================

University dashboard:

New Challenges
Assigned Challenges
Accepted
Active Projects
Completed
At Risk

Challenge detail:

Problem
Evidence
Location
AI analysis
Priority
Challenge DNA
Recommended Industry Partners

Buttons:

[ Accept Challenge ]
[ Reject ]
[ Request Clarification ]

After accepting:

TEAM FORMATION

Required Skills:
Civil Engineering
Environmental Science
IoT
Data Analytics

Recommended:
Faculty Mentor
Student 1
Student 2
Student 3
Expert/Researcher

Button:
[ Create Team ]

====================================================
18. PROJECT DEVELOPMENT
====================================================

Project lifecycle:

Proposal
↓
Development
↓
Milestone Tracking
↓
Field Testing / Pilot
↓
Validation
↓
IP / Documentation
↓
Implementation

Project dashboard:

Overall Progress
Milestones
Deliverables
Timeline
Mentor Engagement
Testing

Project Health:

82% — ON TRACK

Possible states:

ON TRACK
AT RISK
DELAYED

Show warning example:

“Testing milestone is behind schedule.”

Buttons:

[ Update Progress ]
[ Upload Deliverable ]
[ Request Extension ]

====================================================
19. INDUSTRY COLLABORATION
====================================================

Industry dashboard:

Recommended Projects

Example:

“Smart Irrigation Monitoring”

Industry Match:
89%

Why:
IoT requirement
Agriculture domain
Prototype support required

Actions:

[ Offer Mentorship ]
[ Provide Funding ]
[ Provide Technology ]
[ Co-Develop ]

Partnership form:

Organisation Name
Support Type
Budget
Mentor
Technology
Infrastructure
Testing Support

Button:
[ Submit Partnership Offer ]

====================================================
20. SOLUTION REPOSITORY
====================================================

Create a searchable “Solution Repository”.

Search:
“Search previous solutions…”

Filters:
District
Category
Technology
University
Impact

Solution card:

Solution Name
Problem Solved
University
Industry Partner
Beneficiaries
Status

Buttons:

[ View Solution ]
[ Reuse Solution ]

Inside detail:
Problem
Solution
Technology
Cost
Implementation Guide
Impact
Documentation

Highlight:

“Similar solution found for 4 challenges.”

====================================================
21. CITIZEN TRACKING
====================================================

Citizen should see a very simple timeline:

Problem Submitted ✅
AI Processed ✅
Verified ✅
University Matched ✅
Team Formed ✅
Development 🟡
Field Testing ⏳
Implementation ⏳

Use plain language.

Example:
“University ABC is currently working on your problem.”

Buttons:
[ View Details ]
[ Give Feedback ]

====================================================
22. GOVERNMENT DASHBOARD
====================================================

Government dashboard should be more advanced.

Navigation:

Dashboard
Challenges
Validation
Universities
Industry
Projects
Impact
Reports
Notifications

KPI cards:

Total Challenges
Validated
Active Projects
Completed
Participating Universities
Industry Partnerships

Charts:
- Problems by category
- Problems by district
- Project status
- Impact
- University participation
- Industry participation

Jharkhand map:
Show district-wise problem density.

Filters:
District
Block
Panchayat
Category
Priority
Status
Date

Quick actions:

[ Pending Validation ]
[ High Priority ]
[ Unassigned ]
[ At Risk ]
[ Delayed ]

====================================================
23. NOTIFICATIONS
====================================================

Create role-specific notifications.

Citizen:
“Your problem has been verified.”

Panchayat:
“New problem submitted in your Panchayat.”

University:
“New challenge matched to your expertise.”

Faculty:
“Student team has been assigned.”

Industry:
“University ABC needs IoT mentorship.”

Government:
“Project milestone is delayed.”

====================================================
24. DESIGN FOR RURAL / LOW-DIGITAL-LITERACY USERS
====================================================

Citizen screens must prioritize usability over information density.

Use:
- large buttons
- short labels
- large touch targets
- clear icons
- simple language
- one primary action per screen
- voice input
- photo-first interaction
- GPS assistance
- minimal form fields

Avoid:
- complicated menus
- long forms
- technical AI terminology
- email/password dependency for ordinary citizens
- too many cards
- unnecessary animations

A citizen should be able to report a problem in approximately 3 simple steps.

====================================================
25. VISUAL DESIGN
====================================================

Use a government-grade visual language.

Primary:
Deep Government Navy #123B63

Secondary:
Forest Green #2E6B4E

Primary CTA:
Warm Amber #F2B84B

Background:
Soft Off-White #F7F9FB

Text:
Dark Charcoal #17212B

Cards:
White

Use dark mode with a carefully adjusted navy/green dark theme.

Do NOT use:
- neon
- excessive gradients
- excessive glassmorphism
- excessive purple
- childish cartoon UI
- emoji-heavy interface

The illustrated human assistant “Mitra” may appear subtly as a helper on citizen screens, but she must NOT dominate the UI.

====================================================
26. MITRA — DIGITAL SAHAYAK
====================================================

Use the previously created illustrated human assistant “Mitra” as an optional digital helper.

She should appear:
- on the home page
- during problem reporting
- in guidance/help states
- in success states
- inside a small floating assistant/chat button

Example:

“Namaste! Main Mitra hoon.
Main aapki problem report karne mein madad karungi.”

Use her sparingly.

She should guide, not distract.

====================================================
27. ACCESSIBILITY
====================================================

Include:

Language selector
Dark mode
Text size control
High contrast
Clear labels
Icon + text
Keyboard-friendly controls
Screen-reader-friendly semantic naming where possible

Never communicate a status through colour alone.

====================================================
28. FUNCTIONAL FIGMA PROTOTYPE
====================================================

THIS MUST BE A CLICKABLE PROTOTYPE.

Connect all major buttons and screens.

Required flow:

Website opens
→ Language modal
→ Select language
→ Continue
→ Main Landing Page
→ Choose Problem Victim OR Problem Solver

Problem Victim:
→ Citizen / Panchayati Raj / Local Organisation

Problem Solver:
→ Institute / University / Industry / Organisation

Citizen:
→ Login
→ Dashboard
→ Report Problem
→ Step 1
→ Step 2
→ Step 3
→ AI Analysis
→ Confirmation
→ Tracking

Panchayat:
→ Login
→ Dashboard
→ Submit on Behalf
→ Verify Problems
→ Track Projects

University:
→ Login
→ Profile
→ Recommended Challenges
→ Challenge Detail
→ Accept
→ Team Formation
→ Proposal
→ Project Dashboard

Industry:
→ Login
→ Profile
→ Recommended Projects
→ Project Detail
→ Offer Support
→ Partnership Form

Government:
→ Login
→ Dashboard
→ Validation
→ Smart Match
→ Project Monitoring
→ Impact

Repository:
→ Search
→ Solution Detail
→ Reuse Solution

Every major button must be connected.

Use:
hover states
selected states
loading states
success states
error states
modal states
empty states

====================================================
29. IMPORTANT FRONTEND BEHAVIOR
====================================================

This is NOT a collection of disconnected mock screens.

Make the prototype feel like a real frontend product.

When a user:
- selects language → interface changes
- selects role → correct options appear
- selects Citizen → citizen-specific flow appears
- selects Panchayat → Panchayat-specific flow appears
- selects Institute → institute profile fields appear
- selects Industry → industry profile fields appear
- submits a challenge → AI result appears
- selects GPS → location confirmation appears
- selects map → pin-location screen appears
- approves a challenge → matching screen appears
- accepts a project → project workflow opens
- offers industry support → partnership confirmation appears
- changes dark mode → visual theme changes

====================================================
30. FINAL INFORMATION ARCHITECTURE
====================================================

GLOBAL ENTRY:

LANGUAGE POPUP
↓
LANDING PAGE

LANDING PAGE:
Problem Victim
OR
Problem Solver

PROBLEM VICTIM:
Citizen
Panchayati Raj
Local Organisation

PROBLEM SOLVER:
Institute / University
Industry
Organisation

CITIZEN:
Login
→ Dashboard
→ Report Problem
→ Location
→ Evidence
→ AI Processing
→ Tracking

PANCHAYAT:
Login
→ Panchayat Dashboard
→ Submit / Verify / Track

LOCAL ORGANISATION:
Login
→ Community Dashboard
→ Submit / Track

UNIVERSITY:
Login
→ Expertise Profile
→ Recommended Challenges
→ Accept
→ Team
→ Project

INDUSTRY:
Login
→ Capability Profile
→ Recommended Projects
→ Partnership

ORGANISATION:
Login
→ Expertise Profile
→ Recommended Challenges
→ Collaboration

GOVERNMENT:
Login
→ Validation
→ Smart Matching
→ Project Monitoring
→ Analytics
→ Impact

====================================================
31. FINAL PRODUCT FEEL
====================================================

The website must feel like:

A trusted Jharkhand government digital platform
+
A very simple rural citizen reporting service
+
An AI-powered innovation ecosystem

The central idea should visually remain:

“Citizens report the problem.
AI understands and organizes it.
Government validates it.
The right university and experts are matched.
Industry helps develop the solution.
The project is tracked till implementation.
Impact is measured.
Successful solutions are saved for reuse.”

Maintain strong consistency across all screens:
- same header
- same button system
- same card system
- same typography
- same colour system
- same icon style
- same spacing
- same navigation behavior

Do not add random features outside this product architecture.

Prioritize functional clarity, accessibility, trust, rural usability, and a clean government aesthetic over decorative design.