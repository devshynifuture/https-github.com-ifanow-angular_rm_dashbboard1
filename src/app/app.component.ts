import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { EventService } from './Data-service/event.service';
import { RoutingState } from './services/routing-state.service';
import { PlatformLocation } from '@angular/common';
import { ConnectionService } from 'ng-connection-service'
import { from, interval } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mainrouter', {
    static: true
  }) mainrouter;
  isConnected: boolean = true;
  onlineStatus: boolean;
  timeLeft: any;
  intervallTimer: any;
  showTimeRemaing: number;
  setNewTime: any;

  ngAfterViewInit(): void {
    this.routingState.setMainRouter(this.mainrouter);

  }

  constructor(
    private lBar: SlimLoadingBarService,
    private _router: Router, private eventService: EventService,
    private routingState: RoutingState,
    private location: PlatformLocation,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.onlineStatus = true;
        this.showTimeRemaing = 5
        this.intervallTimer.unsubscribe();
      }
      else {
        this.onlineStatus = false;
        this.countDown(5);
      }
    })
    // routingState.changeDetector = changeDetector;
    routingState.router = _router;
    routingState.loadRouting();
    this._router.events.subscribe((event: Event) => {
      this.loadingBarInterceptor(event);
    });

  }
  countDown(timer) {
    this.timeLeft = timer;
    this.setNewTime = timer;
    this.intervallTimer = interval(1000).subscribe(
      data => {
        if (this.timeLeft == 0) {
          timer = 2 * timer;
          this.timeLeft = 2 * timer
        } else {
          this.showTimeRemaing = this.timeLeft--;
        }
      }
    )
  }
  private loadingBarInterceptor(event: Event) {
    if (event instanceof NavigationStart) {
      this.lBar.start();
    }
    if (event instanceof NavigationEnd) {
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