import {Component, OnInit} from '@angular/core';
import {ReconciliationService} from '../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import {AuthService} from 'src/app/auth-service/authService';
import {HttpHeaders} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';

@Component({
  selector: 'app-backoffice-file-upload',
  templateUrl: './backoffice-file-upload.component.html',
  styleUrls: ['./backoffice-file-upload.component.scss']
})
export class BackofficeFileUploadComponent implements OnInit {
  filterRTA: any = "";
  filterStatus: any = "";
  selectedFileType: any = "";
  fileType: any;
  advisorId: any;
  myFiles: any;

  constructor(private reconService: ReconciliationService, private http: HttpService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.reconService.getBackOfficeFileUploadFileType({}).subscribe((data) => {
      this.fileType = data;
    })
  }

  getFile(e) {
    console.log(e);
    let obj = {
      fileType: this.selectedFileType,
      advisorId: this.advisorId
    }
    this.reconService.getBackOfficeFileToUpload(obj).subscribe((data) => {
      // this.fileType = data;
      if (data) {
        this.uploadFileRes(data, e.target.files[0]);
      }
    });
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

  uploadFileRes(data, file) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.putExternal(data.presignedUrl, file, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      // this.successFileUpload(this.selectedFileType, data.fileName)
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

    })
  }
}
