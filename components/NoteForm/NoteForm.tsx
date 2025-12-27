"use client";
import css from './NoteForm.module.css';
import * as Yup from "yup";
import type { NoteTag } from '../../types/note';
import type { FormValues } from '../../types/form';
import { createNote} from '@/lib/api/clientApi';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '@/lib/store/noteStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FormSchema = Yup.object().shape({
    title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
    content: Yup.string()
    .max(500, "Content of note must contain below 500 symbols"),
    tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
})


export default function NoteForm() {
    const queryClient = useQueryClient();
    const { draft, setDraft, clearDraft } = useNoteStore();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    
    const validateForm = async (values: FormValues) => {
        try {
            await FormSchema.validate(values, { abortEarly: false })
            setErrors({})
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
        const formattedErrors: { [key: string]: string } = {};
        error.inner.forEach((e) => {
          if (e.path) formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      }
            return false;
       }
    }

    const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

    const mutation = useMutation({
    mutationFn:(newNote:FormValues) => createNote(newNote),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
        clearDraft()
        router.back()
    },
    onError: () => {} }
    )
    const onSubmit = async (formData: FormData) => {
    const values: FormValues = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        tag:formData.get("tag") as NoteTag,        
    } 
    const formValidationResult = await validateForm(values)
      if (!formValidationResult) return;
    mutation.mutate(values)

  }
    
return (
        <form className={css.form} action={onSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
            <input id="title" type="text" name="title" className={css.input} value={draft?.title} onChange={handleChange} />
            {errors.title && <div className={css.error}>{errors.title}</div>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                    <textarea
                    value={draft?.content}
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                onChange={handleChange}
            />
            {errors.content && <div className={css.error}>{errors.content}</div>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select id="tag" name="tag" className={css.select} value={draft?.tag} onChange={handleChange}>
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
            </select>
            {errors.tag && <div className={css.error}>{errors.tag}</div>}
            </div>

            <div className={css.actions}>
                <button type='button' onClick={() => router.back()} className={css.cancelButton}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                >
                    Create note
                </button>
            </div>
        </form>)}