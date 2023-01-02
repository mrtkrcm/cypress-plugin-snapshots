const tasks = require("./src/tasks/")

/**
 * Initializes the plugin:
 * - registers tasks for `toMatchSnapshot` and `toMatchImageSnapshot`.
 * - Make config accessible via `Cypress.env`.
 * @param {Function} on - Method to register tasks
 * @param {Object} globalConfig - Object containing global Cypress config
 */
/* eslint-disable-next-line  no-unused-vars */
function initPlugin(on, globalConfig = {}) {
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.name === "chrome") {
      launchOptions.args.push("--font-render-hinting=medium")
      launchOptions.args.push("--enable-font-antialiasing")
      launchOptions.args.push("--disable-gpu")
    }
    // whatever you return here becomes the launchOptions
    return launchOptions
  })

  on("task", tasks)
}

module.exports = {
  initPlugin
}
