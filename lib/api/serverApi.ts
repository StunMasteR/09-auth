import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";

import { api } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";



const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};



export async function checkSession(): Promise<AxiosResponse<User>> {
  const cookieHeader = await getCookieHeader();

  return api.get<User>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}


export interface FetchNotesResult {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search?: string,
  page?: number,
  tag?: string
): Promise<FetchNotesResult> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<FetchNotesResult>("/notes", {
    params: {
      search,
      page,
      tag: tag === "All" ? undefined : tag,
      perPage: 12,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}
