import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserTimingService {

  constructor() {
  }

  static eventEmitter() {
    // performance.addEventListener('');
    const navigationEntries = performance.getEntriesByType('navigation');
    // returns an array of a single object by default so we're directly getting that out.

    console.log('UserTimingService eventEmitter navigationEntries : ', navigationEntries);
    performance.clearMarks();
    performance.clearMeasures();
    performance.clearResourceTimings();
  }
}
