<template>
  <v-card>
    <v-card-title class="text-h5 pa-5">
      Add new rocket
    </v-card-title>

    <v-card-text class="px-5">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-text-field
          v-model="form.name"
          label="Rocket name"
          placeholder="e.g. Starship Prototype"
          variant="outlined"
          :rules="[nameRule]"
          required
        />

        <v-textarea
          v-model="form.description"
          label="Description (optional)"
          variant="outlined"
          rows="3"
          auto-grow
        />

        <v-text-field
          v-model="form.launchCost"
          label="Cost per launch in USD (optional)"
          placeholder="e.g. 7000000"
          type="number"
          min="0"
          variant="outlined"
        />

        <v-text-field
          v-model="form.maidenFlight"
          label="First flight (optional)"
          type="date"
          variant="outlined"
        />

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="emit('cancel')">
            Cancel
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            :loading="saving"
          >
            Save rocket
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

defineProps<{
  saving: boolean
  error: string
}>()

const emit = defineEmits<{
  cancel: []
  submit: [
    rocket: {
      name: string
      description: string
      launchCost: string
      maidenFlight: string
    },
  ]
}>()

const formRef = ref()

const form = reactive({
  name: '',
  description: '',
  launchCost: '',
  maidenFlight: '',
})

const nameRule = (value: string) =>
  !!value?.trim() || 'Rocket name is required'

async function submitForm() {
  const result = await formRef.value?.validate()

  if (!result?.valid) return

  const launchCost = form.launchCost.trim()

  if (
    launchCost &&
    (!Number.isFinite(Number(launchCost)) || Number(launchCost) < 0)
  ) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    launchCost,
    maidenFlight: form.maidenFlight,
  })
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.launchCost = ''
  form.maidenFlight = ''
  formRef.value?.resetValidation()
}

defineExpose({ resetForm })
</script>