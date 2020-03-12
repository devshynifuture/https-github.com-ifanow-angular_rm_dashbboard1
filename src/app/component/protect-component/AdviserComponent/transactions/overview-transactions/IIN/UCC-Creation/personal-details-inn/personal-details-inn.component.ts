import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';

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
  firstHolder: any;
  secondHolder: any;
  thirdHolder: any;
  holder = {
    type: 'first',
    data: ''
  }
  replaceObj: { panNumber: any; clientName: any; madianName: any; fatherName: any; motherName: any; dateOfBirth: any; gender: any; martialStatus: any; };
  validatorType = ValidatorType
  changedValue: string;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private processTransaction: ProcessTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
    public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    if (data && data.firstHolder) {
      this.getdataForm(data.firstHolder)
      this.firstHolder = data.firstHolder
      this.secondHolder = data.secondHolder
      this.thirdHolder = data.thirdHolder
      console.log('return data', data)
    }
    this.generalDetails = data
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {

    if (this.firstHolder) {
      this.getdataForm(this.firstHolder)
    } else {
      this.getdataForm('')
    }
    this.holdingList = []
    this.obj1 = []
  }
  close() {
    const fragmentData = {
      direction: 'top',
      componentName: PersonalDetailsInnComponent,
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    this.changedValue = 'close'
  }
  getdataForm(data) {

    this.personalDetails = this.fb.group({
      panNumber: [!data ? '' : data.panNumber, [Validators.required]],
      clientName: [!data ? '' : data.clientName, [Validators.required]],
      madianName: [!data ? '' : data.madianName, [Validators.required]],
      fatherName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName, [Validators.required]],
      dateOfBirth: [!data ? '' : data.dateOfBirth, [Validators.required]],
      gender: [!data ? '' : data.gender, [Validators.required]],
      maritalStatus: [!data ? '' : data.maritalStatus, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.personalDetails.controls;
  }
  openContactDetails(data) {

    const subscription = this.processTransaction.openContact(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }
  reset() {
    this.personalDetails.reset();
  }
  SendToForm(value, flag) {
    if (value == 'first') {
      this.savePersonalDetails(value);
      if (this.firstHolder) {
        this.holder.type = value;
        this.personalDetails.setValue(this.firstHolder);
      } else {
        this.reset();
      }
    }
    else if (value == 'second') {
      this.savePersonalDetails(value);
      if (this.secondHolder) {
        this.holder.type = value;
        this.personalDetails.setValue(this.secondHolder);
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.savePersonalDetails(value);
      if (this.thirdHolder) {
        this.holder.type = value;
        this.personalDetails.setValue(this.thirdHolder);
      } else {
        this.reset();
      };
    } else {
      this.savePersonalDetails(value);
    }
    this.obj1.firstHolder = this.firstHolder;
    this.obj1.secondHolder = this.secondHolder;
    this.obj1.thirdHolder = this.thirdHolder;
    this.obj1.generalDetails = this.generalDetails;
    if (flag == true) {
      this.openContactDetails(this.obj1);
    }
  }
  savePersonalDetails(value) {

    if (this.personalDetails.get('panNumber').invalid) {
      this.personalDetails.get('panNumber').markAsTouched();
      return
    } else if (this.personalDetails.get('clientName').invalid) {
      this.personalDetails.get('clientName').markAsTouched();
      return;
    } else if (this.personalDetails.get('madianName').invalid) {
      this.personalDetails.get('madianName').markAsTouched();
      return;
    } else if (this.personalDetails.get('fatherName').invalid) {
      this.personalDetails.get('fatherName').markAsTouched();
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

      this.setEditHolder(this.holder.type, value)

    }
  }

  setEditHolder(type, value) {
    switch (type) {
      case "first":
        this.firstHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

      case "second":
        this.secondHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

      case "third":
        this.thirdHolder = this.personalDetails.value;
        this.holder.type = value;
        break;

    }
  }
}