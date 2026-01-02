import { QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import NoteDetailsClient from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api/serverApi";
// import { fetchNoteByIdServer } from "@/lib/api/serverApi";


type NoteDetailsProps = {
  params:Promise<{ id: string }>;
};


export default async function NoteDetails({params}:NoteDetailsProps) {
    const queryClient = new QueryClient();
    const { id } =  await params;
    
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });

  return (
   <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}