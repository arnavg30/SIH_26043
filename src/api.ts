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
