"use client";

import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

import { AxiosError } from 'axios';
import { patchUser } from '@/lib/api/clientApi';

export default  function EditProfilePage(
) {
  const user = useAuthStore((state) => (state.user))
  const setUser = useAuthStore((state) => (state.setUser))
  const router = useRouter()
  
  const onSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    if (username.trim() === "") {
      return alert("Username can't be empty!")
    }
      try {
          const res = await patchUser(username)
          if (res) {
              setUser(res)
              router.push('/profile');
          } else {
              alert('Validation error');
          }
      } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.response?.message ??
          error.response?.data?.error ??             
          error.message ??                           
          'Something went wrong, try again!';
          alert(message);
      }else {
        alert('Something went wrong, try again!');
      }
    }
  }
  
  return (
<main className={css.mainContent}>
  <div className={css.profileCard}>
    <h1 className={css.formTitle}>Edit Profile</h1>

    <Image src={user?.avatar ?? "https://ac.goit.global/fullstack/react/default-avatar.jpg"}
      alt="User Avatar"
      width={120}
      height={120}
      className={css.avatar}
    />

    <form className={css.profileInfo} action={onSubmit}>
      <div className={css.usernameWrapper}>
        <label htmlFor="username">Username:</label>
        <input id="username"
          name="username"
          type="text"
          className={css.input}
          defaultValue={user?.username}    
        />
      </div>

      <p>Email: {user?.email}</p>

      <div className={css.actions}>
        <button type="submit" className={css.saveButton}>
          Save
        </button>
        <button type="button" className={css.cancelButton} onClick={()=>{router.back()}}>
          Cancel
        </button>
      </div>
    </form>
  </div>
</main>

  );
}