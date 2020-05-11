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
  fileUploadSuccsess: boolean = false;
  basicDetails: any;
  clientData: any;
  getUserInfo: any;
  familyMemberId: any;
  folderId: any;

  constructor(private custumService: CustomerService,
    private http: HttpService,
    public eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
    this.clientData = AuthService.getClientData()
    this.getUserInfo = AuthService.getUserInfo()

  }
  fetchFileUploadData(value) {
    console.log('here its me', value)
    this.basicDetails = value
    this.familyMemberId = value.familyMemberId
    const obj = {
      advisorId: value.advisorId,
      clientId: value.clientId,
      familyMemberId: (value.familyMemberId) ? value.familyMemberId : 0,
      searchTerm: (value.asset) + '',
    };
    this.custumService.fetchFileUpload(obj).subscribe(
      data => {
        this.fileUploadData = data || [];
        this.folderId = data
        console.log('fileUploadData', this.fileUploadData);
        return this.fileUploadData
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
    return this.fileUploadData
  }
  // fileUploadClient(value) {
  //   console.log('here its me', value)
  //   const obj = {
  //     advisorId: value.advisorId,
  //     clientId: value.clientId,
  //     familyMemberId: this.clientData.familyMemberId,
  //     folderId: this.fileUploadData,
  //     searchTerm: value.clientName + "PAN",
  //   };
  //   this.custumService.fetchFileClientData(obj).subscribe(
  //     data => {
  //       // this.fileUploadData = data || [];
  //       // console.log('fileUploadData', this.fileUploadData);
  //       return this.fileUploadData
  //     },
  //     err => {
  //       this.eventService.openSnackBar(err, 'Dismiss');
  //     }
  //   );
  //   return this.fileUploadData
  // }
  uploadFile(fileName) {
    this.fileUploadSuccsess = false
    this.countFile++;
    this.myFiles = fileName.target.files[0]
    console.log('uploadFile', fileName);
    const obj = {
      clientId: this.basicDetails.clientId,
      advisorId: this.basicDetails.advisorId,
      familyMemberId: ( this.familyMemberId) ? this.familyMemberId : 0,
      folderId:this.folderId,
      fileName: this.myFiles.name
    };
    this.custumService.uploadFile(obj).subscribe(
      data => {
        const fileuploadurl = data;
        const httpOptions = {
          headers: new HttpHeaders()
            .set('Content-Type', '')
        };
        this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
          console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
          if (responseData == null) {
            this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
            this.fileUploadSuccsess = true
            return responseData
          }
          return responseData
        });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
}
