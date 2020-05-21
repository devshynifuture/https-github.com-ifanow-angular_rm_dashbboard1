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

@Component({
  selector: 'app-submit-review-inn',
  templateUrl: './submit-review-inn.component.html',
  styleUrls: ['./submit-review-inn.component.scss']
})
export class SubmitReviewInnComponent implements OnInit {
  changedValue: string;
  advisorId: any;
  brokerCredentials: any;
  reviewSubmit: any;
  inputData: any;
  nse: any;
  bse: any;
  allData: any;
  createdBrokerMap: any = {};
  selectedBrokerBse: any;
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
  isLoading: boolean = false;


  constructor(private onlineTransact: OnlineTransactionService, private fb: FormBuilder,
              private eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.doneData = {};
    this.inputData = data;
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

  get data() {
    return this.inputData;
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
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }

  getBSECredentialsRes(data) {
    this.isLoading = false;
    this.brokerCredentials = data;
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == this.platform);
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

  selectArn(value) {
    this.selectedBrokerBse = value;
    const date = new Date();
    const date1 = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    this.fileName = (this.selectedBrokerBse.memberId).toString() + 'GAURAVD1' + date1 + month + year + '.tiff';

  }

  selectArnNse(value) {
    this.selectedBrokerBse = value;
  }

  selectPlatform(value) {
    this.platform = value.value;
    this.BSEValue = value.value;
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == this.platform);
  }


  submit() {
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
      id: 2,
      divPayMode: this.allData.bankDetailList[0].paymentMode,
      occupationCode: this.allData.fatcaDetail.occupationCode,
      clientCode: this.reviewSubmit.controls.accountNumber.value,
      aggregatorType: this.selectedBrokerBse.aggregatorType,
      familyMemberId: this.allData.familyMemberId,
      clientId: this.allData.clientId,
      advisorId: this.allData.advisorId,
      tpUserCredentialId: this.selectedBrokerBse.id,
      commMode: 1,
      confirmationFlag: 1,
      tpUserSubRequestClientId1: 2,

    };
    this.onlineTransact.createIINUCC(obj1).subscribe(
      data => this.createIINUCCRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  createIINUCCRes(data) {
    this.createdBrokerMap[this.selectedBrokerBse.id] = {
      tpUserRequestId: data.id, tpUserRequest: data,
      brokerData: this.selectedBrokerBse
    };
    this.responseMessage = data.responseMessage;
    this.statusString = data.statusString;
    // this.eventService.showErrorMessage(data.statusString);
    // this.eventService.showErrorMessage(data.responseMessage);
  }

  getTokenRes(data) {
    this.tokenRes = data;
  }

  getFileDetails(documentType, e) {
    this.file = e.target.files[0];
    const file = e.target.files[0];
    const requestMapObject = this.createdBrokerMap[this.selectedBrokerBse.id];
    if (!requestMapObject) {
      this.eventService.openSnackBar('Please create account first', 'Dismiss');
      return;
    }
    const requestMap = {
      tpUserRequestId: requestMapObject.tpUserRequestId,
      documentType
    };
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        if (status == 200) {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar('File uploaded successfully');
        } else {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss');
        }
      });
  }
}
