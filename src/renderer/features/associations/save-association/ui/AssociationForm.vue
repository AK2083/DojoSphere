<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { mdiContentSave, mdiRestore } from '@mdi/js'
import { useTranslation } from '@shared/lib'
import RequiredFieldLabel from '@shared/ui/RequiredFieldLabel.vue'

import translationKeys from '../i18n/keys'
import { ASSOCIATION_EMAIL_MAX_LENGTH } from '../lib/association-form-rules'
import { useAssociationForm } from '../model/use-form'

const props = defineProps<{
  associationId?: string
  title: string
}>()

const { t } = useTranslation()
const { smAndDown } = useDisplay()
const {
  fields,
  isFormValid,
  isSaving,
  isLoading,
  saveErrorMessage,
  loadErrorMessage,
  isSubmitDisabled,
  websiteProtocolItems,
  phoneCountryCodeItems,
  nameRules,
  shortNameRules,
  websiteHostRules,
  associationNumberRules,
  streetRules,
  houseNumberRules,
  postalCodeRules,
  addressCityRules,
  headquartersStreetRules,
  headquartersHouseNumberRules,
  headquartersPostalCodeRules,
  headquartersCityRules,
  emailRules,
  phoneRules,
  fieldLimits,
  setFormRef,
  submit,
  reset
} = useAssociationForm({ associationId: () => props.associationId })

const isMobile = computed(() => smAndDown.value)
const saveLabel = computed(() => t(translationKeys.actions.save))
const resetLabel = computed(() => t(translationKeys.actions.reset))

const addressSections = [
  {
    key: 'headquarters' as const,
    labelKey: translationKeys.form.fields.headquarters,
    sameAsKey: null,
    required: true
  },
  {
    key: 'trainingVenue' as const,
    labelKey: translationKeys.form.fields.trainingVenue,
    sameAsKey: 'trainingVenueSameAsHeadquarters' as const,
    required: false
  },
  {
    key: 'billingAddress' as const,
    labelKey: translationKeys.form.fields.billingAddress,
    sameAsKey: 'billingAddressSameAsHeadquarters' as const,
    required: false
  }
]
</script>

<template>
  <v-form
    v-model="isFormValid"
    :ref="setFormRef"
    :aria-label="t(translationKeys.form.ariaLabel)"
    class="association-form"
    @submit.prevent="submit"
  >
    <div class="association-form__header mb-6">
      <h1 class="association-form__title text-h5">{{ title }}</h1>
      <div class="association-form__active">
        <v-switch
          v-model="fields.isActive"
          color="primary"
          density="compact"
          hide-details
          class="association-form__active-switch"
          :aria-label="t(translationKeys.form.fields.status)"
        />
        <span class="association-form__active-label">
          {{
            fields.isActive ? t(translationKeys.status.active) : t(translationKeys.status.inactive)
          }}
        </span>
      </div>
    </div>

    <v-card class="border px-4 py-4">
      <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

      <v-card-text class="d-flex flex-column ga-3">
        <v-alert type="info" variant="tonal" density="comfortable">
          {{ t(translationKeys.form.hint) }}
        </v-alert>

        <v-alert
          v-if="loadErrorMessage"
          type="error"
          variant="tonal"
          density="comfortable"
          role="alert"
        >
          {{ loadErrorMessage }}
        </v-alert>

        <v-alert
          v-if="saveErrorMessage"
          type="error"
          variant="tonal"
          density="comfortable"
          role="alert"
        >
          {{ saveErrorMessage }}
        </v-alert>

        <fieldset class="association-form__fields d-flex flex-column ga-3" :disabled="isLoading">
          <v-text-field
            v-model="fields.name"
            :rules="nameRules"
            :maxlength="fieldLimits.name"
            :placeholder="t(translationKeys.form.placeholders.name)"
            autocomplete="organization"
            required
          >
            <template #label>
              <RequiredFieldLabel :text="t(translationKeys.form.fields.name)" />
            </template>
          </v-text-field>

          <v-text-field
            v-model="fields.shortName"
            :label="t(translationKeys.form.fields.shortName)"
            :rules="shortNameRules"
            :maxlength="fieldLimits.shortName"
            :placeholder="t(translationKeys.form.placeholders.shortName)"
            autocomplete="off"
          />

          <v-row density="comfortable">
            <v-col cols="12" sm="3">
              <v-select
                v-model="fields.websiteProtocol"
                :items="websiteProtocolItems"
                item-title="title"
                item-value="value"
                :label="t(translationKeys.form.fields.websiteProtocol)"
                :aria-label="t(translationKeys.form.fields.websiteProtocol)"
              />
            </v-col>
            <v-col cols="12" sm="9">
              <v-text-field
                v-model="fields.websiteHost"
                :label="t(translationKeys.form.fields.website)"
                :rules="websiteHostRules"
                :maxlength="fieldLimits.websiteHost"
                :placeholder="t(translationKeys.form.placeholders.websiteHost)"
                autocomplete="url"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="fields.associationNumber"
            :rules="associationNumberRules"
            :maxlength="fieldLimits.associationNumber"
            :placeholder="t(translationKeys.form.placeholders.associationNumber)"
            autocomplete="off"
            required
          >
            <template #label>
              <RequiredFieldLabel :text="t(translationKeys.form.fields.associationNumber)" />
            </template>
          </v-text-field>

          <div
            v-for="section in addressSections"
            :key="section.key"
            class="association-form__address d-flex flex-column ga-1"
          >
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-1">
              <p class="text-subtitle-2 mb-0">{{ t(section.labelKey) }}</p>
              <v-switch
                v-if="section.sameAsKey"
                v-model="fields[section.sameAsKey]"
                color="primary"
                density="compact"
                hide-details
                class="flex-grow-0"
                :label="t(translationKeys.form.sameAsHeadquarters)"
                :aria-label="`${t(section.labelKey)}: ${t(translationKeys.form.sameAsHeadquarters)}`"
              />
            </div>

            <fieldset
              class="association-form__address-fields d-flex flex-column ga-1"
              :disabled="Boolean(section.sameAsKey && fields[section.sameAsKey])"
            >
              <v-row density="comfortable">
                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="fields[section.key].street"
                    :rules="section.required ? headquartersStreetRules : streetRules"
                    :maxlength="fieldLimits.street"
                    :placeholder="t(translationKeys.form.placeholders.street)"
                    autocomplete="address-line1"
                    :required="section.required"
                  >
                    <template v-if="section.required" #label>
                      <RequiredFieldLabel :text="t(translationKeys.form.fields.street)" />
                    </template>
                    <template v-else #label>
                      {{ t(translationKeys.form.fields.street) }}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="fields[section.key].houseNumber"
                    :rules="section.required ? headquartersHouseNumberRules : houseNumberRules"
                    :maxlength="fieldLimits.houseNumber"
                    :placeholder="t(translationKeys.form.placeholders.houseNumber)"
                    autocomplete="off"
                    :required="section.required"
                  >
                    <template v-if="section.required" #label>
                      <RequiredFieldLabel :text="t(translationKeys.form.fields.houseNumber)" />
                    </template>
                    <template v-else #label>
                      {{ t(translationKeys.form.fields.houseNumber) }}
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row density="comfortable">
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="fields[section.key].postalCode"
                    :rules="section.required ? headquartersPostalCodeRules : postalCodeRules"
                    :maxlength="fieldLimits.postalCode"
                    :placeholder="t(translationKeys.form.placeholders.postalCode)"
                    inputmode="numeric"
                    autocomplete="postal-code"
                    :required="section.required"
                  >
                    <template v-if="section.required" #label>
                      <RequiredFieldLabel :text="t(translationKeys.form.fields.postalCode)" />
                    </template>
                    <template v-else #label>
                      {{ t(translationKeys.form.fields.postalCode) }}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="9">
                  <v-text-field
                    v-model="fields[section.key].city"
                    :rules="section.required ? headquartersCityRules : addressCityRules"
                    :maxlength="fieldLimits.city"
                    :placeholder="t(translationKeys.form.placeholders.city)"
                    autocomplete="address-level2"
                    :required="section.required"
                  >
                    <template v-if="section.required" #label>
                      <RequiredFieldLabel :text="t(translationKeys.form.fields.city)" />
                    </template>
                    <template v-else #label>
                      {{ t(translationKeys.form.fields.city) }}
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </fieldset>
          </div>

          <div class="association-form__address d-flex flex-column ga-1">
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-1">
              <p class="text-subtitle-2 mb-0">{{ t(translationKeys.form.fields.contact) }}</p>
            </div>

            <v-text-field
              v-model="fields.email"
              :rules="emailRules"
              :maxlength="ASSOCIATION_EMAIL_MAX_LENGTH"
              :placeholder="t(translationKeys.form.placeholders.email)"
              type="email"
              autocomplete="email"
              required
            >
              <template #label>
                <RequiredFieldLabel :text="t(translationKeys.form.fields.email)" />
              </template>
            </v-text-field>

            <v-row density="comfortable">
              <v-col cols="12" sm="3">
                <v-select
                  v-model="fields.phoneCountryCode"
                  :items="phoneCountryCodeItems"
                  item-title="title"
                  item-value="value"
                  :label="t(translationKeys.form.fields.phoneCountryCode)"
                  :aria-label="t(translationKeys.form.fields.phoneCountryCode)"
                />
              </v-col>
              <v-col cols="12" sm="9">
                <v-text-field
                  v-model="fields.phoneNumber"
                  :label="t(translationKeys.form.fields.phone)"
                  :rules="phoneRules"
                  :maxlength="fieldLimits.phone"
                  :placeholder="t(translationKeys.form.placeholders.phone)"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel-national"
                />
              </v-col>
            </v-row>
          </div>
        </fieldset>
      </v-card-text>

      <v-card-actions class="px-4 pb-4 d-flex ga-2">
        <v-tooltip :text="saveLabel" :location="isMobile ? 'bottom' : 'top'">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              type="submit"
              variant="flat"
              color="primary"
              density="default"
              :disabled="isSubmitDisabled"
              :loading="isSaving"
              :icon="isMobile"
              :prepend-icon="isMobile ? undefined : mdiContentSave"
              :aria-label="isMobile ? saveLabel : undefined"
            >
              <v-icon v-if="isMobile" :icon="mdiContentSave" aria-hidden="true" />
              <span v-if="!isMobile">{{ saveLabel }}</span>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip :text="resetLabel" :location="isMobile ? 'bottom' : 'top'">
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
.association-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  min-height: 2.5rem;
}

.association-form__title {
  margin: 0;
  line-height: 2.5rem;
}

.association-form__active {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 2.5rem;
}

.association-form__active-switch {
  flex: none;
  margin: 0;
  width: auto;
}

.association-form__active-switch :deep(.v-input),
.association-form__active-switch :deep(.v-input__control),
.association-form__active-switch :deep(.v-selection-control),
.association-form__active-switch :deep(.v-selection-control__wrapper) {
  margin: 0;
  padding: 0;
  min-height: 0 !important;
  height: auto;
}

.association-form__active-switch :deep(.v-selection-control) {
  align-items: center;
  justify-content: center;
}

.association-form__active-label {
  line-height: 2.5rem;
  font-size: 1rem;
  white-space: nowrap;
}

.association-form__fields {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.association-form__address-fields {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

:deep(.v-label--required::after) {
  content: none !important;
}
</style>
