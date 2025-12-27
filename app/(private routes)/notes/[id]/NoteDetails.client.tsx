"use client";

import { useQuery,keepPreviousData } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import css from './page.module.css';
import { fetchNoteById } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { JSX } from 'react';

export default function NoteDetails():JSX.Element {
    const { id } = useParams<{ id: string }>();
    const { isLoading, isError, isFetching, data, error } = useQuery({
        queryKey: ['IDnote', id],
        queryFn: () => fetchNoteById(id),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    })


if (isLoading || isFetching) return <Loader />;
  if ((isError) || !data) return <ErrorMessage error={error} />;
    
    return (
<div className={css.container}>
	<div className={css.item}>
	  <div className={css.header}>
	    <h2>{data.title}</h2>
	  </div>
	  <p className={css.content}>{data.content}</p>
	  <p className={css.date}>{data.createdAt}</p>
	</div>
</div>
  );
}