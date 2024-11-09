import { firebase } from '@/firebase';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError,
} from 'firebase/auth';

export const register = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    rememberMe: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, rememberMe }, { cookies }) => {
    if (rememberMe) {
      cookies.set('email', email, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: '/',
      });
    } else {
      cookies.delete('email', {
        path: '/',
      });
    }

    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      if (!firebase.auth.currentUser) {
        throw new ActionError({
          message: 'User not found',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      updateProfile(firebase.auth.currentUser, {
        displayName: name,
      });

      await sendEmailVerification(firebase.auth.currentUser, {
        url: `${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`,
      });

      return JSON.stringify(user);
    } catch (error) {
      console.log(error);

      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new ActionError({
          message: 'Email already in use',
          code: 'CONFLICT',
        });
      }

      throw new ActionError({
        message: 'Something went wrong',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  },
});
