import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionInject {
  // right slider part
  private openCloseRightSlider = new BehaviorSubject<any>('close');
  rightSideBarData = this.openCloseRightSlider.asObservable();

  // upper slider part

  private openCloseupperSlider = new BehaviorSubject('');
  rightslider = this.openCloseupperSlider.asObservable();

  private openContent = new BehaviorSubject('');
  closeRightSlider = this.openContent.asObservable();

  // document-clients

  private openDocument = new BehaviorSubject('');
  rightSliderDocument = this.openDocument.asObservable();

  // billerProfileData

  private billerData = new BehaviorSubject('');
  singleProfileData = this.billerData.asObservable();

  rightSideData(msg) {
    console.log('dialog-container rightSideData: ', msg);

    this.openCloseRightSlider.next(msg);
  }

  rightSliderData(msg: string) {
    this.openCloseupperSlider.next(msg);
  }

  closeSlider(msg: string) {
    this.openContent.next(msg);
  }
/*
  rightDocumentSlider(msg: string) {
    this.openDocument.next(msg);
  }*/

  addSingleProfile(obj) {
    /**/
    this.billerData.next(obj);
    return this.singleProfileData;
  }

  private upper=new BehaviorSubject("");
  upperData=this.upper.asObservable();

  pushUpperData(data)
  {
    this.upper.next(data);
  }
}
