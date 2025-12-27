import css from "@/app/page.module.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found Page",
  description: "This page does not exist",
  openGraph: {
    title: "Not Found",
    description: "This page does not exist",
    url: `https://08-zustand-two-lake.vercel.app/not-found`,
    images: [
      {
        url:"https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function NotFound() {
    return (
<>
    <h1 className={css.title}>404 - Page not found</h1>
    <p className={`${css.description} ${css.descriptionNotFoundPage}`}>Sorry, the page you are looking for does not exist.</p>
</>

  );
}