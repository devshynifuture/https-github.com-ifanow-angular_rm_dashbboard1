import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {ProcessTransactionService} from '../../doTransaction/process-transaction.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {UtilService} from 'src/app/services/util.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatTableDataSource} from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-verify-member',
  templateUrl: './verify-member.component.html',
  styleUrls: ['./verify-member.component.scss']
})
export class VerifyMemberComponent implements OnInit {
  inputData: any;
  displayedColumns: string[] = ['set', 'position', 'name', 'weight', 'ifsc', 'aid', 'euin', 'hold'];
  data1: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource();
  nomineesListFM: any = [];
  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;
  clientCodeData: any;
  detailsIIN: any;
  showMandateTable = false;
  selectedMandate: any;
  customValue: any;
  Todate: any;
  formDate: Date;
  isLoading;
  advisorId: any;


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private processTrasaction: ProcessTransactionService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              private onlineTransact: OnlineTransactionService, public eventService: EventService) {
                this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getdataForm('');
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
  }

  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }

  continuesTill(value) {
    this.customValue = value;
    this.Todate = new Date();
    this.Todate.setDate('31');
    this.Todate.setMonth('11');
    this.Todate.setFullYear('2099');
    this.generalDetails.controls.toDate.setValue(this.Todate);
  }

  getdataForm(data) {

    this.generalDetails = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      holdingNature: [(!data) ? '' : data.ownerName, [Validators.required]],
      taxStatus: [data ? '' : data.ownerName, [Validators.required]],
      fromDate: [data ? '' : data.fromDate, [Validators.required]],
      toDate: [data ? '' : data.toDate, [Validators.required]],
      mandateAmount: [data ? '' : data.mandateAmount, [Validators.required]],
      selectDateOption: [data ? '' : data.mandateAmount, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.generalDetails.controls;
  }


  lisNominee(value) {
    // this.showSpinnerOwner = false
    if (value == null) {
      // this.transactionAddForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      // this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value);
    this.nomineesListFM = Object.assign([], value);
  }

  ownerList(value) {
    if (value == '') {
      this.showSpinnerOwner = false;
    } else {
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.familyMemberId;
    this.familyMemberId = value.id;
    this.ownerDetail();
  }

  saveGeneralDetails(data) {
    const obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingNature: this.generalDetails.controls.holdingNature.value,
      familyMemberId: this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      taxStatus: this.generalDetails.controls.taxStatus.value,
    };
    this.openMandate(null);
  }

  ownerDetail() {

    const obj = {
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      familyMemberId: this.familyMemberData.familyMemberId,
      // tpUserCredentialId: 292
    };
    this.onlineTransact.getClientCodes(obj).subscribe(
      data => {
        console.log(data);
        this.clientCodeData = data;
        console.log('clientCodeData',this.clientCodeData)
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  selectIINUCC(clientCode) {

    this.detailsIIN = clientCode;
    this.getBankMandate();
  }

  getBankMandate() {
    const obj1 = {
      advisorId: this.advisorId,
      tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId,
      aggregatorType: this.detailsIIN.aggregatorType,
      tpUserCredentialId: this.detailsIIN.tpUserCredentialId,
      clientCode: this.detailsIIN.clientCode,
    };
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getBankDetailsMandateRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      });
  }

  getBankDetailsMandateRes(data) {
    console.log(data);
    this.openMandate(data);
  }

  openMandate(data) {
    this.inputData = data;
    this.dataSource = data;
    this.showMandateTable = true;
  }

  selectMandate(mandate) {
    this.selectedMandate = mandate;
  }

  createMandates() {
    this.formDate = new Date(this.generalDetails.controls.fromDate.value);
    this.Todate = new Date(this.generalDetails.controls.toDate.value);
    Object.assign(this.selectedMandate, {advisorId: this.detailsIIN.advisorId});
    Object.assign(this.selectedMandate, {amount: this.generalDetails.controls.mandateAmount.value});
    Object.assign(this.selectedMandate, {toDate: (this.Todate).getTime()});
    Object.assign(this.selectedMandate, {fromDate: (this.formDate).getTime()});
    Object.assign(this.selectedMandate, {tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId});
    Object.assign(this.selectedMandate, {tpUserCredentialId: this.detailsIIN.tpUserCredentialId});
    console.log('selectMandate  == ', this.selectedMandate);
    this.onlineTransact.addMandate(this.selectedMandate).subscribe(
      data => this.addMandateRes(data)
    );
  }

  addMandateRes(data) {
    console.log('res mandate', data);
    this.eventService.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({state: 'close', data, refreshRequired: true});
  }
}
