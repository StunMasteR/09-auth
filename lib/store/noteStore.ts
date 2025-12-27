
import { create } from 'zustand';
import { FormValues } from '@/types/form';
import { persist } from 'zustand/middleware';



interface NoteStore{
    draft: FormValues;
    setDraft: (note:FormValues) => void; 
    clearDraft: () => void; 
}

const initialDraft:FormValues = {
    title: '',
    content: '',
    tag: "Todo",
};



export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);