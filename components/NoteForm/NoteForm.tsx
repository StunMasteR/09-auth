'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { useNoteStore } from '../../lib/store/noteStore';
import styles from './NoteForm.module.css';
import { useState } from 'react';

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/All');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Сталася помилка при створенні нотатки');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !draft.title.trim() ||
      !draft.content.trim() ||
      createNoteMutation.isPending
    )
      return;

    setErrorMessage(null);

    createNoteMutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Заголовок
        </label>
        <input
          type="text"
          id="title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles.input}
          placeholder="Введіть заголовок нотатки"
          required
          aria-label="Заголовок нотатки"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          Зміст
        </label>
        <textarea
          id="content"
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          className={styles.textarea}
          placeholder="Введіть зміст нотатки"
          rows={6}
          required
          aria-label="Зміст нотатки"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag" className={styles.label}>
          Категорія
        </label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
          className={styles.select}
          aria-label="Категорія нотатки"
        >
          <option value="All">Всі</option>
          <option value="Work">Робота</option>
          <option value="Personal">Особисте</option>
          <option value="Ideas">Ідеї</option>
          <option value="Important">Важливо</option>
        </select>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          Скасувати
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Створення...' : 'Створити нотатку'}
        </button>
      </div>
    </form>
  );
}
