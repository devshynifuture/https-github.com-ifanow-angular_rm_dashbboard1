import {Injectable} from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() {
  }

  public eventEmitter(eventName: string, eventCategory: string,
                      eventAction: string, eventLabel: string = null, eventValue: number = null) {
    // this.googleAnalyticsService
    //   .eventEmitter('add_to_cart', 'shop',
    //     'cart', 'click', 10);
    gtag('event', eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
