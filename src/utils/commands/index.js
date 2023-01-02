/* globals Cypress */
/* eslint-env browser */
const { isElement, curryRight } = require("lodash")

function getTest() {
  return Cypress.mocha.getRunner().test;
}

function getTestForTask(test) {
  if (!test) {
    test = getTest();
  }
  return {
    id: test.id,
    title: test.title,
    parent: test.parent && test.parent.title ? getTestForTask(test.parent) : null,
    currentRetry: test.currentRetry && test.currentRetry()
  }
}

function getSubject(testSubject) {
  if (isHtml(testSubject)) {
    let result = '';
    Cypress.$(testSubject).each(function () {
      result += this.outerHTML;
    });
    return result;
  }
  return testSubject;
}

function isHtml(subject) {
  if (subject === undefined || subject === null) {
    return false;
  }
  return isElement(subject) ||
    subject.constructor.name === 'jQuery' || subject.constructor.prototype.jquery ||
    subject.constructor.name === 'HTMLCollection' || subject.constructor.name === 'NodeList' ||
    (Array.isArray(subject) && subject.length && isElement(subject[0]));
}

const getSnapshotName = () => {
  const specPath = Cypress.spec.relative
  const lastIndex = specPath.lastIndexOf("/")
  const specDir = specPath.slice(0, lastIndex)
  const specBasename = specPath.slice(lastIndex + 1)
  return `${specDir}/__snapshots__/${specBasename}.snap`
}

const getTitlePath = () =>
  cy
    .state("test")
    .titlePath()
    .join(" > ")

const failBeforeRetry = n => cy.then(() => expect(cy.state("test").currentRetry(), "currentRetry").eq(n))

function verifySnapshots(arr, include) {
  include = include != null ? include : true
  const titlePath = getTitlePath()
  cy.readFile(getSnapshotName()).then(snapshotContents => {
    arr.forEach(item => {
      const match = item.startsWith("#") ? `${titlePath} ${item}` : item
      if (include) {
        expect(snapshotContents).includes(match)
        return
      }
      expect(snapshotContents).not.includes(match)
    })
  })
}

const verifySnapshotsExclude = curryRight(verifySnapshots)(false)

module.exports = {
  getSubject,
  getTest,
  getTestForTask,
  isHtml,
  failBeforeRetry,
  verifySnapshots,
  verifySnapshotsExclude
}
