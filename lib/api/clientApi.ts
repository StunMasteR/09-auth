import { Note } from "@/types/note";
import { api } from "./api";
import { User } from "@/types/user";


export interface FetchResult{
    notes: Note[],
    totalPages: number,
}


export interface FetchParams{
    params: {
        tag?:string
        page?: number,
        search?: string,
        perPage: number,
    }
    headers?: { Cookie:string }
}
interface CreateBody{
    title: string,
    content: string,
    tag:string,
}

export type CheckSessionRequest = {
  success: boolean;
};



export async function fetchNotes(keyWord?: string, page?: number, tag?: string): Promise<FetchResult>{

 tag = tag === "All" ? undefined : tag;

const fetchParams:FetchParams = {
    params: {
    tag:tag,
    page: page,
    search: keyWord,
    perPage: 9, 
  },

}

const fetchResponse = await api.get<FetchResult>('/notes', fetchParams)
return fetchResponse.data;
}

export async function createNote({ title, content, tag }:CreateBody): Promise<Note> {
    const createBody: CreateBody = {
        title: title,
        content: content,
        tag: tag,
    }
    const createResponse = await api.post<Note>('/notes', createBody)
    
    return createResponse.data;
}

export async function deleteNote(id: string):Promise<Note> {
    const deleteResponse = await api.delete<Note>(`/notes/${id}`)
    return deleteResponse.data;
}

export async function fetchNoteById (id: string):Promise<Note> {
    const fetchNoteByIdResponse = await api.get<Note>(`/notes/${id}`)
    return fetchNoteByIdResponse.data;
}

export async function register(email:string, password:string):Promise<User> {
    const registerRep = await api.post<User>('/auth/register', { email, password })
    
    return registerRep.data;
}

export async function login(email:string, password:string):Promise<User> {
    const loginRep = await api.post<User>('/auth/login', { email, password })
    
    return loginRep.data;
}

export async function logout(): Promise<{ message:string }>{
    const logoutRep = await api.post<{ message:string }>('/auth/logout')
    
    return logoutRep.data;
}


export async function checkSession (){
    const checkSessionRep = await api.get<CheckSessionRequest>('/auth/session');
    
  return checkSessionRep.data.success;
};


export async function getUser(): Promise<User>{
    const getUserRep = await api.get<User>('/users/me')

    return getUserRep.data;
}


export async function patchUser(username:string): Promise<User>{
    const patchUserRep = await api.patch<User>('/users/me', {username})

    return patchUserRep.data;
}
