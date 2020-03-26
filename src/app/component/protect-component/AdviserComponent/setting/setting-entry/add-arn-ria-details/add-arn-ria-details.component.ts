import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-arn-ria-details',
  templateUrl: './add-arn-ria-details.component.html',
  styleUrls: ['./add-arn-ria-details.component.scss']
})
export class AddArnRiaDetailsComponent implements OnInit, OnDestroy {

  @Input() data:any;
  tomrrowsDate = new Date(Date.now() + 864e5);
  yesterdaysDate = new Date(Date.now() - 864e5);

  arnTypeOptions = [
    {
      type: 'Individual',
      id: 1
    },
    {
      type: 'Sole proprietorship',
      id: 2
    },
    {
      type: 'Partnership',
      id: 3
    },
    {
      type: 'LLP',
      id: 4
    },
    {
      type: 'Private limited',
      id: 5
    },
    {
      type: 'Limited',
      id: 6
    },
    {
      type: 'Bank',
      id: 7
    },
    {
      type: 'HUF',
      id: 8
    },
  ]

  arnRiaFG:FormGroup;
  subscriber = new Subscription();

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService,
    private settingService: SettingsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.subscriberToFormChanges();
  }

  createForm() {
    this.arnRiaFG = this.fb.group({
      arn_type: [this.data.arn_type, [Validators.required]],
      arn_number: [this.data.arn_number, [Validators.required, Validators.pattern(ValidatorType.NUMBER_ONLY)]],
      arn_holder: [this.data.arn_holder, [Validators.required]],
      arn_euin: [this.data.arn_euin, [Validators.required, Validators.pattern(/[eE]\d{6}/)]],
      arn_commencement_date: [this.data.arn_commencement_date, [Validators.required]],
      arn_renewal_date: [this.data.arn_renewal_date, [Validators.required]],
      arn_email: [this.data.arn_email, [Validators.required, Validators.email]],
      arn_pan: [this.data.arn_pan, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      arn_address: [this.data.arn_address, [Validators.required, Validators.maxLength(150)]],
      arn_treatment: [this.data.arn_treatment, [Validators.required]],
      arn_gst: [this.data.arn_gst, []],
      arn_data_upload: [this.data.arn_data_upload, [Validators.required]],
    });

    if(this.data.arn_treatment == 'applicable') {
      this.arnRiaFG.controls.arn_gst.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
      this.arnRiaFG.updateValueAndValidity();
    }
  }

  subscriberToFormChanges(){
    this.subscriber.add(
      this.arnRiaFG.controls.arn_treatment.valueChanges.subscribe((value)=>{
        if(value == 'applicable') {
          this.arnRiaFG.controls.arn_gst.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
        } else {
          this.arnRiaFG.controls.arn_gst.clearValidators();
          this.arnRiaFG.controls.arn_gst.setValue('');
        }
        this.arnRiaFG.updateValueAndValidity();
      })
    )
  }

  save(){
    if(this.arnRiaFG.invalid) {
      this.arnRiaFG.markAllAsTouched();
    } else {
      const jsonObj = this.arnRiaFG.getRawValue();
      jsonObj.arn_renewal_date = jsonObj.arn_renewal_date.toDate();
      jsonObj.arn_commencement_date = jsonObj.arn_commencement_date.toDate();

      // add action
      if(this.data.arn_pan) {
        this.settingService.addArn(jsonObj).subscribe((res)=> {
          this.eventService.openSnackBar("ARN-RIA Added successfully");
          this.Close(true);
        })
      } else {
        this.settingService.editArn(jsonObj).subscribe((res)=> {
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
