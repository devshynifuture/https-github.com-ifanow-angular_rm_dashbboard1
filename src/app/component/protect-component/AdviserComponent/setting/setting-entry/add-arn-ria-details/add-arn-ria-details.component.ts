import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-arn-ria-details',
  templateUrl: './add-arn-ria-details.component.html',
  styleUrls: ['./add-arn-ria-details.component.scss']
})
export class AddArnRiaDetailsComponent implements OnInit, OnDestroy {

  @Input() data:any;
  tomrrowsDate = new Date(Date.now() + 864e5);
  yesterdaysDate = new Date(Date.now() - 864e5);
  arnRiaFG:FormGroup;
  subscriber = new Subscription();
  advisorId:any;

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    console.log(this.data);
    this.createForm();
    this.subscriberToFormChanges();
  }

  // "arnOrRia":1
  createForm() {
    this.arnRiaFG = this.fb.group({
      advisorId: [this.advisorId,[]],
      typeId: [this.data.mainData.typeId, [Validators.required]],
      number: [this.data.mainData.number, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      nameOfTheHolder: [this.data.mainData.nameOfTheHolder, [Validators.required]],
      euin: [this.data.mainData.euin, [Validators.required, Validators.pattern(/[eE]\d{6}/)]],
      commencementDate: [this.data.mainData.commencementDate, [Validators.required]],
      renewalDate: [this.data.mainData.renewalDate, [Validators.required]],
      registeredEmail: [this.data.mainData.registeredEmail, [Validators.required, Validators.email]],
      registeredPan: [this.data.mainData.registeredPan, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      registeredAddress: [this.data.mainData.registeredAddress, [Validators.required, Validators.maxLength(150)]],
      gstApplicableId: [this.data.mainData.gstApplicableId, [Validators.required]],
      gstNumber: [this.data.mainData.gstNumber, []],
      dataUploadTypeId: [this.data.mainData.dataUploadTypeId, [Validators.required]],
    });

    if(this.data.mainData.gstApplicableId == 1) {
      this.arnRiaFG.controls.gstNumber.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
    }
    if(this.data.mainData.advisorId) {
      this.arnRiaFG.controls.commencementDate.setValue(new Date(this.data.mainData.commencementDate));
      this.arnRiaFG.controls.renewalDate.setValue(new Date(this.data.mainData.renewalDate));
      this.arnRiaFG.updateValueAndValidity();
    }
  }

  subscriberToFormChanges(){
    this.subscriber.add(
      this.arnRiaFG.controls.gstApplicableId.valueChanges.subscribe((value)=>{
        if(value == 1) {
          this.arnRiaFG.controls.gstNumber.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
        } else {
          this.arnRiaFG.controls.gstNumber.clearValidators();
          this.arnRiaFG.controls.gstNumber.setValue('');
        }
        this.arnRiaFG.updateValueAndValidity();
      })
    )
  }

  save(){
    if(this.arnRiaFG.invalid) {
      this.arnRiaFG.markAllAsTouched();
    } else {
      const jsonObj = {
        ...this.data.mainData,
        ...this.arnRiaFG.getRawValue()
      };

      if(jsonObj.commencementDate instanceof Date) {
        jsonObj.commencementDate = this.datePipe.transform(jsonObj.commencementDate, 'yyyy-MM-dd');
      } else {
        jsonObj.commencementDate = this.datePipe.transform(jsonObj.commencementDate.toDate(), 'yyyy-MM-dd');
      }
      if(jsonObj.renewalDate instanceof Date) {
        jsonObj.renewalDate = this.datePipe.transform(jsonObj.renewalDate, 'yyyy-MM-dd');
      } else {
        jsonObj.renewalDate = this.datePipe.transform(jsonObj.renewalDate.toDate(), 'yyyy-MM-dd');
      }

      // edit action
      if(this.data.mainData.typeId) {
        const editJson = {
          ...this.data.mainData,
          ...jsonObj
        }
        this.settingService.editArn(editJson).subscribe((res)=> {
          this.eventService.openSnackBar("ARN-RIA Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.addArn(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("ARN-RIA Modified successfully");
          this.Close(true);
        })
      }
    }
  }

  Close(status) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: status });
  }

  ngOnDestroy(){
    this.subscriber.unsubscribe();
  }
}
