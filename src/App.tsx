import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Sun, Moon, Globe, ChevronRight, MapPin, Mic, MicOff, Keyboard,
  Camera, Upload, Video, Bell, User, Users, Building2, GraduationCap,
  Briefcase, Home, FileText, Map, Navigation, CheckCircle, Clock,
  AlertTriangle, XCircle, Loader, Search, Filter, ArrowLeft, ArrowRight,
  Phone, MessageSquare, Star, Settings, LogOut, Menu, X, TrendingUp,
  Layers, Heart, BookOpen, Lightbulb, Shield, AlertCircle, ChevronDown,
  BarChart3, PieChart, Activity, Leaf, Droplets, Zap, Wheat, Stethoscope,
  School, Trash2, ThumbsUp, SendHorizontal, RefreshCw, Eye, EyeOff, Lock,
  ClipboardList, HelpCircle, Volume2, UserCheck, Building, Factory, Edit2, Mail,
} from "lucide-react";
import { type Lang, LANG_NAMES, makeT } from "./i18n";
import { NavJharLogo } from "./components/NavJharLogo";
import { MitraAssistant } from "./components/MitraAssistant";
import LocationPickerMap from "./components/LocationPickerMap";
import RecordedAudioPlayer from "./components/RecordedAudioPlayer";
import useVoiceRecording from "./hooks/useVoiceRecording";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, reload, signOut } from "firebase/auth";
import { auth } from "./firebase/config";
import {
  syncAuth, getProfileMe,
  saveCitizenProfile, savePanchayatProfile, saveLocalOrgProfile,
  saveOrgProfile, saveIndustryProfile, saveUniProfile, submitProblem
} from "./api";

// ─── Context ─────────────────────────────────────────────────────────────────
interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  t: (key: string) => string;
  role: string;
  setRole: (r: string) => void;
  report: { description: string; category: string; categoryId: string; evidence: string; files: File[]; previews: string[]; audioDurationSeconds: number; latitude: string; longitude: string; district: string; block: string; panchayat: string; village: string; locationMethod: string; problemCode: string };
  setReport: React.Dispatch<React.SetStateAction<AppCtx["report"]>>;
}
const Ctx = createContext<AppCtx>({
  lang: "en", setLang: () => {}, dark: false, setDark: () => {}, t: (k) => k,
  role: "citizen", setRole: () => {},
  report: { description: "", category: "", categoryId: "", evidence: "", files: [], previews: [], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "" }, setReport: () => {},
});
const useApp = () => useContext(Ctx);
const isValidMobile = (value: string) => /^\d{10}$/.test(value.replace(/\D/g, ""));


type ProfileDisplay = { name: string; detail: string };
function useProfileDisplay(role: string): ProfileDisplay {
  const [display, setDisplay] = useState<ProfileDisplay>({ name: "", detail: "" });
  useEffect(() => {
    let active = true;
    getProfileMe().then(({ profile }) => {
      if (!active || !profile) return;
      if (role === "citizen") setDisplay({ name: profile.name || "", detail: [profile.city_village, profile.district].filter(Boolean).join(", ") });
      else if (role === "panchayat") setDisplay({ name: profile.panchayat_name || "", detail: [profile.block, profile.district].filter(Boolean).join(", ") });
      else if (role === "localorg" || role === "org-victim") setDisplay({ name: profile.organization_name || "", detail: [profile.block, profile.district].filter(Boolean).join(", ") });
      else if (role === "university") setDisplay({ name: profile.university_name || "", detail: profile.institutional_address || "" });
      else if (role === "industry") setDisplay({ name: profile.industry_name || "", detail: profile.industry_type || "" });
      else if (role === "org-solver" || role === "org") setDisplay({ name: profile.organization_name || "", detail: profile.domain_expertise || profile.domain || "" });
    }).catch(() => {});
    return () => { active = false; };
  }, [role]);
  return display;
}

function getHomeDashboard(role: string): Screen {
  if (role === "panchayat") return "panchayat-dashboard";
  if (role === "localorg" || role === "org-victim") return "org-victim-dashboard";
  if (role === "university") return "uni-dashboard";
  if (role === "industry") return "industry-dashboard";
  if (role === "org-solver" || role === "org") return "org-solver-dashboard";
  return "citizen-dashboard";
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "landing"
  | "victim-select" | "solver-select"
  | "citizen-login" | "citizen-dashboard"
  | "panchayat-login" | "panchayat-dashboard"
  | "org-victim-login" | "org-victim-dashboard"
  | "uni-login" | "uni-dashboard" | "uni-challenge-detail"
  | "team-formation" | "proposal"
  | "industry-login" | "industry-dashboard" | "industry-project-detail"
  | "partnership-form" | "partnership-success"
  | "org-solver-login" | "org-solver-dashboard"
  | "report-step1" | "report-step2" | "report-step3"
  | "ai-processing" | "ai-result" | "submit-success"
  | "tracking" | "problems-near-me" | "report-for-someone"
  | "project-lifecycle" | "project-health"
  | "solution-repo" | "solution-detail"
  | "impact-dashboard" | "notifications" | "feedback" | "profile";

// ─── Language Modal ───────────────────────────────────────────────────────────
const LANGS: { code: Lang; native: string; name: string }[] = [
  { code: "hi", native: "हिंदी", name: "Hindi" },
  { code: "en", native: "English", name: "English" },
  { code: "sa", native: "Santali", name: "Santali" },
];

function LanguageModal({ onDone }: { onDone: (lang: Lang) => void }) {
  const [sel, setSel] = useState<Lang>("en");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}>
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--navy)" }}>
            <Globe size={22} color="var(--amber)" />
          </div>
          <h2 className="text-xl font-black" style={{ color: "var(--text)" }}>Choose Your Language</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>अपनी भाषा चुनें</p>
        </div>
        <div className="space-y-2 mb-5">
          {LANGS.map(l => (
            <button key={l.code}
              onClick={() => setSel(l.code)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: sel === l.code ? "var(--green)" : "var(--border)",
                background: sel === l.code ? "var(--success-bg)" : "var(--card)",
              }}>
              <div>
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{l.native}</span>
                {l.code !== "en" && <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{l.name}</span>}
              </div>
              {sel === l.code && <CheckCircle size={18} color="var(--green)" />}
            </button>
          ))}
        </div>
        <button onClick={() => onDone(sel)}
          className="w-full py-3 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          {sel === "hi" ? "जारी रखें →" : sel === "sa" ? "Jari →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

function MitraWelcomeModal({ onContinue }: { onContinue: () => void }) {
  const { t, lang } = useApp();
  const badgeLabel = lang === "hi" ? "मित्रा — आपकी डिजिटल सहायक" : lang === "sa" ? "Mitra — Apan Digital Sahayak" : "Mitra — Your Digital Guide";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg md:max-w-2xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <MitraAssistant
          size="full"
          variant="welcome"
          message={t("mitra.welcome.title")}
          subMessage={t("mitra.welcome.sub")}
          hint={t("mitra.welcome.hint")}
          badgeText={badgeLabel}
          action={
            <button
              onClick={onContinue}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
              style={{ background: "var(--amber)", color: "var(--navy)" }}
            >
              <span>{t("mitra.welcome.btn") || t("lang.continue")}</span>
              <ArrowRight size={18} />
            </button>
          }
        />
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Card({ children, className = "", onClick, style }: {
  children: React.ReactNode; className?: string;
  onClick?: () => void; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border ${onClick ? "cursor-pointer card-hover" : ""} ${className}`}
      style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)", ...style }}
      onClick={onClick}>
      {children}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, className = "", disabled = false, icon }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "nav";
  onClick?: () => void; className?: string; disabled?: boolean; icon?: React.ReactNode;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--amber)", color: "var(--navy)", border: "none" },
    secondary: { background: "transparent", color: "var(--navy)", border: "1.5px solid var(--navy)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1.5px solid var(--border)" },
    danger: { background: "var(--error-bg)", color: "var(--error)", border: "1.5px solid var(--error)" },
    success: { background: "var(--green)", color: "white", border: "none" },
    nav: { background: "transparent", color: "var(--nav-text)", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"} ${className}`}
      style={styles[variant]}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    submitted: { bg: "#EFF6FF", text: "#1D4ED8", label: "Submitted" },
    "under-review": { bg: "#FEF9C3", text: "#854D0E", label: "Under Review" },
    "in-progress": { bg: "var(--warning-bg)", text: "var(--warning)", label: "In Progress" },
    resolved: { bg: "var(--success-bg)", text: "var(--success)", label: "Resolved" },
    "high-priority": { bg: "var(--error-bg)", text: "var(--error)", label: "High Priority" },
    "on-track": { bg: "var(--success-bg)", text: "var(--success)", label: "On Track" },
    "at-risk": { bg: "var(--warning-bg)", text: "var(--warning)", label: "At Risk" },
    delayed: { bg: "var(--error-bg)", text: "var(--error)", label: "Delayed" },
    matched: { bg: "#EDE9FE", text: "#5B21B6", label: "Matched" },
    validated: { bg: "var(--success-bg)", text: "var(--success)", label: "Validated" },
    new: { bg: "#DBEAFE", text: "#1E40AF", label: "New" },
    deployed: { bg: "var(--success-bg)", text: "var(--success)", label: "Deployed" },
  };
  const s = map[status] || { bg: "var(--bg)", text: "var(--text-muted)", label: status };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function PriorityBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--error)" : score >= 60 ? "var(--warning)" : "var(--success)";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: "var(--border)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}/100</span>
    </div>
  );
}

function ProgressRing({ value, size = 80, stroke = 7, color = "var(--green)" }: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
        style={{ fontSize: size * 0.2, fontWeight: 700, fill: color }}>{value}%</text>
    </svg>
  );
}

function KPICard({ icon, label, value, sub, color = "var(--navy)" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {sub && <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "var(--success-bg)", color: "var(--success)" }}>{sub}</span>}
      </div>
      <div className="text-2xl font-black mt-1" style={{ color }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
    </Card>
  );
}

// ─── Top NavBar ───────────────────────────────────────────────────────────────
function NavBar({ role, screen, onNav }: { role: string; screen: Screen; onNav: (s: Screen) => void }) {
  const { t, lang, setLang, dark, setDark } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems: { label: string; screen: Screen; icon: React.ReactNode; isCTA?: boolean }[] =
    role === "citizen" ? [
      { label: t("cit.report"), screen: "report-step1", icon: <FileText size={15} /> },
      { label: t("cit.track"), screen: "tracking", icon: <MapPin size={15} /> },
      { label: t("cit.nearby"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "panchayat" ? [
      { label: t("panch.problems"), screen: "panchayat-dashboard", icon: <Layers size={15} /> },
      { label: t("panch.report"), screen: "report-step1", icon: <FileText size={15} />, isCTA: true },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "localorg" || role === "org-victim" ? [
      { label: t("localorg.my_problems"), screen: "org-victim-dashboard", icon: <FileText size={15} /> },
      { label: t("localorg.area_problems"), screen: "problems-near-me", icon: <Map size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "university" ? [
      { label: "Challenges", screen: "uni-dashboard", icon: <Layers size={15} /> },
      { label: "Projects", screen: "project-lifecycle", icon: <Activity size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "industry" ? [
      { label: "Projects", screen: "industry-dashboard", icon: <Briefcase size={15} /> },
      { label: "Partnerships", screen: "partnership-form", icon: <Building2 size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : role === "org-solver" || role === "org" ? [
      { label: t("org.dashboard"), screen: "org-solver-dashboard", icon: <Briefcase size={15} /> },
      { label: t("nav.profile"), screen: "profile", icon: <User size={15} /> },
    ] : [];

  const homeScreen: Screen = getHomeDashboard(role);

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => onNav(homeScreen)} className="dark flex items-center flex-shrink-0 text-left cursor-pointer transition-transform active:scale-95">
          <div className="hidden sm:block">
            <NavJharLogo variant="full" />
          </div>
          <div className="sm:hidden">
            <NavJharLogo variant="icon" className="w-9 h-9" />
          </div>
        </button>

        {/* Desktop nav items */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => onNav(item.screen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(242,184,75,0.4)"
              } : {
                color: screen === item.screen ? "var(--amber)" : "var(--nav-text)",
                background: screen === item.screen ? "rgba(242,184,75,0.12)" : "transparent"
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Language selector */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
              <Globe size={14} />
              <span className="hidden sm:block">{LANG_NAMES[lang]}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                {LANGS.map(l => (
                  <button key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-medium transition-all hover:opacity-80 flex items-center justify-between"
                    style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                    {l.native}
                    {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button onClick={() => setDark(!dark)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <button onClick={() => onNav("notifications")}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>

          {/* Sign out */}
          <button onClick={() => { signOut(auth).catch(() => {}); onNav("landing"); }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}>
            <LogOut size={13} /> {t("nav.logout")}
          </button>

          {/* Mobile menu */}
          <button className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--nav-text)" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "var(--navy-dark)" }}>
          {navItems.map(item => (
            <button key={item.screen + item.label}
              onClick={() => { onNav(item.screen); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium cursor-pointer"
              style={item.isCTA ? {
                color: "var(--navy)",
                background: "var(--amber)",
                fontWeight: "bold"
              } : { color: screen === item.screen ? "var(--amber)" : "var(--nav-text)" }}>
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => { signOut(auth).catch(() => {}); setMenuOpen(false); onNav("landing"); }}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium border-t cursor-pointer"
            style={{ color: "var(--nav-text)", borderColor: "rgba(255,255,255,0.08)" }}>
            <LogOut size={15} /> {t("nav.logout")}
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Bottom Navigation (For all role dashboards) ─────────────────────────────
function MobileNav({ onNav, activeScreen }: { onNav: (s: Screen) => void; activeScreen?: Screen }) {
  const { t, role } = useApp();
  const homeScreen = getHomeDashboard(role);
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 z-40"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {([
        { icon: <Home size={20} />, label: "Home", screen: homeScreen },
        { icon: <FileText size={20} />, label: t("cit.report").split(" ")[0], screen: "report-step1" as Screen },
        { icon: <MapPin size={20} />, label: t("cit.track").split(" ")[0], screen: "tracking" as Screen },
        { icon: <Map size={20} />, label: "Near Me", screen: "problems-near-me" as Screen },
        { icon: <User size={20} />, label: t("nav.profile"), screen: "profile" as Screen },
      ] as const).map(n => (
        <button key={n.screen} onClick={() => onNav(n.screen)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer active:scale-95"
          style={{ color: activeScreen === n.screen ? "var(--amber)" : "var(--text-muted)" }}>
          {n.icon}
          <span className="text-xs font-medium">{n.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── SIMPLE NAV HEADER (Consistent Top-Left Logo) ─────────────────────────────
function SimpleNavHeader({ onBack, onNav }: { onBack?: () => void; onNav?: (s: Screen) => void }) {
  const { t, dark, setDark, lang, setLang } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 h-14 flex items-center justify-between"
      style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
      {/* Logo in Top-Left Corner (Just like Dashboard) */}
      <button 
        onClick={() => onNav ? onNav("landing") : (onBack ? onBack() : null)} 
        className="dark flex items-center flex-shrink-0 text-left cursor-pointer transition-transform active:scale-95"
      >
        <div className="hidden sm:block">
          <NavJharLogo variant="full" />
        </div>
        <div className="sm:hidden">
          <NavJharLogo variant="icon" className="w-9 h-9" />
        </div>
      </button>

      {/* Right controls: Back button & Theme toggle */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            <ArrowLeft size={14} /> {t("btn.back")}
          </button>
        )}
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            <Globe size={13} /> {LANG_NAMES[lang]} <ChevronDown size={11} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
              style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer"
                  style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                  {l.native} {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setDark(!dark)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang, setLang, dark, setDark } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top header */}
      <header className="px-4 sm:px-6 h-14 flex items-center justify-between"
        style={{ background: "var(--nav-bg)", boxShadow: "var(--shadow)" }}>
        <div className="dark flex items-center">
          <div className="hidden sm:block">
            <NavJharLogo variant="full" />
          </div>
          <div className="sm:hidden">
            <NavJharLogo variant="icon" className="w-9 h-9" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
              <Globe size={13} /> {LANG_NAMES[lang]} <ChevronDown size={11} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border overflow-hidden z-50"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between"
                    style={{ color: "var(--text)", background: lang === l.code ? "var(--success-bg)" : "transparent" }}>
                    {l.native} {lang === l.code && <CheckCircle size={12} color="var(--green)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setDark(!dark)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--nav-text)" }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

        </div>
      </header>

      {/* Hero */}
      <div className="py-10 px-4 text-center" style={{
        background: `linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 60%, var(--green) 100%)`
      }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold"
          style={{ background: "rgba(242,184,75,0.15)", color: "var(--amber)", border: "1px solid rgba(242,184,75,0.3)" }}>
          <Shield size={12} /> Government of Jharkhand — Official Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2 tracking-tight leading-none flex items-center justify-center">
          <span className="text-[#F59E0B]">Nav</span>
          <span className="text-[#4ade80]">Jhar</span>
        </h1>
        <p className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "var(--amber)" }}>
          हर समस्या का नया समाधान
        </p>
        <p className="text-sm max-w-md mx-auto mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
          From Local Problems to Scalable Solutions
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { val: "4,280", key: "landing.stats.reported" },
            { val: "312", key: "landing.stats.deployed" },
            { val: "2.4L+", key: "landing.stats.benefited" },
          ].map(s => (
            <div key={s.key} className="text-center">
              <div className="text-2xl font-black" style={{ color: "var(--amber)" }}>{s.val}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{t(s.key)}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          * {t("landing.demodata")}
        </p>
      </div>

      {/* Main two-path selection */}
      <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <h2 className="text-center text-base font-semibold mb-6" style={{ color: "var(--text)" }}>
          {t("landing.how")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Register a Problem */}
          <button onClick={() => onNav("victim-select")}
            className="p-6 rounded-2xl border-2 text-left transition-all card-hover active:scale-95"
            style={{ background: "var(--card)", borderColor: "var(--green)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--success-bg)", border: "1.5px solid var(--green)" }}>
              <FileText size={28} color="var(--green)" />
            </div>
            <h3 className="text-lg font-black mb-1" style={{ color: "var(--green)" }}>
              {t("landing.victim")}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("landing.victim.sub")}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: "var(--green)" }}>
              {t("btn.next")} <ChevronRight size={14} />
            </div>
          </button>

          {/* Problem Solver */}
          <button onClick={() => onNav("solver-select")}
            className="p-6 rounded-2xl border-2 text-left transition-all card-hover active:scale-95"
            style={{ background: "var(--card)", borderColor: "var(--navy)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "#EFF6FF", border: "1.5px solid var(--navy)" }}>
              <Lightbulb size={28} color="var(--navy)" />
            </div>
            <h3 className="text-lg font-black mb-1" style={{ color: "var(--navy)" }}>
              {t("landing.solver")}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("landing.solver.sub")}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: "var(--navy)" }}>
              {t("btn.next")} <ChevronRight size={14} />
            </div>
          </button>
        </div>



      </div>
      <footer className="mt-auto py-4 px-4 text-center" style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,0.6)" }}>
        <p className="text-xs">A Government of Jharkhand Initiative.</p>
        <p className="text-xs mt-1">Supported by JSAC.</p>
      </footer>
    </div>
  );
}

// ─── VICTIM ROLE SELECTION ────────────────────────────────────────────────────
function VictimSelectScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const roles = [
    {
      icon: <User size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.citizen"), sub: t("victim.citizen.sub"), screen: "citizen-login" as Screen,
    },
    {
      icon: <Building2 size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.panchayat"), sub: t("victim.panchayat.sub"), screen: "panchayat-login" as Screen,
    },
    {
      icon: <Users size={28} color="var(--green)" />, bg: "var(--success-bg)", accentColor: "var(--green)",
      label: t("victim.localorg"), sub: t("victim.localorg.sub"), screen: "org-victim-login" as Screen,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader onBack={() => onNav("landing")} onNav={onNav} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "var(--text)" }}>{t("victim.who")}</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t("landing.victim")}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-8">
            {/* Mitra full body with speech bubble box on side */}
            <div className="w-full max-w-md lg:w-96 shrink-0 flex justify-center">
              <MitraAssistant
                size="full"
                variant="guide"
                mitraHeight="h-72 sm:h-80"
                message={t("mitra.identity.select")}
                subMessage={lang === "hi" ? "कृपया अपनी सही श्रेणी चुनें" : "Please select your category to continue"}
              />
            </div>

            {/* Role Selection Cards */}
            <div className="w-full max-w-md space-y-3">
              {roles.map(r => (
                <button key={r.screen} onClick={() => onNav(r.screen)}
                  className="w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all card-hover active:scale-95 cursor-pointer shadow-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: r.bg, border: `1.5px solid ${r.accentColor}` }}>{r.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-base" style={{ color: "var(--text)" }}>{r.label}</div>
                    <div className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{r.sub}</div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SOLVER ROLE SELECTION ────────────────────────────────────────────────────
function SolverSelectScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const roles = [
    {
      icon: <GraduationCap size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.university"), sub: t("solver.university.sub"), screen: "uni-login" as Screen,
    },
    {
      icon: <Factory size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.industry"), sub: t("solver.industry.sub"), screen: "industry-login" as Screen,
    },
    {
      icon: <Briefcase size={28} color="var(--navy)" />, bg: "#EFF6FF",
      label: t("solver.org"), sub: t("solver.org.sub"), screen: "org-solver-login" as Screen,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner (Just like Dashboard) */}
      <SimpleNavHeader onBack={() => onNav("landing")} onNav={onNav} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-black mb-1 text-center" style={{ color: "var(--text)" }}>{t("solver.who")}</h1>
          <p className="text-sm mb-7 text-center" style={{ color: "var(--text-muted)" }}>
            {t("landing.solver")} — {t("landing.solver.sub")}
          </p>
          <div className="space-y-3">
            {roles.map(r => (
              <button key={r.screen} onClick={() => onNav(r.screen)}
                className="w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all card-hover active:scale-95 cursor-pointer"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: r.bg }}>{r.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-base" style={{ color: "var(--text)" }}>{r.label}</div>
                  <div className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{r.sub}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REUSABLE FIREBASE EMAIL & PASSWORD AUTH FORM ─────────────────────────────
function EmailPasswordAuthForm({
  email, setEmail,
  password, setPassword,
  authMode, setAuthMode,
  showPassword, setShowPassword,
  loading, errorMsg,
  onSubmit,
  emailPlaceholder = "name@example.com",
  emailLabel = "Email Address",
  emailHint = "Enter your email and password to authenticate",
}: {
  email: string; setEmail: (s: string) => void;
  password: string; setPassword: (s: string) => void;
  authMode: "signin" | "signup"; setAuthMode: (m: "signin" | "signup") => void;
  showPassword: boolean; setShowPassword: (b: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean; errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  emailPlaceholder?: string;
  emailLabel?: string;
  emailHint?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Sign In vs Sign Up Toggle Pills */}
      <div className="flex p-1 rounded-xl border gap-1" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => setAuthMode("signin")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMode === "signin" ? "shadow-xs" : "opacity-60 hover:opacity-100"}`}
          style={{
            background: authMode === "signin" ? "var(--card)" : "transparent",
            color: authMode === "signin" ? "var(--text)" : "var(--text-muted)",
          }}>
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("signup")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMode === "signup" ? "shadow-xs" : "opacity-60 hover:opacity-100"}`}
          style={{
            background: authMode === "signup" ? "var(--card)" : "transparent",
            color: authMode === "signup" ? "var(--text)" : "var(--text-muted)",
          }}>
          Create Account
        </button>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
          <Mail size={13} className="inline mr-1" color="var(--amber)" /> {emailLabel} <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{emailHint}</p>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
          <Lock size={13} className="inline mr-1" color="var(--amber)" /> Password <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none pr-10 transition-all"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
            style={{ color: "var(--text)" }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl flex items-start gap-2 text-xs"
          style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      {/* Submit Button */}
      <Btn
        type="submit"
        disabled={loading}
        className="w-full py-3 cursor-pointer"
        icon={loading ? <Loader size={16} className="animate-spin" /> : <ArrowRight size={16} />}>
        {loading ? "Authenticating..." : (authMode === "signin" ? "Sign In & Continue" : "Create Account & Continue")}
      </Btn>

      {/* Switch Helper */}
      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        {authMode === "signin" ? (
          <span>New user? <button type="button" onClick={() => setAuthMode("signup")} className="font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Create account</button></span>
        ) : (
          <span>Already registered? <button type="button" onClick={() => setAuthMode("signin")} className="font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Sign in here</button></span>
        )}
      </div>
    </form>
  );
}

function EmailVerificationGate({ email, onVerified, onBack }: { email: string; onVerified: () => Promise<void>; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const checkVerification = async () => {
    const user = auth.currentUser;
    if (!user) return setErrorMsg("Your session expired. Please sign in again.");
    setLoading(true); setErrorMsg("");
    try {
      await reload(user);
      if (!auth.currentUser?.emailVerified) return setErrorMsg("Email is not verified yet. Open the link from your inbox, then try again.");
      await onVerified();
    } catch (err: any) { setErrorMsg(err.message || "Could not check verification status."); }
    finally { setLoading(false); }
  };
  const resend = async () => {
    const user = auth.currentUser;
    if (!user) return setErrorMsg("Your session expired. Please sign in again.");
    setLoading(true); setErrorMsg(""); setMessage("");
    try { await sendEmailVerification(user); setMessage(`Verification link sent to ${email}.`); }
    catch (err: any) { setErrorMsg(err.message || "Could not resend verification email."); }
    finally { setLoading(false); }
  };
  return <div className="space-y-4 text-center">
    <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--success-bg)" }}><Mail size={22} color="var(--success)" /></div>
    <div><h2 className="font-bold text-base" style={{ color: "var(--text)" }}>Verify your email</h2><p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>We sent a verification link to <strong>{email}</strong>. Open it, then return here.</p></div>
    {message && <p className="p-2.5 rounded-xl text-xs" style={{ background: "var(--success-bg)", color: "var(--success)" }}>{message}</p>}
    {errorMsg && <p className="p-2.5 rounded-xl text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{errorMsg}</p>}
    <Btn onClick={checkVerification} disabled={loading} className="w-full py-3" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>{loading ? "Checking..." : "I verified my email — Continue"}</Btn>
    <button type="button" onClick={resend} disabled={loading} className="w-full text-xs font-semibold underline cursor-pointer" style={{ color: "var(--navy)" }}>Resend verification email</button>
    <button type="button" onClick={onBack} disabled={loading} className="w-full text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>Use a different email</button>
  </div>;
}

// ─── GENERIC EMAIL LOGIN & PROFILE SETUP ──────────────────────────────────────
function OTPLoginScreen({ title, icon, onSuccess, onBack, profileType = "citizen" }: {
  title: string; icon: React.ReactNode;
  onSuccess: () => void; onBack: () => void;
  profileType?: string;
}) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeField, setActiveField] = useState<string>("name");

  // Citizen Profile Form State
  const [citName, setCitName] = useState("");
  const [citPhone, setCitPhone] = useState("");
  const [citGender, setCitGender] = useState("Male");
  const [citDob, setCitDob] = useState("");
  const [citHouse, setCitHouse] = useState("");
  const [citCity, setCitCity] = useState("");
  const [citPincode, setCitPincode] = useState("");
  const [citLandmark, setCitLandmark] = useState("");
  const [citDistrict, setCitDistrict] = useState("Ranchi");

  // Panchayat Profile Form State
  const [panchName, setPanchName] = useState("");
  const [sarpanchName, setSarpanchName] = useState("");
  const [panchPhone, setPanchPhone] = useState("");
  const [panchAddress, setPanchAddress] = useState("");
  const [panchDistrict, setPanchDistrict] = useState("Ranchi");
  const [panchBlock, setPanchBlock] = useState("Namkum");
  const [panchVillages, setPanchVillages] = useState("");

  // Local Org Profile Form State
  const [orgName, setOrgName] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocDesignation, setSpocDesignation] = useState("President / General Secretary");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgDistrict, setOrgDistrict] = useState("Ranchi");
  const [orgBlock, setOrgBlock] = useState("Ranchi Sadar");
  const [orgArea, setOrgArea] = useState("");

  const getCitizenMitraMessage = () => {
    if (step === "email") return t("mitra.profile.email");
    if (activeField === "phone") return t("mitra.profile.phone");
    if (activeField === "name") return t("mitra.profile.name");
    if (activeField === "gender") return t("mitra.profile.gender");
    if (activeField === "dob") return t("mitra.profile.dob");
    if (activeField === "address") return t("mitra.profile.address");
    return t("mitra.profile.default");
  };

  const finishVerifiedAuthentication = async () => {
    const profileTypeUpper = profileType === "panchayat" ? "PANCHAYAT" : profileType === "localorg" ? "LOCAL_ORG" : "CITIZEN";
    await syncAuth(profileTypeUpper, lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onSuccess(); } catch { /* New profile. */ }
    setStep("profile");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) {
        if (authMode === "signup") await sendEmailVerification(user);
        setStep("verify");
        return;
      }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If you don't have an account yet, click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please click 'Sign In' instead.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (profileType === "panchayat") {
        if (!panchName.trim() || !sarpanchName.trim() || !panchAddress.trim() || !isValidMobile(panchPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await savePanchayatProfile({
          panchayatName: panchName,
          sarpanchName,
          district: panchDistrict,
          block: panchBlock,
          villagesCovered: panchVillages,
          officeAddress: panchAddress,
          officialPhone: panchPhone,
        });
      } else if (profileType === "localorg") {
        if (!orgName.trim() || !spocName.trim() || !orgAddress.trim() || !isValidMobile(orgPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await saveLocalOrgProfile({
          organizationName: orgName,
          spocName,
          designation: spocDesignation,
          district: orgDistrict,
          block: orgBlock,
          panchayatArea: orgArea,
          officeAddress: orgAddress,
          organizationContact: orgPhone,
        });
      } else {
        // Citizen
        if (!citName.trim() || !citCity.trim() || !citPincode.trim() || !citDistrict.trim() || !isValidMobile(citPhone)) {
          setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
          setLoading(false);
          return;
        }
        await saveCitizenProfile({
          name: citName,
          phoneNumber: citPhone,
          gender: citGender,
          dateOfBirth: citDob || undefined,
          houseNumber: citHouse,
          cityVillage: citCity,
          pincode: citPincode,
          landmark: citLandmark,
          district: citDistrict,
          residentialAddress: `${citHouse ? citHouse + ", " : ""}${citLandmark ? citLandmark + ", " : ""}${citCity || ""}, ${citDistrict || ""}, ${citPincode || ""}`.trim(),
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error("Profile save error:", err);
      setErrorMsg(err.message || "Could not save profile. Please check your network and fields.");
    } finally {
      setLoading(false);
    }
  };

  const ProfileForm = () => {
    if (profileType === "panchayat") {
      return (
        <form onSubmit={handleProfileSubmit}>
          <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
            <CheckCircle size={16} color="var(--success)" />
            <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
              Authenticated: {email}
            </span>
          </div>

          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
            <UserCheck size={16} className="inline mr-1" /> Panchayat Profile Setup
          </h2>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Panchayat Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={panchName}
              onChange={e => setPanchName(e.target.value)}
              placeholder="e.g. Ramgarh Gram Panchayat"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Mukhiya / Sarpanch Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={sarpanchName}
              onChange={e => setSarpanchName(e.target.value)}
              placeholder="e.g. Rameshwar Soren"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              <Phone size={12} className="inline mr-1" /> Official Phone Number <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <div className="flex gap-2">
              <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={panchPhone}
                onChange={e => setPanchPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Office Address <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={panchAddress}
              onChange={e => setPanchAddress(e.target.value)}
              placeholder="Panchayat Bhawan, Block Road"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label>
              <input
                value={panchDistrict}
                onChange={e => setPanchDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label>
              <input
                value={panchBlock}
                onChange={e => setPanchBlock(e.target.value)}
                placeholder="e.g. Namkum"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Village(s) Covered</label>
            <input
              value={panchVillages}
              onChange={e => setPanchVillages(e.target.value)}
              placeholder="e.g. Rampur, Sitadih"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
            {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Setup")}
          </Btn>
        </form>
      );
    }
    if (profileType === "localorg") {
      return (
        <form onSubmit={handleProfileSubmit}>
          <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
            <CheckCircle size={16} color="var(--success)" />
            <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
              Authenticated: {email}
            </span>
          </div>

          <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
            <UserCheck size={16} className="inline mr-1" /> Organisation Profile Setup
          </h2>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Organisation Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="e.g. Harmu Residents Welfare Association"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              SPOC Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={spocName}
              onChange={e => setSpocName(e.target.value)}
              placeholder="e.g. Sunil Kumar Singh"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              SPOC Designation
            </label>
            <input
              value={spocDesignation}
              onChange={e => setSpocDesignation(e.target.value)}
              placeholder="e.g. General Secretary / President"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              <Phone size={12} className="inline mr-1" /> Contact Phone Number <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <div className="flex gap-2">
              <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={orgPhone}
                onChange={e => setOrgPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              Office Address <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              required
              value={orgAddress}
              onChange={e => setOrgAddress(e.target.value)}
              placeholder="e.g. Community Center, Sector 4, Harmu Housing Colony"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>District</label>
              <input
                value={orgDistrict}
                onChange={e => setOrgDistrict(e.target.value)}
                placeholder="e.g. Ranchi"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Block</label>
              <input
                value={orgBlock}
                onChange={e => setOrgBlock(e.target.value)}
                placeholder="e.g. Ranchi Sadar"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Panchayat / Area</label>
            <input
              value={orgArea}
              onChange={e => setOrgArea(e.target.value)}
              placeholder="e.g. Harmu Ward 26"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
            {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Setup")}
          </Btn>
        </form>
      );
    }
    
    // Default (Citizen)
    return (
      <form onSubmit={handleProfileSubmit}>
        <div className="p-2.5 rounded-xl flex items-center gap-2 mb-4" style={{ background: "var(--success-bg)" }}>
          <CheckCircle size={16} color="var(--success)" />
          <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
            Authenticated: {email}
          </span>
        </div>

        <h2 className="font-bold mb-4 text-base" style={{ color: "var(--text)" }}>
          <UserCheck size={16} className="inline mr-1" /> Profile Setup
        </h2>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            {t("profile.name")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <input
            required
            value={citName}
            onChange={e => setCitName(e.target.value)}
            onFocus={() => setActiveField("name")}
            placeholder="e.g. Ramesh Kumar"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
            <Phone size={12} className="inline mr-1" /> {t("auth.mobile")} <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <div className="flex gap-2">
            <div className="px-3 py-2.5 rounded-xl text-sm font-medium border"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={citPhone}
              onChange={e => setCitPhone(e.target.value)}
              placeholder="98765 43210"
              onFocus={() => setActiveField("phone")}
              className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              {t("profile.gender")}
            </label>
            <select
              value={citGender}
              onChange={e => setCitGender(e.target.value)}
              onFocus={() => setActiveField("gender")}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
              {t("profile.dob")}
            </label>
            <input
              type="date"
              value={citDob}
              onChange={e => setCitDob(e.target.value)}
              onFocus={() => setActiveField("dob")}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </div>
        <div className="mb-3">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--text)" }}>
            <MapPin size={12} /> {t("profile.address")} <span style={{ color: "var(--error)" }}>*</span>
          </p>
          <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--border)" }}>
            <div className="relative">
              <input
                value={citHouse}
                onChange={e => setCitHouse(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.housenumber") || "House / Flat No."}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={citCity}
                onChange={e => setCitCity(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.city") || "City / Village"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <input
                required
                value={citDistrict}
                onChange={e => setCitDistrict(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder="District (e.g. Ranchi)"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={citPincode}
                onChange={e => setCitPincode(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.pincode") || "Pincode"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <input
                value={citLandmark}
                onChange={e => setCitLandmark(e.target.value)}
                onFocus={() => setActiveField("address")}
                placeholder={t("profile.landmark") || "Landmark"}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </div>
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
        <Btn type="submit" disabled={loading} className="w-full cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <ChevronRight size={16} />}>
          {loading ? "Saving Profile..." : (t("profile.getstarted") || "Complete Profile")}
        </Btn>
      </form>
    );
  };

  const formCard = (
    <Card className="p-6">
      {step === "email" && (
        <EmailPasswordAuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authMode={authMode}
          setAuthMode={setAuthMode}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          errorMsg={errorMsg}
          onSubmit={handleAuthSubmit}
          emailPlaceholder={
            profileType === "panchayat" ? "panchayat.bokaro@jharkhand.gov.in" :
            profileType === "localorg" ? "contact@rwa-association.org" :
            "citizen.jharkhand@gmail.com"
          }
          emailLabel={t("auth.email")}
          emailHint="Enter your email and a password to authenticate"
        />
      )}
      {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}
      {step === "profile" && ProfileForm()}
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader onBack={() => {
        if (step === "profile" || step === "verify") setStep("email");
        else onBack();
      }} />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {profileType === "citizen" ? (
          <div className="w-full max-w-md lg:max-w-4xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            {/* Mitra Full Body Guidance with Speech Bubble Box on Side */}
            <div className="w-full max-w-md lg:w-96 shrink-0 flex justify-center">
              <MitraAssistant
                size="full"
                variant="guide"
                mitraHeight="h-72 sm:h-80"
                message={getCitizenMitraMessage()}
                subMessage={step === "email" ? "Enter your email & password to sign in or create an account" : undefined}
              />
            </div>

            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                  style={{ background: "var(--navy)" }}>{icon}</div>
                <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>{title}</h1>
              </div>
              {formCard}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                style={{ background: "var(--navy)" }}>{icon}</div>
              <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>{title}</h1>
            </div>
            {formCard}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CITIZEN LOGIN ─────────────────────────────────────────────────────────────
function CitizenLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen
      title={t("victim.citizen")}
      icon={<User size={28} color="var(--amber)" />}
      onSuccess={() => onNav("citizen-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}

// ─── PANCHAYAT LOGIN ──────────────────────────────────────────────────────────
function PanchayatLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen profileType="panchayat"
      title={t("victim.panchayat")}
      icon={<Building2 size={28} color="var(--amber)" />}
      onSuccess={() => onNav("panchayat-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}

// ─── LOCAL ORG (VICTIM) LOGIN ─────────────────────────────────────────────────
function OrgVictimLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <OTPLoginScreen profileType="localorg"
      title={t("victim.localorg")}
      icon={<Users size={28} color="var(--amber)" />}
      onSuccess={() => onNav("org-victim-dashboard")}
      onBack={() => onNav("victim-select")}
    />
  );
}


// ─── CITIZEN DASHBOARD ────────────────────────────────────────────────────────
function CitizenDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("citizen");
  const mitraGreeting = profile.name
    ? t("mitra.dash.greeting").replace("{name}", profile.name)
    : t("mitra.dash.greeting.generic");
  const statuses = [
    { icon: <SendHorizontal size={20} />, val: "3", key: "cit.submitted", color: "#1D4ED8" },
    { icon: <Clock size={20} />, val: "2", key: "cit.underreview", color: "var(--warning)" },
    { icon: <Activity size={20} />, val: "1", key: "cit.inprogress", color: "var(--green)" },
    { icon: <CheckCircle size={20} />, val: "1", key: "cit.resolved", color: "var(--success)" },
  ];
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="citizen" screen="citizen-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{t("cit.namaste")}</p>
            <h1 className="text-xl font-black text-white">{profile.name ? `${profile.name} Ji` : "Welcome"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Compact Mitra Greeting */}
        <div className="mb-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
          <MitraAssistant
            size="compact"
            variant="compact"
            message={mitraGreeting}
            subMessage={t("mitra.dash.hint")}
            badgeText="Mitra • आपकी डिजिटल सहायक"
            
          />
        </div>

        {/* Primary CTA */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("cit.report")}</div>
            <div className="font-medium text-sm opacity-75">समस्या रिपोर्ट करें</div>
          </div>
          <FileText size={36} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.key} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t(s.key)}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <MapPin size={22} />, key: "cit.track", screen: "tracking" as Screen, color: "var(--navy)" },
            { icon: <Map size={22} />, key: "cit.nearby", screen: "problems-near-me" as Screen, color: "var(--green)" },
            { icon: <Users size={22} />, key: "cit.foranother", screen: "report-for-someone" as Screen, color: "#7C3AED" },
            { icon: <HelpCircle size={22} />, key: "nav.help", screen: "notifications" as Screen, color: "#B45309" },
          ].map(a => (
            <button key={a.key} onClick={() => onNav(a.screen)}
              className="p-4 rounded-xl border-2 text-left transition-all card-hover active:scale-95"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `color-mix(in srgb, ${a.color} 10%, transparent)`, color: a.color }}>
                {a.icon}
              </div>
              <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t(a.key)}</div>
            </button>
          ))}
        </div>

        {/* Recent */}
        <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>{t("cit.myrecent")}</h2>
        {[
          { title: "Handpump kharab hai", loc: "Bakri Bazar", status: "in-progress", id: "JH-WTR-1024" },
          { title: "Road potholes near school", loc: "Kanke Chowk", status: "under-review", id: "JH-RD-982" },
        ].map(p => (
          <Card key={p.id} className="p-4 mb-3" onClick={() => onNav("tracking")}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <MapPin size={11} /> {p.loc}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={p.status} />
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </Card>
        ))}
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

// ─── PANCHAYAT DASHBOARD ──────────────────────────────────────────────────────
function PanchayatDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("panchayat");
  const statuses = [
    { label: "Total Problems", val: "34", color: "var(--navy)", icon: <Layers size={18} /> },
    { label: "Under Review", val: "8", color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: "12", color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: "14", color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="panchayat" screen="panchayat-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Mukhiya / Sarpanch</p>
            <h1 className="text-xl font-black text-white">{profile.name || "Panchayat Dashboard"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("panch.report")}</div>
            <div className="font-medium text-sm opacity-75">पंचायत की ओर से नई समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid (Citizen Style 2x2) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.label} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>



        {/* Recent Problems in Panchayat */}
        <div>
          <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Problems in My Panchayat</h2>
          {[
            { title: "Handpump kharab — Ward 3", sub: "Bakri Bazar", status: "under-review", id: "JH-WTR-1024" },
            { title: "Road damaged near school", sub: "Kanke Chowk", status: "in-progress", id: "JH-RD-982" },
            { title: "Street lights not working", sub: "Lalgutwa", status: "submitted", id: "JH-EL-456" },
          ].map(p => (
            <Card key={p.id} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {p.sub}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

function OrgVictimDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("localorg");
  const statuses = [
    { label: "Total Reported", val: "12", color: "var(--navy)", icon: <FileText size={18} /> },
    { label: "Pending Review", val: "2", color: "var(--warning)", icon: <Clock size={18} /> },
    { label: "In Progress", val: "3", color: "var(--green)", icon: <Activity size={18} /> },
    { label: "Resolved", val: "7", color: "var(--success)", icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role="localorg" screen="org-victim-dashboard" onNav={onNav} />

      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Local Organisation (RWA)</p>
            <h1 className="text-xl font-black text-white">{profile.name || "Organisation Dashboard"}</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {profile.detail || "Your verified profile"}
            </p>
          </div>
          <button onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <Bell size={18} color="white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
          </button>
        </div>

        {/* Primary CTA (Citizen Dashboard Style) */}
        <button onClick={() => onNav("report-step1")}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 active:scale-95 transition-all shadow-md"
          style={{ background: "var(--amber)", color: "var(--navy)" }}>
          <div>
            <div className="font-black text-lg leading-tight">{t("localorg.submit")}</div>
            <div className="font-medium text-sm opacity-75">सामुदायिक समस्या दर्ज करें</div>
          </div>
          <FileText size={34} />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Status grid (Citizen Style 2x2) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {statuses.map(s => (
            <Card key={s.label} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>



        {/* Recent Community Problems */}
        <div>
          <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recent Community Problems</h2>
          {[
            { title: "Garbage accumulation near community park", sub: "Kanke Ward 4", status: "in-progress", id: "JH-SAN-712" },
            { title: "Drainage overflow during monsoon", sub: "Kanke Main Rd", status: "under-review", id: "JH-DRN-389" },
            { title: "Street light pole damaged", sub: "Sector 2 Block B", status: "resolved", id: "JH-EL-204" },
          ].map(p => (
            <Card key={p.id} className="p-4 mb-3 cursor-pointer card-hover" onClick={() => onNav("tracking")}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {p.sub}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{p.id}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

function OrgSolverLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form State
  const [orgName, setOrgName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocPhone, setSpocPhone] = useState("");
  const [domain, setDomain] = useState("Community Development & Healthcare");
  const [address, setAddress] = useState("");

  const finishVerifiedAuthentication = async () => {
    await syncAuth("ORGANIZATION", lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onNav("org-solver-dashboard"); } catch { /* New profile. */ }
    setStep("profile");
  };
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) { if (authMode === "signup") await sendEmailVerification(user); setStep("verify"); return; }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("OrgSolver Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If this is your first time, click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please sign in instead.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid organisation email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !spocName.trim() || !address.trim() || !isValidMobile(spocPhone)) {
      setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await saveOrgProfile({
        organizationName: orgName,
        registrationNumber: regNum,
        spocName,
        spocContact: spocPhone,
        domain,
        registeredAddress: address,
      });
      onNav("org-solver-dashboard");
    } catch (err: any) {
      console.error("Org Profile Save Error:", err);
      setErrorMsg(err.message || "Failed to save organisation profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader 
        onBack={() => {
          if (step === "profile" || step === "verify") setStep("email");
          else onNav("solver-select");
        }} 
        onNav={onNav} 
      />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
              style={{ background: "var(--navy)" }}>
              <Briefcase size={24} color="var(--amber)" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
              {step === "email" ? t("org.verify_email_title") : t("org.profile_setup")}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {step === "email" ? "Professional Entity Email Authentication" : "Professional Entity Onboarding"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--navy)" }} />
            <div className="flex-1 h-1.5 rounded-full" style={{ background: step === "profile" ? "var(--navy)" : "var(--border)" }} />
          </div>

          <Card className="p-6">
            {step === "email" && (
              <EmailPasswordAuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                authMode={authMode}
                setAuthMode={setAuthMode}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={handleAuthSubmit}
                emailPlaceholder="e.g. contact@ranchitrust.org"
                emailLabel="Organisation Official Email"
                emailHint="Enter your registered NGO / non-profit / organisation email address."
              />
            )}
            {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}

            {step === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <div className="p-2.5 rounded-xl flex items-center gap-2" style={{ background: "var(--success-bg)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                    Authenticated: {email}
                  </span>
                </div>

                <h2 className="font-bold mb-2 text-base" style={{ color: "var(--text)" }}>
                  <Building2 size={16} className="inline mr-1" /> Organisation Profile
                </h2>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Organisation Name <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="e.g. Ranchi Development Trust"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registration Number (e.g., Darpan ID)</label>
                  <input
                    value={regNum}
                    onChange={e => setRegNum(e.target.value)}
                    placeholder="e.g. JH/2021/012948"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>SPOC Name <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={spocName}
                    onChange={e => setSpocName(e.target.value)}
                    placeholder="Single Point of Contact name"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>
                    <Phone size={12} className="inline mr-1" /> SPOC Contact Number <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2 rounded-xl text-sm font-medium border"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={spocPhone}
                      onChange={e => setSpocPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Domain <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="e.g. Education, Healthcare, Water Management, Rural Development..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Registered Office Address <span style={{ color: "var(--error)" }}>*</span></label>
                  <input
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Full registered office address"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                {errorMsg && (
                  <div className="p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}
                <Btn type="submit" disabled={loading} className="w-full mt-2 cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>
                  {loading ? "Saving Profile..." : "Complete Registration"}
                </Btn>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── ORG SOLVER DASHBOARD ─────────────────────────────────────────────────────
function OrgSolverDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("org-solver");
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="org-solver" screen="org-solver-dashboard" onNav={onNav} />
      <div className="px-4 pt-5 pb-4" style={{ background: "var(--nav-bg)" }}>
        <h1 className="text-xl font-black text-white">{t("org.dashboard")}</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{profile.name || "Organisation"} {profile.detail ? `- ${profile.detail}` : `- ${t("org.subtitle")}`}</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Layers size={18} />, label: t("org.recommended"), value: "6", color: "var(--amber)", screen: "uni-dashboard" as Screen },
            { icon: <Briefcase size={18} />, label: t("org.collabs"), value: "3", color: "var(--green)", screen: "project-lifecycle" as Screen },
            { icon: <CheckCircle size={18} />, label: t("org.completed"), value: "8", color: "var(--success)", screen: "" as Screen },
            { icon: <Users size={18} />, label: t("org.reach"), value: "12K", color: "var(--navy)", screen: "" as Screen },
          ].map(k => (
            <div key={k.label} onClick={() => k.screen ? onNav(k.screen) : null} className={k.screen ? "cursor-pointer active:scale-95 transition-all" : ""}>
              <KPICard icon={k.icon} label={k.label} value={k.value} color={k.color} />
            </div>
          ))}
        </div>
        
        {/* Core Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNav("uni-dashboard")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--navy)", color: "white" }}>
            <Search size={16} /> {t("org.find_problems")}
          </button>
          <button onClick={() => onNav("partnership-form")} className="p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all card-hover" style={{ background: "var(--green)", color: "white" }}>
            <SendHorizontal size={16} /> {t("org.support")}
          </button>
        </div>

        {/* Top Recommended Challenges */}
        <h3 className="font-bold text-sm mt-6 mb-2" style={{ color: "var(--text)" }}>{t("org.recommended")}</h3>
        <div className="space-y-3">
          <Card className="p-4 cursor-pointer card-hover" onClick={() => onNav("uni-challenge-detail")}>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>Handpump Broken — Ward 3</h4>
                 <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> Kanke, Ranchi</p>
               </div>
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Under Review</span>
             </div>
             <p className="text-xs font-semibold" style={{ color: "var(--navy)" }}>Match Score: 92%</p>
          </Card>
          <Card className="p-4 cursor-pointer card-hover" onClick={() => onNav("uni-challenge-detail")}>
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>Village Water Quality Issue</h4>
                 <p className="text-xs" style={{ color: "var(--text-muted)" }}><MapPin size={10} className="inline mr-1"/> Gumla</p>
               </div>
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--error-bg)", color: "var(--error)" }}>High Priority</span>
             </div>
             <p className="text-xs font-semibold" style={{ color: "var(--navy)" }}>Match Score: 88%</p>
          </Card>
        </div>

        {/* Profile */}
        <Card className="p-4 mt-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{t("org.expertise")}</h3>
            <button className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "var(--amber)" }}>
              <Edit2 size={12} /> Update Profile
            </button>
          </div>
          
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>DOMAIN / SECTOR:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Education", "Healthcare", "Rural Development"].map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}>{t}</span>
            ))}
          </div>

          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>EXPERTISE:</p>
          <div className="flex flex-wrap gap-2">
            {["Community Mobilisation", "Water Management", "Sanitation", "NGO Network", "Field Implementation"].map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ background: "#EFF6FF", color: "var(--navy)" }}>{t}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── UNI / INDUSTRY LOGINS ────────────────────────────────────────────────────
function UniLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form State
  const [uniName, setUniName] = useState("");
  const [aisheCode, setAisheCode] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocPhone, setSpocPhone] = useState("");
  const [uniAddress, setUniAddress] = useState("");
  const [expertise, setExpertise] = useState("Civil Engineering, IoT, Water Management");

  const finishVerifiedAuthentication = async () => {
    await syncAuth("UNIVERSITY", lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onNav("uni-dashboard"); } catch { /* New profile. */ }
    setStep("profile");
  };
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) { if (authMode === "signup") await sendEmailVerification(user); setStep("verify"); return; }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("Uni Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If new, please click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This institutional email is already registered. Please sign in.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniName.trim() || !spocName.trim() || !uniAddress.trim() || !isValidMobile(spocPhone)) {
      setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await saveUniProfile({
        universityName: uniName,
        aisheCode,
        spocName,
        spocNumber: spocPhone,
        officialEmail: email,
        institutionalAddress: uniAddress,
        domainExpertise: expertise,
      });
      onNav("uni-dashboard");
    } catch (err: any) {
      console.error("Uni Profile Save Error:", err);
      setErrorMsg(err.message || "Failed to save university profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader 
        onBack={() => {
          if (step === "profile" || step === "verify") setStep("email");
          else onNav("solver-select");
        }} 
        onNav={onNav} 
      />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
              style={{ background: "var(--navy)" }}>
              <GraduationCap size={24} color="var(--amber)" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
              {step === "email" ? t("uni.verify_email_title") : t("uni.profile_setup")}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {step === "email" ? "Professional Institutional Email Authentication" : "Professional & Academic Institution Registration"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--navy)" }} />
            <div className="flex-1 h-1.5 rounded-full" style={{ background: step === "profile" ? "var(--navy)" : "var(--border)" }} />
          </div>

          <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {step === "email" && (
              <EmailPasswordAuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                authMode={authMode}
                setAuthMode={setAuthMode}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={handleAuthSubmit}
                emailPlaceholder="e.g. registrar@bitmesra.ac.in"
                emailLabel="Institutional Official Email"
                emailHint="Please enter your official university / college email address."
              />
            )}
            {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}

            {step === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <div className="p-2.5 rounded-xl flex items-center gap-2" style={{ background: "var(--success-bg)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                    Authenticated: {email}
                  </span>
                </div>

                <h2 className="font-bold mb-2 text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <GraduationCap size={18} style={{ color: "var(--navy)" }} /> Institution Profile
                </h2>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    University / Institute Name <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={uniName}
                    onChange={e => setUniName(e.target.value)}
                    placeholder="e.g. BIT Mesra"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    AISHE Code (Optional)
                  </label>
                  <input
                    value={aisheCode}
                    onChange={e => setAisheCode(e.target.value)}
                    placeholder="e.g. U-0294"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    SPOC Name <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={spocName}
                    onChange={e => setSpocName(e.target.value)}
                    placeholder="Single Point of Contact / Dean R&D name"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    <Phone size={12} className="inline mr-1" /> SPOC Contact Number <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2 rounded-xl text-sm font-medium border"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={spocPhone}
                      onChange={e => setSpocPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    University Address <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={uniAddress}
                    onChange={e => setUniAddress(e.target.value)}
                    placeholder="Full institutional campus address"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Expertise Areas <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={expertise}
                    onChange={e => setExpertise(e.target.value)}
                    placeholder="e.g. Civil Engineering, Water Management, IoT, Agriculture..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                {errorMsg && (
                  <div className="p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}
                <Btn type="submit" disabled={loading} className="w-full mt-3 py-3 cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>
                  {loading ? "Saving Profile..." : "Register & Continue"}
                </Btn>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustryLoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, lang } = useApp();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form State
  const [indName, setIndName] = useState("");
  const [spocName, setSpocName] = useState("");
  const [spocPhone, setSpocPhone] = useState("");
  const [indType, setIndType] = useState("IoT & Hardware");
  const [indAddress, setIndAddress] = useState("");
  const [expertise, setExpertise] = useState("IoT, AgriTech, Manufacturing");
  const [csrBudget, setCsrBudget] = useState("500000");

  const finishVerifiedAuthentication = async () => {
    await syncAuth("INDUSTRY", lang);
    try { const pRes = await getProfileMe(); if (pRes?.profile) return onNav("industry-dashboard"); } catch { /* New profile. */ }
    setStep("profile");
  };
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Firebase user is unavailable.");
      if (!user.emailVerified) { if (authMode === "signup") await sendEmailVerification(user); setStep("verify"); return; }
      await finishVerifiedAuthentication();
    } catch (err: any) {
      console.error("Industry Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. If new, please click 'Create Account'.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This corporate email is already registered. Please sign in.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indName.trim() || !spocName.trim() || !indAddress.trim() || !isValidMobile(spocPhone)) {
      setErrorMsg("Fill all required fields and enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await saveIndustryProfile({
        industryName: indName,
        industryType: indType,
        spocName,
        phoneNumber: spocPhone,
        officialEmail: email,
        companyAddress: indAddress,
        domainExpertise: expertise,
        csrBudgetAvailable: csrBudget ? Number(csrBudget) : undefined,
      });
      onNav("industry-dashboard");
    } catch (err: any) {
      console.error("Industry Profile Save Error:", err);
      setErrorMsg(err.message || "Failed to save industry profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Logo at Top-Left Corner */}
      <SimpleNavHeader 
        onBack={() => {
          if (step === "profile" || step === "verify") setStep("email");
          else onNav("solver-select");
        }} 
        onNav={onNav} 
      />

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
              style={{ background: "var(--navy)" }}>
              <Factory size={24} color="var(--amber)" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
              {step === "email" ? t("ind.verify_email_title") : t("ind.profile_setup")}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {step === "email" ? "Corporate Partner Email Authentication" : "Professional Industry Partner Onboarding"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--navy)" }} />
            <div className="flex-1 h-1.5 rounded-full" style={{ background: step === "profile" ? "var(--navy)" : "var(--border)" }} />
          </div>

          <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {step === "email" && (
              <EmailPasswordAuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                authMode={authMode}
                setAuthMode={setAuthMode}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={handleAuthSubmit}
                emailPlaceholder="e.g. contact@techgrow.com"
                emailLabel={t("ind.official_email") || "Official Corporate Email"}
                emailHint="Please enter your official corporate/organization email."
              />
            )}
            {step === "verify" && <EmailVerificationGate email={email} onVerified={finishVerifiedAuthentication} onBack={() => setStep("email")} />}

            {step === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <div className="p-2.5 rounded-xl flex items-center gap-2" style={{ background: "var(--success-bg)" }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                    Authenticated: {email}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Industry / Corporate Name <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={indName}
                    onChange={e => setIndName(e.target.value)}
                    placeholder="e.g. TechGrow Solutions Pvt. Ltd."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Industry Category / Type
                  </label>
                  <input
                    value={indType}
                    onChange={e => setIndType(e.target.value)}
                    placeholder="e.g. IoT, AgriTech, Manufacturing..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    SPOC Name <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={spocName}
                    onChange={e => setSpocName(e.target.value)}
                    placeholder="Single Point of Contact name"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    <Phone size={12} className="inline mr-1" /> SPOC Contact Number <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2 rounded-xl text-sm font-medium border"
                      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>+91</div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={spocPhone}
                      onChange={e => setSpocPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Company Address <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={indAddress}
                    onChange={e => setIndAddress(e.target.value)}
                    placeholder="Registered corporate address"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    Expertise Areas <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <input
                    required
                    value={expertise}
                    onChange={e => setExpertise(e.target.value)}
                    placeholder="e.g. IoT, AgriTech, Water Technology, Hardware..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                    CSR / Innovation Budget Available (₹)
                  </label>
                  <input
                    type="number"
                    value={csrBudget}
                    onChange={e => setCsrBudget(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}

                <Btn type="submit" disabled={loading} className="w-full mt-2 py-3 cursor-pointer" icon={loading ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}>
                  {loading ? "Saving Profile..." : "Register & Enter"}
                </Btn>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REPORT STEP 1 ────────────────────────────────────────────────────────────
function ReportStep1Screen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const { report, setReport } = useApp();
  const desc = report.description;
  const setDesc = (description: string) => setReport(current => ({ ...current, description }));
  const [mode, setMode] = useState<"none" | "voice" | "text">(() => report.files.some(file => file.type.startsWith("audio/")) ? "voice" : "none");
  const selCat = report.category || null;
  const setSelCat = (category: string | null) => setReport(current => ({ ...current, category: category || "", categoryId: category ? String(cats.findIndex(item => item.label === category) + 1) : "" }));
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const recordedAudio = report.files.find(file => file.type.startsWith("audio/"));
  const recording = useVoiceRecording((file, duration) => {
    setReport(current => {
      const retained = current.files.map((item, index) => ({ file: item, preview: current.previews[index] }))
        .filter(item => !item.file.type.startsWith("audio/"));
      return {
        ...current, evidence: "Voice recording", audioDurationSeconds: duration,
        files: [...retained.map(item => item.file), file],
        previews: [...retained.map(item => item.preview), ""],
      };
    });
  });
  const listening = recording.status === "recording";
  const recordingError = recording.error;
  const recordingSeconds = recording.seconds;
  const stopRecording = recording.stop;
  const startRecording = () => {
    if (!recordedAudio && report.files.length >= 10) return;
    return recording.start();
  };
  const addMedia = (files: FileList | null, evidence: string) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, Math.max(0, 10 - report.files.length));
    const previews = selected.map(file => URL.createObjectURL(file));
    setReport(current => ({ ...current, evidence, files: [...current.files, ...selected], previews: [...current.previews, ...previews] }));
  };

  const cats = [
    { icon: <Wheat size={18} />, label: "Agriculture" },
    { icon: <Droplets size={18} />, label: "Water" },
    { icon: <Stethoscope size={18} />, label: "Healthcare" },
    { icon: <School size={18} />, label: "Education" },
    { icon: <Navigation size={18} />, label: "Roads" },
    { icon: <Trash2 size={18} />, label: "Sanitation" },
    { icon: <Leaf size={18} />, label: "Environment" },
    { icon: <Zap size={18} />, label: "Electricity" },
    { icon: <Building size={18} />, label: "Public Services" },
    { icon: <Layers size={18} />, label: "Other" },
  ];

  const StepDots = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: s === 1 ? "var(--amber)" : "rgba(255,255,255,0.2)",
              color: s === 1 ? "var(--navy)" : "rgba(255,255,255,0.5)"
            }}>{s}</div>
          {s < 3 && <div className="w-5 h-0.5" style={{ background: "rgba(255,255,255,0.2)" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 px-4 py-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => onNav(getHomeDashboard(role))} className="flex items-center gap-1 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <ArrowLeft size={15} /> {t("btn.back")}
          </button>
          <StepDots />
          <div className="w-14" />
        </div>
        <h1 className="text-xl font-black text-white">{t("rep.step1.title")}</h1>
      </div>

      <div className="px-4 py-5">
        {/* Mitra Compact Banner (Image 2 style) - ONLY for Individual Citizen */}
        {role === "citizen" && (
          <div className="mb-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
            <MitraAssistant
              size="compact"
              variant="compact"
              message={listening ? t("mitra.rep.step1.listening") : t("mitra.rep.step1")}
              subMessage={listening ? "बोलना जारी रखें..." : "Tap mic to speak or select category below"}
            />
          </div>
        )}

        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
          {t("rep.step1.category")}
        </h2>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {cats.map(c => (
            <button key={c.label} onClick={() => setSelCat(selCat === c.label ? null : c.label)}
              className="flex flex-col items-center p-2 rounded-xl border-2 transition-all active:scale-95"
              style={{
                borderColor: selCat === c.label ? "var(--green)" : "var(--border)",
                background: selCat === c.label ? "var(--success-bg)" : "var(--card)",
                color: selCat === c.label ? "var(--green)" : "var(--text-muted)"
              }}>
              {c.icon}
              <span className="text-xs mt-1 text-center leading-tight"
                style={{ fontSize: "9px", color: "var(--text)" }}>{c.label}</span>
            </button>
          ))}
        </div>

        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
          {t("rep.step1.describe")} <span style={{ color: "var(--error)" }}>*</span>
        </h2>
        <div className="flex gap-3 mb-4">
          <button onClick={() => {
            if (listening) stopRecording();
            else { setMode("voice"); void startRecording(); }
          }}
            disabled={recording.status === "requesting" || recording.status === "processing"}
            className="flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all active:scale-95"
            style={{
              borderColor: mode === "voice" ? "var(--green)" : "var(--border)",
              background: mode === "voice" ? "var(--success-bg)" : "var(--card)"
            }}>
            <Mic size={28} color={mode === "voice" ? "var(--green)" : "var(--text-muted)"} />
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t("rep.step1.voice")}</span>
          </button>
          <button disabled={recording.busy} onClick={() => setMode(mode === "text" ? "none" : "text")}
            className="flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all active:scale-95"
            style={{
              borderColor: mode === "text" ? "var(--navy)" : "var(--border)",
              background: mode === "text" ? "#EFF6FF" : "var(--card)"
            }}>
            <Keyboard size={28} color={mode === "text" ? "var(--navy)" : "var(--text-muted)"} />
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t("rep.step1.type")}</span>
          </button>
        </div>

        {mode === "voice" && (
          <div className="p-5 rounded-xl border-2 mb-4 text-center"
            style={{ borderColor: "var(--green)", background: "var(--success-bg)" }}>
            {recording.status === "requesting" || recording.status === "processing" ? (
              <p role="status" className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                <Loader className="animate-spin" size={20} />
                {recording.status === "requesting" ? "Waiting for microphone permission…" : "Preparing recording for playback…"}
              </p>
            ) : !listening ? (
              <>
                <button onClick={() => void startRecording()}
                  aria-label={recordedAudio ? "Record again" : "Start recording"}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all active:scale-95"
                  style={{ background: "var(--green)" }}>
                  <Mic size={30} color="white" />
                </button>
                <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>{recordedAudio ? "Record again" : t("rep.step1.tap_to_speak")}</p>
                {recordedAudio && <RecordedAudioPlayer file={recordedAudio} />}
                {!recordedAudio && report.files.length >= 10 && <p className="text-xs mt-2">A report can contain up to 10 attachments.</p>}
                {recordingError && <p className="text-xs mt-3" style={{ color: "var(--error)" }}>{recordingError}</p>}
              </>
            ) : (
              <>
                <div className="relative inline-flex mb-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "var(--green)" }}>
                    <MicOff size={28} color="white" />
                  </div>
                  <div className="absolute inset-0 rounded-full pulse-ring border-2"
                    style={{ borderColor: "var(--green)" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>{t("rep.step1.listening_text")}</p>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")} • Your voice is being recorded
                </p>
                <button onClick={stopRecording}
                  className="mt-3 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--error)" }}>
                  Stop & Save Recording
                </button>
              </>
            )}
          </div>
        )}

        {mode === "text" && (
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
            placeholder="Apni samasya yahan likhein… / Type your problem here…"
            className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none resize-none mb-4"
            style={{
              borderColor: desc ? "var(--navy)" : "var(--border)",
              background: "var(--input-bg)", color: "var(--text)"
            }} />
        )}

        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>{t("rep.step1.photo")}</h2>
        <div className="grid grid-cols-3 gap-2 mb-6">
          <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={e => addMedia(e.target.files, "Photo upload")} />
          <input ref={videoInput} type="file" accept="video/*" multiple className="hidden" onChange={e => addMedia(e.target.files, "Video upload")} />
          {[
            { icon: <Camera size={22} />, label: "Take Photo" },
            { icon: <Upload size={22} />, label: "Upload Photo" },
            { icon: <Video size={22} />, label: "Upload Video" },
          ].map(b => (
            <button key={b.label} onClick={() => b.label === "Upload Video" ? videoInput.current?.click() : imageInput.current?.click()} className="py-4 rounded-xl border-2 flex flex-col items-center gap-1.5"
              style={{ borderColor: report.evidence === b.label ? "var(--green)" : "var(--border)", background: report.evidence === b.label ? "var(--success-bg)" : "var(--card)", color: "var(--text-muted)" }}>
              {b.icon}
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{b.label}</span>
            </button>
          ))}
        </div>
        {report.files.length > 0 && <div className="grid grid-cols-3 gap-2 mb-6">{report.files.map((file, index) => <div key={`${file.name}-${index}`} className="rounded-xl border p-2 text-center overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {file.type.startsWith("image/") ? <img src={report.previews[index]} alt={file.name} className="w-full h-16 object-cover rounded-lg" /> : file.type.startsWith("audio/") ? <Mic size={22} className="mx-auto" color="var(--green)" /> : <Video size={22} className="mx-auto" color="var(--navy)" />}
          <p className="text-[10px] truncate mt-1" style={{ color: "var(--text-muted)" }}>{file.name}</p>
        </div>)}</div>}

        <Btn onClick={() => onNav("report-step2")} disabled={(!desc.trim() && !recordedAudio) || !selCat || recording.busy} className="w-full py-4 text-base"
          icon={<ArrowRight size={18} />}>
          {t("rep.step1.next")}
        </Btn>
      </div>
    </div>
  );
}

// ─── REPORT STEP 2 ────────────────────────────────────────────────────────────
function ReportStep2Screen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const { report, setReport } = useApp();
  const [method, setMethod] = useState<"none" | "gps" | "map" | "address" | "profile">("none");
  const [addressInput, setAddressInput] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const locationWatchRef = useRef<number | null>(null);
  const locationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopLocationWatch = () => {
    if (locationWatchRef.current !== null) navigator.geolocation.clearWatch(locationWatchRef.current);
    if (locationTimerRef.current !== null) clearTimeout(locationTimerRef.current);
    locationWatchRef.current = null;
    locationTimerRef.current = null;
  };
  useEffect(() => () => stopLocationWatch(), []);

  const saveCoordinates = (latitude: number, longitude: number, locationMethod: string, addressDetails?: any) => {
    setLocationError(null);
    setReport(current => ({ 
      ...current, 
      latitude: latitude.toFixed(6), 
      longitude: longitude.toFixed(6), 
      locationMethod,
      ...(addressDetails || {})
    }));
  };

  const geocodeAddress = async (query: string, methodLabel: string) => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        saveCoordinates(parseFloat(data[0].lat), parseFloat(data[0].lon), methodLabel, { village: query });
      } else {
        setLocationError("Address not found. Please try again or choose on map.");
      }
    } catch (e) {
      setLocationError("Failed to fetch location. Please try again.");
    } finally {
      setIsLocating(false);
    }
  };

  const useProfileLocation = async () => {
    setMethod("profile");
    setIsLocating(true);
    setLocationError(null);
    try {
      const res = await getProfileMe();
      if (res?.profile) {
        const p = res.profile;
        const queryParts = [
          p.house_number, p.landmark, p.city_village, p.district, p.pincode,
          p.office_address, p.villages_covered, p.block, p.panchayat_area,
          p.institutional_address, p.company_address, p.registered_address
        ].filter(Boolean);
        
        if (queryParts.length > 0) {
          const query = queryParts.slice(0, 4).join(", ");
          await geocodeAddress(query, "Profile");
          setReport(current => ({ ...current, district: p.district || current.district, block: p.block || current.block, village: query }));
        } else {
          setLocationError("No saved address found in your profile.");
          setIsLocating(false);
        }
      } else {
        setLocationError("Could not retrieve profile.");
        setIsLocating(false);
      }
    } catch (e) {
      setLocationError("Failed to access saved address.");
      setIsLocating(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser. Please select the point on the map.");
      return;
    }
    if (!window.isSecureContext) {
      setLocationError("Current location requires a secure (HTTPS) connection. Open the app through its HTTPS preview link.");
      return;
    }
    setMethod("gps");
    stopLocationWatch();
    setLocationError(null);
    setIsLocating(true);
    setLocationAccuracy(null);

    let bestAccuracy = Number.POSITIVE_INFINITY;
    locationWatchRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (coords.accuracy < bestAccuracy) {
          bestAccuracy = coords.accuracy;
          saveCoordinates(coords.latitude, coords.longitude, "GPS");
          setLocationAccuracy(coords.accuracy);
        }
        // A reading within 30 metres is sufficiently precise for a problem report.
        if (coords.accuracy <= 30) {
          stopLocationWatch();
          setIsLocating(false);
        }
      },
      (error) => {
        if (error.code === 1) {
          stopLocationWatch();
          setLocationError("Location permission was blocked. Allow precise location for this site, then try again.");
          setIsLocating(false);
        } else if (bestAccuracy === Number.POSITIVE_INFINITY) {
          setLocationError("Searching for a precise GPS signal… Move near a window, or select the point on the map.");
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );

    locationTimerRef.current = setTimeout(() => {
      stopLocationWatch();
      setIsLocating(false);
      if (bestAccuracy === Number.POSITIVE_INFINITY) {
        setLocationError("A precise location could not be detected. Check device location settings or place the pin on the map.");
      } else if (bestAccuracy > 100) {
        setLocationError(`Location is approximate (±${Math.round(bestAccuracy)} m). Drag the pin to the exact place.`);
      }
    }, 35000);
  };


  const StepDots = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: s <= 2 ? "var(--amber)" : "rgba(255,255,255,0.2)",
              color: s <= 2 ? "var(--navy)" : "rgba(255,255,255,0.5)"
            }}>{s === 1 ? <CheckCircle size={12} /> : s}</div>
          {s < 3 && <div className="w-5 h-0.5" style={{ background: s < 2 ? "var(--amber)" : "rgba(255,255,255,0.2)" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 px-4 py-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => onNav("report-step1")} className="flex items-center gap-1 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <ArrowLeft size={15} /> {t("btn.back")}
          </button>
          <StepDots />
          <div className="w-14" />
        </div>
        <h1 className="text-xl font-black text-white">{t("rep.step2.title")}</h1>
      </div>

      <div className="px-4 py-5">
        {role === "citizen" && (
          <div className="mb-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
            <MitraAssistant
              size="compact"
              variant="compact"
              message={t("mitra.rep.step2")}
              subMessage={method === "gps" ? t("loc.confirmed") : undefined}
            />
          </div>
        )}

        <div className="space-y-3 mb-5">
          {[
            { method: "gps" as const, icon: <Navigation size={24} />, label: "Current Location", color: "var(--green)" },
            { method: "address" as const, icon: <Building2 size={24} />, label: "Enter Problem Address", color: "#7C3AED" },
            { method: "profile" as const, icon: <UserCheck size={24} />, label: "Use Saved Address", color: "#F59E0B" },
            { method: "map" as const, icon: <Map size={24} />, label: "Choose on Map", color: "var(--navy)" },
          ].map(opt => (
            <button key={opt.method} onClick={() => {
              setMethod(opt.method);
              if (opt.method === "gps") useCurrentLocation();
              else if (opt.method === "profile") useProfileLocation();
              else { setLocationError(null); setReport(current => ({ ...current, locationMethod: opt.method === "map" ? "Map" : "Address" })); }
            }}
              className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all active:scale-95"
              style={{
                borderColor: method === opt.method ? opt.color : "var(--border)",
                background: method === opt.method ? `color-mix(in srgb, ${opt.color} 8%, var(--card))` : "var(--card)"
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${opt.color} 12%, transparent)`, color: opt.color }}>
                {opt.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{opt.label}</div>
              </div>
              {method === opt.method && <CheckCircle size={20} color={opt.color} />}
            </button>
          ))}
        </div>

        {method === "gps" && (
          <Card className="p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              {report.latitude && report.longitude ? <CheckCircle size={18} color="var(--success)" /> : <Navigation size={18} color="var(--amber)" />}
              <div>
                <div className="text-sm font-semibold" style={{ color: report.latitude && report.longitude ? "var(--success)" : "var(--text)" }}>{report.latitude && report.longitude ? t("loc.detected") : "Detecting your location…"}</div>
                <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Your browser location is used only for this report.</div>
              </div>
            </div>
            <LocationPickerMap latitude={report.latitude} longitude={report.longitude} onLocationChange={(lat, lng) => { stopLocationWatch(); setIsLocating(false); setLocationAccuracy(null); saveCoordinates(lat, lng, "Map"); }} onUseCurrentLocation={useCurrentLocation} isLocating={isLocating} locationError={locationError} accuracy={locationAccuracy} className="w-full max-w-2xl aspect-square mx-auto" />
          </Card>
        )}

        {method === "address" && (
          <Card className="p-4 mb-5">
            <div className="mb-3">
               <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Problem Address</label>
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. MG Road, Ranchi"
                    value={addressInput}
                    onChange={e => setAddressInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <Btn 
                    onClick={() => geocodeAddress(addressInput, "Address")} 
                    disabled={!addressInput || isLocating}
                    className="px-4"
                  >
                    {isLocating ? <RefreshCw size={16} className="animate-spin" /> : "Search"}
                  </Btn>
               </div>
            </div>
            {report.latitude && report.longitude && (
              <LocationPickerMap latitude={report.latitude} longitude={report.longitude} onLocationChange={(lat, lng) => saveCoordinates(lat, lng, "Address")} onUseCurrentLocation={useCurrentLocation} isLocating={isLocating} locationError={locationError} height="190px" />
            )}
            {locationError && !report.latitude && (
              <div className="text-red-500 text-xs mt-2">{locationError}</div>
            )}
          </Card>
        )}

        {method === "profile" && (
          <Card className="p-4 mb-5">
            <div className="mb-3 text-sm font-medium" style={{ color: "var(--text)" }}>
              {isLocating ? "Fetching and geocoding your saved profile address..." : (report.latitude && report.longitude ? "Profile address geocoded successfully. You can adjust the pin." : "")}
            </div>
            {report.latitude && report.longitude && (
              <LocationPickerMap latitude={report.latitude} longitude={report.longitude} onLocationChange={(lat, lng) => saveCoordinates(lat, lng, "Profile")} onUseCurrentLocation={useCurrentLocation} isLocating={isLocating} locationError={locationError} height="190px" />
            )}
            {locationError && !report.latitude && (
              <div className="text-red-500 text-xs mt-2">{locationError}</div>
            )}
          </Card>
        )}

        {method === "map" && (
          <Card className="p-4 mb-5">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              <Map size={14} className="inline mr-1" /> {t("rep.step2.map_hint")}
            </p>
            <LocationPickerMap latitude={report.latitude} longitude={report.longitude} onLocationChange={(lat, lng) => { stopLocationWatch(); setIsLocating(false); setLocationAccuracy(null); saveCoordinates(lat, lng, "Map"); }} onUseCurrentLocation={useCurrentLocation} isLocating={isLocating} locationError={locationError} accuracy={locationAccuracy} className="w-full max-w-2xl aspect-square mx-auto" />
          </Card>
        )}

        {method !== "none" && (
          <Btn onClick={() => onNav("report-step3")} disabled={!report.latitude || !report.longitude} className="w-full py-4 text-base"
            icon={<ArrowRight size={18} />}>
            {t("rep.step2.confirm")}
          </Btn>
        )}
      </div>
    </div>
  );
}

// ─── REPORT STEP 3 ────────────────────────────────────────────────────────────
function ReportStep3Screen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const { report } = useApp();
  const recordedAudio = report.files.find(file => file.type.startsWith("audio/"));
  const StepDots = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--amber)", color: "var(--navy)" }}>
            {s < 3 ? <CheckCircle size={12} /> : "3"}
          </div>
          {s < 3 && <div className="w-5 h-0.5" style={{ background: "var(--amber)" }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 px-4 py-4" style={{ background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => onNav("report-step2")} className="flex items-center gap-1 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <ArrowLeft size={15} /> {t("btn.back")}
          </button>
          <StepDots />
          <div className="w-14" />
        </div>
        <h1 className="text-xl font-black text-white">{t("rep.step3.title")}</h1>
      </div>

      <div className="px-4 py-5">
        {/* Mitra Compact Banner (Image 2 style) - ONLY for Individual Citizen */}
        {role === "citizen" && (
          <div className="mb-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
            <MitraAssistant
              size="compact"
              variant="compact"
              message={t("mitra.rep.step3")}
              subMessage="कृपया अपनी समस्या का विवरण जांचें और जमा करें"
            />
          </div>
        )}

        <Card className="p-4 mb-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <ClipboardList size={16} /> {t("rep.step3.summary")}
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
              <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <MessageSquare size={11} /> {t("rep.step3.desc_label")}
              </p>
              {report.description.trim() && (
                <p className="text-sm" style={{ color: "var(--text)" }}>{report.description}</p>
              )}
              {recordedAudio && (
                <div className="mt-3 p-3 sm:p-4 rounded-xl border" style={{ background: "var(--success-bg)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2" style={{ color: "var(--green)" }}>
                    <Mic size={18} />
                    <span className="text-sm font-semibold">{t("rep.step1.voice")}</span>
                    {report.audioDurationSeconds > 0 && (
                      <span className="ml-auto text-xs font-mono tabular-nums">
                        {Math.floor(report.audioDurationSeconds / 60)}:{String(report.audioDurationSeconds % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <RecordedAudioPlayer file={recordedAudio} />
                </div>
              )}
            </div>
            <div className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
              <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <MapPin size={11} /> {t("rep.step3.loc_label")}
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map location selected"}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "var(--success-bg)" }}>
                <Droplets size={16} color="var(--green)" className="mx-auto mb-1" />
                <p className="text-xs font-bold" style={{ color: "var(--green)" }}>{report.category}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl text-center" style={{ background: "var(--warning-bg)" }}>
                {recordedAudio && report.files.length === 1
                  ? <Mic size={16} color="var(--warning)" className="mx-auto mb-1" />
                  : <Camera size={16} color="var(--warning)" className="mx-auto mb-1" />}
                <p className="text-xs font-bold" style={{ color: "var(--warning)" }}>{report.evidence || "No evidence added"}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="p-4 rounded-xl border mb-5" style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#1D4ED8" }}>
            <Activity size={13} /> {t("rep.step3.ai_handle")}
          </p>
          {["Categorize and prioritize your problem", "Detect similar reports nearby", "Match with the best university", "Generate a unique Challenge ID"].map(item => (
            <p key={item} className="text-xs flex items-center gap-1.5 mb-1" style={{ color: "#1E40AF" }}>
              <CheckCircle size={11} /> {item}
            </p>
          ))}
        </div>

        <Btn onClick={() => onNav("ai-processing")} className="w-full py-4 text-base mb-3"
          icon={<SendHorizontal size={18} />}>
          {t("rep.submit")}
        </Btn>
        <Btn variant="ghost" onClick={() => onNav("report-step1")} className="w-full"
          icon={<ArrowLeft size={16} />}>
          {t("rep.edit")}
        </Btn>
      </div>
    </div>
  );
}

// ─── AI PROCESSING ────────────────────────────────────────────────────────────
function AIProcessingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [step, setStep] = useState(0);
  const steps = [
    t("ai.processing"),
    "Checking for similar reports…",
    "Detecting category and priority…",
    "Preparing your challenge…",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) { clearInterval(timer); setTimeout(() => onNav("ai-result"), 800); return s; }
        return s + 1;
      });
    }, 750);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--navy-dark)" }}>
      <div className="text-center">
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center p-3 animate-spin [animation-duration:2.5s]"
            style={{ background: "rgba(242,184,75,0.12)", border: "2px solid var(--amber)" }}>
            <NavJharLogo variant="icon" className="w-14 h-14" />
          </div>
          <div className="absolute inset-0 rounded-full pulse-ring"
            style={{ border: "2px solid var(--amber)", opacity: 0.4 }} />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">{t("ai.processing")}</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>AI is understanding your problem</p>
        <div className="w-full max-w-xs">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  background: i < step ? "var(--green)" : i === step ? "var(--amber)" : "rgba(255,255,255,0.1)",
                }}>
                {i < step ? <CheckCircle size={14} color="white" /> : i === step ? <Loader size={14} color="var(--navy)" /> : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>○</span>}
              </div>
              <span className="text-sm text-left"
                style={{ color: i <= step ? "white" : "rgba(255,255,255,0.3)" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI RESULT ────────────────────────────────────────────────────────────────
function AIResultScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const { report, setReport } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitReport = async () => {
    setSubmitting(true); setSubmitError("");
    try {
      const data = new FormData();
      data.append("categoryId", report.categoryId);
      data.append("categoryName", report.category);
      const submittedDescription = report.description.trim() || "Problem details are attached as a voice recording.";
      data.append("title", report.description.trim().slice(0, 100) || "Voice-recorded problem report");
      data.append("description", submittedDescription);
      data.append("district", report.district || "Ranchi");
      data.append("block", report.block || "Kanke");
      data.append("panchayatWard", report.panchayat);
      data.append("landmark", report.village);
      data.append("siteAddress", [report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map-selected location");
      if (report.latitude && report.longitude) {
        data.append("latitude", report.latitude);
        data.append("longitude", report.longitude);
      }
      report.files.forEach(file => data.append("media", file));
      if (report.audioDurationSeconds) data.append("voiceDurationSeconds", String(report.audioDurationSeconds));
      const result = await submitProblem(data);
      setReport(current => ({ ...current, problemCode: result.problem.problem_code }));
      onNav("submit-success");
    } catch (err: any) { setSubmitError(err.message || "Could not submit the report. Please try again."); }
    finally { setSubmitting(false); }
  };
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <div className="px-4 py-5" style={{ background: "var(--nav-bg)" }}>
        <button onClick={() => onNav("report-step3")} className="flex items-center gap-1 text-xs mb-2"
          style={{ color: "rgba(255,255,255,0.6)" }}>
          <ArrowLeft size={13} /> {t("btn.back")}
        </button>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Activity size={20} color="var(--amber)" /> AI Analysis Complete
        </h1>
      </div>
      <div className="px-4 py-5 space-y-4">
        <Card className="p-4">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <CheckCircle size={16} color="var(--success)" /> AI Detection Results
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Layers size={18} color="var(--navy)" />, label: t("ai.category"), val: report.category || "Other", conf: "Selected by you" },
              { icon: <AlertTriangle size={18} color="var(--error)" />, label: t("ai.priority"), val: "HIGH", conf: "87/100" },
              { icon: <RefreshCw size={18} color="var(--warning)" />, label: t("ai.duplicate"), val: "4 Found", conf: "89% similar" },
            ].map(r => (
              <div key={r.label} className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
                <div className="mb-1">{r.icon}</div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.label}</p>
                <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{r.val}</p>
                {r.conf && <p className="text-xs" style={{ color: "var(--green)" }}>{r.conf}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Layers size={16} color="var(--navy)" /> {t("ai.dna")}
          </h3>
          <div className="space-y-2">
            {[
              ["Domain", report.category || "Other"],
              ["Severity", "High — 3+ weeks unresolved"],
              
              ["Required Skills", "Civil + Water Mgmt + IoT"],
              ["Expected Impact", "High — Essential service"],
              ["Location", "Rural — 28 km from Ranchi"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 text-sm">
                <span className="w-32 flex-shrink-0" style={{ color: "var(--text-muted)" }}>{k}</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="p-4 rounded-xl border" style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
          <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--warning)" }}>
            <AlertTriangle size={15} /> 4 Similar Reports Found Nearby
          </p>
          <p className="text-xs" style={{ color: "var(--text)" }}>
            These may describe the same problem and will be reviewed by the government validator.
          </p>
        </div>

        <div className="flex gap-3">
          <Btn onClick={submitReport} disabled={submitting} className="flex-1 py-4 text-base"
            icon={submitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}>
            {submitting ? "Submitting..." : t("rep.confirm")}
          </Btn>
          <Btn variant="ghost" onClick={() => onNav("report-step1")} className="px-4"
            icon={<ArrowLeft size={16} />}>
            {t("rep.edit")}
          </Btn>
        </div>
        {submitError && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{submitError}</p>}
      </div>
    </div>
  );
}

// ─── SUBMIT SUCCESS ────────────────────────────────────────────────────────────
function SubmitSuccessScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const { report } = useApp();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center"
      style={{ background: "var(--bg)" }}>
      {/* Mitra Compact Banner (Image 2 style) - ONLY for Individual Citizen */}
      {role === "citizen" ? (
        <div className="mb-6 w-full max-w-md p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
          <MitraAssistant
            size="compact"
            variant="compact"
            message={t("mitra.rep.success")}
            subMessage={t("success.title")}
          />
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--success-bg)" }}>
            <CheckCircle size={32} color="var(--green)" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{t("success.title")}</h2>
        </div>
      )}
      <Card className="p-5 mb-6 w-full max-w-xs">
        <p className="text-xs font-medium mb-2 flex items-center justify-center gap-1"
          style={{ color: "var(--text-muted)" }}>
          <ClipboardList size={12} /> Challenge ID
        </p>
        <div className="text-3xl font-black font-mono tracking-wide mb-2" style={{ color: "var(--navy)" }}>
          {report.problemCode || "Submitted"}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("success.save_hint")}</p>
        <p className="text-xs mt-3 font-semibold" style={{ color: "var(--text)" }}>{report.category}: {report.description}</p>
      </Card>
      <div className="flex gap-3 w-full max-w-xs">
        <Btn onClick={() => onNav("tracking")} className="flex-1" icon={<MapPin size={16} />}>
          {t("success.trackbtn")}
        </Btn>
        <Btn variant="secondary" onClick={() => onNav(getHomeDashboard(role))} className="flex-1" icon={<Home size={16} />}>
          {t("success.homebtn")}
        </Btn>
      </div>
    </div>
  );
}

// ─── TRACKING ─────────────────────────────────────────────────────────────────
function TrackingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const { report } = useApp();
  const timeline = [
    { label: "Challenge Submitted", sub: "Ram Kumar • Aug 28, 2026", done: true },
    { label: "AI Processed", sub: "Water Mgmt • Priority: 87/100", done: true },
    { label: "Government Verified", sub: "Ranchi District • Aug 30", done: true },
    { label: "University Matched", sub: "BIT Mesra — 92% match", done: true },
    { label: "Institution Assigned", sub: "Assigned to BIT Mesra", done: true },
    { label: "Development", sub: "Working on smart monitoring solution…", active: true },
    { label: "Field Testing", sub: "Expected: Sep 20, 2026", pending: true },
    { label: "Implementation", sub: "Expected: Oct 15, 2026", pending: true },
  ];
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="tracking" onNav={onNav} />
      <div className="px-4 py-5" style={{ background: "var(--nav-bg)" }}>
        <button onClick={() => onNav(getHomeDashboard(role))} className="flex items-center gap-1 text-xs mb-3 transition-all"
          style={{ color: "rgba(255,255,255,0.7)" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-black text-white">{t("track.title")}</h1>
        <div className="mt-2 px-3 py-1 rounded-lg inline-block" style={{ background: "rgba(255,255,255,0.1)" }}>
          <span className="text-xs font-mono text-white">{report.problemCode || "Your submitted challenge"}</span>
        </div>

        {/* Mitra Tracking Guidance - ONLY for Individual Citizen */}
        {role === "citizen" && (
          <div className="mt-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <MitraAssistant
              size="compact"
              variant="compact"
              message={t("mitra.rep.track")}
              badgeText="Mitra • Live Status"
              
            />
          </div>
        )}
      </div>
      <div className="px-4 py-5">
        <Card className="p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{report.description || "Your submitted problem"}</p>
            <StatusBadge status="in-progress" />
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            <MapPin size={11} /> {[report.village, report.panchayat, report.block, report.district].filter(Boolean).join(", ") || "Map-selected location"}
          </p>
          {report.files.length > 0 && <div className="flex gap-2 mt-3 overflow-x-auto">{report.files.map((file, index) => file.type.startsWith("image/") ? <img key={`${file.name}-${index}`} src={report.previews[index]} alt={file.name} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: "var(--border)" }} /> : <div key={`${file.name}-${index}`} className="w-16 h-16 rounded-lg border flex flex-col items-center justify-center text-[9px] p-1" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}><Video size={18} /><span className="truncate w-full text-center">{file.name}</span></div>)}</div>}
          <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--success-bg)" }}>
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--green)" }}>
              <GraduationCap size={13} /> Your {report.category || "selected"} problem is being reviewed.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--success)" }}>
              Your submitted report is safely recorded and will move through review and matching.
            </p>
          </div>
        </Card>

        <h2 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Progress Timeline</h2>
        {timeline.map((item, i) => (
          <div key={i} className="flex gap-4 mb-5">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                style={{
                  background: item.done ? "var(--success)" : item.active ? "var(--amber)" : "var(--border)",
                  color: item.done ? "white" : item.active ? "var(--navy)" : "var(--text-muted)",
                  border: item.active ? "3px solid var(--navy)" : "none"
                }}>
                {item.done ? <CheckCircle size={16} /> : item.active ? <Activity size={14} /> : <Clock size={14} />}
              </div>
              {i < timeline.length - 1 && (
                <div className="w-0.5 h-8 mt-1"
                  style={{ background: item.done ? "var(--success)" : "var(--border)" }} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm"
                style={{ color: item.done ? "var(--text)" : item.active ? "var(--navy)" : "var(--text-muted)" }}>
                {item.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
              {item.active && (
                <div className="flex gap-2 mt-2">
                  <Btn variant="secondary" onClick={() => onNav("feedback")} className="text-xs px-3 py-1.5"
                    icon={<MessageSquare size={12} />}>
                    {t("btn.feedback")}
                  </Btn>
                  <Btn variant="ghost" className="text-xs px-3 py-1.5" icon={<Phone size={12} />}>
                    Contact
                  </Btn>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROBLEMS NEAR ME ─────────────────────────────────────────────────────────
function ProblemsNearMeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const problems = [
    { title: "Broken Handpump", dist: "1.2 km", village: "ABC Village", cat: "Water", status: "under-review" as const },
    { title: "Road potholes near school", dist: "2.4 km", village: "Kanke Chowk", cat: "Roads", status: "submitted" as const },
    { title: "No street lights", dist: "3.1 km", village: "Lalgutwa", cat: "Electricity", status: "in-progress" as const },
    { title: "Open drainage canal", dist: "4.7 km", village: "Namkum", cat: "Sanitation", status: "resolved" as const },
  ];
  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="problems-near-me" onNav={onNav} />
      <div className="px-4 py-5" style={{ background: "var(--nav-bg)" }}>
        <button onClick={() => onNav(getHomeDashboard(role))} className="flex items-center gap-1 text-xs mb-3 transition-all"
          style={{ color: "rgba(255,255,255,0.7)" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Map size={20} color="var(--amber)" /> {t("cit.nearby")}
        </h1>
      </div>
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden map-placeholder h-48 relative">
        {[{ top: "30%", left: "40%" }, { top: "55%", left: "65%" }, { top: "25%", left: "70%" }].map((p, i) => (
          <div key={i} className="absolute z-10" style={{ top: p.top, left: p.left }}>
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2"
              style={{ borderColor: "var(--navy)" }}>
              <MapPin size={16} color="var(--error)" />
            </div>
          </div>
        ))}
        <div className="absolute top-2 right-2 z-10 bg-white rounded-lg px-2 py-1 text-xs font-semibold shadow"
          style={{ color: "var(--navy)" }}>
          <Navigation size={11} className="inline mr-1" /> You are here
        </div>
      </div>
      <div className="px-4 mt-4 flex items-center justify-between mb-3">
        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>4 problems found nearby</p>
        <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--navy)" }}>
          <Filter size={13} /> Filter
        </button>
      </div>
      <div className="px-4 space-y-3">
        {problems.map((p, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.title}</p>
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <MapPin size={11} /> {p.village} • {p.dist} away • {p.cat}
                </p>
                <div className="mt-2"><StatusBadge status={p.status} /></div>
              </div>
              <Btn variant="secondary" onClick={() => onNav("submit-success")}
                className="ml-3 text-xs px-3 py-1.5 flex-shrink-0">
                Same Problem?
              </Btn>
            </div>
          </Card>
        ))}
      </div>
      <MobileNav onNav={onNav} />
    </div>
  );
}

// ─── REPORT FOR SOMEONE ───────────────────────────────────────────────────────
function ReportForSomeoneScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t, role } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const opts = [
    { icon: <User size={24} />, label: "Myself", sub: "Apni samasya" },
    { icon: <Users size={24} />, label: "Another Person", sub: "Kisi aur ki samasya" },
    { icon: <Building2 size={24} />, label: "Community", sub: "Gaon ki samasya" },
    { icon: <Building size={24} />, label: "Panchayat / Local Body", sub: "Sarkari samasya" },
  ];
  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--bg)" }}>
      <button onClick={() => onNav(getHomeDashboard(role))} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={15} /> {t("btn.back")}
      </button>
      <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>Who are you reporting for?</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>किसके लिए रिपोर्ट कर रहे हैं?</p>
      <div className="space-y-3 mb-6">
        {opts.map(o => (
          <button key={o.label} onClick={() => setSel(o.label)}
            className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all active:scale-95"
            style={{
              borderColor: sel === o.label ? "var(--green)" : "var(--border)",
              background: sel === o.label ? "var(--success-bg)" : "var(--card)"
            }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: sel === o.label ? "var(--success-bg)" : "var(--bg)", color: "var(--green)" }}>
              {o.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold" style={{ color: "var(--text)" }}>{o.label}</div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{o.sub}</div>
            </div>
            {sel === o.label && <CheckCircle size={20} color="var(--green)" />}
          </button>
        ))}
      </div>
      {sel && <Btn onClick={() => onNav("report-step1")} className="w-full py-4 text-base" icon={<ArrowRight size={18} />}>
        Continue
      </Btn>}
    </div>
  );
}

// ─── UNIVERSITY DASHBOARD ─────────────────────────────────────────────────────
function UniDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("university");
  const challenges = [
    { title: "Village Irrigation Canal Leakage", loc: "Kanke, Ranchi", pri: 87, match: 92, pop: 500, cat: "Water", status: "new" as const },
    { title: "School roof needs repair", loc: "Namkum, Ranchi", pri: 72, match: 86, pop: 320, cat: "Education", status: "matched" as const },
    { title: "Primary health centre closed", loc: "Ratu, Ranchi", pri: 91, match: 79, pop: 1200, cat: "Healthcare", status: "new" as const },
    { title: "Solar-powered street lighting", loc: "Ormanjhi, Ranchi", pri: 65, match: 88, pop: 450, cat: "Energy", status: "validated" as const },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <GraduationCap size={22} /> {profile.name || t("uni.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>BIT Mesra, Ranchi — Innovation Partner</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Demo Data</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "New Challenges", value: "8", color: "var(--amber)" },
            { icon: <CheckCircle size={18} />, label: "Accepted", value: "14", color: "var(--green)" },
            { icon: <Activity size={18} />, label: "Active Projects", value: "11", color: "var(--navy)" },
            { icon: <ThumbsUp size={18} />, label: "Completed", value: "23", color: "var(--success)" },
            { icon: <AlertTriangle size={18} />, label: "At Risk", value: "2", color: "var(--error)" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title}</h3>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {c.loc}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{c.cat}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                  <Users size={10} className="inline mr-0.5" />{c.pop.toLocaleString()} affected
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Priority</div>
                  <PriorityBar score={c.pri} />
                </div>
                <div className="text-right">
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>AI Match</div>
                  <div className="font-black text-xl" style={{ color: "var(--success)" }}>{c.match}%</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn onClick={() => onNav("uni-challenge-detail")} variant="ghost" className="flex-1 text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => onNav("team-formation")} className="flex-1 text-xs"
                  icon={<CheckCircle size={13} />}>{t("btn.accept")}</Btn>
                <Btn variant="danger" className="text-xs px-2" icon={<XCircle size={13} />}></Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── UNI CHALLENGE DETAIL ─────────────────────────────────────────────────────
function UniChallengeDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Village Irrigation Canal Leakage</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 • Kanke, Ranchi • Aug 28, 2026</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>Problem Description</h3>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                The main irrigation canal serving Bakri Bazar and surrounding villages has developed multiple
                leak points. Approximately 40% of water is lost, severely impacting ~500 farmers across 6 villages.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <Layers size={15} /> Challenge DNA
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[["Domain", "Water / Agriculture"], ["Severity", "High"],  ["Skills", "Civil + IoT"], ["Impact", "High"], ["Deadline", "Sep 30, 2026"]].map(([k, v]) => (
                  <div key={k} className="p-2 rounded-xl" style={{ background: "var(--bg)" }}>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{k}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{v}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Recommended Industry Partners</h3>
              {[
                { name: "AquaSense IoT Solutions", match: 89, type: "IoT / Technology" },
                { name: "Jharkhand Infrastructure Ltd.", match: 82, type: "Civil Construction" },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.type}</p>
                  </div>
                  <span className="font-black text-sm" style={{ color: "var(--green)" }}>{p.match}%</span>
                </div>
              ))}
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>AI Match Score</h3>
              <ProgressRing value={92} size={90} />
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--success-bg)" }}>
                <CheckCircle size={18} color="var(--success)" />
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--success)" }}>Verified & Approved</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ranchi Collectorate • Aug 30</p>
                </div>
              </div>
            </Card>
            <Btn onClick={() => onNav("team-formation")} className="w-full" icon={<CheckCircle size={16} />}>
              {t("uni.accept")}
            </Btn>
            <Btn variant="secondary" onClick={() => onNav("team-formation")} className="w-full" icon={<FileText size={16} />}>
              Project Scoping
            </Btn>
            <Btn variant="ghost" className="w-full" icon={<MessageSquare size={16} />}>
              Contact Government
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT COLLABORATION & SCOPING ──────────────────────────────────────────
function TeamFormationScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("uni-challenge-detail")} className="text-xs flex items-center gap-1 mb-4 transition-all"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <Building2 size={22} /> Project Collaboration & Scoping
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>Project scoping and partner alignment for JH-WTR-1024</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["Civil Engineering", "Environmental Science", "IoT / Sensors", "Data Analytics"].map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: "#EFF6FF", color: "var(--navy)", border: "1px solid #BFDBFE" }}>{s}</span>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Project Scope & Objectives</h3>
              <div className="space-y-2.5 text-xs" style={{ color: "var(--text)" }}>
                <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                  <p className="font-bold mb-0.5" style={{ color: "var(--text)" }}>Phase 1: Field Assessment</p>
                  <p style={{ color: "var(--text-muted)" }}>Identify canal breach points and survey ground flow rates.</p>
                </div>
                <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                  <p className="font-bold mb-0.5" style={{ color: "var(--text)" }}>Phase 2: IoT Sensor Deployment</p>
                  <p style={{ color: "var(--text-muted)" }}>Install smart water level and telemetry sensors along canal route.</p>
                </div>
                <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                  <p className="font-bold mb-0.5" style={{ color: "var(--text)" }}>Phase 3: Civil Restoration</p>
                  <p style={{ color: "var(--text-muted)" }}>Canal lining reinforcement with local administration support.</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Partner</h3>
              <div className="p-3.5 rounded-xl" style={{ background: "var(--success-bg)", border: "1px solid var(--green)" }}>
                <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: "var(--green)" }}>
                  <Factory size={13} /> AquaSense IoT Solutions
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--text)" }}>IoT hardware + field testing support</p>
                <Btn variant="secondary" className="text-xs w-full">Invite Partner</Btn>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Project Summary</h3>
              {[["Lead Institution", "BIT Mesra"], ["Industry Partner", "AquaSense IoT (Pending)"], ["Estimated Timeline", "6 Months"], ["Skills Covered", "4/4"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="font-bold" style={{ color: k === "Skills Covered" ? "var(--success)" : "var(--text)" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={() => onNav("proposal")} className="w-full py-4 text-base" icon={<ArrowRight size={18} />}>
              Write Proposal
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="uni-dashboard" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("team-formation")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <FileText size={22} /> Project Proposal
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 — Village Irrigation Canal Leakage</p>
        <Card className="p-6 space-y-5">
          {[
            { label: "Problem Understanding", val: "The irrigation canal serving 500+ farmers has 40% water loss due to multiple breach points over 3 months." },
            { label: "Proposed Solution", val: "Smart IoT-based leak detection system combined with canal lining reinforcement. Sensors monitor flow rate at key points." },
            { label: "Technology Approach", val: "IoT flow sensors (Arduino + LoRa), cloud dashboard (MQTT/Node.js), GIS mapping, cement canal lining restoration." },
            { label: "Expected Impact", val: "500 farmers, 18 villages, 40% → <10% water loss, ₹8L estimated annual crop savings." },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{f.label}</label>
              <textarea rows={3} defaultValue={f.val}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Estimated Cost (₹)</label>
              <input defaultValue="4,50,000"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Timeline</label>
              <input defaultValue="3 months (Sep–Nov 2026)"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={() => onNav("project-lifecycle")} className="flex-1" icon={<SendHorizontal size={16} />}>
              {t("btn.submit")} Proposal
            </Btn>
            <Btn variant="ghost" className="px-4" icon={<BookOpen size={16} />}>{t("btn.save")}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PROJECT LIFECYCLE ────────────────────────────────────────────────────────
function ProjectLifecycleScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const milestones = [
    { label: "Research & Survey", date: "Sep 1–7", done: true },
    { label: "Prototype Design", date: "Sep 8–15", done: true },
    { label: "Testing & Validation", date: "Sep 16–30", active: true, behind: true },
    { label: "Pilot Implementation", date: "Oct 1–20", pending: true },
    { label: "Full Deployment", date: "Nov 1–15", pending: true },
  ];
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="project-lifecycle" onNav={onNav} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-black" style={{ color: "var(--navy)" }}>Smart Irrigation Monitoring System</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                JH-WTR-1024 • BIT Mesra × AquaSense IoT • Kanke, Ranchi
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status="on-track" />
              <button onClick={() => onNav("project-health")}
                className="text-xs font-semibold mt-2 block hover:underline transition-all"
                style={{ color: "var(--navy)" }}>
                {t("proj.view_progress")} →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[["Progress", "68%"], ["Health Score", "82%"], ["Days Remaining", "47"], ["Phases", "5"]].map(([l, v]) => (
              <div key={l} className="p-3 rounded-xl text-center" style={{ background: "var(--bg)" }}>
                <div className="text-xl font-black" style={{ color: "var(--navy)" }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "var(--text-muted)" }}>{t("proj.progress")}</span>
              <span className="font-bold" style={{ color: "var(--green)" }}>68%</span>
            </div>
            <div className="h-3 rounded-full" style={{ background: "var(--border)" }}>
              <div className="h-3 rounded-full" style={{ width: "68%", background: "var(--green)" }} />
            </div>
          </div>
        </Card>

        {/* Milestone status note without extension button */}
        <div className="p-4 rounded-xl border flex items-start gap-3"
          style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
          <AlertTriangle size={20} color="var(--warning)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--warning)" }}>Testing milestone is behind schedule.</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text)" }}>
              Testing phase is 4 days behind. May affect Pilot Implementation deadline.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Milestones</h3>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: m.done ? "var(--success)" : m.active ? (m.behind ? "var(--warning-bg)" : "var(--amber)") : "var(--border)",
                      color: m.done ? "white" : m.active ? (m.behind ? "var(--warning)" : "var(--navy)") : "var(--text-muted)"
                    }}>
                    {m.done ? <CheckCircle size={16} /> : m.active ? <Activity size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold"
                      style={{ color: m.done ? "var(--text)" : m.active ? (m.behind ? "var(--warning)" : "var(--navy)") : "var(--text-muted)" }}>
                      {m.label}
                      {m.behind && <span className="ml-2 text-xs" style={{ color: "var(--warning)" }}>Behind schedule</span>}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Project Actions</h3>
              <div className="space-y-3">
                <Btn className="w-full" icon={<Activity size={16} />}>{t("proj.update")}</Btn>
                <Btn variant="secondary" className="w-full" onClick={() => onNav("project-health")} icon={<TrendingUp size={16} />}>
                  {t("proj.view_progress")}
                </Btn>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>Implementation Roadmap</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                3 of 5 phases active. Expected completion: Nov 15, 2026.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT HEALTH / PROGRESS ────────────────────────────────────────────────
function ProjectHealthScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const factors = [
    { label: "Milestone Progress", score: 75, icon: <Clock size={16} /> },
    { label: "Deliverables / Completion Status", score: 90, icon: <FileText size={16} /> },
    { label: "Mentor Engagement", score: 88, icon: <User size={16} /> },
    { label: "Testing Progress", score: 55, icon: <Activity size={16} /> },
    { label: "Timeline / Schedule Progress", score: 70, icon: <TrendingUp size={16} /> },
    { label: "Quality & Standards Compliance", score: 80, icon: <CheckCircle size={16} /> },
  ];
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="university" screen="project-lifecycle" onNav={onNav} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("project-lifecycle")} className="text-xs flex items-center gap-1 mb-4 transition-all"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: "var(--navy)" }}>
          <TrendingUp size={22} /> {t("proj.progress_analysis")}
        </h1>
        <Card className="p-6 mb-5 text-center">
          <ProgressRing value={82} size={120} stroke={10} />
          <h2 className="text-2xl font-black mt-4" style={{ color: "var(--success)" }}>82% ON TRACK</h2>
          <StatusBadge status="on-track" />
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Project milestones and technical deliverables are progressing according to the active implementation roadmap.
          </p>
        </Card>
        <Card className="p-5 mb-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Progress Factors Breakdown</h3>
          <div className="space-y-3">
            {factors.map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span style={{ color: "var(--text-muted)", width: 18 }}>{f.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: "var(--text)" }}>{f.label}</span>
                    <span className="font-bold" style={{
                      color: f.score >= 80 ? "var(--success)" : f.score >= 60 ? "var(--warning)" : "var(--error)"
                    }}>{f.score}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-2 rounded-full" style={{
                      width: `${f.score}%`,
                      background: f.score >= 80 ? "var(--success)" : f.score >= 60 ? "var(--warning)" : "var(--error)"
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function IndustryDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const profile = useProfileDisplay("industry");
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
              <Factory size={22} /> {t("ind.dashboard")}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{profile.name || "Industry Partner"}{profile.detail ? ` — ${profile.detail}` : ""}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Bell size={18} />, label: "Recommended Projects", value: "12", color: "var(--amber)" },
            { icon: <Users size={18} />, label: "Active Partnerships", value: "4", color: "var(--green)" },
            { icon: <GraduationCap size={18} />, label: "Mentorship", value: "3", color: "var(--navy)" },
            { icon: <TrendingUp size={18} />, label: "CSR Funding (₹L)", value: "24.5", color: "#7C3AED" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>

        <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Lightbulb size={16} /> Recommended Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Smart Irrigation Monitoring", match: 89, cat: "IoT / Agriculture", uni: "BIT Mesra", reasons: ["IoT requirement", "Agriculture domain", "Prototype support needed"] },
            { title: "Rural Health Diagnostic Kit", match: 84, cat: "Healthcare / IoT", uni: "NIT Jamshedpur", reasons: ["Medical device IoT", "Rural deployment", "CSR opportunity"] },
            { title: "Solar Street Lighting", match: 78, cat: "Energy / Infrastructure", uni: "IIT ISM Dhanbad", reasons: ["Solar technology", "Manufacturing capability", "Scale potential"] },
            { title: "Digital Literacy Kiosk", match: 72, cat: "Education / Tech", uni: "BIT Mesra", reasons: ["Software development", "Rural reach", "Training support"] },
          ].map((p, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.cat} • {p.uni}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl" style={{ color: "var(--success)" }}>{p.match}%</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Match</div>
                </div>
              </div>
              <div className="mb-3 space-y-1">
                {p.reasons.map(r => (
                  <p key={r} className="text-xs flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                    <CheckCircle size={11} /> {r}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Btn onClick={() => onNav("industry-project-detail")} variant="secondary" className="text-xs"
                  icon={<Eye size={13} />}>View</Btn>
                <Btn onClick={() => onNav("partnership-form")} className="text-xs" icon={<Users size={13} />}>Collaborate</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INDUSTRY PROJECT DETAIL ──────────────────────────────────────────────────
function IndustryProjectDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="industry-dashboard" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-dashboard")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black mb-1" style={{ color: "var(--navy)" }}>Smart Irrigation Monitoring System</h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 • BIT Mesra × Ranchi District</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem", c: "40% water leakage in irrigation canal serving 500 farmers across 6 villages." },
              { t: "Solution", c: "IoT-based real-time leak detection with flow sensors + canal lining restoration." },
              { t: "Technology", c: "IoT sensors (Arduino/ESP32 + LoRa), cloud dashboard, GIS mapping, civil restoration." },
              { t: "Expected Impact", c: "500 farmers, 40% → <10% water loss, ₹8L/year savings, replicable across 200+ canals." },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Industry Match</h3>
              <ProgressRing value={89} size={80} color="var(--green)" />
              <div className="mt-3 space-y-2 text-xs text-left">
                {[["Domain Fit", "IoT + Agriculture"], ["Support Type", "Hardware + Tech"], ["Health", "82% ON TRACK"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Btn onClick={() => onNav("partnership-form")} className="w-full" icon={<Users size={16} />}>
              {t("ind.mentorship")}
            </Btn>
            <Btn variant="secondary" className="w-full" icon={<TrendingUp size={16} />}>{t("ind.funding")}</Btn>
            <Btn variant="ghost" className="w-full" icon={<Briefcase size={16} />}>Co-Develop</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PARTNERSHIP FORM ────────────────────────────────────────────────────────
function PartnershipFormScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [supports, setSupports] = useState<string[]>(["Mentorship", "Hardware"]);
  const toggleSupport = (s: string) =>
    setSupports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg)" }}>
      <NavBar role="industry" screen="partnership-form" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("industry-project-detail")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: "var(--navy)" }}>
          <Users size={22} /> Partnership Offer
        </h1>
        <Card className="p-6 space-y-5">
          {[
            { label: "Organisation Name", val: "TechGrow Solutions Pvt. Ltd." },
            { label: "Contact Person", val: "Sanjay Mehta, CTO" },
            { label: "Email", val: "sanjay@techgrow.in" },
            { label: "Expertise Area", val: "IoT Hardware, Embedded Systems, Agriculture Tech" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{f.label}</label>
              <input defaultValue={f.val}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "var(--text)" }}>Support Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["Mentorship", "Funding", "Hardware", "Infrastructure", "Field Testing", "Co-development", "Technology Transfer", "Training"].map(s => (
                <button key={s} onClick={() => toggleSupport(s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border-2 text-left transition-all"
                  style={{
                    borderColor: supports.includes(s) ? "var(--green)" : "var(--border)",
                    background: supports.includes(s) ? "var(--success-bg)" : "var(--card)",
                    color: "var(--text)"
                  }}>
                  {supports.includes(s) ? <CheckCircle size={14} color="var(--green)" /> : <div className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: "var(--border)" }} />}
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Budget (₹)</label>
              <input defaultValue="1,50,000"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Mentor Availability</label>
              <input defaultValue="10 hrs/week"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          <Btn onClick={() => onNav("partnership-success")} className="w-full py-4 text-base"
            icon={<SendHorizontal size={18} />}>
            {t("ind.partner")}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── PARTNERSHIP SUCCESS ──────────────────────────────────────────────────────
function PartnershipSuccessScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--success-bg)" }}>
        <Users size={40} color="var(--success)" />
      </div>
      <h1 className="text-xl font-black mb-2" style={{ color: "var(--success)" }}>Partnership Offer Submitted!</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        TechGrow Solutions' offer has been sent to BIT Mesra. They will confirm within 3 working days.
      </p>
      <div className="flex gap-3">
        <Btn onClick={() => onNav("industry-dashboard")}>Back to Dashboard</Btn>
        <Btn variant="secondary" onClick={() => onNav("project-lifecycle")}>View Project</Btn>
      </div>
    </div>
  );
}

// ─── SOLUTION REPOSITORY ──────────────────────────────────────────────────────
function SolutionRepoScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const solutions = [
    { title: "IoT-Based Irrigation Monitoring", cat: "Water / Agriculture", loc: "Kanke, Ranchi", uni: "BIT Mesra", beneficiaries: "2,500 farmers", status: "deployed" as const },
    { title: "Mobile Health Diagnostic App", cat: "Healthcare", loc: "Dhanbad", uni: "AIIMS Deoghar", beneficiaries: "8,000 residents", status: "deployed" as const },
    { title: "Solar Water Pump Controller", cat: "Water / Energy", loc: "Bokaro", uni: "NIT Jamshedpur", beneficiaries: "1,200 farmers", status: "deployed" as const },
    { title: "Community Waste Segregation", cat: "Sanitation", loc: "Ranchi Urban", uni: "BIT Mesra", beneficiaries: "15,000 residents", status: "in-progress" as const },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="citizen" screen="solution-repo" onNav={onNav} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <BookOpen size={22} /> {t("repo.title")}
        </h1>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Knowledge bank of deployed and reusable solutions for Jharkhand
        </p>
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("repo.search")}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
          </div>
          <Btn variant="ghost" className="text-xs" icon={<Filter size={14} />}>Filter</Btn>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["All", "Water", "Agriculture", "Healthcare", "Education", "Energy", "Sanitation"].map(f => (
            <button key={f}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
              style={{
                background: f === "All" ? "var(--navy)" : "var(--card)",
                color: f === "All" ? "white" : "var(--text-muted)",
                borderColor: "var(--border)"
              }}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solutions.map((s, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{s.title}</h3>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <MapPin size={11} /> {s.loc} • <GraduationCap size={11} /> {s.uni}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{s.cat}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                  style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                  <Users size={10} className="inline mr-0.5" />{s.beneficiaries}
                </span>
              </div>
              <div className="flex gap-2">
                <Btn variant="secondary" onClick={() => onNav("solution-detail")} className="flex-1 text-xs"
                  icon={<Eye size={13} />}>{t("repo.view")}</Btn>
                <Btn onClick={() => onNav("solution-detail")} className="flex-1 text-xs"
                  icon={<RefreshCw size={13} />}>{t("repo.reuse")}</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SOLUTION DETAIL ──────────────────────────────────────────────────────────
function SolutionDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="citizen" screen="solution-repo" onNav={onNav} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => onNav("solution-repo")} className="text-xs flex items-center gap-1 mb-4"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> {t("repo.title")}</button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-black" style={{ color: "var(--navy)" }}>IoT-Based Irrigation Monitoring</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>BIT Mesra × AquaSense IoT × Ranchi District</p>
          </div>
          <StatusBadge status="deployed" />
        </div>

        <div className="p-4 rounded-xl border mb-6 flex items-center gap-3"
          style={{ background: "#EDE9FE", borderColor: "#C4B5FD" }}>
          <RefreshCw size={20} color="#5B21B6" />
          <div>
            <p className="text-sm font-bold" style={{ color: "#5B21B6" }}>
              This solution may be reusable for 4 similar challenges.
            </p>
            <p className="text-xs" style={{ color: "#6D28D9" }}>
              Similar water problems found in Bokaro (2), Giridih (1), Hazaribagh (1).
            </p>
          </div>
          <Btn className="ml-auto text-xs flex-shrink-0" onClick={() => onNav("tracking")}
            icon={<ArrowRight size={13} />}>
            View Status
          </Btn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {[
              { t: "Problem Solved", c: "40% water leakage in main irrigation canal serving 500+ farmers. Persistent for 3 months." },
              { t: "Solution Implemented", c: "IoT flow sensors at 12 strategic points. Cloud dashboard with real-time monitoring. Canal lining restored at 6 breach points." },
              { t: "Technology Used", c: "Arduino Uno + LoRa sensors, MQTT cloud protocol, Node.js dashboard, GPS mapping, Portland cement canal lining." },
              { t: "Deployment Guide", c: "Install sensors at canal entry/exit points. Configure LoRa network. Train local Panchayat maintenance team (4-hour training). Dashboard via mobile app." },
            ].map(s => (
              <Card key={s.t} className="p-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "var(--text)" }}>{s.c}</p>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Impact Summary</h3>
              {[
                { l: "Farmers Benefited", v: "2,500" },
                { l: "Villages Covered", v: "18" },
                { l: "Water Loss Before", v: "40%" },
                { l: "Water Loss After", v: "8%" },
                { l: "Est. Annual Savings", v: "₹8L/year" },
                { l: "Implementation Cost", v: "₹4.5L" },
              ].map(item => (
                <div key={item.l} className="flex justify-between text-sm py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.l}</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{item.v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMPACT DASHBOARD ─────────────────────────────────────────────────────────
function ImpactDashboardScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role="citizen" screen="impact-dashboard" onNav={onNav} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--navy)" }}>
            <TrendingUp size={22} /> Impact Dashboard
          </h1>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Demo Data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Users size={18} />, label: t("impact.people"), value: "2,42,000+", color: "var(--green)" },
            { icon: <Map size={18} />, label: t("impact.villages"), value: "312", color: "var(--navy)" },
            { icon: <Lightbulb size={18} />, label: t("impact.solutions"), value: "312", color: "#7C3AED" },
            { icon: <TrendingUp size={18} />, label: t("impact.savings") + " (₹Cr)", value: "18.4", color: "#B45309" },
          ].map(k => <KPICard key={k.label} {...k} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Before vs. After — Water</h3>
            <div className="space-y-4">
              {[
                { label: "Canal Water Loss", before: 40, after: 8, unit: "%" },
                { label: "Handpump Failures (Unresolved)", before: 85, after: 12, unit: "%" },
                { label: "Irrigation Coverage", before: 45, after: 78, unit: "% of farmland" },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text)" }}>{m.label}</p>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--text-muted)" }}>Before</span>
                        <span className="font-bold" style={{ color: "var(--error)" }}>{m.before}{m.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full" style={{ background: "var(--error-bg)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${m.before}%`, background: "var(--error)" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "var(--text-muted)" }}>After</span>
                        <span className="font-bold" style={{ color: "var(--success)" }}>{m.after}{m.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full" style={{ background: "var(--success-bg)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${m.after}%`, background: "var(--success)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Star size={15} /> Citizen Feedback
            </h3>
            <div className="space-y-3">
              {[
                { name: "Ram Kumar, Bakri Bazar", rating: 5, text: "The handpump is fixed. Now we get water in the morning. Very happy!" },
                { name: "Sunita Devi, Lalgutwa", rating: 4, text: "Canal water is much better now. My crop is growing well this season." },
                { name: "Mukesh Oraon, Kanke", rating: 5, text: "The app is easy to use. Problem was fixed within 2 months!" },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{r.name}</span>
                    <div className="flex">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} size={11} fill="var(--amber)" color="var(--amber)" />)}
                    </div>
                  </div>
                  <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Leaf size={15} color="var(--green)" /> Environmental Impact
            </h3>
            <div className="space-y-3">
              {[
                { icon: <Droplets size={18} />, val: "48 Cr litres/year", label: "Water Conserved" },
                { icon: <Leaf size={18} />, val: "1,240 tonnes/year", label: "CO₂ Avoided" },
                { icon: <Zap size={18} />, val: "18,000 kWh/month", label: "Solar Generated" },
                { icon: <Leaf size={18} />, val: "12,400+", label: "Trees Planted" },
              ].map(e => (
                <div key={e.label} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--success-bg)" }}>
                  <span style={{ color: "var(--green)" }}>{e.icon}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--green)" }}>{e.val}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{e.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

// ─── PROFILE SCREEN (Shifted from Profile Setup to Dashboard Bottom Right) ────
function ProfileScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t, lang } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Role-specific initial state
  const [citizenData, setCitizenData] = useState({
    name: "", gender: "", dob: "", phone: "", houseNumber: "",
    landmark: "", city: "", pincode: "", district: "", state: "",
  });

  const [panchayatData, setPanchayatData] = useState({
    panchayatName: "", mukhiyaName: "", officeAddress: "", phone: "",
    district: "", block: "", villages: "",
  });

  const [localOrgData, setLocalOrgData] = useState({
    orgName: "", spocName: "", designation: "", officeAddress: "",
    district: "", block: "", area: "", phone: "",
  });

  const [uniData, setUniData] = useState({
    uniName: "", spocName: "", address: "", expertise: "", phone: "",
  });

  const [industryData, setIndustryData] = useState({
    industryName: "", spocName: "", category: "", address: "",
    expertise: "", email: "",
  });

  const [orgSolverData, setOrgSolverData] = useState({
    orgName: "", spocName: "", focus: "", address: "", phone: "",
  });

  useEffect(() => {
    let active = true;
    getProfileMe().then(({ profile, user }) => {
      if (!active || !profile) return;
      if (role === "citizen") setCitizenData(v => ({ ...v, name: profile.name || "", gender: profile.gender || "", dob: profile.date_of_birth?.slice(0, 10) || "", phone: user?.phone_number || v.phone, houseNumber: profile.house_number || "", landmark: profile.landmark || "", city: profile.city_village || "", pincode: profile.pincode || "", district: profile.district || "" }));
      else if (role === "panchayat") setPanchayatData({ panchayatName: profile.panchayat_name || "", mukhiyaName: profile.sarpanch_mukhiya_name || "", officeAddress: profile.office_address || "", phone: profile.official_phone || "", district: profile.district || "", block: profile.block || "", villages: profile.villages_covered || "" });
      else if (role === "localorg" || role === "org-victim") setLocalOrgData({ orgName: profile.organization_name || "", spocName: profile.spoc_name || "", designation: profile.designation || "", officeAddress: profile.office_address || "", district: profile.district || "", block: profile.block || "", area: profile.panchayat_area || "", phone: profile.organization_contact || "" });
      else if (role === "university") setUniData({ uniName: profile.university_name || "", spocName: profile.spoc_name || "", address: profile.institutional_address || "", expertise: profile.domain_expertise || "", phone: profile.spoc_number || "" });
      else if (role === "industry") setIndustryData({ industryName: profile.industry_name || "", spocName: profile.spoc_name || "", category: profile.industry_type || "", address: profile.company_address || "", expertise: profile.domain_expertise || "", email: profile.official_email || user?.email || "" });
      else if (role === "org-solver" || role === "org") setOrgSolverData({ orgName: profile.organization_name || "", spocName: profile.spoc_name || "", focus: profile.domain_expertise || profile.domain || "", address: profile.registered_address || "", phone: profile.spoc_contact || "" });
    }).catch(() => {});
    return () => { active = false; };
  }, [role]);

  const handleSave = async () => {
    setSaveError("");
    try {
      if (role === "citizen") await saveCitizenProfile({ name: citizenData.name, phoneNumber: citizenData.phone, gender: citizenData.gender, dateOfBirth: citizenData.dob, houseNumber: citizenData.houseNumber, cityVillage: citizenData.city, pincode: citizenData.pincode, landmark: citizenData.landmark, district: citizenData.district, residentialAddress: `${citizenData.houseNumber}, ${citizenData.landmark}, ${citizenData.city}, ${citizenData.district}, ${citizenData.pincode}` });
      else if (role === "panchayat") await savePanchayatProfile({ panchayatName: panchayatData.panchayatName, sarpanchName: panchayatData.mukhiyaName, district: panchayatData.district, block: panchayatData.block, villagesCovered: panchayatData.villages, officeAddress: panchayatData.officeAddress, officialPhone: panchayatData.phone });
      else if (role === "localorg" || role === "org-victim") await saveLocalOrgProfile({ organizationName: localOrgData.orgName, spocName: localOrgData.spocName, designation: localOrgData.designation, district: localOrgData.district, block: localOrgData.block, panchayatArea: localOrgData.area, officeAddress: localOrgData.officeAddress, organizationContact: localOrgData.phone });
      else if (role === "university") await saveUniProfile({ universityName: uniData.uniName, spocName: uniData.spocName, spocNumber: uniData.phone, institutionalAddress: uniData.address, domainExpertise: uniData.expertise });
      else if (role === "industry") await saveIndustryProfile({ industryName: industryData.industryName, industryType: industryData.category, spocName: industryData.spocName, officialEmail: industryData.email, companyAddress: industryData.address, domainExpertise: industryData.expertise });
      else await saveOrgProfile({ organizationName: orgSolverData.orgName, spocName: orgSolverData.spocName, spocContact: orgSolverData.phone, domainExpertise: orgSolverData.focus, registeredAddress: orgSolverData.address });
      setIsEditing(false); setShowSavedToast(true); setTimeout(() => setShowSavedToast(false), 3500);
    } catch (err: any) { setSaveError(err.message || "Could not save profile."); }
  };

  const getRoleHeader = () => {
    if (role === "panchayat") {
      return {
        title: panchayatData.panchayatName,
        sub: "Panchayati Raj Institution • Local Body",
        icon: <Building2 size={24} color="var(--green)" />,
        tag: "Verified Local Governance",
      };
    }
    if (role === "localorg" || role === "org-victim") {
      return {
        title: localOrgData.orgName,
        sub: "Local Organisation (RWA) • Community Body",
        icon: <Users size={24} color="var(--green)" />,
        tag: "Verified Resident Welfare Association",
      };
    }
    if (role === "university") {
      return {
        title: uniData.uniName,
        sub: "Higher Education & Research Institution",
        icon: <GraduationCap size={24} color="var(--amber)" />,
        tag: "Academic Partner",
      };
    }
    if (role === "industry") {
      return {
        title: industryData.industryName,
        sub: "Industry & Corporate Innovation Partner",
        icon: <Briefcase size={24} color="var(--amber)" />,
        tag: "Industry Solver",
      };
    }
    if (role === "org-solver" || role === "org") {
      return {
        title: orgSolverData.orgName,
        sub: "Civil Society & Non-Profit Organisation",
        icon: <Building size={24} color="var(--amber)" />,
        tag: "Solution Provider",
      };
    }
    return {
      title: citizenData.name,
      sub: citizenData.phone + " • " + citizenData.city,
      icon: <User size={24} color="var(--green)" />,
      tag: "Verified Citizen (JH-CIT-8821)",
    };
  };

  const headerInfo = getRoleHeader();

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="profile" onNav={onNav} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back navigation */}
        <button onClick={() => onNav(getHomeDashboard(role))}
          className="text-xs flex items-center gap-1 mb-4 transition-all cursor-pointer"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={13} /> Back to Dashboard
        </button>

        {/* Saved feedback banner */}
        {showSavedToast && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-semibold animate-fadeIn">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t("profile.saved")}</span>
          </div>
        )}
        {saveError && <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{saveError}</div>}

        {/* Mitra Compact Guidance Banner (Image 2 style) - ONLY FOR INDIVIDUAL CITIZEN */}
        {role === "citizen" && (
          <div className="mb-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
            <MitraAssistant
              size="compact"
              variant="compact"
              message={t("mitra.profile.view")}
              subMessage="Tap Edit Profile below to update your name, address or contact details."
            />
          </div>
        )}

        {/* Profile Card Header */}
        <Card className="p-5 mb-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--success-bg)", border: "1.5px solid var(--border)" }}>
                {headerInfo.icon}
              </div>
              <div>
                <h1 className="text-lg font-black" style={{ color: "var(--text)" }}>{headerInfo.title}</h1>
                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{headerInfo.sub}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#207244]/10 text-[#207244] dark:text-[#4ade80]">
                  <UserCheck size={12} /> {headerInfo.tag}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              style={{
                background: isEditing ? "var(--green)" : "var(--card)",
                color: isEditing ? "white" : "var(--text)",
                border: "1.5px solid var(--border)",
              }}
            >
              {isEditing ? (
                <><CheckCircle size={14} /> {t("profile.save")}</>
              ) : (
                <><Edit2 size={13} /> {t("profile.edit")}</>
              )}
            </button>
          </div>
        </Card>

        {/* Profile Details Form Content */}
        <Card className="p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-black flex items-center gap-1.5" style={{ color: "var(--text)" }}>
              <UserCheck size={16} color="var(--green)" /> {t("profile.info")}
            </h2>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              {isEditing ? "Editing Mode" : "View Mode"}
            </span>
          </div>

          {/* CITIZEN PROFILE FIELDS */}
          {role === "citizen" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{t("profile.name")}</label>
                  <input
                    disabled={!isEditing}
                    value={citizenData.name}
                    onChange={e => setCitizenData({ ...citizenData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{t("auth.mobile")}</label>
                  <input
                    disabled={!isEditing}
                    value={citizenData.phone}
                    onChange={e => setCitizenData({ ...citizenData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{t("profile.gender")}</label>
                  <select
                    disabled={!isEditing}
                    value={citizenData.gender}
                    onChange={e => setCitizenData({ ...citizenData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{t("profile.dob")}</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={citizenData.dob}
                    onChange={e => setCitizenData({ ...citizenData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: "var(--text)" }}>
                  <MapPin size={13} color="var(--green)" /> {t("profile.address")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l-2" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>{t("profile.housenumber")}</label>
                    <input
                      disabled={!isEditing}
                      value={citizenData.houseNumber}
                      onChange={e => setCitizenData({ ...citizenData, houseNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none disabled:opacity-75"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>{t("profile.landmark")}</label>
                    <input
                      disabled={!isEditing}
                      value={citizenData.landmark}
                      onChange={e => setCitizenData({ ...citizenData, landmark: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none disabled:opacity-75"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>{t("profile.city")}</label>
                    <input
                      disabled={!isEditing}
                      value={citizenData.city}
                      onChange={e => setCitizenData({ ...citizenData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none disabled:opacity-75"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>{t("profile.pincode")}</label>
                    <input
                      disabled={!isEditing}
                      value={citizenData.pincode}
                      onChange={e => setCitizenData({ ...citizenData, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none disabled:opacity-75"
                      style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANCHAYAT PROFILE FIELDS */}
          {role === "panchayat" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Panchayat Name</label>
                <input
                  disabled={!isEditing}
                  value={panchayatData.panchayatName}
                  onChange={e => setPanchayatData({ ...panchayatData, panchayatName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Mukhiya / Sarpanch Name</label>
                  <input
                    disabled={!isEditing}
                    value={panchayatData.mukhiyaName}
                    onChange={e => setPanchayatData({ ...panchayatData, mukhiyaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Official Phone Number</label>
                  <input
                    disabled={!isEditing}
                    value={panchayatData.phone}
                    onChange={e => setPanchayatData({ ...panchayatData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Office Address</label>
                <input
                  disabled={!isEditing}
                  value={panchayatData.officeAddress}
                  onChange={e => setPanchayatData({ ...panchayatData, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>District</label>
                  <input
                    disabled={!isEditing}
                    value={panchayatData.district}
                    onChange={e => setPanchayatData({ ...panchayatData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Block</label>
                  <input
                    disabled={!isEditing}
                    value={panchayatData.block}
                    onChange={e => setPanchayatData({ ...panchayatData, block: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Village(s)</label>
                  <input
                    disabled={!isEditing}
                    value={panchayatData.villages}
                    onChange={e => setPanchayatData({ ...panchayatData, villages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* LOCAL ORGANISATION (RWA) PROFILE FIELDS */}
          {(role === "localorg" || role === "org-victim") && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Organisation Name</label>
                <input
                  disabled={!isEditing}
                  value={localOrgData.orgName}
                  onChange={e => setLocalOrgData({ ...localOrgData, orgName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>SPOC Name</label>
                  <input
                    disabled={!isEditing}
                    value={localOrgData.spocName}
                    onChange={e => setLocalOrgData({ ...localOrgData, spocName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Designation</label>
                  <input
                    disabled={!isEditing}
                    value={localOrgData.designation}
                    onChange={e => setLocalOrgData({ ...localOrgData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Office Address</label>
                <input
                  disabled={!isEditing}
                  value={localOrgData.officeAddress}
                  onChange={e => setLocalOrgData({ ...localOrgData, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>District</label>
                  <input
                    disabled={!isEditing}
                    value={localOrgData.district}
                    onChange={e => setLocalOrgData({ ...localOrgData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Block</label>
                  <input
                    disabled={!isEditing}
                    value={localOrgData.block}
                    onChange={e => setLocalOrgData({ ...localOrgData, block: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Panchayat / Area</label>
                  <input
                    disabled={!isEditing}
                    value={localOrgData.area}
                    onChange={e => setLocalOrgData({ ...localOrgData, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* UNIVERSITY PROFILE FIELDS */}
          {role === "university" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>University / Institute Name</label>
                <input
                  disabled={!isEditing}
                  value={uniData.uniName}
                  onChange={e => setUniData({ ...uniData, uniName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>SPOC Name</label>
                  <input
                    disabled={!isEditing}
                    value={uniData.spocName}
                    onChange={e => setUniData({ ...uniData, spocName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Contact Number</label>
                  <input
                    disabled={!isEditing}
                    value={uniData.phone}
                    onChange={e => setUniData({ ...uniData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Campus Address</label>
                <input
                  disabled={!isEditing}
                  value={uniData.address}
                  onChange={e => setUniData({ ...uniData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Core Expertise Areas</label>
                <input
                  disabled={!isEditing}
                  value={uniData.expertise}
                  onChange={e => setUniData({ ...uniData, expertise: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>
          )}

          {/* INDUSTRY PROFILE FIELDS */}
          {role === "industry" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Industry / Company Name</label>
                <input
                  disabled={!isEditing}
                  value={industryData.industryName}
                  onChange={e => setIndustryData({ ...industryData, industryName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>SPOC Name</label>
                  <input
                    disabled={!isEditing}
                    value={industryData.spocName}
                    onChange={e => setIndustryData({ ...industryData, spocName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Category</label>
                  <input
                    disabled={!isEditing}
                    value={industryData.category}
                    onChange={e => setIndustryData({ ...industryData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Company Address</label>
                <input
                  disabled={!isEditing}
                  value={industryData.address}
                  onChange={e => setIndustryData({ ...industryData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Expertise Areas</label>
                  <input
                    disabled={!isEditing}
                    value={industryData.expertise}
                    onChange={e => setIndustryData({ ...industryData, expertise: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Official Email</label>
                  <input
                    disabled={!isEditing}
                    value={industryData.email}
                    onChange={e => setIndustryData({ ...industryData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ORG SOLVER PROFILE FIELDS */}
          {(role === "org-solver" || role === "org") && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Organisation Name</label>
                <input
                  disabled={!isEditing}
                  value={orgSolverData.orgName}
                  onChange={e => setOrgSolverData({ ...orgSolverData, orgName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>SPOC / Leader Name</label>
                  <input
                    disabled={!isEditing}
                    value={orgSolverData.spocName}
                    onChange={e => setOrgSolverData({ ...orgSolverData, spocName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Contact Phone</label>
                  <input
                    disabled={!isEditing}
                    value={orgSolverData.phone}
                    onChange={e => setOrgSolverData({ ...orgSolverData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                    style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Focus Areas</label>
                <input
                  disabled={!isEditing}
                  value={orgSolverData.focus}
                  onChange={e => setOrgSolverData({ ...orgSolverData, focus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Address</label>
                <input
                  disabled={!isEditing}
                  value={orgSolverData.address}
                  onChange={e => setOrgSolverData({ ...orgSolverData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none disabled:opacity-75"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-5 pt-3 border-t flex gap-2" style={{ borderColor: "var(--border)" }}>
              <Btn onClick={handleSave} className="flex-1" icon={<CheckCircle size={16} />}>
                {t("profile.save")}
              </Btn>
              <Btn variant="secondary" onClick={() => setIsEditing(false)} className="px-4">
                Cancel
              </Btn>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button onClick={() => { signOut(auth).catch(() => {}); onNav("landing"); }}
            className="flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--error)" }}>
            <LogOut size={14} /> {t("nav.logout")}
          </button>
        </div>
      </div>

      <MobileNav onNav={onNav} activeScreen="profile" />
    </div>
  );
}

function NotificationsScreen({ onNav, role }: { onNav: (s: Screen) => void; role: string }) {
  const { t } = useApp();
  const allNotifs = {
    citizen: [
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Challenge Verified", sub: "JH-WTR-1024 verified by Ranchi Collectorate.", time: "2h ago", read: false, screen: "tracking" as Screen },
      { icon: <GraduationCap size={18} color="var(--navy)" />, title: "University Matched", sub: "BIT Mesra accepted your challenge.", time: "1d ago", read: false, screen: "tracking" as Screen },
      { icon: <Building2 size={18} color="var(--green)" />, title: "Project Assigned", sub: "Assigned to BIT Mesra for execution.", time: "2d ago", read: true, screen: "tracking" as Screen },
    ],
    localorg: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "Problem Status Updated", sub: "JH-SAN-712 is now In Progress.", time: "2h ago", read: false, screen: "tracking" as Screen },
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Problem Verified", sub: "JH-DRN-389 verified by administration.", time: "1d ago", read: true, screen: "tracking" as Screen },
    ],
    "org-solver": [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Problem Available", sub: "Community issue matches your domain.", time: "3h ago", read: false, screen: "org-solver-dashboard" as Screen },
    ],

    university: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Challenge Assigned", sub: "Village Irrigation Canal Leakage — High Priority", time: "1h ago", read: false, screen: "uni-challenge-detail" as Screen },
      { icon: <Factory size={18} color="var(--green)" />, title: "Industry Partner Joined", sub: "AquaSense IoT joined your project.", time: "4h ago", read: false, screen: "project-lifecycle" as Screen },
      { icon: <AlertTriangle size={18} color="var(--warning)" />, title: "Testing Milestone Behind", sub: "4 days behind schedule.", time: "1d ago", read: false, screen: "project-health" as Screen },
    ],
    industry: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Project Match", sub: "Smart Irrigation — 89% industry match.", time: "2h ago", read: false, screen: "industry-project-detail" as Screen },
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Partnership Confirmed", sub: "BIT Mesra confirmed your partnership.", time: "1d ago", read: true, screen: "project-lifecycle" as Screen },
    ],
    panchayat: [
      { icon: <Bell size={18} color="var(--amber)" />, title: "New Problem Submitted", sub: "Bakri Bazar citizen reported a water problem.", time: "1h ago", read: false, screen: "panchayat-dashboard" as Screen },
      { icon: <CheckCircle size={18} color="var(--success)" />, title: "Problem Verified", sub: "JH-WTR-1024 verified by government.", time: "2d ago", read: true, screen: "tracking" as Screen },
    ],
  };
  const notifs = allNotifs[role as keyof typeof allNotifs] || allNotifs.citizen;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <NavBar role={role} screen="notifications" onNav={onNav} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => onNav(getHomeDashboard(role))} className="text-xs flex items-center gap-1 mb-4 transition-all"
          style={{ color: "var(--text-muted)" }}><ArrowLeft size={13} /> Back to Dashboard</button>
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "var(--navy)" }}>
          <Bell size={22} /> {t("notif.title")}
        </h1>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          {notifs.filter(n => !n.read).length} {t("notif.unread")}
        </p>
        <div className="space-y-3">
          {notifs.map((n, i) => (
            <Card key={i} className="p-4" onClick={() => onNav(n.screen)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: n.read ? "var(--bg)" : "var(--success-bg)" }}>
                  {n.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)", opacity: n.read ? 0.65 : 1 }}>
                    {n.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{n.sub}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--navy)" }} />}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FEEDBACK ────────────────────────────────────────────────────────────────
function FeedbackScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { t } = useApp();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
        style={{ background: "var(--success-bg)" }}>
        <ThumbsUp size={40} color="var(--success)" />
      </div>
      <h1 className="text-xl font-black mb-2" style={{ color: "var(--success)" }}>{t("feedback.thanks")}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Your feedback has been submitted.</p>
      <Btn onClick={() => onNav("tracking")} icon={<ArrowLeft size={16} />}>Back to Tracking</Btn>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--bg)" }}>
      <button onClick={() => onNav("tracking")} className="flex items-center gap-1.5 text-sm mb-6"
        style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={15} /> {t("btn.back")}
      </button>
      <h1 className="text-xl font-black mb-1 flex items-center gap-2" style={{ color: "var(--navy)" }}>
        <Star size={22} /> {t("feedback.title")}
      </h1>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>JH-WTR-1024 — Handpump kharab hai</p>
      <Card className="p-5 max-w-sm mx-auto">
        <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>
          How satisfied are you with the progress?
        </h3>
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="transition-all hover:scale-110 active:scale-95">
              <Star size={32} fill={s <= rating ? "var(--amber)" : "transparent"}
                color={s <= rating ? "var(--amber)" : "var(--border)"} />
            </button>
          ))}
        </div>
        <textarea rows={4} placeholder="अपनी राय यहाँ लिखें… / Write your feedback here…"
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none mb-4"
          style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--text)" }} />
        <Btn onClick={() => setSubmitted(true)} className="w-full" disabled={rating === 0}
          icon={<SendHorizontal size={16} />}>
          {t("feedback.submit")}
        </Btn>
      </Card>
    </div>
  );
}

// ─── GLOBAL LOADING OVERLAY ───────────────────────────────────────────────────
function NavJharLoadingOverlay({ show }: { show: boolean }) {
  const { dark } = useApp();
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-300"
      style={{
        background: dark ? "rgba(15, 25, 35, 0.85)" : "rgba(247, 249, 251, 0.88)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        className="p-6 sm:p-8 rounded-3xl flex flex-col items-center shadow-2xl border"
        style={{
          background: dark ? "rgba(22, 34, 50, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderColor: dark ? "rgba(255, 255, 255, 0.12)" : "rgba(18, 59, 99, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Continuously Rotating NavJhar Brand Logo */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-35 animate-pulse"
            style={{ background: "radial-gradient(circle, #2E6B4E 0%, #123B63 100%)" }}
          />
          <div className="w-16 h-16 sm:w-20 sm:h-20 animate-spin [animation-duration:1.8s]">
            <NavJharLogo variant="icon" className="w-full h-full" />
          </div>
        </div>

        {/* Loading Label with Bouncing Dots */}
        <div className="mt-4 text-center">
          <div
            className="text-lg font-black tracking-wide flex items-center justify-center gap-0.5"
            style={{ color: "var(--navy)" }}
          >
            <span>Loading</span>
            <span className="inline-flex tracking-widest ml-0.5">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
            </span>
          </div>
          <p className="text-xs font-semibold mt-1" style={{ color: "var(--green)" }}>
            हर समस्या का नया समाधान
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("jsic_lang") as Lang) || "en");
  const [dark, setDark] = useState(() => localStorage.getItem("jsic_dark") === "1");
  const [screen, setScreen] = useState<Screen>("landing");
  const [role, setRole] = useState("citizen");
  const [report, setReport] = useState({ description: "", category: "", categoryId: "", evidence: "", files: [] as File[], previews: [] as string[], audioDurationSeconds: 0, latitude: "", longitude: "", district: "", block: "", panchayat: "", village: "", locationMethod: "", problemCode: "" });
  // On initial website load, show language selection popup, followed immediately by Mitra full-body welcome
  const [showLangModal, setShowLangModal] = useState(true);
  const [showMitraWelcome, setShowMitraWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const t = makeT(lang);

  const setLangAndSave = (l: Lang) => { setLang(l); localStorage.setItem("jsic_lang", l); };
  const setDarkAndSave = (d: boolean) => { setDark(d); localStorage.setItem("jsic_dark", d ? "1" : "0"); };

  const navigate = (s: Screen) => {
    setLoading(true);
    const roleMap: Partial<Record<Screen, string>> = {
      "citizen-login": "citizen", "citizen-dashboard": "citizen",
      "panchayat-login": "panchayat", "panchayat-dashboard": "panchayat",
      "org-victim-login": "localorg", "org-victim-dashboard": "localorg",
      "uni-login": "university", "uni-dashboard": "university",
      "industry-login": "industry", "industry-dashboard": "industry",
      "org-solver-login": "org-solver", "org-solver-dashboard": "org-solver",
    };
    if (roleMap[s]) setRole(roleMap[s]!);
    setTimeout(() => {
      setScreen(s);
      window.scrollTo(0, 0);
      setLoading(false);
    }, 450);
  };

  const props = { onNav: navigate };

  return (
    <Ctx.Provider value={{ lang, setLang: setLangAndSave, dark, setDark: setDarkAndSave, t, role, setRole, report, setReport }}>
      <div className={dark ? "dark" : ""} style={{ minHeight: "100%", background: "var(--bg)", color: "var(--text)" }}>
        {/* Global NavJhar Rotating Loading Overlay */}
        <NavJharLoadingOverlay show={loading || initialLoading} />

        {/* Language modal — blocks entry on first visit */}
        {showLangModal && (
          <LanguageModal onDone={(l) => {
            setLangAndSave(l);
            setShowLangModal(false);
            setShowMitraWelcome(true);
          }} />
        )}

        {/* Mitra Welcome Intro — shown immediately after language selection */}
        {showMitraWelcome && (
          <MitraWelcomeModal onContinue={() => setShowMitraWelcome(false)} />
        )}

        {screen === "landing" && <LandingScreen {...props} />}
        {screen === "victim-select" && <VictimSelectScreen {...props} />}
        {screen === "solver-select" && <SolverSelectScreen {...props} />}
        {screen === "citizen-login" && <CitizenLoginScreen {...props} />}
        {screen === "panchayat-login" && <PanchayatLoginScreen {...props} />}
        {screen === "org-victim-login" && <OrgVictimLoginScreen {...props} />}
        {screen === "panchayat-dashboard" && <PanchayatDashboardScreen {...props} />}
        {screen === "org-victim-dashboard" && <OrgVictimDashboardScreen {...props} />}
        {screen === "org-solver-login" && <OrgSolverLoginScreen {...props} />}
        {screen === "org-solver-dashboard" && <OrgSolverDashboardScreen {...props} />}
        {screen === "uni-login" && <UniLoginScreen {...props} />}
        {screen === "industry-login" && <IndustryLoginScreen {...props} />}
        {screen === "citizen-dashboard" && <CitizenDashboardScreen {...props} />}
        {screen === "report-step1" && <ReportStep1Screen {...props} />}
        {screen === "report-step2" && <ReportStep2Screen {...props} />}
        {screen === "report-step3" && <ReportStep3Screen {...props} />}
        {screen === "ai-processing" && <AIProcessingScreen {...props} />}
        {screen === "ai-result" && <AIResultScreen {...props} />}
        {screen === "submit-success" && <SubmitSuccessScreen {...props} />}
        {screen === "tracking" && <TrackingScreen {...props} />}
        {screen === "problems-near-me" && <ProblemsNearMeScreen {...props} />}
        {screen === "report-for-someone" && <ReportForSomeoneScreen {...props} />}
        {screen === "uni-dashboard" && <UniDashboardScreen {...props} />}
        {screen === "uni-challenge-detail" && <UniChallengeDetailScreen {...props} />}
        {screen === "team-formation" && <TeamFormationScreen {...props} />}
        {screen === "proposal" && <ProposalScreen {...props} />}
        {screen === "project-lifecycle" && <ProjectLifecycleScreen {...props} />}
        {screen === "project-health" && <ProjectHealthScreen {...props} />}
        {screen === "industry-dashboard" && <IndustryDashboardScreen {...props} />}
        {screen === "industry-project-detail" && <IndustryProjectDetailScreen {...props} />}
        {screen === "partnership-form" && <PartnershipFormScreen {...props} />}
        {screen === "partnership-success" && <PartnershipSuccessScreen {...props} />}
        {screen === "solution-repo" && <SolutionRepoScreen {...props} />}
        {screen === "solution-detail" && <SolutionDetailScreen {...props} />}
        {screen === "impact-dashboard" && <ImpactDashboardScreen {...props} />}
        {screen === "notifications" && <NotificationsScreen {...props} role={role} />}
        {screen === "profile" && <ProfileScreen {...props} role={role} />}
        {screen === "feedback" && <FeedbackScreen {...props} />}
      </div>
    </Ctx.Provider>
  );
}
