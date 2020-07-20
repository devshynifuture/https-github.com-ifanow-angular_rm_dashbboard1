import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {BootstrapModuleFn, WebpackModule} from '@ngxs/hmr-plugin';
import 'hammerjs';
import {hmrBootstrap} from './hmr';

declare const module: WebpackModule;

if (environment.production) {
  enableProdMode();
}

/*platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));*/
const bootstrap: BootstrapModuleFn = () => platformBrowserDynamic().bootstrapModule(AppModule)
// .then(ref => {
//     // Ensure Angular destroys itself on hot reloads.
//     if (window['ngRef']) {
//       window['ngRef'].destroy();
//     }
//     window['ngRef'] = ref;

//     // Otherise, log the boot error
//   }).catch(err => console.error(err));
if (environment.hmr) {
  if (module[ 'hot' ]) {
    hmrBootstrap(module, bootstrap);
  } else {
    bootstrap().catch((err) => console.log(err));

    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap().then(ref => {
        // Ensure Angular destroys itself on hot reloads.
        if (window['ngRef']) {
          window['ngRef'].destroy();
        }
        window['ngRef'] = ref;

    // Otherise, log the boot error
      }).catch(err => console.error(err));
}
