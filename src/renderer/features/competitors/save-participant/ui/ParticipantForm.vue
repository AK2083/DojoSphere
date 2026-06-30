<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { VTextField } from 'vuetify/components'
import { mdiCalendar, mdiContentSave, mdiRestore } from '@mdi/js'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { useParticipantForm } from '../model/use-participant-form'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const { form, submit, reset } = useParticipantForm()

const birthDateFieldRef = ref<VTextField | null>(null)

const isMobile = computed(() => smAndDown.value)
const saveLabel = computed(() => t(translationKeys.actions.save))
const resetLabel = computed(() => t(translationKeys.actions.reset))

const genderOptions = computed(() => [
  { title: t(translationKeys.gender.female), value: 'female' as const },
  { title: t(translationKeys.gender.male), value: 'male' as const },
  { title: t(translationKeys.gender.diverse), value: 'diverse' as const }
])

const isGenderSelected = computed(() => form.value.gender !== '')
const fieldHint = computed(() => t(translationKeys.form.fieldHint))

function openBirthDatePicker(): void {
  const input = birthDateFieldRef.value?.$el?.querySelector('input[type="date"]')

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  input.showPicker?.()
  input.focus()
}
</script>

<template>
  <v-form :aria-label="t(translationKeys.form.ariaLabel)" @submit.prevent="submit">
    <v-card class="border px-4 py-4">
      <v-card-text class="d-flex flex-column ga-3">
        <v-alert type="info" variant="tonal" density="comfortable">
          {{ t(translationKeys.form.hint) }}
        </v-alert>

        <v-row density="comfortable">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.givenName"
              :label="t(translationKeys.form.fields.givenName)"
              :hint="fieldHint"
              persistent-hint
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.familyName"
              :label="t(translationKeys.form.fields.familyName)"
              :hint="fieldHint"
              persistent-hint
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <v-select
          v-model="form.gender"
          :items="genderOptions"
          item-title="title"
          item-value="value"
          :label="t(translationKeys.form.fields.gender)"
          :hint="fieldHint"
          persistent-hint
          :clearable="isGenderSelected"
        />

        <v-text-field
          ref="birthDateFieldRef"
          v-model="form.birthDate"
          type="date"
          class="participant-form__birth-date"
          :label="t(translationKeys.form.fields.birthDate)"
          :hint="fieldHint"
          persistent-hint
        >
          <template #append-inner>
            <v-btn
              type="button"
              variant="text"
              size="x-small"
              density="compact"
              class="participant-form__birth-date-icon-btn"
              :icon="mdiCalendar"
              :aria-label="t(translationKeys.form.openBirthDatePicker)"
              @click="openBirthDatePicker"
            />
          </template>
        </v-text-field>

        <v-text-field
          v-model="form.club"
          :label="t(translationKeys.form.fields.club)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.nationality"
          :label="t(translationKeys.form.fields.nationality)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.weightClass"
          :label="t(translationKeys.form.fields.weightClass)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.ageClass"
          :label="t(translationKeys.form.fields.ageClass)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.passNumber"
          :label="t(translationKeys.form.fields.passNumber)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.grade"
          :label="t(translationKeys.form.fields.grade)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.licenseNumber"
          :label="t(translationKeys.form.fields.licenseNumber)"
          :hint="fieldHint"
          persistent-hint
        />
        <v-text-field
          v-model="form.clubContactEmail"
          type="email"
          :label="t(translationKeys.form.fields.clubContactEmail)"
          :hint="fieldHint"
          persistent-hint
          autocomplete="off"
        />
        <v-text-field
          v-model="form.contactPhone"
          type="tel"
          :label="t(translationKeys.form.fields.contactPhone)"
          :hint="fieldHint"
          persistent-hint
          autocomplete="off"
        />
        <v-text-field
          v-model="form.coach"
          :label="t(translationKeys.form.fields.coach)"
          :hint="fieldHint"
          persistent-hint
        />
      </v-card-text>

      <v-card-actions class="px-4 pb-4 d-flex ga-2">
        <v-tooltip :disabled="!isMobile" :text="saveLabel" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              type="submit"
              variant="flat"
              color="primary"
              density="default"
              :icon="isMobile"
              :prepend-icon="isMobile ? undefined : mdiContentSave"
              :aria-label="isMobile ? saveLabel : undefined"
            >
              <v-icon v-if="isMobile" :icon="mdiContentSave" aria-hidden="true" />
              <span v-if="!isMobile">{{ saveLabel }}</span>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!isMobile" :text="resetLabel" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              type="button"
              variant="outlined"
              density="default"
              :icon="isMobile"
              :prepend-icon="isMobile ? undefined : mdiRestore"
              :aria-label="isMobile ? resetLabel : undefined"
              @click="reset"
            >
              <v-icon v-if="isMobile" :icon="mdiRestore" aria-hidden="true" />
              <span v-if="!isMobile">{{ resetLabel }}</span>
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped>
.participant-form__birth-date :deep(input[type='date']::-webkit-calendar-picker-indicator) {
  display: none;
}

.participant-form__birth-date :deep(input[type='date']) {
  appearance: none;
  -webkit-appearance: none;
}

.participant-form__birth-date-icon-btn {
  width: 1.5rem;
  height: 1.5rem;
}

.participant-form__birth-date-icon-btn :deep(.v-icon) {
  font-size: 1.125rem;
}
</style>
