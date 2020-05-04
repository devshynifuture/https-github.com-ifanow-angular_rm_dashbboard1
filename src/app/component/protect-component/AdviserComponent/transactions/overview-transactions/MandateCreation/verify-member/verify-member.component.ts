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
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { ParsedResponseHeaders, FileItem } from 'ng2-file-upload';

@Component({
  selector: 'app-verify-member',
  templateUrl: './verify-member.component.html',
  styleUrls: ['./verify-member.component.scss']
})
export class VerifyMemberComponent implements OnInit {
  inputData: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'ifsc', 'aid', 'euin', 'hold'];
  data1: Array<any> = [{}, {}, {}];
  dataSource = [];
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
  bankDetails: any;
  selectedBank: any;
  isLoadingUcc: boolean = false;
  isLoadingBank: boolean = false;
  showUploadSection: boolean = false;
  madateResponse: any;
  file: any;


  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private processTrasaction: ProcessTransactionService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              private onlineTransact: OnlineTransactionService, public eventService: EventService) {
                this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getdataForm('');
    this.showUploadSection = false
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
  getBankDetails() {
    this.isLoadingBank = true
    const obj = {
      tpUserCredFamilyMappingId: this.detailsIIN.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getBankDetailsNSE(obj).subscribe(
      data => this.getBankDetailsNSERes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getBankDetailsNSERes(data){
    this.isLoadingBank = false
    console.log(data)
    this.bankDetails = data
  }
  getdataForm(data) {

    this.generalDetails = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      holdingNature: [(!data) ? '' : data.ownerName, [Validators.required]],
      bank: [(!data) ? '' : data.bank, [Validators.required]],
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
      this.isLoadingUcc = true
    const obj = {
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      familyMemberId: this.familyMemberData.familyMemberId,
      // tpUserCredentialId: 292
    };
    this.onlineTransact.getClientCodes(obj).subscribe(
      data => {
        this.isLoadingUcc = false
        console.log(data);
        this.clientCodeData = data;
        console.log('clientCodeData',this.clientCodeData)
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  selectIINUCC(clientCode) {
    this.detailsIIN = clientCode;
    console.log('fg',this.detailsIIN)
    this.getBankDetails()
  //  this.getBankMandate();
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
  }

  selectMandate(mandate) {
    this.selectedMandate = mandate;
  }
  selectBank(bank){
    this.dataSource = []
    this.selectedBank = bank
    this.selectedMandate =bank
    this.dataSource.push(bank);
    this.showMandateTable = true;
    console.log(this.selectedBank)
  }

  createMandates() {
    if(!this.selectedMandate){
      this.selectedMandate = {}
    }
    this.formDate = new Date(this.generalDetails.controls.fromDate.value);
    this.Todate = new Date(this.generalDetails.controls.toDate.value);
    Object.assign(this.selectedMandate, {advisorId: this.detailsIIN.advisorId});
    Object.assign(this.selectedMandate, {clientCode: this.detailsIIN.clientCode});
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
    this.madateResponse = data
    this.eventService.openSnackBar('Added successfully!', 'Dismiss');
   // this.subInjectService.changeNewRightSliderState({state: 'close', data, refreshRequired: true});

   this.showUploadSection = true
  }
  getFileDetails(e,flag) {
    console.log('file', e);
    this.file = e.target.files[0];
    console.log('file', e);
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: 1,
      documentType: flag
    };
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.MANDATE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);

        if (status == 200) {
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);

        }
      });
  }
}
