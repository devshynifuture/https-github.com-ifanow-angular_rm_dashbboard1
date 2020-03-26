import { Component, OnInit } from '@angular/core';
import { ReconciliationService } from '../backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { AuthService } from 'src/app/auth-service/authService';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from 'src/app/http-service/http-service';

@Component({
  selector: 'app-backoffice-file-upload',
  templateUrl: './backoffice-file-upload.component.html',
  styleUrls: ['./backoffice-file-upload.component.scss']
})
export class BackofficeFileUploadComponent implements OnInit {
  filterRTA:any="";
  filterStatus:any="";
  selectedFileType:any="";
  fileType:any;
  advisorId: any;
  constructor(private reconService: ReconciliationService, private http: HttpService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.reconService.getBackOfficeFileUploadFileType({}).subscribe((data)=>{
      this.fileType = data;
    })
  }

  getFile(file){
    console.log(file);
    let obj={
      fileType:this.selectedFileType,
      advisorId: this.advisorId
    }
    this.reconService.getBackOfficeFileToUpload(obj).subscribe((data)=>{
      // this.fileType = data;
      if(data){
        this.uploadFileRes(data, file)
      }
    });
  }

  uploadFileRes(data, file){
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.put(data.presignedUrl, file.files[0], httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      this.successFileUpload(this.selectedFileType, data.fileName)
    });
  }

  successFileUpload(fileType, fileName){
    let obj = {
      fileType: fileType,
      fileName: fileName
    }
    this.reconService.successBackOfficeFileToUpload(obj).subscribe((data)=>{

    })
  }
}
