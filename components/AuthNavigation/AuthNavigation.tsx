"use client";

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function AuthNavigation() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const email = useAuthStore((state) => state.user?.email)
  const clearIsAuthenticated = useAuthStore((state)=>state.clearIsAuthenticated)
  const router = useRouter()
  const onClick = async () => {
    try {
      const res = await logout()
      if (res) {
          clearIsAuthenticated()
          router.push('/sign-in');
      } else {
      alert('Something went wrong, try again!');
    }
      } catch (error){
if (error instanceof AxiosError) {
  const message =
    error.response?.data?.response?.message ??
    error.response?.data?.error ??             
    error.message ??                           
    'Something went wrong, try again!';
  alert(message)
  }else {
  const message = 'Something went wrong, try again!';
  alert(message)
  }
      }
  }

  return (<>
    {isAuthenticated && (<>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{email}</p>
        <button className={css.logoutButton} onClick={onClick}>
          Logout
        </button>
      </li>
    </>)}

    {!isAuthenticated && (<>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
    )}
  </>)
}