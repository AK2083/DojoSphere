<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { VTextField } from 'vuetify/components'
import { mdiCalendar, mdiContentSave, mdiRestore } from '@mdi/js'
import {
  COMPETITOR_COACH_MAX_LENGTH,
  COMPETITOR_CONTACT_PHONE_MAX_LENGTH,
  COMPETITOR_LICENSE_NUMBER_MAX_LENGTH,
  COMPETITOR_NAME_MAX_LENGTH,
  COMPETITOR_PASS_NUMBER_MAX_LENGTH
} from '@shared/domain/competitor-field-limits'
import { useTranslation } from '@shared/lib'
import RequiredFieldLabel from '@shared/ui/RequiredFieldLabel.vue'

import translationKeys from '../i18n/keys'
import { useParticipantForm } from '../model/use-form'

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const {
  fields,
  isFormValid,
  isSubmitDisabled,
  isWeightClassRequired,
  genderOptions,
  clubOptions,
  nationalityOptions,
  ageClassOptions,
  gradeOptions,
  weightClassOptions,
  givenNameRules,
  familyNameRules,
  genderRules,
  birthDateRules,
  clubRules,
  nationalityRules,
  ageClassRules,
  weightClassRules,
  passNumberRules,
  licenseNumberRules,
  contactPhoneRules,
  coachRules,
  setFormRef,
  submit,
  reset
} = useParticipantForm()

const birthDateFieldRef = ref<VTextField | null>(null)

const isMobile = computed(() => smAndDown.value)
const saveLabel = computed(() => t(translationKeys.actions.save))
const resetLabel = computed(() => t(translationKeys.actions.reset))

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
  <v-form
    v-model="isFormValid"
    :ref="setFormRef"
    :aria-label="t(translationKeys.form.ariaLabel)"
    @submit.prevent="submit"
  >
    <v-card class="border px-4 py-4">
      <v-card-text class="d-flex flex-column ga-3">
        <v-alert type="info" variant="tonal" density="comfortable">
          {{ t(translationKeys.form.hint) }}
        </v-alert>

        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ t(translationKeys.form.requiredFieldsLegend) }}
        </p>

        <v-row density="comfortable">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="fields.givenName"
              :rules="givenNameRules"
              :maxlength="COMPETITOR_NAME_MAX_LENGTH"
              autocomplete="off"
              required
            >
              <template #label>
                <RequiredFieldLabel :text="t(translationKeys.form.fields.givenName)" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="fields.familyName"
              :rules="familyNameRules"
              :maxlength="COMPETITOR_NAME_MAX_LENGTH"
              autocomplete="off"
              required
            >
              <template #label>
                <RequiredFieldLabel :text="t(translationKeys.form.fields.familyName)" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-select
          v-model="fields.gender"
          :items="genderOptions"
          item-title="title"
          item-value="value"
          :rules="genderRules"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.gender)" />
          </template>
        </v-select>

        <v-text-field
          ref="birthDateFieldRef"
          v-model="fields.birthDate"
          type="date"
          class="participant-form__birth-date"
          :rules="birthDateRules"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.birthDate)" />
          </template>
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

        <v-select
          v-model="fields.clubId"
          :items="clubOptions"
          item-title="title"
          item-value="value"
          :rules="clubRules"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.club)" />
          </template>
        </v-select>

        <v-select
          v-model="fields.nationality"
          :items="nationalityOptions"
          item-title="title"
          item-value="value"
          :rules="nationalityRules"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.nationality)" />
          </template>
        </v-select>

        <v-select
          v-model="fields.ageClassId"
          :items="ageClassOptions"
          item-title="title"
          item-value="value"
          :rules="ageClassRules"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.ageClass)" />
          </template>
        </v-select>

        <v-alert
          v-if="fields.ageClassId && !isWeightClassRequired"
          type="info"
          variant="tonal"
          density="comfortable"
        >
          {{ t(translationKeys.form.flexibleWeightHint) }}
        </v-alert>

        <v-select
          v-else-if="fields.ageClassId"
          v-model="fields.weightClassId"
          :items="weightClassOptions"
          item-title="title"
          item-value="value"
          :rules="weightClassRules"
          :hint="t(translationKeys.form.selectAgeClassFirst)"
          :persistent-hint="!fields.ageClassId"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.weightClass)" />
          </template>
        </v-select>

        <v-text-field
          v-model="fields.passNumber"
          :rules="passNumberRules"
          :maxlength="COMPETITOR_PASS_NUMBER_MAX_LENGTH"
          autocomplete="off"
          required
        >
          <template #label>
            <RequiredFieldLabel :text="t(translationKeys.form.fields.passNumber)" />
          </template>
        </v-text-field>

        <v-select
          v-model="fields.gradeId"
          :items="gradeOptions"
          item-title="title"
          item-value="value"
          :label="t(translationKeys.form.fields.grade)"
          clearable
        />

        <v-text-field
          v-model="fields.licenseNumber"
          :label="t(translationKeys.form.fields.licenseNumber)"
          :rules="licenseNumberRules"
          :maxlength="COMPETITOR_LICENSE_NUMBER_MAX_LENGTH"
          autocomplete="off"
        />

        <v-text-field
          v-model="fields.contactPhone"
          type="tel"
          :label="t(translationKeys.form.fields.contactPhone)"
          :rules="contactPhoneRules"
          :maxlength="COMPETITOR_CONTACT_PHONE_MAX_LENGTH"
          autocomplete="off"
        />

        <v-text-field
          v-model="fields.coach"
          :label="t(translationKeys.form.fields.coach)"
          :rules="coachRules"
          :maxlength="COMPETITOR_COACH_MAX_LENGTH"
          autocomplete="off"
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
              :disabled="isSubmitDisabled"
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

/* Vuetify may add its own asterisk when `required` is set — hide duplicate markers. */
:deep(.v-label--required::after) {
  content: none !important;
}
</style>
