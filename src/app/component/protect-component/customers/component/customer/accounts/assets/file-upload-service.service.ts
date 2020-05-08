import { Injectable } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServiceService {
  countFile: any;
  advisorId: any;
  clientId: any;
  fileUploadData: any;
  myFiles: any;

  constructor(private custumService: CustomerService,
    private http: HttpService,
    public eventService : EventService) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()

  }
  fetchFileUploadData(value) {
    console.log('here its me',value)
    const obj = {
      advisorId: value.advisorId,
      clientId : value.clientId,
      familyMemberId:0,
      searchTerm : (value.asset)+'',
    };
    this.custumService.fetchFileUpload(obj).subscribe(
      data => {
        this.fileUploadData = data || [];
        console.log('fileUploadData', this.fileUploadData);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
    return this.fileUploadData
  }
  uploadFile(fileName) {
    this.countFile++;
    this.myFiles = fileName.target.files[0]
    console.log('uploadFile', fileName);
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: this.fileUploadData,
      fileName: this.myFiles.name
    };
    this.custumService.uploadFile(obj).subscribe(
      data => this.uploadFileRes(data, fileName)
    );

  }
  uploadFileRes(data, fileName) {
    this.countFile++;
    
    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      if (responseData == null) {
        setTimeout(() => {
          // this._bottomSheet.dismiss()
          this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
        }, 1000);
        setTimeout(() => {
        }, 2000);
      }
    });
  }
}
