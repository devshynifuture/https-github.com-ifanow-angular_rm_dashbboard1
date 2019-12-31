import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Event, NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {EventService} from './Data-service/event.service';
import {RoutingState} from './services/routing-state.service';
import {ChangeDetectorRef} from '@angular/core/src/metadata/*';

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
    private routingState: RoutingState, private changeDetector: ChangeDetectorRef
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
    if (event instanceof NavigationStart) {
      this.lBar.start();
      console.log('Performance navigation start', performance.getEntriesByType('navigation'));
    }
    if (event instanceof NavigationEnd) {
      console.log('Performance navigation end', performance.getEntriesByType('navigation'));

      this.lBar.complete();
      // this.changeDetector.markForCheck();
      // window.scrollTo(0, 0);
      // window.focus();
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
