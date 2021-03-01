import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'console';
import { BehaviorSubject } from 'rxjs';

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

  // private sideNavContainerClassValue = new BehaviorSubject('sidenav-container'); /*blur-filter*/
  // sideNavContainerClassData = this.sideNavContainerClassValue.asObservable();

  private overlayVisibleValue = new BehaviorSubject(false);
  overlayVisibleData = this.overlayVisibleValue.asObservable();

  private sliderRefreshState = new BehaviorSubject(false);

  private upperSliderData = new BehaviorSubject<object>({
    state: 'close',
    fragmentData: {},
    flag: '',
    componentName: ''
  });


  upperSliderDataObs = this.upperSliderData.asObservable();

  changeUpperSliderState(sliderState: object) {
    this.upperSliderData.next(sliderState);
    return this.upperSliderDataObs;
  }

  openUpperSlider(sliderData: any) {
    this.upperSliderData.next(sliderData);
    return this.upperSliderDataObs;
  }

  setRefreshRequired() {
    this.sliderRefreshState.next(true);
  }

  closeUpperSlider(sliderData) {
    const sliderCloseState = {
      refreshRequired: this.sliderRefreshState.getValue(),
      ...sliderData
    }
    this.upperSliderData.next(sliderCloseState);
    this.sliderRefreshState.next(false);
  }

  changeOverlayVisible(isVisible: boolean) {
    this.overlayVisibleValue.next(isVisible);
  }

  openSnackBar(message: string, action: string = null, actionCallback = null, duration = 2000) {
    const snackBbarref = this.snackBar.open(message, "Dismiss", {
      duration,
      panelClass: ['app-bottom-snackbar']
    });
    if (actionCallback) {
      snackBbarref.onAction().subscribe(actionCallback);
    }
  }

  openSnackBarWithCustomDismissBtn(message: string, action: string = null, actionCallback = null, duration = 2000) {
    const snackBarRef = this.snackBar.open(message, action, {
      duration,
      panelClass: ['app-bottom-snackbar']
    });
    if (actionCallback) {
      snackBarRef.onAction().subscribe(actionCallback);
    }
  }

  openSnackBarNoDuration(message: string, action: string = null, actionCallback = null) {
    const snackBarRef = this.snackBar.open(message, action, {
      panelClass: ['app-bottom-snackbar']
    });
    if (actionCallback) {
      snackBarRef.onAction().subscribe(actionCallback);
    }
  }

  showErrorMessage(data, actionCallback = null) {

    console.log(data)
    console.log(typeof data)
    if (typeof data == 'string') {
      this.openSnackBar(data, 'Dismiss', actionCallback);
    }
    else {
      this.openSnackBar('Something went wrong', 'Dismiss', actionCallback);
    }
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

  // sideNaveClass(className: string) {
  //   this.sideNavContainerClassValue.next(className);
  // }
}
