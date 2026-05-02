import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseWebConfig } from './clientEnv';

const app = initializeApp(firebaseWebConfig);
export const firebaseAuth = getAuth(app);