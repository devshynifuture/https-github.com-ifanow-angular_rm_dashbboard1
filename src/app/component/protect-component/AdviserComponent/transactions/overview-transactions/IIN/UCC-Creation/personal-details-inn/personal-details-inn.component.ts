import { Component, OnInit, Input } from '@angular/core';
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
  inputData: any;
  generalDetails: any;
  obj1: any;
  firstHolder: { panNumber: any; clientName: any; madianName: any; fatherName: any; motherName: any; dateOfBirth: any; gender: any; martialStatus: any; };
  secondHolder: { panNumber: any; clientName: any; madianName: any; fatherName: any; motherName: any; dateOfBirth: any; gender: any; martialStatus: any; };
  thirdHolder: { panNumber: any; clientName: any; madianName: any; fatherName: any; motherName: any; dateOfBirth: any; gender: any; martialStatus: any; };

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data)
    this.generalDetails = data
  }

  get data() {
    return this.inputData;
  }
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
      pan: [!data ? '' : data.panNumber, [Validators.required]],
      nameAsPan: [!data ? '' : data.clientName, [Validators.required]],
      madianName: [!data ? '' : data.madianName, [Validators.required]],
      fatherSpouseName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName, [Validators.required]],
      dateOfBirth: [!data ? '' : data.dateOfBirth, [Validators.required]],
      gender: [!data ? '' : data.gender, [Validators.required]],
      maritalStatus: [!data ? '' : data.martialStatus, [Validators.required]],
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
  reset() {
    this.personalDetails.reset();
  }
  SendToForm() {

  }
  savePersonalDetails(value) {

    if (value == 'skip') {
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
      this.holdingList.push(obj);
      this.obj1 = Object.assign({}, this.generalDetails, this.holdingList);
      this.openContactDetails(this.obj1)
    }
    if (value == 'first' && this.firstHolder != undefined) {
      this.getdataForm(this.firstHolder)
    } else if (value == 'second' && this.secondHolder != undefined) {
      this.getdataForm(this.secondHolder)
    } else if (value == 'third' && this.thirdHolder != undefined) {
      this.getdataForm(this.thirdHolder)
    } else {
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
        if (this.firstHolder == undefined || value == 'first') {
          this.firstHolder = obj
          this.getdataForm(this.firstHolder)
        } else if (value == 'second') {
          if (this.secondHolder == undefined && this.firstHolder != undefined) {
            this.reset()
          } else {
            this.secondHolder = obj
            this.getdataForm(this.secondHolder)
          }
        } else if (value == 'third') {
          if (this.thirdHolder == undefined && this.secondHolder == undefined) {
            this.secondHolder = obj
            this.getdataForm(this.secondHolder)
          } else if (this.thirdHolder == undefined && this.secondHolder != undefined && this.firstHolder != undefined) {
            this.reset();
          } else {
            this.thirdHolder = obj
            this.getdataForm(this.thirdHolder)
          }
        }
        if (!value) {
          this.holdingList.push(obj);
          this.obj1 = Object.assign({}, this.generalDetails, this.holdingList);
        }
      }
    }

    console.log('personalDetials obj', this.obj1)
  }
}