import { writable } from 'svelte/store';

// Erstellen eines writable Stores für eine Number-Variable
export const globalActiveUser = writable<number>(0);