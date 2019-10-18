import {Component} from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {
  NavigationStart,
  NavigationEnd,
  Event,
  Router
} from '@angular/router';
import {EventService} from './Data-service/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isOverlayVisible;

  constructor(
    private lBar: SlimLoadingBarService,
    private _router: Router,
    private eventService: EventService
  ) {
    this._router.events.subscribe((event: Event) => {
      // console.log(event);
      this.loadingBarInterceptor(event);
    });
    this.eventService.overlayVisibleData.subscribe(
      data => {
        this.isOverlayVisible = data;
        console.log('AppComponent constructor: ', this.isOverlayVisible);
      }
    );
  }

  private loadingBarInterceptor(event: Event) {
    if (event instanceof NavigationStart) {
      this.lBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.lBar.complete();
    }
  }


}
