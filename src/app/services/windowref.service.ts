import {Injectable} from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable({
  providedIn: 'root'
})
export class WindowRef {
  get nativeWindow(): Document {
    return _window().document;
  }
}
