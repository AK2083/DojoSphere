import { defineStore, getActivePinia, storeToRefs } from 'pinia'

/** Shared alias for Pinia store creation. */
export const newStore: typeof defineStore = defineStore

/** Shared alias for Pinia store-to-refs conversion. */
export const newStoreToRefs: typeof storeToRefs = storeToRefs

/** Returns the active Pinia instance when the app has mounted. */
export const getActiveStore: typeof getActivePinia = getActivePinia
