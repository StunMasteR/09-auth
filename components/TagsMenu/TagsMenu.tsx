"use client";

import css from './TagsMenu.module.css';
import { noteTags } from '@/lib/constants';
import type { NoteTag } from '@/types/note';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';



export default function TagsMenu() {
  const tagsMenuRef = useRef<HTMLDivElement | null>(null)
  
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    function OutsideClickHandler(event: MouseEvent) {
      if (
      (tagsMenuRef.current && !tagsMenuRef.current.contains(event.target as Node))) {
        setIsOpen(false);
      } 
    }
    document.addEventListener("mousedown", OutsideClickHandler);
    return () => {
      document.removeEventListener("mousedown", OutsideClickHandler);
    };
  }, []
)
  return (
<div className={css.menuContainer} ref={tagsMenuRef}>
  <button className={css.menuButton} onClick={() => { setIsOpen(!isOpen) }}>
    Notes ▾
  </button>
      <ul className={`${css.menuList} ${isOpen ? css.menuListOpen  : css.menuListClosed }`} >
        {noteTags.map((tag:NoteTag) => (
        <li className={css.menuItem} key={tag}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink} onClick={() => {setIsOpen(false)}}>
            {tag}
            </Link>
    </li>
    ))}

    </ul>
</div>

  );
}