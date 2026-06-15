import { computed, onMounted, ref } from 'vue'
import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { resolveLocalAuthSession } from '@features/authentication/service/resolve-local-auth-session'

import translationKeys from '../i18n/keys'
import { ensureLocalSessionForUsername } from '../service/ensure-local-session-for-username'
import { updateDisplayName } from '../service/update-display-name'

function getDisplayNameFromSession(
  user: { user_metadata?: { full_name?: string; name?: string }; email?: string } | null | undefined
) {
  if (!user) {
    return ''
  }

  const meta = user.user_metadata
  return meta?.full_name || meta?.name || user.email?.split('@')[0] || ''
}

/**
 * Composable for editing the local display name in settings.
 *
 * @returns Form state and save handler for the username editor.
 */
export function useUsernameForm() {
  const username = ref('')
  const savedUsername = ref('')
  const loading = ref(false)
  const errorCode = ref<string | null>(null)
  const success = ref(false)

  const trimmedUsername = computed(() => username.value.trim())
  const isEmpty = computed(() => trimmedUsername.value.length === 0)
  const hasChanges = computed(() => trimmedUsername.value !== savedUsername.value)
  const canSave = computed(() => hasChanges.value && !isEmpty.value && !loading.value)

  async function loadCurrentUsername() {
    if (!getLocalSessionToken()) {
      await ensureLocalSessionForUsername()
    }

    const session = await resolveLocalAuthSession()
    const displayName = getDisplayNameFromSession(session?.user)

    username.value = displayName
    savedUsername.value = displayName
  }

  async function save() {
    if (!canSave.value) {
      if (isEmpty.value) {
        errorCode.value = translationKeys.error.empty
      }

      return
    }

    loading.value = true
    errorCode.value = null
    success.value = false

    try {
      const updatedUser = await updateDisplayName(trimmedUsername.value)

      username.value = updatedUser.displayName
      savedUsername.value = updatedUser.displayName
      success.value = true
    } catch {
      errorCode.value = translationKeys.error.save
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void loadCurrentUsername()
  })

  return {
    username,
    loading,
    errorCode,
    success,
    canSave,
    save
  }
}
