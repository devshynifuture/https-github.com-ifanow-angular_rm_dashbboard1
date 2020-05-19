import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionInject {

  private newRightSliderData = new BehaviorSubject<any>({state: 'close', fragmentData: {}, flag: ''});
  newRightSliderDataObs = this.newRightSliderData.asObservable();

  private upperRightSliderData = new BehaviorSubject<any>({state: 'close', fragmentData: {}, flag: ''});
  upperRightSliderDataObs = this.upperRightSliderData.asObservable();
  // right slider part
  private openCloseRightSlider = new BehaviorSubject<any>('close');
  rightSideBarData = this.openCloseRightSlider.asObservable();

  // upper slider part
  private openCloseupperSlider = new BehaviorSubject('');
  rightslider = this.openCloseupperSlider.asObservable();

  // billerProfileData

  private billerData = new BehaviorSubject('');
  singleProfileData = this.billerData.asObservable();


  private refreshObservable = new BehaviorSubject<boolean>(false);

  rightSideData(msg) {
    this.openCloseRightSlider.next(msg);
    return this.rightSideBarData;
  }

  rightSliderData(msg: string) {
    this.openCloseupperSlider.next(msg);
  }

  addSingleProfile(obj) {
    this.billerData.next(obj);
    return this.singleProfileData;
  }

  changeUpperRightSliderState(sliderState: object) {
    this.upperRightSliderData.next(sliderState);
    return this.upperRightSliderDataObs;
  }


  // methods for opening compoennts in slider
  changeNewRightSliderState(sliderState: object) {
    this.newRightSliderData.next(sliderState);
    return this.newRightSliderDataObs;
  }

  setRefreshRequired() {
    this.refreshObservable.next(true);
  }

  openNewRightSlider(sliderData: any) {
    this.newRightSliderData.next(sliderData);
    return this.newRightSliderDataObs;
  }

  closeNewRightSlider(sliderObj: any) {
    const sliderCloseObj = {
      refreshRequired: this.refreshObservable.getValue(),
      ...sliderObj
    };
    this.refreshObservable.next(false);
    this.newRightSliderData.next(sliderCloseObj);
  }

  // ending of methods for opening components in slider
}
