
import Image from 'next/image';
import css from './ProfilePage.module.css';
import Link from 'next/link';
import { getUser } from '@/lib/api/serverApi';
import { Metadata } from 'next';


export async function generateMetadata():Promise<Metadata> {
  const user = await getUser()
  return {
    title: `${user.username}'s profile`,
    description: `${user.username}'s profile on Notehub`,
        openGraph: {
    title: `${user.username}'s profile`,
    description: `${user.username}'s profile on Notehub`,
    url: `${process.env.NEXT_PUBLIC_API_URL}/profile`,
    images: [
      {
        url: user.avatar,
        width: 1200,
        height: 630,
        alt: `${user.username}'s Avatar`,
      },
    ],
  },
  }
}


export default async function Profile() {
  const user = await getUser()
  return (
  <main className={css.mainContent}>
  <div className={css.profileCard}>
      <div className={css.header}>
	     <h1 className={css.formTitle}>Profile Page</h1>
	     <Link href="/profile/edit" className={css.editProfileButton}>
	       Edit Profile
	     </Link>
	   </div>
     <div className={css.avatarWrapper}>
      <Image
        src={user.avatar}
        alt="User Avatar"
        width={120}
        height={120}
        className={css.avatar}
      />
    </div>
    <div className={css.profileInfo}>
      <p>
        Username: {user.username}
      </p>
      <p>
        Email: {user.email}
      </p>
    </div>
  </div>
</main>

  );
}