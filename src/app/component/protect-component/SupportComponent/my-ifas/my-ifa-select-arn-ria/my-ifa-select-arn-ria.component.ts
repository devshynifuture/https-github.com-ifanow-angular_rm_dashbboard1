import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from './../../../../../Data-service/event.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { UpperSliderBackofficeComponent } from '../../common-component/upper-slider-backoffice/upper-slider-backoffice.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-my-ifa-select-arn-ria',
  templateUrl: './my-ifa-select-arn-ria.component.html',
  styleUrls: ['./my-ifa-select-arn-ria.component.scss']
})
export class MyIfaSelectArnRiaComponent implements OnInit {
  dataToSend: any;
  options: any;
  rtId: any;
  selectedOption: any;

  constructor(
    public dialogRef: MatDialogRef<MyIfaSelectArnRiaComponent>,
    @Inject(MAT_DIALOG_DATA) public fragmentData: any,
    private fb: FormBuilder,
    private eventService: EventService,
    private subscriptionInject: SubscriptionInject
  ) { }

  selectArnRiaForm = this.fb.group({
    arnOrRia: [, Validators.required]
  });

  ngOnInit() {
    console.log('fragmentData', this.fragmentData)
    this.dataToSend = this.fragmentData.mainData;
    this.options = this.fragmentData.flag;
    this.options.forEach(element => {
      element.selected = false
    });
    this.rtId = this.fragmentData.rtId
  }

  selectedOtp(value) {
    console.log('selectedOtp', value)
    value.selected = true;
    this.selectedOption = value;
  }

  openUpperModule(flag, data) {
    if (flag == 'report') {
      data.startRecon = false;
    } else {
      data.startRecon = true;
    }
    const fragmentData = {
      flag,
      id: 1,
      data,
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();

        }
      }
    );

  }
  openUpperSliderBackoffice(flag, data) {
    this.dialogClose();
    data = this.fragmentData.mainData
    data.rtId = this.rtId
    const fragmentData = {
      flag: "clients",
      id: 1,
      data,
      direction: 'top',
      componentName: UpperSliderBackofficeComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        this.subscriptionInject.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();

        }
      }
    );

  }

  start() {
    if (this.selectArnRiaForm.valid) {
      this.dialogClose();
      this.openUpperModule('', '');
      this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
    } else if (this.selectArnRiaForm.invalid) {
      this.selectArnRiaForm.get('arnOrRia').markAsTouched();
    }

  }

  dialogClose() {
    this.dialogRef.close();
  }

}
