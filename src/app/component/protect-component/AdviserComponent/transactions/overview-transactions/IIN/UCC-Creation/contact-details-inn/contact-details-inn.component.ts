import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-contact-details-inn',
  templateUrl: './contact-details-inn.component.html',
  styleUrls: ['./contact-details-inn.component.scss']
})
export class ContactDetailsInnComponent implements OnInit {
  contactDetails: any;
  inputData: any;
  holdingList: any;

  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
    @Input()
    set data(data) {
      this.inputData = data;
      this.holdingList = data
    }
  
    get data() {
      return this.inputData;
    }
  ngOnInit() {
    this.getdataForm('')
    console.log('holding list',this.holdingList)
  }
  close(){
    const fragmentData = {
      direction: 'top',
      componentName: ContactDetailsInnComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {

    this.contactDetails = this.fb.group({
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
    return this.contactDetails.controls;
  }
  saveContactDetails() {
    if (this.contactDetails.get('email').invalid) {
      this.contactDetails.get('email').markAsTouched();
      return;
    } else if (this.contactDetails.get('mobileNo').invalid) {
      this.contactDetails.get('mobileNo').markAsTouched();
      return;
    } else if (this.contactDetails.get('phoneNo').invalid) {
      this.contactDetails.get('phoneNo').markAsTouched();
      return
    } else if (this.contactDetails.get('addressType').invalid) {
      this.contactDetails.get('addressType').markAsTouched();
      return;
    } else if (this.contactDetails.get('idType').invalid) {
      this.contactDetails.get('idType').markAsTouched();
      return;
    } else if (this.contactDetails.get('idNumber').invalid) {
      this.contactDetails.get('idNumber').markAsTouched();
      return;
    } else if (this.contactDetails.get('addressLine1').invalid) {
      this.contactDetails.get('addressLine1').markAsTouched();
      return;
    } else if (this.contactDetails.get('addressLine2').invalid) {
      this.contactDetails.get('addressLine2').markAsTouched();
      return;
    }else if (this.contactDetails.get('pinCode').invalid) {
      this.contactDetails.get('pinCode').markAsTouched();
      return;
    } else if (this.contactDetails.get('city').invalid) {
      this.contactDetails.get('city').markAsTouched();
      return;
    }  else if (this.contactDetails.get('district').invalid) {
      this.contactDetails.get('district').markAsTouched();
      return;
    } else if (this.contactDetails.get('state').invalid) {
      this.contactDetails.get('state').markAsTouched();
      return;
    }else if (this.contactDetails.get('country').invalid) {
      this.contactDetails.get('country').markAsTouched();
      return;
    } else {
      let obj = {
        email: this.contactDetails.controls.email.value,
        mobileNo: this.contactDetails.controls.mobileNo.value,
        phoneNo: this.contactDetails.controls.phoneNo.value,
        addressType: this.contactDetails.controls.addressType.value,
        idType: this.contactDetails.controls.idType.value,
        idNumber: this.contactDetails.controls.idNumber.value,
        addressLine1: this.contactDetails.controls.addressLine1.value,
        addressLine2: this.contactDetails.controls.addressLine2.value,
        pincode: this.contactDetails.controls.pincode.value,
        city: this.contactDetails.controls.city.value,
        district: this.contactDetails.controls.district.value,
        state: this.contactDetails.controls.state.value,
        country: this.contactDetails.controls.country.value,
      }
   
      this.holdingList.forEach(element => {
        element.merge(obj)
      });
      console.log('contact details',this.holdingList)
    }
  }
}
