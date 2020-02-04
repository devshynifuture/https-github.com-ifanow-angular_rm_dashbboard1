import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../../auth-service/authService';
import { DialogContainerComponent } from 'src/app/common/dialog-container/dialog-container.component';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from 'src/app/animation/animation';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';
import { Location } from '@angular/common';

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
  upperState: string = "close";
  isRefreshData: any;
  constructor(private router: Router, private authService: AuthService,
    protected eventService: EventService, protected subinject: SubscriptionInject, protected dynamicComponentService: DynamicComponentService, private location: Location
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
    this.isRefreshData = data;
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
    console.log(history.state);
    if (this.isRefreshData == undefined) {
      this.isRefreshData = AuthService.getSubscriptionUpperSliderData();
      this.fragmentDataSubsUpper = this.isRefreshData
      this.upperDataSubsUpper = this.isRefreshData.data;
    }
    // this.upperState = "open";
  }
  ngAfterViewInit() {
    // this.upperState = "close"
  }
  dialogClose() {
    // this.dialogRef.close();
    switch (true) {
      case (this.isRefreshData.flag == "plan" || this.isRefreshData == "plan"):
        this.router.navigate(['/admin/subscription/settings/plans'])
        this.location.replaceState('/admin/subscription/settings/plans');
        break;
      case (this.isRefreshData.flag == "services" || this.isRefreshData == ""):
        this.router.navigate(['/admin/subscription/settings/services'])
        this.location.replaceState('/admin/subscription/settings/services');
        break;
      case (this.isRefreshData.flag == "documents" || this.isRefreshData == "documents"):
        this.router.navigate(['/admin/subscription/settings/documents'])
        this.location.replaceState('/admin/subscription/settings/documents');
        break;
      default:
        // this.router.navigate(['/admin/subscription/clients'])
        this.location.replaceState('/admin/subscription/clients');
        // this.router.navigate(['/admin/subscription/clients'])
        break;
    }
    sessionStorage.removeItem('subUpperData')
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  getStateData(data) {
    this.State = data;
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
