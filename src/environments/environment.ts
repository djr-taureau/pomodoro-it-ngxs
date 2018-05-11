// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  api: {
    host: 'https://todoist.com/oauth/authorize?client_id=928cd4baca4f456790059633990eaa2e&scope=data:read_write&state=PipU9sG8',
    client_id: '928cd4baca4f456790059633990eaa2e',
    client_secret: '874a2f692cf541ac9fd9647ab6a8d821',
    state: 'PipU9sG8',
    scope: 'data:read_write',
    tokens: {
      access: 'access_token',
    }
  },
  firebase: {
    apiKey: 'AIzaSyC3Hd9DIO5PyHBVM1js7J2owUgfmXUPkzo',
    authDomain: 'pomodoro-it.firebaseapp.com',
    databaseURL: 'https://pomodoro-it.firebaseio.com',
    projectId: 'pomodoro-it',
    storageBucket: 'pomodoro-it.appspot.com',
    messagingSenderId: '190752659546'
  },
  google: {
    webClientId: '190752659546-ble3d9625vv4gorjhemm6m3dis3enau7.apps.googleusercontent.com',
    webClientSecret: 'xnkCv-uzhmuTiG-29rKHly2Z'
  }
};

