// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

export default createI18n({
  legacy: false, // Use composition API mode
  locale: localStorage.getItem('td-score-locale') || 'en', // Default locale
  fallbackLocale: 'en', // Fallback if translation is missing
  messages: {
    en,
    fr,
  },
})
