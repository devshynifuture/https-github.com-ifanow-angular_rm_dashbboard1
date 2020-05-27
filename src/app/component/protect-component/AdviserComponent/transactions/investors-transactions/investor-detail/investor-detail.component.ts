import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {FileUploadService} from '../../../../../../services/file-upload.service';
import {apiConfig} from '../../../../../../config/main-config';
import {appConfig} from '../../../../../../config/component-config';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {OnlineTransactionService} from '../../online-transaction.service';
import {EventService} from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-investor-detail',
  templateUrl: './investor-detail.component.html',
  styleUrls: ['./investor-detail.component.scss']
})
export class InvestorDetailComponent implements OnInit {

  data;
  details: any;
  transactionData: any;
  isLoading = false;
  isFileUploading = false;
  statusData = [
    {
      name: 'Request sent', checked: true, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 1
    },
    {
      name: 'Investment Ready', checked: false, status: 2
    }
  ];
  statusDetails: any;
  file: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.details = this.data;
    this.getFormUploadDetail();
    this.getDataStatus(this.details);
  }

  uploadFormFile(event) {// for pro build param added

  }

  uploadFormImageUpload(event) {// for pro build param added

  }

  getDataStatus(data) {
    // this.isLoading = true;
    this.statusDetails = this.statusData;
    if (data.tpUserCredFamilyMappingId && data.tpUserCredFamilyMappingId > 0) {
      this.statusDetails[2].checked = true;
    }
    // this.isLoading = false;
  }

  getInvestorStatus() {
    const obj = {id: this.details.id};
    this.isLoading = true;

    this.onlineTransact.getInvestorStatusCheck(obj).subscribe(resultData => {
      this.statusData[2].checked = true;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.eventService.openSnackBar(error, 'Discuss');
      this.statusData[2].checked = false;
    });
  }

  getFormUploadDetail() {
    const obj = {id: this.details.id};
    this.isLoading = true;
    this.onlineTransact.getInvestorFormUploadDetail(obj).subscribe(resultData => {
      if (this.details.aggregatorType == 2) {
        this.statusData[1].checked = true;
      } else if (resultData.length > 1) {
        this.statusData[1].checked = true;
      }
      this.isLoading = false;
    }, error => {
      console.error('investor detail form upload data : ', error);
      this.isLoading = false;
      // this.eventService.openSnackBar(error, 'discuss');
      this.statusData[1].checked = false;
    });
  }

  refresh(value) {
    this.getDataStatus(value);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  getFileDetails(documentType, e) {
    this.file = e.target.files[0];
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: this.details.id,
      documentType
    };
    this.isFileUploading = true;
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        this.isFileUploading = false;
        if (status == 200) {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar('File uploaded successfully');
          this.getFormUploadDetail();
        } else {
          const responseObject = JSON.parse(response);
          this.eventService.openSnackBar(responseObject.message, 'Dismiss', null, 60000);
        }
      });
  }
}
