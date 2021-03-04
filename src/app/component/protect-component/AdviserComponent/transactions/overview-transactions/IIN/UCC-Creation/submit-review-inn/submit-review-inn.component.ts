import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { FatcaDetailsInnComponent } from '../fatca-details-inn/fatca-details-inn.component';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { FileUploadService } from '../../../../../../../../services/file-upload.service';
import { apiConfig } from '../../../../../../../../config/main-config';
import { appConfig } from '../../../../../../../../config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { IinCreationLoaderComponent } from './iin-creation-loader/iin-creation-loader.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { ConfirmUploadComponent } from '../../../../investors-transactions/investor-detail/confirm-upload/confirm-upload.component';

@Component({
  selector: 'app-submit-review-inn',
  templateUrl: './submit-review-inn.component.html',
  styleUrls: ['./submit-review-inn.component.scss']
})
export class SubmitReviewInnComponent implements OnInit {
  returnValue: any;
  getOrgData: any;
  selectedBroker: any;
  firstHolder: any;
  bankDetailList: any;
  nominee: any;

  @ViewChild('realEstateTemp', { static: false }) realEstateTemp: ElementRef;
  thirdHolder: any;
  secondHolder: any;
  dataSource: any;
  failureMessage: string = '';

  constructor(private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder,
    public authService: AuthService,
    private eventService: EventService,
    private utilService: UtilService,
    public dialog: MatDialog,
    private peopleService: PeopleService) {
    this.getOrgData = AuthService.getOrgDetails();
    console.log('companay details', this.getOrgData)

  }
  fragmentData = { isSpinner: false };

  get data() {
    return this.inputData;
  }


  @Input()
  set data(data) {
    this.doneData = {};
    this.inputData = data;
    console.log('submit and review component inputData : ', this.inputData);
    this.firstHolder = this.inputData.holderList[0]
    this.secondHolder = this.inputData.secondHolder
    this.thirdHolder = this.inputData.thirdHolder
    this.bankDetailList = this.inputData.bankDetailList[0]
    this.nominee = this.inputData.nomineeList[0]
    this.allData = { ...data };
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
  barWidth: any = '0%';
  showLoader: any;

  isFileUploading;
  isSuccessful = false;

  dialogRef;

  dataSourceNse = [];
  dataSourceBse = [];

  isLoading = false;
  selectedCount = 0;

  changedValue: string;
  advisorId: any;
  brokerCredentials: any;
  logoText = 'Your Logo here';
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

  tempObj;

  num: any = 0;
  numlimit: any;

  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    this.changedValue = 'close';
  }

  ngOnInit() {
    this.selectedBroker = ''
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
      advisorId: AuthService.getAdminId(),
      onlyBrokerCred: true
    };
    console.log('encode', obj);
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data)
    );
  }

  getBSECredentialsRes(data) {
    this.getBSESubBrokerCredentials();
    this.isLoading = false;
    this.brokerCredentials = data;
    console.log('getBSECredentialsRes', data);
  }
  getBSESubBrokerCredentials() {
    const obj = {
      advisorId: AuthService.getAdminId(),
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSESubBrokerCredentials(obj).subscribe(
      data => this.getBSESubBrokerCredentialsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.isLoading = false;
      }
    );
  }

  getBSESubBrokerCredentialsRes(data) {
    this.isLoading = false;
    if (data == undefined || data.length == 0) {
    } else {
      this.brokerCredentials.forEach(function (ad) {
        const subBrokerMatch = data.find(function (tm) {
          return ad.id == tm.tpUserCredentialId;
        });
        if (subBrokerMatch && subBrokerMatch.euin) {
          ad.euin = subBrokerMatch.euin;
          ad.tp_nse_subbroker_mapping_id = subBrokerMatch.tpUserCredentialId;
          ad.subBrokerCode = subBrokerMatch.subBrokerCode;
          ad.tpSubBrokerCredentialId = subBrokerMatch.id;
        }
      });
      this.dataSource = this.brokerCredentials;
      console.log('this data', this.dataSource)

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
      console.log('nse', this.nse);
      console.log('bse', this.bse);
    }
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
  download(template, tableTitle) {
    this.fragmentData.isSpinner = true;
    const para = this.realEstateTemp.nativeElement;
    const obj = {
      htmlInput: para.innerHTML,
      name: tableTitle,
      landscape: true,
      key: '',
      svg: ''
    };
    let header = null
    this.returnValue = this.utilService.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true, null);
    console.log('return value ====', this.returnValue);
    return obj;
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
    console.log('singleBrokerCreds', singleBrokerCred)
    if (singleBrokerCred.aggregatorType == 1) {
      if (!this.nominee) {
        this.failureMessage = 'Please go back and fill nominee details for NSE';
        return;
      }
    }
    // this.doneData = true;
    this.selectedBroker = singleBrokerCred
    this.toSendObjHolderList = [];
    this.toSendObjBankList = [];
    this.toSendObjNomineeList = [];
    this.allData.holderList.forEach(element => {
      if (element.email) {
        this.toSendObjHolderList.push(Object.assign({}, element));
      }
    });
    this.allData.bankDetailList.forEach(element => {
      if (element.address && element.ifscCode) {
        this.toSendObjBankList.push(element);
      }
    });
    if (this.allData.nomineeList.length > 0 && this.nominee) {
      this.allData.nomineeList.forEach(element => {
        if (element.address && element.name) {
          this.toSendObjNomineeList.push(element);
        }
      });
    }
    this.allData.holderList = this.toSendObjHolderList;
    this.allData.bankDetailList = this.toSendObjBankList;
    this.allData.nomineeList = this.toSendObjNomineeList;
    // this.inputData.clientData = this.clientData;

    const firstHolder = this.toSendObjHolderList[0];
    // this.inputData.taxMaster
    if (this.allData.taxMaster.minorFlag) {
      if (!firstHolder.guardianName || firstHolder.guardianName == '') {
        firstHolder.guardianName = firstHolder.fatherName;
        firstHolder.guardianPan = firstHolder.panNumber;
        firstHolder.panNumber = '';
        firstHolder.fatherName = '';
      }
    }
    const obj1 = {
      ownerName: this.allData.ownerName,
      holdingType: this.allData.holdingType,
      taxMasterId: this.allData.taxMasterId,
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
    this.tempObj = obj1;
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
    this.tempObj.bankDetailList.forEach(element => {
      element.userId = (this.tempObj.ownerName.familyMemberId) ? this.tempObj.ownerName.familyMemberId : this.tempObj.ownerName.clientId;
      element.userType = this.tempObj.ownerName.userType;
      this.peopleService.addEditClientBankDetails(element).subscribe(
        data => console.log('Address add/edit')
      );
    });
    this.tempObj.holderList[0].address.userId = (this.tempObj.ownerName.familyMemberId) ? this.tempObj.ownerName.familyMemberId : this.tempObj.ownerName.clientId;
    this.tempObj.holderList[0].address.userType = this.tempObj.ownerName.userType;
    const obj = this.tempObj.holderList[0].address;
    this.peopleService.addEditClientAddress(obj).subscribe(
      data => console.log('Bank add/edit')
    );
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
    if (e.target.files[0].type !== 'image/tiff') {
      // this.eventService.openSnackBar("Please upload the document in TIFF format only with max size up to 5MB", "Dimiss")
      return;
    }
    this.showLoader = true;
    this.addbarWidth(30);
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
    this.addbarWidth(50);
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        console.log('getFileDetails uploadFileToServer callback item : ', item);
        console.log('getFileDetails uploadFileToServer callback status : ', status);
        console.log('getFileDetails uploadFileToServer callback headers : ', headers);
        console.log('getFileDetails uploadFileToServer callback response : ', response);
        this.isFileUploading = false;
        this.addbarWidth(100);
        if (status == 200) {
          const responseObject = JSON.parse(response);
          console.log('onChange file upload success response url : ', responseObject.url);
          this.eventService.openSnackBar('File uploaded successfully');
        } else {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }

  openIinUccClient(singleBrokerCred, requestJson) {
    const data = { singleBrokerCred, requestJson };
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


  openUploadConfirmBox(value, typeId, singleBrokerCred) {

    const dialogData = {
      data: value,
      header: 'UPLOAD',
      body: UtilService.transactionDocumentsRequired(this.allData.taxMasterId),
      body2: 'Please upload the document in TIFF format only with max size up to 5MB',
      btnYes: 'CANCEL',
      btnNo: 'CHOOSE',
      positiveMethod: (fileData) => {
        dialogRef.close();

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmUploadComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.numlimit = 30;
        if (typeId == 1) {
          this.addbarWidth(1);
          // this.isFileUploading = true;
        }
        this.getFileDetails(typeId, result, singleBrokerCred);
      }
    });
  }

  recall() {
    if (this.num <= this.numlimit) {
      this.addbarWidth(this.num);
    }
  }

  addbarWidth(c) {
    this.num = c;
    setTimeout(() => {
      if (this.num <= 99) {
        this.num++;
      }
      this.barWidth = this.num + '%';
      console.log('1');
      this.recall();
    }, 500);

  }


}
