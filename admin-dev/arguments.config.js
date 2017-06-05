module.exports = {
  dev: {
    testingMode: true,
    env: 'dev',
    APP_ID: '',
    APP_KEY: '',
    apiUrl: 'http: //xxx',
    contextPatch: '',
    others: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  prd: {
    env: 'dev',
    APP_ID: '111',
    APP_KEY: '222',
    apiUrl: 'http: //xxx',
    contextPatch: '',
    others: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
}
