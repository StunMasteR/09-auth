import { QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import NotesClient from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import { Metadata } from "next";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesProps):Promise<Metadata> {
  const { slug } =  await params;
  const tag = slug[0]
  return {
    title: `${tag} page`,
    description: `${tag} category on NoteHub`,
    openGraph: {
    title: `${tag} page`,
    description: `${tag} category on NoteHub`,
    url: `https://08-zustand-two-lake.vercel.app/notes/filter/${tag}`,
    images: [
      {
        url:"https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
  }  
}

export default async function Notes({ params }: NotesProps) {
  const { slug } =  await params;
  const tag = slug[0]
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag], 
    queryFn: () => fetchNotes(tag),
  })

  return (
   <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}