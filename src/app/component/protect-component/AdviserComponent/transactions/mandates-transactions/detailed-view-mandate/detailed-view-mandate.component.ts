import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {FileUploadService} from 'src/app/services/file-upload.service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';

@Component({
  selector: 'app-detailed-view-mandate',
  templateUrl: './detailed-view-mandate.component.html',
  styleUrls: ['./detailed-view-mandate.component.scss']
})
export class DetailedViewMandateComponent implements OnInit {
  data;
  details: any;
  transactionData: any;
  isLoading = false;

  statusData = [
    {
      name: 'Pending authorization', checked: false, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 4
    },
    {
      name: 'Accpted authorization', checked: false, status: 2
    },
    {
      name: 'Rejected authorization', checked: false, status: 3
    }
  ];
  statusDetails: any;
  file: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.details = this.data;
    console.log('mandateDetails', this.data);
    this.getDataStatus(this.details);
  }

  uploadFormFile(event) {// for pro build param added

  }

  uploadFormImageUpload(event) {// for pro build param added

  }

  getDataStatus(data) {
    this.statusDetails = this.statusData;
    this.statusDetails.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false;
    });
  }

  refresh(value) {
    console.log(value);
    this.getDataStatus(value)
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
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
}
