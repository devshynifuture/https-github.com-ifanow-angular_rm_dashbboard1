import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserTimingService {

  constructor() {
  }

  public eventEmitter(eventName: string, eventCategory: string,
                      eventAction: string, eventLabel: string = null, eventValue: number = null) {
    performance.mark('');
  }
}
