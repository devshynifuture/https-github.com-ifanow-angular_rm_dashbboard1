import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ContactDetailsInnComponent } from '../contact-details-inn/contact-details-inn.component';

@Component({
  selector: 'app-personal-details-inn',
  templateUrl: './personal-details-inn.component.html',
  styleUrls: ['./personal-details-inn.component.scss']
})
export class PersonalDetailsInnComponent implements OnInit {

  personalDetails: any;
  holdingList: any;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }

  ngOnInit() {
    this.getdataForm('')
    this.holdingList = []
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: PersonalDetailsInnComponent,
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
  openContactDetails(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ContactDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  savePersonalDetails() {

    // "holderList": [
    //   {
    //     "id": 2,
    //     "clientName": "GAURAV GANGESHWAR DWIVEDI",
    //     "panNumber": "AXCPD6453F",
    //     "email": "gaurav.dwivedi1990@gmail.com",
    //     "mobileNumber": "9004776228",
    //     "aadharNumber": "625012386467",
    //     "gender": 1,
    //     "martialStatus": 1,
    //     "fatherName": "GANGESHWAR AYODHYA DWIVEDI",
    //     "motherName": "SEWA GANGESHWAR DWIVEDI",
    //     "countryCode": "IND",
    //     "addressId": 5,
    //     "address": {
    //       "id": 5,
    //       "address1": "B-8/1, JAI DURGA CHS, NETAJI NAGAR, 90 FT RD",
    //       "address2": "SAKINAKA,KURLA-W",
    //       "address3": null,
    //       "pinCode": 400072,
    //       "city": "MUMBAI",
    //       "state": "MAHARASHTRA",
    //       "stateId": "MA",
    //       "country": "INDIA",
    //       "update": false
    //     },
    if (this.personalDetails.get('pan').invalid) {
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
        panNumber: this.personalDetails.controls.pan.value,
        clientName: this.personalDetails.controls.nameAsPan.value,
        madianName: this.personalDetails.controls.madianName.value,
        fatherName: this.personalDetails.controls.fatherSpouseName.value,
        motherName: this.personalDetails.controls.motherName.value,
        dateOfBirth: this.personalDetails.controls.dateOfBirth.value,
        gender: this.personalDetails.controls.gender.value,
        martialStatus: this.personalDetails.controls.maritalStatus.value,
      }
      console.log('personalDetials obj', obj)
      this.holdingList.push(obj);
      this.openContactDetails(obj)
    }
  }
}