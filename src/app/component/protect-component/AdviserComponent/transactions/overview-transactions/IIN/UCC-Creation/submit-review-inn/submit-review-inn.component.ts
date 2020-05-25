import {Component, Input, OnInit} from '@angular/core';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {AuthService} from 'src/app/auth-service/authService';
import {FormBuilder, Validators} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {FatcaDetailsInnComponent} from '../fatca-details-inn/fatca-details-inn.component';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {FileUploadService} from '../../../../../../../../services/file-upload.service';
import {apiConfig} from '../../../../../../../../config/main-config';
import {appConfig} from '../../../../../../../../config/component-config';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {MatDialog} from '@angular/material';
import {IinCreationLoaderComponent} from './iin-creation-loader/iin-creation-loader.component';

@Component({
  selector: 'app-submit-review-inn',
  templateUrl: './submit-review-inn.component.html',
  styleUrls: ['./submit-review-inn.component.scss']
})
export class SubmitReviewInnComponent implements OnInit {

  isFileUploading = false;
  isSuccessful = false;

  constructor(private onlineTransact: OnlineTransactionService, private fb: FormBuilder,
              private eventService: EventService, public dialog: MatDialog) {
  }

  get data() {
    return this.inputData;
  }

  dialogRef;

  dataSourceNse = [];
  dataSourceBse = [];

  isLoading = false;
  selectedCount = 0;

  changedValue: string;
  advisorId: any;
  brokerCredentials: any;

  reviewSubmit: any;
  inputData: any;
  nse: any;
  bse: any;
  allData: any;
  createdBrokerMap: any = {};
  matValue: any;
  doneData: any;
  tokenRes: any;
  fileName: string;
  file: any;
  toSendObjHolderList: any;
  toSendObjBankList: any;
  toSendObjNomineeList: any;
  clientData: any;
  validatorType = ValidatorType;
  platform = '2';
  BSEValue = '2';
  responseMessage: any;
  statusString: any;

  @Input()
  set data(data) {
    this.doneData = {};
    this.inputData = data;
    console.log('submit and review component inputData : ', this.inputData);
    this.allData = data;
    this.clientData = this.clientData;
    this.doneData.nominee = true;
    this.doneData.bank = true;
    this.doneData.contact = true;
    this.doneData.personal = true;
    this.doneData.fatca = true;
    this.doneData.submit = false;
    if (data && data.firstHolder) {
      // this.getdataForm(data.firstHolder)
      // this.firstHolder = data.firstHolder
      // this.secondHolder = data.secondHolder
      // this.thirdHolder = data.thirdHolder
      // console.log('return data', data)
    }
    // this.generalDetails = data
  }

  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    this.changedValue = 'close';
  }

  ngOnInit() {
    this.changedValue = '';
    this.advisorId = AuthService.getAdvisorId();
    this.getBSECredentials();
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm('');
    this.matValue = false;
  }

  getBSECredentials() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    console.log('encode', obj);
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }

  getBSECredentialsRes(data) {
    this.isLoading = false;
    console.log('getBSECredentialsRes', data);
    this.brokerCredentials = data;
    if (this.brokerCredentials) {
      this.brokerCredentials.forEach(singleCred => {
        if (singleCred.defaultLogin == 1) {
          if (singleCred.aggregatorType == 1) {
            this.dataSourceNse.push(singleCred);
          } else {
            this.dataSourceBse.push(singleCred);
          }
          singleCred.selected = true;
          this.selectedCount = this.selectedCount + 1;
        }
      });
      if (this.selectedCount == 0 && this.brokerCredentials.length > 0) {
        const singleCred = this.brokerCredentials[0];
        if (singleCred.aggregatorType == 1) {
          this.dataSourceNse.push(singleCred);
        } else {
          this.dataSourceBse.push(singleCred);
        }
        singleCred.selected = true;
        this.selectedCount = this.selectedCount + 1;
      }
    }
    // this.bse = this.brokerCredentials.filter(element => element.aggregatorType == this.platform);
    console.log('nse', this.nse);
    console.log('bse', this.bse);
  }

  getdataForm(data) {

    this.reviewSubmit = this.fb.group({
      bseBroker: [!(data.bseBroker) ? data.bseBroker : '', [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      nseBroker: [!data ? '' : data.nseBroker, [Validators.required]],
      platform: [!data ? '2' : '2', [Validators.required]],
    });
  }

  openFatcaDetails() {
    const data = this.inputData;
    const temp = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: FatcaDetailsInnComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(temp).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  getFormControl(): any {
    return this.reviewSubmit.controls;
  }

  selectPlatform(value) {
    console.log('mat check', value);
    this.platform = value.value;
    this.BSEValue = value.value;
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == this.platform);
  }


  submit(singleBrokerCred) {
    this.doneData = true;
    this.toSendObjHolderList = [];
    this.toSendObjBankList = [];
    this.toSendObjNomineeList = [];
    this.allData.holderList.forEach(element => {
      if (element.email) {
        this.toSendObjHolderList.push(element);
      }
    });
    this.allData.bankDetailList.forEach(element => {
      if (element.address && element.ifscCode) {
        this.toSendObjBankList.push(element);
      }

    });
    this.allData.nomineeList.forEach(element => {
      if (element.address && element.nomineeName) {
        this.toSendObjNomineeList.push(element);
      }

    });
    this.allData.holderList = this.toSendObjHolderList;
    this.allData.bankDetailList = this.toSendObjBankList;
    this.allData.nomineeList = this.toSendObjNomineeList;
    this.inputData.clientData = this.clientData;

    const firstHolder = this.allData.holderList[0];
    if (this.allData.taxStatus == '02') {
      firstHolder.guardianName = firstHolder.fatherName;
      firstHolder.guardianPan = firstHolder.panNumber;
      firstHolder.panNumber = '';
      firstHolder.fatherName = '';
    }
    const obj1 = {
      ownerName: this.allData.ownerName,
      holdingType: this.allData.holdingType,
      taxStatus: (this.allData.taxStatus) ? this.allData.taxStatus : '01',
      holderList: this.toSendObjHolderList,
      bankDetailList: this.toSendObjBankList,
      nomineeList: this.toSendObjNomineeList,
      fatcaDetail: this.allData.fatcaDetail,
      divPayMode: this.allData.bankDetailList[0].paymentMode,
      occupationCode: this.allData.fatcaDetail.occupationCode,
      clientCode: this.reviewSubmit.controls.accountNumber.value,
      aggregatorType: singleBrokerCred.aggregatorType,
      familyMemberId: this.allData.familyMemberId,
      clientId: this.allData.clientId,
      advisorId: this.allData.advisorId,
      tpUserCredentialId: singleBrokerCred.id,
      commMode: 1,
      confirmationFlag: 1,
    };
    this.openIinUccClient(singleBrokerCred, obj1);
    // setTimeout(() => {
    //   if (this.dialogRef) {
    //     this.dialogRef.componentInstance.setSuccessData(obj1);
    //   }
    // }, 5000);
    this.onlineTransact.createIINUCC(obj1).subscribe(
      data => this.createIINUCCRes(data, singleBrokerCred), (error) => {
        if (this.dialogRef) {
          this.dialogRef.componentInstance.setFailureData(error);
        }
        // this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  createIINUCCRes(data, singleBrokerCred) {
    console.log('data respose =', data);
    singleBrokerCred.tpUserRequestId = data.id;
    singleBrokerCred.tpUserRequest = data;
    if (this.dialogRef) {
      this.dialogRef.componentInstance.setSuccessData(data);
    }
    this.isSuccessful = true;

  }

  getTokenRes(data) {
    console.log('token', data);
    this.tokenRes = data;
  }

  addNewRow() {
    this.brokerCredentials.forEach(singleCred => {
      if (!singleCred.selected) {
        if (singleCred.aggregatorType == 1) {
          this.dataSourceNse.push(singleCred);
        } else {
          this.dataSourceBse.push(singleCred);
        }
        singleCred.selected = true;
        this.selectedCount = this.selectedCount + 1;
      }
    });
  }

  getFileDetails(documentType, e, singleBrokerCred) {
    console.log('file', e);
    this.file = e.target.files[0];
    console.log('file', e);
    const file = e.target.files[0];
    const tpUserRequestId = singleBrokerCred.tpUserRequestId;
    if (!tpUserRequestId || tpUserRequestId == 0) {
      this.eventService.openSnackBar('Please create account first', 'Dismiss');
      return;
    }
    const requestMap = {
      tpUserRequestId,
      documentType
    };
    this.isFileUploading = true;
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);
        this.isFileUploading = false;
        if (status == 200) {
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);
          this.eventService.openSnackBar('File uploaded successfully');
        } else {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss');
        }
      });
  }

  openIinUccClient(singleBrokerCred, requestJson) {
    const data = {singleBrokerCred, requestJson};
    const Fragmentdata = {
      flag: 'IIn',
      ...data

    };
    this.dialogRef = this.dialog.open(IinCreationLoaderComponent, {
      width: '600px',
      height: '450px',
      data: Fragmentdata,
      autoFocus: false,
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      console.log(result, 'cancel was close');
      if (result != undefined) {
      }
    });
  }

}
