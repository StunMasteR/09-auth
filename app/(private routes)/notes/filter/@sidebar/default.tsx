import css from './SidebarNotes.module.css';
import Link from 'next/link';
import { noteTags } from '@/lib/constants';
import { NoteTag } from '@/types/note';


export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
        {noteTags.map((tag:NoteTag) => (
        <li className={css.menuItem} key={tag}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
            </Link>
    </li>
    ))}
    </ul>
  );
}