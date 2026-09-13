import { auth } from "./firebase/config";

// Route browser calls through Vite's /api proxy so the preview iframe can
// reach the local backend without treating its own localhost as the API host.
const API_BASE = "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
  ? {}
  : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "API request failed");
  }

  return data;
}

export async function syncAuth(profileType: string, languageCode: string = "en") {
  return apiFetch("/api/auth/sync", {
    method: "POST",
    body: JSON.stringify({ profileType, languageCode }),
  });
}

export async function getProfileMe() {
  return apiFetch("/api/profile/me");
}

export type GeocodedLocation = {
  latitude: number;
  longitude: number;
  displayName: string;
  address: {
    district?: string;
    block?: string;
    village?: string;
    pincode?: string;
  };
};

export async function geocodeProblemAddress(query: string): Promise<GeocodedLocation> {
  return apiFetch(`/api/geocode?query=${encodeURIComponent(query.trim())}`);
}

export async function analyzeProblemAI(data: { text: string; latitude: string; longitude: string }) {
  return apiFetch("/api/problems/ai-analyze", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function submitProblem(data: FormData) {
  return apiFetch("/api/problems", { method: "POST", body: data });
}

export async function saveCitizenProfile(data: {
  name: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  houseNumber?: string;
  cityVillage?: string;
  pincode?: string;
  landmark?: string;
  district?: string;
  residentialAddress?: string;
}) {
  return apiFetch("/api/profile/citizen", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function savePanchayatProfile(data: {
  panchayatName: string;
  sarpanchName: string;
  district: string;
  block: string;
  villagesCovered?: string;
  officeAddress: string;
  officialPhone?: string;
}) {
  return apiFetch("/api/profile/panchayat", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function saveLocalOrgProfile(data: {
  organizationName: string;
  spocName: string;
  designation?: string;
  district?: string;
  block?: string;
  panchayatArea?: string;
  officeAddress: string;
  organizationContact?: string;
}) {
  return apiFetch("/api/profile/localorg", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function saveOrgProfile(data: {
  organizationName: string;
  registrationNumber?: string;
  spocName: string;
  spocContact?: string;
  domain?: string;
  domainExpertise?: string;
  registeredAddress: string;
}) {
  return apiFetch("/api/profile/organization", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function saveIndustryProfile(data: {
  industryName: string;
  industryType?: string;
  spocName: string;
  designation?: string;
  officialEmail?: string;
  phoneNumber?: string;
  domainExpertise?: string;
  companyAddress: string;
  csrBudgetAvailable?: number | string;
}) {
  return apiFetch("/api/profile/industry", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function saveUniProfile(data: {
  universityName: string;
  aisheCode?: string;
  spocName: string;
  spocNumber?: string;
  officialEmail?: string;
  institutionalAddress: string;
  domainExpertise?: string;
}) {
  return apiFetch("/api/profile/university", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getMyProblems() {
  return apiFetch('/api/problems/my');
}

export async function getRecommendedProblems() {
  return apiFetch('/api/problems/recommended');
}

export async function acceptProblem(problemCode: string) {
  return apiFetch(`/api/problems/${problemCode}/accept`, { method: "PATCH" });
}

export async function submitSolutionAI(problemCode: string, text: string) {
  return apiFetch(`/api/problems/${problemCode}/solutions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
}

export async function markSolved(problemCode: string) {
  return apiFetch(`/api/problems/${problemCode}/mark-solved`, { method: "POST" });
}

export async function checkEmailExists(email: string) {
  const res = await fetch("/api/auth/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to check email");
  }
  return res.json();
}
