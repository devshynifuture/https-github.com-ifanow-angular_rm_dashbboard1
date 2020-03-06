import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  personalDetails: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
    this.getdataForm('')
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: PersonalDetailsComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {

    this.personalDetails = this.fb.group({
      inverstorType: [(!data) ? '' : data.inverstorType, [Validators.required]],
      investorType2: [data ? '' : data.investorType2, [Validators.required]],
      pan: [data ? '' : data.pan, [Validators.required]],
      nameAsPan: [data ? '' : data.nameAsPan, [Validators.required]],
      madianName: [data ? '' : data.madianName, [Validators.required]],
      fatherSpouseName: [data ? '' : data.fatherSpouseName, [Validators.required]],
      motherName: [data ? '' : data.motherName, [Validators.required]],
      dateOfBirth: [data ? '' : data.dateOfBirth, [Validators.required]],
      gender: [data ? '' : data.gender, [Validators.required]],
      maritalStatus: [data ? '' : data.maritalStatus, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.personalDetails.controls;
  }
  savePersonalDetails() {
    if (this.personalDetails.get('inverstorType').invalid) {
      this.personalDetails.get('inverstorType').markAsTouched();
      return;
    } else if (this.personalDetails.get('investorType2').invalid) {
      this.personalDetails.get('investorType2').markAsTouched();
      return;
    } else if (this.personalDetails.get('pan').invalid) {
      this.personalDetails.get('pan').markAsTouched();
      return
    } else if (this.personalDetails.get('nameAsPan').invalid) {
      this.personalDetails.get('nameAsPan').markAsTouched();
      return;
    } else if (this.personalDetails.get('madianName').invalid) {
      this.personalDetails.get('madianName').markAsTouched();
      return;
    } else if (this.personalDetails.get('fatherSpouseName').invalid) {
      this.personalDetails.get('fatherSpouseName').markAsTouched();
      return;
    } else if (this.personalDetails.get('motherName').invalid) {
      this.personalDetails.get('motherName').markAsTouched();
      return;
    } else if (this.personalDetails.get('dateOfBirth').invalid) {
      this.personalDetails.get('dateOfBirth').markAsTouched();
      return;
    } else if (this.personalDetails.get('gender').invalid) {
      this.personalDetails.get('gender').markAsTouched();
      return;
    } else if (this.personalDetails.get('maritalStatus').invalid) {
      this.personalDetails.get('maritalStatus').markAsTouched();
      return;
    } else {
      let obj = {
        inverstorType: this.personalDetails.controls.inverstorType.value,
        investorType2: this.personalDetails.controls.investorType2.value,
        pan: this.personalDetails.controls.pan.value,
        nameAsPan: this.personalDetails.controls.nameAsPan.value,
        madianName: this.personalDetails.controls.madianName.value,
        fatherSpouseName: this.personalDetails.controls.fatherSpouseName.value,
        motherName: this.personalDetails.controls.motherName.value,
        dateOfBirth: this.personalDetails.controls.dateOfBirth.value,
        gender: this.personalDetails.controls.gender.value,
        maritalStatus: this.personalDetails.controls.maritalStatus.value,
      }
    }
  }
}
