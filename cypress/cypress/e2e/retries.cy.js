/// <reference types="cypress" />

const { failBeforeRetry, verifySnapshotsExclude, verifySnapshots } = require("../../../src/utils/commands/index")

describe("cypress retries", { retries: 2 }, () => {
  describe("toMatchSnapshot", () => {
    it("retries after snapshot", () => {
      cy.wrap({ foo: true }).toMatchSnapshot()
      failBeforeRetry(2)
      verifySnapshots(["#0"])
      verifySnapshotsExclude(["#1"])
    })

    it("retries before snapshot", () => {
      failBeforeRetry(2)
      cy.wrap({ foo: true }).toMatchSnapshot()
      verifySnapshots(["#0"])
      verifySnapshotsExclude(["#1"])
    })

    it("retries between snapshots", () => {
      cy.wrap({ foo: true }).toMatchSnapshot()
      failBeforeRetry(2)
      cy.wrap({ foo: true }).toMatchSnapshot()
      verifySnapshots(["#0", "#1"])
      verifySnapshotsExclude(["#2"])
    })
  })
  describe("toMatchImageSnapshot", () => {
    it("retries after snapshot", () => {
      cy.visit("/static/stub.html")
      failBeforeRetry(2)
      cy.document().toMatchImageSnapshot({
        threshold: 0.1
      })
      failBeforeRetry(2)
    })

    it("retries before snapshot", () => {
      cy.visit("/static/stub.html")
      cy.document().toMatchImageSnapshot({
        threshold: 0.1
      })
      failBeforeRetry(2)
    })

    it("retries between snapshots", () => {
      cy.visit("/static/stub.html")
      cy.document().toMatchImageSnapshot({
        threshold: 0.1
      })
      failBeforeRetry(2)
      cy.document().toMatchImageSnapshot({
        threshold: 0.1
      })
    })

    it("retries with named snapshots", () => {
      cy.visit("/static/stub.html")
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
        name: "foo"
      })
      failBeforeRetry(2)
    })
  })
})
