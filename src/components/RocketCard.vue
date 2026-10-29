<template>
  <v-card
    class="h-100"
    variant="outlined"
    rounded="lg"
    hover
    @click="emit('view-details', rocket.id)"
  >
    <v-img
      :src="rocket.image_url || undefined"
      height="210"
      cover
      :alt="rocket.full_name || rocket.name"
    >
      <template #placeholder>
        <div
          class="d-flex align-center justify-center fill-height bg-grey-darken-3"
        >
          <v-icon size="56" color="grey-lighten-1">
            mdi-rocket-launch
          </v-icon>
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-h6">
        {{ rocket.full_name || rocket.name }}
      </v-card-title>

      <v-card-subtitle>
        {{ rocket.manufacturer?.country_code || 'Country unknown' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p class="text-body-2 text-medium-emphasis rocket-description">
        {{ rocket.description || 'No description available yet.' }}
      </p>

      <div class="d-flex flex-wrap ga-2 mt-4">
        <v-chip size="small" variant="tonal">
          <v-icon start size="small">mdi-currency-usd</v-icon>
          {{ formatCost(rocket.launch_cost) }}
        </v-chip>

        <v-chip size="small" variant="tonal">
          <v-icon start size="small">mdi-calendar</v-icon>
          {{ rocket.maiden_flight || 'Flight date unknown' }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        append-icon="mdi-arrow-right"
        @click.stop="emit('view-details', rocket.id)"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/services/rocketService'

defineProps<{
  rocket: Rocket
}>()

const emit = defineEmits<{
  'view-details': [id: number | string]
}>()

function formatCost(cost: string | null) {
  if (!cost) return 'Cost unknown'

  const amount = Number(cost)

  if (!Number.isFinite(amount)) return cost

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<style scoped>
.rocket-description {
  display: -webkit-box;
  min-height: 4.5em;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

:deep(.v-card) {
  transition: transform 0.2s ease, border-color 0.2s ease;
}

:deep(.v-card:hover) {
  transform: translateY(-3px);
}
</style>