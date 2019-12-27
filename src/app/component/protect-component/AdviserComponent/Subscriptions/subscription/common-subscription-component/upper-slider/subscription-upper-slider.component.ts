import {Component, OnInit} from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../../../../auth-service/authService';

@Component({
  selector: 'app-subscription-upper-slider',
  templateUrl: './subscription-upper-slider.component.html',
  styleUrls: ['./subscription-upper-slider.component.scss']
})

export class SubscriptionUpperSliderComponent implements OnInit {
  fragmentData;
  selectedServiceTab = 0;
  upperRightSideInputData;

  constructor(private router: Router, private authService: AuthService,
              private eventService: EventService, private subinject: SubscriptionInject
              // public dialogRef: MatDialogRef<UpperSliderComponent>,
              // @Inject(MAT_DIALOG_DATA) public fragmentData: any
  ) {
    this.eventService.rightSliderData.subscribe(
      data => this.setRightSliderFlag(data)
    );
    this.subinject.upperRightSliderDataObs.subscribe(data => {
      const rightSliderFragData = data;
      this.upperRightSideInputData = data;
      this.setRightSliderFlag(rightSliderFragData.flag);
      this.getStateData(data.state);
    });
    this.subinject.rightslider.subscribe(
      data => this.getStateData(data)
    );
    this.subinject.upperData.subscribe(
      data => this.getUpperDataValue(data)
    );
    this.eventService.upperSliderDataObs.subscribe(
      data => {
        console.log('DialogContainerComponent constructor upperSliderDataObs: ', data);

        this.fragmentData = data;
        console.log('UpperSlider constructor ngOnInit: ', this.fragmentData);

        this.State = 'close';

        this.upperData = this.fragmentData.data;

        console.log('upperData: ', this.upperData);
        console.log(this.fragmentData);
      }
    );
  }

  get data() {
    return this.fragmentData;
  }

  set data(data) {
    console.log('SubscriptionUpperSliderComponent data : ', data);
    this.fragmentData = {data};
  }

  subscriptionTab: any;

  State;
  rightSliderFlag;
  upperData;

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

  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
    // this.dialogRef.close();
  }

  getStateData(data) {
    this.State = data;
  }

  getUpperDataValue(data) {
    this.upperData = data;
    console.log('upperData', this.upperData);
  }

  setRightSliderFlag(data) {
    this.blankOverview = data;
    this.rightSliderFlag = data;
    console.log('value', data);
  }

  tabClick(event) {
    console.log(event);
    this.subscriptionTab = event.tab.textLabel;
  }

  // openClientDetails() {
  //   this.authService.setClientData(this.fragmentData.data);
  //   this.router.navigateByUrl('/customer/detail', {state: this.fragmentData.data});
  //   this.dialogClose();

  // }

}
