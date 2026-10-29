<template>
  <v-container class="py-8">
    <header class="mb-8">
      <p class="text-overline text-primary">SPACE EXPLORATION</p>
      <h1 class="text-h3 font-weight-bold mb-3">SpaceX Rockets</h1>
      <p class="text-body-1 text-medium-emphasis">
        Explore the rockets behind SpaceX's missions.
      </p>
    </header>

    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="Search by rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
      max-width="520"
    />

    <div class="d-flex align-center justify-space-between mb-4">
      <p class="text-body-2 text-medium-emphasis">
        {{ filteredRockets.length }} rockets found
      </p>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddForm = true"
      >
        Add rocket
      </v-btn>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}

      <template #append>
        <v-btn
          variant="text"
          :disabled="loading"
          @click="loadRockets"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <div v-if="loading" class="py-12 text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <p class="mt-4 text-medium-emphasis">Loading rockets...</p>
    </div>

    <v-row v-else-if="filteredRockets.length > 0">
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <RocketCard
          :rocket="rocket"
          @view-details="openRocket"
        />
      </v-col>
    </v-row>

    <v-alert
      v-else-if="!error"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No rockets found. Try another search term.
    </v-alert>

    <v-dialog v-model="showAddForm" max-width="560">
      <RocketForm
        ref="rocketFormRef"
        :saving="saving"
        :error="formError"
        @cancel="closeAddForm"
        @submit="addRocket"
      />
    </v-dialog>

    <v-snackbar v-model="showSuccess" color="success">
      Rocket added successfully.

      <template #actions>
        <v-btn
          variant="text"
          @click="showSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RocketCard from '@/components/RocketCard.vue'
import RocketForm from '@/components/RocketForm.vue'
import { getRockets } from '@/services/rocketService'
import type { Rocket } from '@/services/rocketService'
import {
  getLocalRockets,
  saveLocalRocket,
} from '@/services/localRocketService'
import type { LocalRocket } from '@/services/localRocketService'

interface RocketFormData {
  name: string
  description: string
  launchCost: string
  maidenFlight: string
}

const router = useRouter()

const rockets = ref<Rocket[]>([])
const search = ref('')
const loading = ref(false)
const error = ref('')
const showAddForm = ref(false)
const saving = ref(false)
const formError = ref('')
const showSuccess = ref(false)
const rocketFormRef = ref<InstanceType<typeof RocketForm> | null>(null)

const filteredRockets = computed(() => {
  const query = (search.value ?? '').trim().toLowerCase()

  if (!query) return rockets.value

  return rockets.value.filter((rocket) =>
    `${rocket.name} ${rocket.full_name}`
      .toLowerCase()
      .includes(query),
  )
})

async function loadRockets() {
  loading.value = true
  error.value = ''

  try {
    const response = await getRockets()
    rockets.value = [...response.results, ...getLocalRockets()]
  } catch (err) {
    console.error('Failed to load rockets:', err)
    rockets.value = getLocalRockets()
    error.value = 'Could not load rockets from the API. Please try again.'
  } finally {
    loading.value = false
  }
}

function openRocket(id: number | string) {
  router.push(`/rockets/${id}`)
}

function closeAddForm() {
  showAddForm.value = false
  formError.value = ''
}

function addRocket(form: RocketFormData) {
  const cost = form.launchCost.trim()

  if (cost && (!Number.isFinite(Number(cost)) || Number(cost) < 0)) {
    formError.value = 'Launch cost must be a valid non-negative number.'
    return
  }

  saving.value = true
  formError.value = ''

  const localRocket: LocalRocket = {
    id: crypto.randomUUID(),
    name: form.name,
    full_name: form.name,
    description: form.description || null,
    image_url: null,
    launch_cost: cost || null,
    maiden_flight: form.maidenFlight || null,
    manufacturer: {
      name: 'SpaceX',
      country_code: 'USA',
    },
    created_at: new Date().toISOString(),
  }

  try {
    saveLocalRocket(localRocket)
    rockets.value.push(localRocket)

    rocketFormRef.value?.resetForm()
    search.value = ''
    showAddForm.value = false
    showSuccess.value = true
  } catch (err) {
    console.error('Failed to save rocket:', err)
    formError.value = 'Could not save this rocket in your browser.'
  } finally {
    saving.value = false
  }
}

onMounted(loadRockets)
</script>
