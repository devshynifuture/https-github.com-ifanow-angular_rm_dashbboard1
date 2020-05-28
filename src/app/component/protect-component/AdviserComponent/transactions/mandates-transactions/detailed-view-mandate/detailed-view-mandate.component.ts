import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EventService } from '../../../../../../Data-service/event.service';

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

  constructor(private subInjectService: SubscriptionInject, private eventService: EventService) {
  }

  ngOnInit() {
    this.details = this.data;
    this.getDataStatus(this.details);
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
    (flag == 4) ? this.chequeFlag = true : this.mandateFlag = true;
    this.file = e.target.files[0];
    const file = e.target.files[0];
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
