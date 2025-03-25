// src/components/common/LanguageSwitcher.vue
<template>
  <div class="flex items-center">
    <button
      v-if="currentLocale === 'fr'"
      @click="changeLanguage('en')"
      class="px-2 py-1 rounded transition-colors"
      :class="currentLocale === 'en' ? 'bg-white text-green-800' : 'text-white hover:bg-green-700'"
    >
      EN
    </button>
    <!-- <span class="mx-1 text-white">|</span> -->
    <button
      v-if="currentLocale === 'en'"
      @click="changeLanguage('fr')"
      class="px-2 py-1 rounded transition-colors"
      :class="currentLocale === 'fr' ? 'bg-white text-green-800' : 'text-white hover:bg-green-700'"
    >
      FR
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('td-score-locale', lang)
}
</script>
