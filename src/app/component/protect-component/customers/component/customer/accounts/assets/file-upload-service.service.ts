import { Injectable } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { DashboardService } from 'src/app/component/protect-component/AdviserComponent/dashboard/dashboard.service';

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
  filenm: any;
  responseData: boolean;

  constructor(private custumService: CustomerService,
    private _bottomSheet: MatBottomSheet,
    private http: HttpService,
    public eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
    this.clientData = AuthService.getClientData()
    this.getUserInfo = AuthService.getUserInfo()

  }
  element: any;
  fetchFileUploadData(value, myFiles) {
    this.element = value.element;
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
        myFiles.forEach(fileName => {
          this.filenm = fileName;
          this.uploadFile(this.filenm)
        });

      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  uploadFile(fileName) {
    this.fileUploadSuccsess = false
    this.countFile++;

    const obj = {
      clientId: this.basicDetails.clientId,
      advisorId: this.basicDetails.advisorId,
      familyMemberId: (this.familyMemberId) ? this.familyMemberId : 0,
      folderId: this.folderId,
      fileName: fileName.name
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
            // this.addDocumentUsers(fileName, this.imageType, fileuploadurl);
            this.addDocumentUsers(fileuploadurl);
            DashboardService.dashDocumentTotalSize = null;
            this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
            this.fileUploadSuccsess = true
            this.responseData = true
            this._bottomSheet.dismiss()
            return responseData
          }
        });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
    if (this.responseData == true) {
      return this.responseData
    }
  }

  addDocumentUsers(url) {
    // console.log(obj, 'save obj');
    let addDocObj = {
      advisorId: this.element.advisorId,
      clientId: this.element.clientId,
      userId: this.getUserInfo.userId,
      userType: this.element.ownerList ? this.element.ownerList[0].isClient ? 2 : 3 : this.element.isClient,
      assetCategoryOrSubCatTypeId: this.element.subCatTypeId,
      documentId: this.element.id,
      documentType: 5,
      proofType: 0,
      proofSubType: 0,
      fileName: ''
    };
    url = url.substring(url.search('x-amz-meta-uuid'), url.length - 1);
    url = url.substring(0, url.indexOf('&'));
    const uuID = url.replace('x-amz-meta-uuid=', '');
    addDocObj.fileName = uuID;
    this.custumService.saveClientUploadFile(addDocObj).subscribe((data) => {
      console.log('added', data);

    });
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

  getAssetsDoc(element) {
    let self = this
    return new Promise(function (resolve, reject) {
      const obj = {
        userId: self.getUserInfo.userId,
        userType: element.ownerList[0].isClient ? 2 : 3,
      };
      self.custumService.getClientUploadFile(obj).subscribe((data) => {
        resolve(data);
      },
        err => {
          reject(err)
        });
    });
  }
}
