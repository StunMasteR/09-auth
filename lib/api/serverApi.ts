import "server-only";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
}


export async function signInServer(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Sign in failed");
  }

  return res.json();
}

export async function signUpServer(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Sign up failed");
  }

  return res.json();
}


export async function checkSession(
  refreshToken: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Session refresh failed");
  }

  return res.json();
}



export async function getCurrentUserServer(
  accessToken: string
): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}


export async function logoutServer(
  refreshToken: string
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

export const fetchNotesServer = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = await cookies();
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  if (tag && tag !== 'All') params.append("tag", tag);

  const response = await api.get(`/notes?${params.toString()}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};