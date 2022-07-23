import { boot } from 'quasar/wrappers'

/*export default async ({ Vue }) => {
  // Register it globally
  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}*/

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // Add build-in rules
/*  extend('required', required)
  extend('email', email)

  // Add custom rule
  extend('minMaxValue', {
    validate: (value, {
      min,
      max
    }) => {
      return value >= Number(min) && value <= Number(max)
    },
    message: (fieldName, {
      min,
      max
    }) => {
      return `${fieldName} must be between ${min} and ${max}`
    },
    params: ['min', 'max']
  })*/
})
