// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Direct PocketBase instance URL
export const pb = new PocketBase('http://localhost:8090'); 

// Writable store to track the current user
export const currentUser = writable(pb.authStore.model);

// Optional: Automatically update the user store on auth changes
pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
});
