// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'firedb-chatapp',
        appId: '1:759287893451:web:5ad02d1be32b09a3237a4e',
        databaseURL:
          'https://firedb-chatapp-default-rtdb.asia-southeast1.firebasedatabase.app',
        storageBucket: 'firedb-chatapp.firebasestorage.app',
        apiKey: 'AIzaSyBw4ujAGsAUYtuOXb4MtjZENmlyGp-JXD8',
        authDomain: 'firedb-chatapp.firebaseapp.com',
        messagingSenderId: '759287893451',
        measurementId: 'G-KFDMZ8F6EB',
  },
    
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
