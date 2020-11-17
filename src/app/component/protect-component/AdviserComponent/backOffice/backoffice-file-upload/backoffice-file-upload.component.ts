import { MisAumDataStorageService } from './../backoffice-mis/mutual-funds/aum/mis-aum-data-storage.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from '../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { AuthService } from 'src/app/auth-service/authService';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from 'src/app/http-service/http-service';
import { BackofficeFileUploadService } from './backoffice-file-upload.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SettingsService } from '../../setting/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { StatusFileUploadComponent } from './status-file-upload/status-file-upload.component';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';

const Buffer = require('buffer/').Buffer;
@Component({
  selector: 'app-backoffice-file-upload',
  templateUrl: './backoffice-file-upload.component.html',
  styleUrls: ['./backoffice-file-upload.component.scss']
})
export class BackofficeFileUploadComponent implements OnInit {

  selectedFileType: any = '';
  filterRTA = '';
  filterStatus = '';
  filter: any = {
    rt: 0,
    status: 2
  };
  fileType: any;
  advisorId: any;
  filterList: any;
  arnRiaList = [];
  arnRiaId: any = '';
  fileName: any;
  fileSize: any;
  targetFile: any;
  uploadButton = false;
  barWidth: any = '0%';
  selectedRadio: boolean;
  fileTypeStock: any;
  selectedType: 1;
  stockFile: any;
  type: any;
  element: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private reconService: ReconciliationService,
    private eventService: EventService,
    public dialog: MatDialog,
    private http: HttpService,
    private BackOffice: BackofficeFileUploadService,
    private settingService: SettingsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private misAumDataStorageService: MisAumDataStorageService
  ) {
  }

  ngOnInit() {
    this.selectedType = 1
    this.fileTypeStock = [
      {
        category: "Transaction File",
        id: 1,
        value: [{ name: 'Xls', id: 1 }]
      }, {
        category: "Holdings",
        id: 2,
        value: [{ name: 'Xls', id: 1 }]
      }
    ]
    this.selectedRadio = true
    this.advisorId = AuthService.getAdvisorId();
    this.reconService.getBackOfficeFileUploadFileType({}).subscribe((data) => {
      console.log('thisis filetype data', data);
      this.fileType = data;
    });
    this.reconService.getBackOfficeFilter({}).subscribe((data) => {
      this.filterList = data;
      console.log('this is filter list :::', data);
    });
    this.settingService.getArnlist({ advisorId: this.advisorId })
      .subscribe(res => {
        if (res.length > 0) {
          this.arnRiaList = res;
        } else {
          this.eventService.openSnackBar('No arn ria code found!!', 'DISMISS');
        }
      });
    this.setFilter();
  }
  changeType(event) {
    this.selectedType = event.value
    console.log(event)
    console.log(this.fileTypeStock)
    if (event) {

    } else {

    }
    this.fileType
  }
  getFile(e) {
    this.fileName = e.currentTarget.files[0].name;
    this.fileSize = this.formatBytes(e.currentTarget.files[0].size, 2);
    this.targetFile = e;
    this.uploadButton = true;
    // let obj = {
    //   fileType: this.selectedFileType,
    //   advisorId: this.advisorId
    // }
    // this.reconService.getBackOfficeFileToUpload(obj).subscribe((data) => {
    //   // this.fileType = data;
    //   if (data) {
    //     this.uploadFileRes(data, e.target.files[0]);
    //   }
    // });
    // this.myFiles = [];
    // for (let i = 0; i < e.target.files.length; i++) {
    //   this.myFiles.push(e.target.files[i]);
    // }
    // this.myFiles.forEach(fileName => {
    //   this.filenm = fileName;
    //   // this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
    //   this.uploadFile(this.parentId, this.filenm);
    // });
  }
  getFileStock(e, type) {
    this.fileName = e.currentTarget.files[0].name;
    this.stockFile = e.target.files[0]
    this.targetFile = e;
    this.uploadButton = true;
  }
  // setArnRiaId(value) {
  //   console.log(value);
  //   if (value) {
  //     this.arnRiaId = value.id;
  //   }
  // }

  uploadTargetFile() {
    this.addbarWidth(1);
    this.numlimit = 30;
    this.uploadButton = false;

    const obj = {
      fileType: this.selectedFileType,
      advisorId: this.advisorId,
      arnRiaDetailId: this.arnRiaId,
    };

    this.reconService.getBackOfficeFileToUpload(obj).subscribe((data) => {
      // this.fileType = data;
      if (data) {
        this.addbarWidth(30);
        this.uploadFileRes(data, this.targetFile.target.files[0]);
      }
    });
  }
  fileTypeSelect(type) {
    this.type = type.id
    console.log(this.type)
  }
  uploadTargetFileStock() {
    this.addbarWidth(1);
    this.numlimit = 30;
    this.uploadButton = false;
    const requestMap = {
      advisorId: AuthService.getAdvisorId()
    };
    const obj = {
      file: this.stockFile
    };
    if (this.type == 1) {
      FileUploadService.uploadFileToServer(apiConfig.MAIN_URL + appConfig.TRANSACTION_UPLOAD,
        this.stockFile, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const encodedata = responseObject.payLoad;
            const datavalue = (Buffer.from(encodedata, 'base64').toString('utf-8'));
            const responseData = JSON.parse(datavalue);
            const dialogRef = this.dialog.open(StatusFileUploadComponent, {
              width: '900px',
              height: '500px',
              data: { data: responseData, flag: 'transaction' }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == undefined) {
                return
              }
              this.close()
              console.log('The dialog was closed');
              this.element = result;
              console.log('result -==', this.element)
            });
          }
        });
    } else {
      FileUploadService.uploadFileToServer(apiConfig.MAIN_URL + appConfig.HOLDING_UPLOAD,
        this.stockFile, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
          if (status == 200) {
            const responseObject = JSON.parse(response);
            const encodedata = responseObject.payLoad;
            const datavalue = (Buffer.from(encodedata, 'base64').toString('utf-8'));
            const responseData = JSON.parse(datavalue);
            const dialogRef = this.dialog.open(StatusFileUploadComponent, {
              width: '900px',
              height: '500px',
              data: { data: responseData, flag: 'holding' }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == undefined) {
                return
              }
              this.close()
              console.log('The dialog was closed');
              this.element = result;
              console.log('result -==', this.element)
            });
          }
        });
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
    });
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  setDefaultRtAndStatus() {
    this.filterStatus = '2';
    this.filterRTA = '0';
  }

  uploadFileRes(data, file) {
    // setInterval(this.addbarWidth(30));
    // for(let i = 30; i < 70; i++){
    //   setTimeout(() => {
    //     this.addbarWidth();
    //   }, 1000);
    // }
    this.numlimit = 70;
    this.addbarWidth(50);
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.putExternal(data.presignedUrl, file, httpOptions).subscribe((responseData) => {
      this.numlimit = 99;
      this.addbarWidth(90);
      this.successFileUpload(this.selectedFileType, data.fileName);
    }, error => {
      this.eventService.openSnackBar("Failed to upload file !", "DISMISS");
    });
  }
  num: any = 0;
  numlimit: any;
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
      console.log("1");
      this.recall();
    }, 500);

  }

  successFileUpload(fileType, fileName) {

    const obj = {
      fileType,
      fileName,
      advisorId: this.advisorId,
      arnRiaDetailId: this.arnRiaId,
      uploadedFileName: this.targetFile.target.files[0].name
    };
    this.reconService.successBackOfficeFileToUpload(obj).subscribe((data) => {
      this.fileName = '';
      this.fileSize = '';
      // this.barWidth = "100%";
      this.addbarWidth(100);
      this.targetFile = null;
      this.misAumDataStorageService.clearStorage();
      this.misAumDataStorageService.callApiData();
      this.eventService.openSnackBar('File uploaded successfully', 'Dismiss');
      // reload
      var { value } = this.fileType[0];
      let transactionFileTypeArr = value;

      var { value } = this.fileType[1];
      let stpSipFileTypeArr = value;

      var { value } = this.fileType[2];
      let aumFileTypeArr = value;

      var { value } = this.fileType[3];
      let folioMasterFileTypeArr = value;

      if (transactionFileTypeArr.some(item => item.id === this.selectedFileType)) {
        this.router.navigate(['transaction'], { relativeTo: this.activatedRoute })
      }
      if (stpSipFileTypeArr.some(item => item.id === this.selectedFileType)) {
        this.router.navigate(['sip-stp'], { relativeTo: this.activatedRoute })
      }

      if (aumFileTypeArr.some(item => item.id === this.selectedFileType)) {
        this.router.navigate(['aum'], { relativeTo: this.activatedRoute });
      }
      if (folioMasterFileTypeArr.some(item => item.id === this.selectedFileType)) {
        this.router.navigate(['folio'], { relativeTo: this.activatedRoute });
      }
      this.num = 0;

      this.setFilter();
    });
  }

  setFilter() {
    // this.barWidth = "0%";
    // this.num = 0; 
    // if (this.filterStatus === undefined) { //initially we need to show selectRTA and select Status in dropdown
    //   this.filterStatus = 2;
    // }
    // if (this.filterRTA === undefined) {
    //   this.filterRTA = 0;
    // }
    this.filter.status = this.filterStatus;
    this.filter.rt = this.filterRTA;
    this.BackOffice.addFilterData(this.filter);

  }

  setDefaultFilter() {
    this.BackOffice.addFilterData({ rt: 0, status: 2 });
  }

  refresh(flag) {
    this.setFilter();
  }
}
