
<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-8"
      @click="router.push('/')"
    >
      All rockets
    </v-btn>

    <div v-if="loading" class="py-16 text-center">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-4">Loading rocket details...</p>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}

      <v-btn variant="text" class="ml-2" @click="loadRocket">
        Try again
      </v-btn>
    </v-alert>

    <template v-else-if="rocket">
      <v-row>
        <v-col cols="12" md="7">
        <v-img
          v-if="rocket.image_url"
          :src="rocket.image_url"
          :alt="rocket.full_name || rocket.name"
          cover
          class="rocket-detail-image"
        />

        <div
          v-else
          class="d-flex align-center justify-center bg-grey-darken-3"
          style="height: 460px"
        >
          <v-icon size="72" color="grey-lighten-1">
            mdi-rocket-launch
          </v-icon>
        </div>
        </v-col>

        <v-col cols="12" md="5">
          <p class="text-overline text-primary">
            {{ rocket.manufacturer?.name || 'Rocket profile' }}
          </p>

          <h1 class="text-h3 font-weight-bold mb-4">
            {{ rocket.full_name || rocket.name }}
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-8">
            {{ rocket.description || 'No description available for this rocket.' }}
          </p>

          <v-divider class="mb-4" />

          <div class="py-3">
            <p class="text-caption text-medium-emphasis">Manufacturer</p>
            <p>{{ rocket.manufacturer?.name || 'Unknown' }}</p>
          </div>

          <v-divider />

          <div class="py-3">
            <p class="text-caption text-medium-emphasis">Country</p>
            <p>{{ rocket.manufacturer?.country_code || 'Unknown' }}</p>
          </div>

          <v-divider />

          <div class="py-3">
            <p class="text-caption text-medium-emphasis">Cost per launch</p>
            <p>{{ formatCost(rocket.launch_cost) }}</p>
          </div>

          <v-divider />

          <div class="py-3">
            <p class="text-caption text-medium-emphasis">First flight</p>
            <p>{{ rocket.maiden_flight || 'Unknown' }}</p>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRocketById } from '@/services/rocketService'
import type { Rocket } from '@/services/rocketService'
import { getLocalRockets } from '@/services/localRocketService'

const route = useRoute()
const router = useRouter()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref('')


async function loadRocket() {
  loading.value = true
  error.value = ''

  try {
    // const id = route.params.id
    const id = String(
      (route.params as Record<string, string | string[]>).id ?? '',
    )

    if (typeof id !== 'string' || !id) {
      throw new Error('Invalid rocket ID.')
    }

    const localRocket = getLocalRockets().find(
      (item) => String(item.id) === id,
    )

    if (localRocket) {
      rocket.value = localRocket
      return
    }

    if (!/^\d+$/.test(id)) {
      throw new Error('Rocket not found.')
    }

    rocket.value = await getRocketById(id)
  } catch (err) {
    console.error('Failed to load rocket:', err)
    error.value = 'Could not load this rocket. Please try again.'
  } finally {
    loading.value = false
  }
}

function formatCost(cost: string | null) {
  if (!cost) return 'Unknown'

  const amount = Number(cost)

  if (!Number.isFinite(amount)) return cost

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

onMounted(loadRocket)
</script>
<style scoped>
.rocket-detail-image {
  height: auto;
}
</style>
