import { firebase } from '@/firebase';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';

export const login = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    rememberMe: z.boolean().optional(),
  }),
  handler: async ({ email, password, rememberMe }, { cookies }) => {
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
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      return JSON.stringify(user);
    } catch (error) {
      const firebaseError = error as AuthError;

      if (
        [
          'auth/user-not-found',
          'auth/wrong-password',
          'auth/invalid-email',
          'auth/invalid-credential',
        ].includes(firebaseError.code)
      ) {
        throw new ActionError({
          message: 'User not found',
          code: 'NOT_FOUND',
        });
      }

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
