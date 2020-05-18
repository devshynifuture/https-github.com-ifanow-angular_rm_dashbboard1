import {Component, OnInit} from '@angular/core';
import {ReconciliationService} from '../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import {AuthService} from 'src/app/auth-service/authService';
import {HttpHeaders} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';
import { BackofficeFileUploadService } from './backoffice-file-upload.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-backoffice-file-upload',
  templateUrl: './backoffice-file-upload.component.html',
  styleUrls: ['./backoffice-file-upload.component.scss']
})
export class BackofficeFileUploadComponent implements OnInit {
  filterRTA: any = 0;
  filterStatus: any = 0;
  selectedFileType: any = "";
  fileType: any;
  advisorId: any;
  filterList:any;
  filter:any = {
    rt:0,
    status:0
  }
  constructor(private reconService: ReconciliationService,private eventService: EventService, private http: HttpService, private BackOffice: BackofficeFileUploadService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.reconService.getBackOfficeFileUploadFileType({}).subscribe((data) => {
      this.fileType = data;
    })
    this.reconService.getBackOfficeFilter({}).subscribe((data)=>{
      this.filterList = data;
      console.log(this.filterList, "this.filterList 123");
      
    })
    this.setFilter();
  }
  fileName:any;
  fileSize:any;
  targetFile:any;
  uploadButton:boolean=false;
  getFile(e) {
    // console.log(e);
    this.fileName = e.currentTarget.files[0].name;
    this.fileSize = this.formatBytes(e.currentTarget.files[0].size, 2);
    this.targetFile =e;
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
  uploadTargetFile(){
    this.uploadButton = false;

    let obj = {
      fileType: this.selectedFileType,
      advisorId: this.advisorId
    }
    this.reconService.getBackOfficeFileToUpload(obj).subscribe((data) => {
      // this.fileType = data;
      if (data) {
        this.uploadFileRes(data, this.targetFile.target.files[0]);
      }
    });
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  uploadFileRes(data, file) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.putExternal(data.presignedUrl, file, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      this.successFileUpload(this.selectedFileType, data.fileName)
    }, error => {
      console.log('DocumentsComponent uploadFileRes error : ', error);

    });
  }

  successFileUpload(fileType, fileName) {
    let obj = {
      fileType: fileType,
      fileName: fileName
    }
    this.reconService.successBackOfficeFileToUpload(obj).subscribe((data) => {
      this.fileName = "";
      this.fileSize = "";
      this.eventService.openSnackBar('File uploaded successfully', 'Dismiss');
    })
  }

  setFilter(){
    this.filter.status = this.filterStatus;
    this.filter.rt = this.filterRTA;
    this.BackOffice.addFilterData(this.filter);
  }
  refresh(flag){
    
  }
}
