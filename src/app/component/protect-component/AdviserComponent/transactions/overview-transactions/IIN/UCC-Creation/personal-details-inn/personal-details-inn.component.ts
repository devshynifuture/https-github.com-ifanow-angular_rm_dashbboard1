import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatInput } from '@angular/material';

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
  doneData: any;
  advisorId: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private processTransaction: ProcessTransactionService,
    private onlineTransact: OnlineTransactionService, private datePipe: DatePipe, public utils: UtilService,
    public eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('all data in per', this.inputData)
    if (data && data.holderList) {
      this.getdataForm(data.holderList[0])
      this.firstHolder = data.holderList[0]
      this.secondHolder = data.holderList[1]
      this.thirdHolder = data.holderList[2]
      console.log('return data', data)
    } else if (data && data.firstHolder) {
      this.getdataForm(data.firstHolder)
      this.firstHolder = data.firstHolder
      this.secondHolder = data.secondHolder
      this.thirdHolder = data.thirdHolder
    }
    this.generalDetails = data
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.doneData = false
    if (this.firstHolder) {
      this.getdataForm(this.firstHolder)
    } else {
      this.getdataForm('')
    }
    this.holdingList = []
    this.obj1 = []
  }
  close() {
    this.changedValue = 'close'
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  getdataForm(data) {
    if (!data) {
      data = {
        address: {}
      }
    } else if (!data.address) {
      data.address = null
    }
    this.personalDetails = this.fb.group({
      panNumber: [!data ? '' : data.panNumber, [Validators.required]],
      clientName: [!data ? '' : data.clientName, [Validators.required]],
      madianName: [!data ? '' : data.madianName, [Validators.required]],
      fatherName: [!data ? '' : data.fatherName, [Validators.required]],
      motherName: [!data ? '' : data.motherName, [Validators.required]],
      dateOfBirth: [!data ? '' : data.dateOfBirth, [Validators.required]],
      gender: [!data ? '' : data.gender, [Validators.required]],
      email: [!data ? '' : data.email],
      aadharNumber: [!data ? '' : data.aadharNumber],
      mobileNo: [!data ? '' : data.mobileNo],
      phoneNo: [!data ? '' : data.phoneNo],
      maritalStatus: [!data ? '' : data.maritalStatus, [Validators.required]],
      addressLine1: [!data.address ? '' : data.address.addressLine1],
      addressLine2: [!data.address ? '' : data.address.addressLine2],
      pinCode: [!data.address ? '' : data.address.pinCode],
      city: [!data.address ? '' : data.address.city],
      district: [!data.address ? '' : data.address.district],
      state: [!data.address ? '' : data.address.state],
      country: [!data.address ? '' : data.address.country],
    });
  }
  getFormControl(): any {
    return this.personalDetails.controls;
  }
  openContactDetails(data) {
    this.doneData = true
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
    if (flag == true) {
      this.doneData = true
    }
    if (value == 'first') {
      this.savePersonalDetails(value);
      if (this.firstHolder && this.firstHolder.panNumber) {
        this.holder.type = value;
        this.personalDetails.setValue(this.firstHolder);
      } else {
        return;
      }
    }
    else if (value == 'second') {
      this.savePersonalDetails(value);
      if (this.secondHolder && this.secondHolder.panNumber) {
        this.holder.type = value;
        this.personalDetails.setValue(this.secondHolder);
      } else {
        this.reset();
      }
    }
    else if (value == 'third') {
      this.savePersonalDetails(value);
      if (this.thirdHolder && this.thirdHolder.panNumber) {
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
    this.obj1.holderList = this.inputData.holderList
    this.obj1.bankDetailList = this.inputData.bankDetailList
    this.obj1.nomineeList = this.inputData.nomineeList
    this.obj1.fatcaDetail = this.inputData.fatcaDetail;
    if (flag == true) {
      this.openContactDetails(this.obj1);
    }
  }
  savePersonalDetails(value) {
    if (this.personalDetails.invalid) {
      for (let element in this.personalDetails.controls) {
        console.log(element)
        if (this.personalDetails.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.personalDetails.controls[element].markAsTouched();
        }
      }
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