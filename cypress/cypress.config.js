const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    "cypress-plugin-snapshots": {
      diffLines: 4,
      excludeFields: ["ignore"]
    }
  },
  video: false,
  viewportWidth: 660,
  viewportHeight: 1000,
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:8080",
    excludeSpecPattern: ["**/__snapshots__/*", "**/__image_snapshots__/*"]
  }
})
