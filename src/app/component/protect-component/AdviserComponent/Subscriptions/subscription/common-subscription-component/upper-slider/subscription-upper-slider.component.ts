import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../../auth-service/authService';
import { DialogContainerComponent } from 'src/app/common/dialog-container/dialog-container.component';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from 'src/app/animation/animation';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';

@Component({
  selector: 'app-subscription-upper-slider',
  templateUrl: './subscription-upper-slider.component.html',
  styleUrls: ['./subscription-upper-slider.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})

export class SubscriptionUpperSliderComponent extends DialogContainerComponent implements OnInit {
  fragmentDataSubsUpper;
  selectedServiceTab = 0;
  upperRightSideInputData;
  sessionData: any;
  upperState: string;
  constructor(private router: Router, private authService: AuthService,
    protected eventService: EventService, protected subinject: SubscriptionInject, protected dynamicComponentService: DynamicComponentService
    // public dialogRef: MatDialogRef<UpperSliderComponent>,
    // @Inject(MAT_DIALOG_DATA) public fragmentDataSubsUpper: any
  ) {
    super(eventService, subinject, dynamicComponentService);
    // this.eventService.rightSliderData.subscribe(
    //   data => this.setRightSliderFlag(data)
    // );
    // this.subinject.upperRightSliderDataObs.subscribe(data => {
    //   const rightSliderFragData = data;
    //   this.upperRightSideInputData = data;
    //   this.setRightSliderFlag(rightSliderFragData.flag);
    //   this.getStateData(data.state);
    // });
    // this.subinject.rightslider.subscribe(
    //   data => this.getStateData(data)
    // );
    // this.subinject.upperDataSubsUpper.subscribe(
    //   data => this.getUpperDataValue(data)
    // );
    // this.eventService.upperSliderDataObs.subscribe(
    //   data => {

    //     console.log('DialogContainerComponent constructor upperSliderDataObs: ', data);

    //     this.fragmentDataSubsUpper = data;
    //     console.log('UpperSlider constructor ngOnInit: ', this.fragmentDataSubsUpper);

    //     this.State = 'close';

    //     this.upperDataSubsUpper = this.fragmentDataSubsUpper.data;

    //     console.log('upperDataSubsUpper: ', this.upperDataSubsUpper);
    //     console.log(this.fragmentDataSubsUpper);
    //   }
    // );
  }

  get data() {
    return this.fragmentDataSubsUpper;
  }

  set data(data) {
    console.log('SubscriptionUpperSliderComponent data : ', data);
    this.fragmentDataSubsUpper = { data };
  }

  subscriptionTab: any;

  State;
  rightSliderFlag;
  upperDataSubsUpper;

  flag = 'planOverview';
  plan = 'planServices';
  documents = 'plansDocuments';
  plans = 'servicesPlans';
  clientDocuments = 'clientDocuments';
  servicesDocuments = 'servicesDocuments';
  blankOverview;
  headerData = 'EMAIL QUOTATION';
  headerDataInvoice = 'EMAIL INVOICE';
  headerDataDocuments = 'EMAIL DOCS WITH E-SIGN REQUEST';

  ngOnInit() {
    console.log(history.state)
    this.sessionData = AuthService.getSubscriptionUpperSliderData();
    this.fragmentDataSubsUpper = this.sessionData
    this.upperDataSubsUpper = this.sessionData.data;
    this.upperState = "open";
  }
  ngAfterViewInit() {
    this.upperState = "close"
  }
  dialogClose() {
    // this.eventService.changeUpperSliderState({ state: 'close' });
    // this.dialogRef.close();
    switch (true) {
      case (this.sessionData.flag == "plan" || this.sessionData.flag == "service" || this.sessionData.flag == "document"):
        this.router.navigate(['/admin/subscription/settings'])
        break;
      default:
        this.router.navigate(['/admin/subscription/clients'])
    }
    this.upperState = "open";

    sessionStorage.removeItem('subUpperData')
  }

  getStateData(data) {
    this.State = data;
  }
  getPlanData(data) {
    this.upperDataSubsUpper = data;
  }
  getServiceData(data) {
    this.upperDataSubsUpper = data;
  }
  getDocumentData(data) {
    this.upperDataSubsUpper = data;
  }
  getUpperDataValue(data) {
    this.upperDataSubsUpper = data;
    console.log('upperDataSubsUpper', this.upperDataSubsUpper);
  }
  getCancelInvoiceSubscription(data) {
    console.log(data);
    this.ngOnInit();
  }
  setRightSliderFlag(data) {
    this.blankOverview = data;
    this.rightSliderFlag = data;
    console.log('value', data);
  }

  tabClick(event) {
    console.log(event);
    this.subscriptionTab = event.tab.textLabel;
    this.selectedServiceTab = event.index;
  }

  // openClientDetails() {
  //   this.authService.setClientData(this.fragmentDataSubsUpper.data);
  //   this.router.navigateByUrl('/customer/detail', {state: this.fragmentDataSubsUpper.data});
  //   this.dialogClose();

  // }

}
