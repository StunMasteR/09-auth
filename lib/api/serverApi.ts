import { User } from "@/types/user";
import { api } from "./api";
import { cookies } from "next/headers";
import { CheckSessionRequest, FetchParams, FetchResult } from "./clientApi";
import { Note } from "@/types/note";


export const checkSession = async () => {
    const cookieStore = await cookies()
    const checkSessionRep = await api.get<CheckSessionRequest>('/auth/session', {
        headers: {
            Cookie: cookieStore.toString()
        }
    });
    
  return checkSessionRep;
};

export async function getUser(): Promise<User>{
    const cookieStore = await cookies()
    const getUserRep = await api.get<User>('/users/me', {
        headers: {
            Cookie:cookieStore.toString()
        }
    })

    return getUserRep.data;
}

export async function fetchNotes(keyWord?: string, page?: number, tag?: string): Promise<FetchResult>{
const cookieStore = await cookies()
 tag = tag === "All" ? undefined : tag;

const fetchParams:FetchParams = {
    params: {
    tag:tag,
    page: page,
    search: keyWord,
    perPage: 9, 
    },
    headers: {
        Cookie:cookieStore.toString()
    }
}

const fetchResponse = await api.get<FetchResult>('/notes', fetchParams)
return fetchResponse.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const cookieStore = await cookies()
    const fetchNoteByIdResponse = await api.get<Note>(`/notes/${id}`, {
        headers: {
            Cookie:cookieStore.toString()
        }
    })

    return fetchNoteByIdResponse.data;
}
export async function fetchNoteByIdServer(id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
      {
        cache: "no-store",
      }
    );
  
    if (!res.ok) {
      throw new Error("Failed to fetch note");
    }
  
    return res.json();
  }