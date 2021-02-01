import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EventService } from '../../../../../../Data-service/event.service';
import { TransactionRoleService } from "../../transaction-role.service";
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-view-mandate',
  templateUrl: './detailed-view-mandate.component.html',
  styleUrls: ['./detailed-view-mandate.component.scss']
})
export class DetailedViewMandateComponent implements OnInit {
  @Input() data;
  details: any;
  transactionData: any;
  isLoading = false;
  isRefreshRequired = false;

  statusData = [
    {
      name: 'Pending authorization', checked: false, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 4
    },
    {
      name: 'Accepted authorization', checked: false, status: 2
    }
  ];
  statusDetails: any;
  file: any;
  chequeFlag: boolean;
  mandateFlag: boolean;
  showChequeStatus: boolean;
  showMandateStatus: boolean;
  fragmentData = { isSpinner: false };
  @ViewChild('realEstateTemp', { static: false }) realEstateTemp: ElementRef;
  returnValue: any;
  umrn1: any;
  accountNumList: any;
  ifscCodeList: any;
  ifscCodelist: any;
  micrNoList: any;
  auth: string;
  dubleTick: string;

  constructor(private subInjectService: SubscriptionInject,
    private utilService: UtilService,
    private eventService: EventService
    , public transactionRoleService: TransactionRoleService) {
  }

  ngOnInit() {
    this.details = this.data;
    this.mandateData(this.details)
    this.getDataStatus(this.details);
  }
  mandateData(data) {
    this.umrn1 = []
    this.accountNumList = []
    this.ifscCodeList = []
    this.micrNoList = []
    Object.assign(this.details, { auth: 'BSE Limited' });
    Object.assign(this.details, { dubleTick: 'SB/CA/CC/SB-NRO/Other' });
    var umrnList = data.umrnNo.length
    for (var i = 0; i < umrnList; i++) {
      this.umrn1.push(data.umrnNo.charAt(i))
    }
    for (var i = 0; i < data.accountNo.length; i++) {
      this.accountNumList.push(data.accountNo.charAt(i))
    }
    for (var i = 0; i < data.ifscCode.length; i++) {
      this.ifscCodeList.push(data.ifscCode.charAt(i))
    }
    for (var i = 0; i < data.micrNo.length; i++) {
      this.micrNoList.push(data.micrNo.charAt(i))
    }
    var d = new Date();
    var n = d.getMonth();
    console.log('umrn', this.umrn1)
  }
  download(template, titile) {
    this.fragmentData.isSpinner = true;
    const para = document.getElementById(template);
    const obj = {
      htmlInput: para.innerHTML,
      name: titile,
      landscape: true,
      key: '',
      svg: ''
    };
    let header = null
    this.returnValue = this.utilService.htmlToPdf(header, para.innerHTML, titile, false, this.fragmentData, '', '', true);
    console.log('return value ====', this.returnValue);
    return obj;
  }
  getDataStatus(data) {
    this.isLoading = true;
    this.statusDetails = this.statusData;
    if (this.details.status == 3) {
      this.statusDetails = [{
        name: 'Rejected authorization', checked: true, status: 3
      }];
    }
    this.statusDetails.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false;
    });


    if (this.details.formUploadFlag == 1) {
      this.statusDetails[1].checked = true;
    }
    this.isLoading = false;
  }

  refresh(value) {
    this.getDataStatus(value);
  }


  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: this.isRefreshRequired });
  }

  isFileUploading = false;

  getFileDetails(e, flag) {
    this.showChequeStatus = undefined;
    this.showMandateStatus = undefined;
    this.file = e.target.files[0];
    const file = e.target.files[0];
    if (flag == 4 && file.type != "application/pdf") {
      this.eventService.openSnackBar("Please select PDF/TIF format image", "Dismiss");
      return;
    }
    (flag == 4) ? this.chequeFlag = true : this.mandateFlag = true;
    const requestMap = {
      // tpUserRequestId: 1,
      documentType: flag,
      tpMandateDetailId: this.details.id
    };
    this.isFileUploading = true;
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.MANDATE_UPLOAD,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        this.isFileUploading = false;
        (flag == 4) ? this.chequeFlag = false : this.mandateFlag = false;
        if (status == 200) {
          (flag == 4) ? this.showChequeStatus = true : this.showMandateStatus = true;
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar('File uploaded successfully');
          if (flag == 2) {
            this.details.formUploadFlag = 1;
          } else {
            this.details.chequeUploadFlag = 1;
          }

          this.refresh('');
          this.isRefreshRequired = true;
          this.subInjectService.setRefreshRequired();
        } else {
          (flag == 4) ? this.showChequeStatus = false : this.showMandateStatus = false;
          const responseObject = JSON.parse(response);
          // this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }

      });
  }
}
