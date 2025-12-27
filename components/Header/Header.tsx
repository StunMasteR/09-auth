import Link from 'next/link';
import css from './Header.module.css';
import TagsMenu from '../TagsMenu/TagsMenu';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function Header() {
  return (
<header className={css.header}>
  <Link href="/" aria-label="Home" className={css.headerLink}>
    NoteHub
  </Link>
  <nav aria-label="Main Navigation">
    <ul className={css.navigation}>
      <li>
            <Link className={css.headerLink} href="/">Home</Link>
      </li>
      <li>
        <TagsMenu />
      </li>
      <AuthNavigation />
    </ul>
  </nav>
</header>

  );
}