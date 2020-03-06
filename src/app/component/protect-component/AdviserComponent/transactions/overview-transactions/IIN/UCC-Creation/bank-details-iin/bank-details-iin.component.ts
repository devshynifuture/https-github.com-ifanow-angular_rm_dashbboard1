import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-bank-details-iin',
  templateUrl: './bank-details-iin.component.html',
  styleUrls: ['./bank-details-iin.component.scss']
})
export class BankDetailsIINComponent implements OnInit {

  bankDetails: any;

  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
    this.getdataForm('')
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: BankDetailsIINComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {

    this.bankDetails = this.fb.group({
      email: [(!data) ? '' : data.inverstorType, [Validators.required]],
      mobileNo: [data ? '' : data.investorType2, [Validators.required]],
      phoneNo: [data ? '' : data.pan, [Validators.required]],
      addressType: [data ? '' : data.nameAsPan, [Validators.required]],
      idType: [data ? '' : data.madianName, [Validators.required]],
      idNumber: [data ? '' : data.fatherSpouseName, [Validators.required]],
      addressLine1: [data ? '' : data.motherName, [Validators.required]],
      addressLine2: [data ? '' : data.dateOfBirth, [Validators.required]],
      pinCode: [data ? '' : data.gender, [Validators.required]],
      city: [data ? '' : data.maritalStatus, [Validators.required]],
      district: [data ? '' : data.maritalStatus, [Validators.required]],
      state: [data ? '' : data.maritalStatus, [Validators.required]],
      country: [data ? '' : data.maritalStatus, [Validators.required]],

    });
  }
  getFormControl(): any {
    return this.bankDetails.controls;
  }
  savePersonalDetails() {
    if (this.bankDetails.get('email').invalid) {
      this.bankDetails.get('email').markAsTouched();
      return;
    } else if (this.bankDetails.get('mobileNo').invalid) {
      this.bankDetails.get('mobileNo').markAsTouched();
      return;
    } else if (this.bankDetails.get('phoneNo').invalid) {
      this.bankDetails.get('phoneNo').markAsTouched();
      return
    } else if (this.bankDetails.get('addressType').invalid) {
      this.bankDetails.get('addressType').markAsTouched();
      return;
    } else if (this.bankDetails.get('idType').invalid) {
      this.bankDetails.get('idType').markAsTouched();
      return;
    } else if (this.bankDetails.get('idNumber').invalid) {
      this.bankDetails.get('idNumber').markAsTouched();
      return;
    } else if (this.bankDetails.get('addressLine1').invalid) {
      this.bankDetails.get('addressLine1').markAsTouched();
      return;
    } else if (this.bankDetails.get('addressLine2').invalid) {
      this.bankDetails.get('addressLine2').markAsTouched();
      return;
    }else if (this.bankDetails.get('pinCode').invalid) {
      this.bankDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.bankDetails.get('city').invalid) {
      this.bankDetails.get('city').markAsTouched();
      return;
    }  else if (this.bankDetails.get('district').invalid) {
      this.bankDetails.get('district').markAsTouched();
      return;
    } else if (this.bankDetails.get('state').invalid) {
      this.bankDetails.get('state').markAsTouched();
      return;
    }else if (this.bankDetails.get('country').invalid) {
      this.bankDetails.get('country').markAsTouched();
      return;
    } else {
      let obj = {
        email: this.bankDetails.controls.email.value,
        mobileNo: this.bankDetails.controls.mobileNo.value,
        phoneNo: this.bankDetails.controls.phoneNo.value,
        addressType: this.bankDetails.controls.addressType.value,
        idType: this.bankDetails.controls.idType.value,
        idNumber: this.bankDetails.controls.idNumber.value,
        addressLine1: this.bankDetails.controls.addressLine1.value,
        addressLine2: this.bankDetails.controls.addressLine2.value,
        pincode: this.bankDetails.controls.pincode.value,
        city: this.bankDetails.controls.city.value,
        district: this.bankDetails.controls.district.value,
        state: this.bankDetails.controls.state.value,
        country: this.bankDetails.controls.country.value,
      }
    }
  }
}
