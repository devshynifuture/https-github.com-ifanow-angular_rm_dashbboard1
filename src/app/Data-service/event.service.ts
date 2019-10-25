import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(public snackBar: MatSnackBar) {
  }

  // right slider part
  private sidebarValue = new BehaviorSubject<any>('');
  sidebarSubscribeData = this.sidebarValue.asObservable();

  private tabValue = new BehaviorSubject<any>('');
  tabChangeData = this.tabValue.asObservable();

  // upper slider part
  private rightSliderValue = new BehaviorSubject('');
  rightSliderData = this.rightSliderValue.asObservable();

  private sideNavContainerClassValue = new BehaviorSubject('sidenav-container'); /*blur-filter*/
  sideNavContainerClassData = this.sideNavContainerClassValue.asObservable();

  private overlayVisibleValue = new BehaviorSubject(false);
  overlayVisibleData = this.overlayVisibleValue.asObservable();

  private upperSliderData = new BehaviorSubject<object>({state: 'close', fragmentData: {}, flag: ''});
  upperSliderDataObs = this.upperSliderData.asObservable();


  changeUpperSliderState(sliderState: object) {
    this.upperSliderData.next(sliderState);
    return this.upperSliderDataObs;
  }

  changeOverlayVisible(isVisible: boolean) {
    this.overlayVisibleValue.next(isVisible);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['app-bottom-snackbar']
    });
  }

  sidebarData(message: string) {
    this.sidebarValue.next(message);
    return this.sidebarSubscribeData;
  }

  tabData(message: string) {
    this.tabValue.next(message);
  }

  sliderData(msg: string) {
    this.rightSliderValue.next(msg);
  }

  sideNaveClass(className: string) {
    this.sideNavContainerClassValue.next(className);
  }
}
