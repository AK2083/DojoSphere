import { defineStore, getActivePinia, storeToRefs } from 'pinia'

/**
 * Shared alias for Pinia store creation.
 */
export const newStore: typeof defineStore = defineStore
export const newStoreToRefs: typeof storeToRefs = storeToRefs
export const getActiveStore: typeof getActivePinia = getActivePinia
