import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
      console.log(' preloading route.data :', route.data);
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);
      return load();
    } else {
      return of(null);
    }
  }
}
