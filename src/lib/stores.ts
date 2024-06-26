import { writable } from 'svelte/store';
import { initApp } from './app';

const { app, auth, db } = initApp();

export const authStore = writable(auth);
export const appStore = writable(app);
export const dbStore = writable(db);
