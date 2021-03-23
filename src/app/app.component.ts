import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import {
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { EventService } from './Data-service/event.service';
import { RoutingState } from './services/routing-state.service';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { ConnectionService } from 'ng-connection-service';
import { interval } from 'rxjs';
import { OnInit } from '@angular/core/src/metadata/*';
import { SettingsService } from './component/protect-component/AdviserComponent/setting/settings.service';
import { AuthService } from './auth-service/authService';
import { EnumDataService } from './services/enum-data.service';
import { LoginService } from './component/no-protected/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('mainrouter', {
    static: true
  }) mainrouter;
  isConnected = true;
  onlineStatus: boolean;
  timeLeft: any;
  intervalTimer: any;
  showTimeRemaining: number;
  setNewTime: any;

  ngOnInit() {
    let width, height;
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    // if (height > width) {
    //   this.document.getElementById('tabviewJs').style.width = `${height}px`
    //   this.document.getElementById('tabviewJs').style.height = `${width}px`;

    // }
    this.getDomainData("dev.ifanow.in");
    const domainData = {
      faviconUrl: 'https://www.google.com/favicon.ico',
      appTitle: 'This is a tribute'
    };
    // this.setValuesAsPerDomain(domainData);
  }

  getDomainData(data) {
    const obj = {
      hostName: data
    };
    this.settingService.getDomainData(obj).subscribe(res => {
      if (res) {
        console.log(res);
        res['hostName'] = data;
        AuthService.setDomainDetails(res);
        this.setValuesAsPerDomain(res);
      }
    },
      err => {
        console.log(err);
      });
  }

  setValuesAsPerDomain(data) {
    this.document.getElementById('appAppleTouchIcon').setAttribute('href', data.feviconUrl);
    this.document.getElementById('appIcon32').setAttribute('href', data.feviconUrl);
    this.document.getElementById('appIcon').setAttribute('href', data.feviconUrl);
    // console.log('titleElement', this.document.getElementById('appTitle'));
    this.document.title = data.siteTitle;
    // this.document.getElementById('appTitle').setAttribute('title', data.appTitle);

    // appTitle
  }

  ngAfterViewInit(): void {
    this.routingState.setMainRouter(this.mainrouter);

  }

  constructor(
    private lBar: SlimLoadingBarService,
    private _router: Router, private eventService: EventService,
    private routingState: RoutingState,
    private location: PlatformLocation,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private settingService: SettingsService,
    public enumDataService: EnumDataService,
    @Inject(DOCUMENT) private document
  ) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.onlineStatus = true;
        this.showTimeRemaining = 5;
        this.intervalTimer.unsubscribe();
      } else {
        this.onlineStatus = false;
        this.countDown(5);
      }
    });
    // routingState.changeDetector = changeDetector;
    routingState.router = _router;
    routingState.loadRouting();
    this._router.events.subscribe((event: Event) => {
      this.loadingBarInterceptor(event);
    });
    console.log('document.location', document.location);
    console.log('document : ', document);
    // document.location.host
  }

  countDown(timer) {
    this.timeLeft = timer;
    this.setNewTime = timer;
    this.intervalTimer = interval(1000).subscribe(
      data => {
        if (this.timeLeft == 0) {
          timer = 2 * timer;
          this.timeLeft = 2 * timer;
        } else {
          this.showTimeRemaining = this.timeLeft--;
        }
      }
    );
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
