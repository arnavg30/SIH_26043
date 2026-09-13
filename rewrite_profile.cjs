const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldProfileStart = `function ProfileScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {`;
const oldProfileIdx = code.indexOf(oldProfileStart);

if (oldProfileIdx === -1) {
  console.log("Could not find ProfileScreen");
  process.exit(1);
}

// Find the end of ProfileScreen. It ends right before export default function App() {
const nextFuncIdx = code.indexOf('export default function App() {');
if (nextFuncIdx === -1) {
  console.log("Could not find App function");
  process.exit(1);
}

const newProfileCode = `function ProfileScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const [email, setEmail] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    import('./firebase/config').then(({ auth }) => {
      if (auth.currentUser) setEmail(auth.currentUser.email || "No email");
      else setEmail("Not logged in");
    });
    const { getProfileMe } = require('./api');
    getProfileMe().then((res: any) => {
      if (res.profile) {
        setProfile(res.profile);
        if (role === "citizen") {
          setFormData({
            name: res.profile.name || "", phoneNumber: res.profile.phone_number || "",
            gender: res.profile.gender || "Male", dateOfBirth: res.profile.date_of_birth || "",
            houseNumber: res.profile.house_number || "", cityVillage: res.profile.city_village || "",
            pincode: res.profile.pincode || "", landmark: res.profile.landmark || "",
            district: res.profile.district || "", residentialAddress: res.profile.residential_address || ""
          });
        } else if (role === "panchayat") {
          setFormData({
            panchayatName: res.profile.panchayat_name || "", sarpanchName: res.profile.sarpanch_name || "",
            district: res.profile.district || "", block: res.profile.block || "",
            villagesCovered: res.profile.villages_covered || "", officeAddress: res.profile.office_address || "",
            officialPhone: res.profile.official_phone || ""
          });
        } else if (role === "org-victim") {
          setFormData({
            organizationName: res.profile.organization_name || "", spocName: res.profile.spoc_name || "",
            designation: res.profile.designation || "", district: res.profile.district || "",
            block: res.profile.block || "", panchayatArea: res.profile.panchayat_area || "",
            officeAddress: res.profile.office_address || "", organizationContact: res.profile.organization_contact || ""
          });
        } else if (role === "org-solver") {
          setFormData({
            organizationName: res.profile.organization_name || "", registrationNumber: res.profile.registration_number || "",
            spocName: res.profile.spoc_name || "", spocContact: res.profile.spoc_contact || "",
            domain: res.profile.domain || "", domainExpertise: res.profile.domain_expertise || "",
            registeredAddress: res.profile.registered_address || ""
          });
        } else if (role === "industry") {
          setFormData({
            industryName: res.profile.industry_name || "", industryType: res.profile.industry_type || "",
            spocName: res.profile.spoc_name || "", designation: res.profile.designation || "",
            officialEmail: res.profile.official_email || "", phoneNumber: res.profile.phone_number || "",
            domainExpertise: res.profile.domain_expertise || "", companyAddress: res.profile.company_address || "",
            csrBudgetAvailable: res.profile.csr_budget_available || ""
          });
        } else if (role === "university") {
          setFormData({
            universityName: res.profile.university_name || "", aisheCode: res.profile.aishe_code || "",
            spocName: res.profile.spoc_name || "", spocNumber: res.profile.spoc_number || "",
            officialEmail: res.profile.official_email || "", institutionalAddress: res.profile.institutional_address || "",
            domainExpertise: res.profile.domain_expertise || ""
          });
        }
      }
      setLoading(false);
    }).catch((err: any) => {
      console.error(err);
      setLoading(false);
    });
  }, [role]);

  const handleChange = (k: string, v: string) => setFormData((prev: any) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      if (role === "citizen") await api.saveCitizenProfile(formData);
      else if (role === "panchayat") await api.savePanchayatProfile(formData);
      else if (role === "org-victim") await api.saveLocalOrgProfile(formData);
      else if (role === "org-solver") await api.saveOrgProfile(formData);
      else if (role === "industry") await api.saveIndustryProfile(formData);
      else if (role === "university") await api.saveUniProfile(formData);
      
      const res = await api.getProfileMe();
      if (res.profile) setProfile(res.profile);
      setIsEditing(false);
    } catch (e) {
      alert("Error saving profile");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getName = () => {
    if (role === "citizen") return profile.name || "Unknown Citizen";
    if (role === "panchayat") return profile.panchayat_name || "Unknown Panchayat";
    if (role === "org-victim" || role === "org-solver") return profile.organization_name || "Unknown Organization";
    if (role === "industry") return profile.industry_name || "Unknown Industry";
    if (role === "university") return profile.university_name || "Unknown University";
    return "User Profile";
  };
  const getSub = () => {
    if (role === "citizen") return [profile.phone_number, profile.city_village, profile.district].filter(Boolean).join(" • ");
    if (role === "panchayat") return [profile.district, profile.block].filter(Boolean).join(" • ");
    if (role === "org-victim" || role === "org-solver") return [profile.spoc_name, profile.district].filter(Boolean).join(" • ");
    if (role === "industry") return [profile.industry_type, profile.spoc_name].filter(Boolean).join(" • ");
    if (role === "university") return [profile.aishe_code, profile.institutional_address].filter(Boolean).join(" • ");
    return email;
  };

  const getBadge = () => {
    if (role === "citizen") return \`Verified Citizen (JH-CIT-\${profile.user_id || 'NEW'})\`;
    if (role === "panchayat") return "Verified Panchayat Leader";
    if (role === "org-victim") return "Verified Local NGO";
    if (role === "org-solver") return "Verified NGO/Organization";
    if (role === "industry") return "Verified Industry Partner";
    if (role === "university") return "Verified University";
    return "";
  };

  const InputRow = ({ label, k, type = "text", placeholder = "", required = false }: any) => (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        disabled={!isEditing}
        placeholder={placeholder}
        value={formData[k] || ""}
        onChange={e => handleChange(k, e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
        style={{
          background: isEditing ? "var(--bg)" : "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          opacity: isEditing ? 1 : 0.7
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="profile" onNav={onNav} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        
        {/* AI Helper Banner */}
        <div className="mb-6 rounded-lg p-4 flex gap-4 items-start" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="w-12 h-12 rounded-full flex-shrink-0 bg-teal-900/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-teal-400 text-center leading-tight">Mitra<br/>Sahayak</span>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>Here is your profile information. You can view or update your details anytime.</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Tap Edit Profile below to update your name, address or contact details.</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mb-6 rounded-lg p-5 flex items-center justify-between" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-teal-900/30 text-teal-500">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>{getName()}</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{getSub()}</p>
              <p className="text-xs mt-1 font-semibold flex items-center gap-1 text-teal-500">
                <CheckCircle size={12} /> {getBadge()}
              </p>
            </div>
          </div>
          {!isEditing ? (
            <Btn variant="ghost" className="text-xs" icon={<Edit2 size={14} />} onClick={() => setIsEditing(true)}>Edit Profile</Btn>
          ) : (
             <Btn variant="primary" className="text-xs" icon={<CheckCircle size={14} />} onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Btn>
          )}
        </div>

        {/* Profile Form */}
        <div className="rounded-lg p-5 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
             <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
               <User size={16} className="text-teal-500" /> Profile Information
             </h2>
             <span className="text-xs" style={{ color: "var(--text-muted)" }}>{isEditing ? "Edit Mode" : "View Mode"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role === "citizen" && (
              <>
                <InputRow label="Full Name" k="name" required />
                <InputRow label="Mobile Number" k="phoneNumber" required />
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Gender <span className="text-red-500">*</span></label>
                  <select
                    disabled={!isEditing}
                    value={formData.gender || "Male"}
                    onChange={e => handleChange("gender", e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                    style={{ background: isEditing ? "var(--bg)" : "var(--surface)", borderColor: "var(--border)", color: "var(--text)", opacity: isEditing ? 1 : 0.7 }}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <InputRow label="Date of Birth" k="dateOfBirth" type="date" required />
              </>
            )}
            
            {role === "panchayat" && (
              <>
                <InputRow label="Panchayat Name" k="panchayatName" required />
                <InputRow label="Sarpanch Name" k="sarpanchName" required />
                <InputRow label="Official Phone" k="officialPhone" />
                <InputRow label="Villages Covered" k="villagesCovered" />
              </>
            )}

            {role === "org-victim" && (
              <>
                <InputRow label="Organization Name" k="organizationName" required />
                <InputRow label="SPOC Name" k="spocName" required />
                <InputRow label="Designation" k="designation" />
                <InputRow label="Contact Number" k="organizationContact" />
              </>
            )}

            {role === "org-solver" && (
              <>
                <InputRow label="Organization / NGO Name" k="organizationName" required />
                <InputRow label="Registration Number" k="registrationNumber" />
                <InputRow label="SPOC Name" k="spocName" required />
                <InputRow label="SPOC Contact" k="spocContact" />
                <InputRow label="Domain" k="domain" />
                <InputRow label="Domain Expertise" k="domainExpertise" />
              </>
            )}

            {role === "industry" && (
              <>
                <InputRow label="Industry Name" k="industryName" required />
                <InputRow label="Industry Type" k="industryType" />
                <InputRow label="SPOC Name" k="spocName" required />
                <InputRow label="Designation" k="designation" />
                <InputRow label="Official Email" k="officialEmail" />
                <InputRow label="Phone Number" k="phoneNumber" />
                <InputRow label="Domain Expertise" k="domainExpertise" />
                <InputRow label="CSR Budget (₹L)" k="csrBudgetAvailable" type="number" />
              </>
            )}

            {role === "university" && (
              <>
                <InputRow label="University Name" k="universityName" required />
                <InputRow label="AISHE Code" k="aisheCode" />
                <InputRow label="SPOC Name" k="spocName" required />
                <InputRow label="SPOC Number" k="spocNumber" />
                <InputRow label="Official Email" k="officialEmail" />
                <InputRow label="Domain Expertise" k="domainExpertise" />
              </>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="rounded-lg p-5 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
             <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
               <MapPin size={16} className="text-teal-500" /> Address Details
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {role === "citizen" && (
               <>
                 <InputRow label="House Number" k="houseNumber" />
                 <InputRow label="Nearest Landmark" k="landmark" />
                 <InputRow label="Village / City" k="cityVillage" />
                 <InputRow label="District" k="district" />
                 <InputRow label="Pincode" k="pincode" />
               </>
             )}
             {role === "panchayat" && (
               <>
                 <InputRow label="Block" k="block" required />
                 <InputRow label="District" k="district" required />
                 <InputRow label="Office Address" k="officeAddress" />
               </>
             )}
             {role === "org-victim" && (
               <>
                 <InputRow label="Panchayat Area" k="panchayatArea" />
                 <InputRow label="Block" k="block" />
                 <InputRow label="District" k="district" />
                 <InputRow label="Office Address" k="officeAddress" required />
               </>
             )}
             {role === "org-solver" && (
               <div className="md:col-span-2">
                 <InputRow label="Registered Address" k="registeredAddress" required />
               </div>
             )}
             {role === "industry" && (
               <div className="md:col-span-2">
                 <InputRow label="Company Address" k="companyAddress" required />
               </div>
             )}
             {role === "university" && (
               <div className="md:col-span-2">
                 <InputRow label="Institutional Address" k="institutionalAddress" required />
               </div>
             )}
          </div>
        </div>

        <Btn variant="ghost" className="w-full text-red-500 mt-6" onClick={() => {
          import('./firebase/config').then(({ auth }) => {
            import('firebase/auth').then(({ signOut }) => {
              signOut(auth).then(() => onNav("landing"));
            });
          });
        }}>
          <LogOut size={16} className="mr-2" /> Sign Out
        </Btn>

      </div>
    </div>
  );
}
`;

const updatedCode = code.slice(0, oldProfileIdx) + newProfileCode + '\n\n' + code.slice(nextFuncIdx);
fs.writeFileSync('src/App.tsx', updatedCode);
console.log("Rewrote ProfileScreen successfully.");
