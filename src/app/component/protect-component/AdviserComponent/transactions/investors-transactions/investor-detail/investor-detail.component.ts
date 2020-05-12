import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {FileUploadService} from '../../../../../../services/file-upload.service';
import {apiConfig} from '../../../../../../config/main-config';
import {appConfig} from '../../../../../../config/component-config';
import {FileItem, ParsedResponseHeaders} from 'ng2-file-upload';

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

  statusData = [
    {
      name: 'Pending', checked: false, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 4
    },
    {
      name: 'Investment Ready', checked: false, status: 2
    }
  ];
  statusDetails: any;
  file: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.details = this.data;
    console.log('investor detail', this.data);
    this.getDataStatus(this.details);
  }

  uploadFormFile(event) {// for pro build param added

  }

  uploadFormImageUpload(event) {// for pro build param added

  }

  getDataStatus(data) {
    this.isLoading = true;
    this.statusDetails = this.statusData;
    this.statusDetails.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false;
    });
    this.isLoading = false;
  }

  refresh(value) {
    console.log(value);
    this.getDataStatus(value);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
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
}
