import {Component, OnInit} from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../../../../auth-service/authService';
import {DialogContainerComponent} from 'src/app/common/dialog-container/dialog-container.component';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from 'src/app/animation/animation';
import {DynamicComponentService} from 'src/app/services/dynamic-component.service';
import {Location} from '@angular/common';

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

  fragmentDataSubsUpper: any;

  get data() {
    return this.fragmentDataSubsUpper;
  }

  selectedServiceTab = 0;
  sessionData: any;
  upperState = 'close';
  referenceData: any;
  isRefreshData = false;
  addedData: any;

  constructor(private router: Router, private authService: AuthService,
              protected eventService: EventService, protected subinject: SubscriptionInject,
              protected dynamicComponentService: DynamicComponentService, private location: Location
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


    //     this.fragmentDataSubsUpper = data;

    //     this.State = 'close';

    //     this.upperDataSubsUpper = this.fragmentDataSubsUpper.data;

    //   }
    // );
  }

  subscriptionTab: any;

  State;
  rightSliderFlag;
  upperDataSubsUpper;
  sendAddedData: any;
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

  set data(data) {
    this.referenceData = data;
    this.fragmentDataSubsUpper = {data};
  }

  ngOnInit() {
    // if (this.referenceData == undefined) {
    this.referenceData = AuthService.getSubscriptionUpperSliderData();
    this.fragmentDataSubsUpper = this.referenceData;
    this.upperDataSubsUpper = this.referenceData.data;

    // }
    // this.upperState = "open";
  }

  dialogClose() {
    // this.dialogRef.close();

    switch (true) {
      case (this.referenceData.flag == 'plan'):
        this.router.navigate(['/admin/subscription/settings/plans']);
        this.location.replaceState('/admin/subscription/settings/plans');
        break;
      case (this.referenceData.flag == 'services'):
        this.router.navigate(['/admin/subscription/settings/services']);
        this.location.replaceState('/admin/subscription/settings/services');
        break;
      case (this.referenceData.flag == 'documents'):
        this.router.navigate(['/admin/subscription/settings/documents']);
        this.location.replaceState('/admin/subscription/settings/documents');
        break;
      default:
        this.router.navigate(['/admin/subscription/clients']);
        this.location.replaceState('/admin/subscription/clients');
        // this.router.navigate(['/admin/subscription/clients'])
        break;
    }
    sessionStorage.removeItem('subUpperData');
    if (this.isRefreshData) {
      this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
    } else {
      this.eventService.changeUpperSliderState({state: 'close', refreshRequired: false});
    }
  }

  getData(event) {
    // this.addedData = event
    this.sendAddedData = event;
    this.addedData = this.fragmentDataSubsUpper.data;
    // this.fragmentDataSubsUpper.data = this.addedData ;
    if (event != undefined) {
      this.isRefreshData = true;
    }
  }

  getStateData(data) {
    this.State = data;
  }

  getUpperDataValue(data) {
    this.upperDataSubsUpper = data;
  }

  getCancelInvoiceSubscription(data) {
    this.ngOnInit();
  }

  setRightSliderFlag(data) {
    this.blankOverview = data;
    this.rightSliderFlag = data;
  }

  tabClick(event) {
    this.subscriptionTab = event.tab.textLabel;
    this.selectedServiceTab = event.index;
  }

  // openClientDetails() {
  //   this.authService.setClientData(this.fragmentDataSubsUpper.data);
  //   this.router.navigateByUrl('/customer/detail', {state: this.fragmentDataSubsUpper.data});
  //   this.dialogClose();

  // }

}
