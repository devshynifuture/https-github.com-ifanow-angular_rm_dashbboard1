import { Component, OnInit, Output, Input,EventEmitter} from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../subscription-inject.service';
import { SubscriptionService } from '../../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';


@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  payeeDataRes: any;
  noDataMessage: string;
  @Output() subStartNextBtn = new EventEmitter();
  

  @Input()
  set data(payeeData) {
      this._payeeData = payeeData;
      console.log('input payeeData : ', this._payeeData);
  }
  restrictAfter100(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
    }
  }

  

  constructor(public utils: UtilService, private enumService: EnumServiceService,public subInjectService: SubscriptionInject, public subService: SubscriptionService, public eventService: EventService, private fb: FormBuilder) {

  }


  // noDataMessage = 'Loading...';
  _payeeData: any;

  @Output() outputData = new EventEmitter<Object>();
  @Output() payeeFlag = new EventEmitter<Object>();
  dataSub: any;
  dataObj;
  getRowData: any;
  isSelectedPlan: any;
  arraTosend: any;
  dataMatSlider: any;
  clickedOnMatSlider = false;
  subscriptionDetails: FormGroup;
  totalValue = 0;
  feeMode:any;
  isEdite:boolean = false;
  ngOnInit() {
    // console.log('change payee upperData', this.upperData);
    this.subscriptionDetails = this.fb.group({
      id:[this._payeeData.id],
      subscriptionNumber: [this._payeeData.subscriptionNumber, [Validators.required]],
      startsOn: [new Date(this._payeeData.startsOn), [Validators.required]],
      invoiceSending: [1, [Validators.required]],
      feeMode: [this._payeeData.feeMode, [Validators.required]],
      dueDateFrequency: [5, [Validators.required]]
    });

    this.feeMode = this.enumService.getFeeCollectionModeData();

  }

  enableForm(){
    this.isEdite = true;
  }

  Close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close',refreshRequired:flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag });
  }
  

  saveChangeSubsDetails() {
    if(this.subscriptionDetails.invalid){
      this.subscriptionDetails.get('subscriptionNumber').markAsTouched();
      this.subscriptionDetails.get('startsOn').markAsTouched();
      this.subscriptionDetails.get('feeMode').markAsTouched();
      this.subscriptionDetails.get('invoiceSending').markAsTouched();
      this.subscriptionDetails.get('dueDateFrequency').markAsTouched();
    }
    else{
      this.barButtonOptions.active = true;
      console.log('obj ====', this.subscriptionDetails.value);
      this.subService.changeSubsDetails(this.subscriptionDetails.value).subscribe(
        data => {
          this.barButtonOptions.active = false;
          this.changeSubsDetails(data)
        },
        err =>{
          this.barButtonOptions.active = false;
          console.log(err,"error changePayeeSetting");
        }
      );
    }
  }

  changeSubsDetails(data) {
    console.log('changeSubsDetails', data);
    
      this.eventService.openSnackBar('Details updated successfully', 'OK');
      this.Close(true);
    
  }

}
