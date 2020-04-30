import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {EventService} from './Data-service/event.service';
import {RoutingState} from './services/routing-state.service';
import {PlatformLocation} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mainrouter', {
    static: true
  }) mainrouter;

  ngAfterViewInit(): void {
    this.routingState.setMainRouter(this.mainrouter);

  }

  constructor(
    private lBar: SlimLoadingBarService,
    private _router: Router, private eventService: EventService,
    private routingState: RoutingState,
    private location: PlatformLocation
  ) {
    // routingState.changeDetector = changeDetector;
    routingState.router = _router;
    routingState.loadRouting();
    this._router.events.subscribe((event: Event) => {
      // console.log(event);
      this.loadingBarInterceptor(event);
    });
  }

  private loadingBarInterceptor(event: Event) {
    // console.log('appComponent loadingBar event : ', event);
    if (event instanceof NavigationStart) {
      this.lBar.start();
      // console.log('Performance navigation start', performance.getEntriesByType('navigation'));
    }
    if (event instanceof NavigationEnd) {
      // console.log('Performance navigation end', performance.getEntriesByType('navigation'));
      this.lBar.complete();
    } else if (event instanceof NavigationCancel) {
      this.lBar.complete();
    } else if (event instanceof NavigationError) {
      this.lBar.complete();
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker('./app.worker', {type: 'module'});
  worker.onmessage = ({data}) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
