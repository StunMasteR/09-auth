  "use client";

  import { useRouter } from 'next/navigation';
  import css from './SignInPage.module.css';
  import { useState } from 'react';
  import { login } from '@/lib/api/clientApi';
  import { AxiosError } from 'axios';
  import { useAuthStore } from '@/lib/store/authStore';

  export default function SignInPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const setUser = useAuthStore((state)=> state.setUser)

      const onSubmit = async (formData: FormData) => {
          setError('')
          try {
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;

          const res = await login(email, password)
          if (res) {
              setUser(res)
              router.push('/profile');
          } else {
          setError('Invalid email or password');
        }
          } catch (error){
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.response?.message ??
        error.response?.data?.error ??             
        error.message ??                           
        'Something went wrong, try again!';
        setError(message);
    }else {
      setError('Something went wrong, try again!');
    }
          }
      }

    return (
  <main className={css.mainContent}>
  <form className={css.form} action={onSubmit}>
      <h1 className={css.formTitle}>Sign in</h1>

      <div className={css.formGroup}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" className={css.input} required />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" className={css.input} required />
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Log in
        </button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  </main>

    );
  }