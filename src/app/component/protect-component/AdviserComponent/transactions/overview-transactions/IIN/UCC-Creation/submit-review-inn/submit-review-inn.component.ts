import { Component, Input, OnInit } from '@angular/core';
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
  selectedBrokerBse: any;
  selectedBrokerNse: any;
  matValue: any;
  addedNse = false;
  addedBse = false;
  doneData: any;
  tokenRes: any;
  fileName: string;
  file: any;
  byte: any;
  uploadSttus: any;
  toSendObjHolderList: any;
  toSendObjBankList: any;
  toSendObjNomineeList: any;
  clientData: any;
  validatorType = ValidatorType
  paltform = '2';
  BSEValue: any;


  constructor(private onlineTransact: OnlineTransactionService, private fb: FormBuilder,
    private eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.doneData = {};
    this.inputData = data;
    this.allData = data;
    this.clientData = this.clientData
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

  uploadFormImageUpload(file) {
    const obj = {
      tpUserCredentialId: this.selectedBrokerBse.id,
      file: file.target.files[0],
      documentType: 1,
    };
    this.onlineTransact.imageFileUpload(obj).subscribe(
      data => {
        this.uploadSttus = data;
        console.log('uploadSttus', this.uploadSttus);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  getBSECredentials() {
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
    console.log('getBSECredentialsRes', data);
    this.brokerCredentials = data;
    console.log('nse', this.nse);
    console.log('bse', this.bse);
  }

  getdataForm(data) {

    this.reviewSubmit = this.fb.group({
      bseBroker: [!data ? '' : data.bseBroker, [Validators.required]],
      accountNumber: [!data ? '' : data.accountNumber, [Validators.required]],
      nseBroker: [!data ? '' : data.nseBroker, [Validators.required]],
      platform : [!data ? '2' : '2', [Validators.required]],
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

    console.log('fileName', this.fileName);
  }

  selectArnNse(value) {
    this.selectedBrokerBse = value;
  }

  selectPlatform(value) {
    console.log('mat check', value);
    this.paltform = value.value;
    this.BSEValue = value.value
    this.bse = this.brokerCredentials.filter(element => element.aggregatorType == this.paltform);
    this.nse = this.brokerCredentials.filter(element => element.aggregatorType == this.paltform);
  }



  submit() {
    this.doneData = true;
    this.toSendObjHolderList = []
    this.toSendObjBankList = []
    this.toSendObjNomineeList = []
    this.allData.holderList.forEach(element => {
      if (element.address && element.email) {
        this.toSendObjHolderList.push(element)
      }

    });
    this.allData.bankDetailList.forEach(element => {
      if (element.address && element.ifscCode) {
        this.toSendObjBankList.push(element)
      }

    });
    this.allData.nomineeList.forEach(element => {
      if (element.address && element.nomineeName) {
        this.toSendObjNomineeList.push(element)
      }

    });
    this.allData.holderList = this.toSendObjHolderList
    this.allData.bankDetailList = this.toSendObjBankList
    this.allData.nomineeList = this.toSendObjNomineeList
    this.inputData.clientData = this.clientData
    if (this.paltform == '2') {
      const obj1 = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: (this.allData.taxStatus) ? this.allData.taxStatus : this.allData.generalDetails.taxStatus,
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
          this.eventService.showErrorMessage(error);
        }
      );
    } else if (this.paltform == '1') {
      const obj1 = {
        ownerName: this.allData.ownerName,
        holdingType: this.allData.holdingType,
        taxStatus: (this.allData.taxStatus) ? this.allData.taxStatus : this.allData.generalDetails.taxStatus,
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
          this.eventService.showErrorMessage(error);
        }
      );
    }

  }

  createIINUCCRes(data) {
    console.log('data respose =', data);
  }

  uploadForm() {
    const obj1 = {
      tpUserCredentialId: this.selectedBrokerBse.id
    };
    this.onlineTransact.getToken(obj1).subscribe(
      data => this.getTokenRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      });
  }

  getTokenRes(data) {
    console.log('token', data);
    this.tokenRes = data;
    this.soapCall();
  }

  getFileDetails(e) {
    console.log('file', e);
    this.file = e.target.files[0];
    console.log('file', e);
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: 1,
      documentType: 1
    };
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
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


  soapCall() {
    const xmlhttp = new XMLHttpRequest();
    const headers = xmlhttp.setRequestHeader('Content-Type', 'application/soap+xml; charset=utf-8; action=http://tempuri.org/IStarMFFileUploadService/UploadFile');

    xmlhttp.open('POST', 'https://www.bsestarmf.in/StarMFFileUploadService/StarMFFileUploadService.svc/Secure', true);

    const sr =
      `<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
           <soapenv:Header
            xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsa:To>https://www.bsestarmf.in/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To>
            <wsa:Action>http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action>
          </soapenv:Header>
           <ns3:UploadFile
            xmlns:ns2="http://schemas.datacontract.org/2004/07/StarMFFileUploadService"
            xmlns:ns3="http://tempuri.org/"
            xmlns:ns4="http://schemas.microsoft.com/2003/10/Serialization/">
             <soapenv:Body>
              <ns3:data>
              <ns2:ClientCode>` + 'GAURAVD1' + `</ns2:ClientCode>
               <ns2:DocumentType>` + 'Nrm' + `</ns2:DocumentType>
               <ns2:EncryptedPassword>` + this.tokenRes.passwordResponseForStarMfFileUpload + `</ns2:EncryptedPassword>
               <ns2:FileName>` + this.fileName + `</ns2:FileName>
               <ns2:Flag>` + 'UCC' + `</ns2:Flag>
               <ns2:MemberCode>` + this.selectedBrokerBse.userId + `</ns2:MemberCode>
               <ns2:UserId>` + this.selectedBrokerBse.memberId + `</ns2:UserId>
               <ns2:pFileBytes>` + '' + `</ns2:pFileBytes>
               </ns3:data>
            </ns3:UploadFile>
             </soapenv:Body>
           </soapenv:Envelope>`;

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const xml = xmlhttp.responseXML;
          // Here I'm getting the value contained by the <return> node.
          const response_number = parseInt(xml.getElementsByTagName('return')[0].childNodes[0].nodeValue);
          // Print result square number.
          console.log(response_number);
        }
      }
    };
    // Send the POST request.
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);
  }
}
