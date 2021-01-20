import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FileUploadServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/file-upload-service.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss']
})
export class ClientUploadComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & CLOSE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  clientRoles: any = [];
  myFiles: any = [];
  @ViewChild('fileComPan', { static: false }) fileComPanRef;
  advisorId: any;
  clientId: any;
  proofTypes: any = [];
  bankLIst: any = [];
  filenm: any;
  parentId: any;
  addressProof: any = '';
  bankProof: any = '';
  selectedBank: any = '';
  proofSubType: any = 1;
  fileComPanImg: any = { view: '', store: '' };
  filePerPanImg: any = { view: '', store: '' };
  fileProof1Img: any = { view: '', store: '' };
  fileProof2Img: any = { view: '', store: '' };
  fileProof2BackImg: any = { view: '', store: '' };
  imgWidth: any = 100;
  imgStyleCom = {
    width: this.imgWidth + '%',
    height: 'auto'
  };
  imgStylePer = {
    width: this.imgWidth + '%',
    height: 'auto'
  };
  addDocObj: any;
  countFile: any;
  viewFront = true;
  // }
  errProof1 = true;
  showErr1 = false;
  // getProofType(type){
  //   switch (type) {
  //     case "proof-type1":
  //       this.addDocObj.proofType = this.addressProof;
  //       break;
  //     case "proof-type2":
  //       this.addDocObj.proofType = this.addressProof;
  //       break;
  //   }
  errProof2 = true;
  showErr2 = false;
  userData: any;
  bankList: any;
  fileUploadData: any;
  file: any;
  clientData: any;
  isLoadingUpload = false;
  urlResponse: boolean;
  folderId: any;
  fileuploadurl: any;
  imageType: any;

  constructor(private subInjectService: SubscriptionInject, private http: HttpService,
    private custumService: CustomerService, private enumService: EnumServiceService,
    private eventService: EventService,
    private fileUpload: FileUploadServiceService, ) {
    this.clientData = AuthService.getClientData();
    this.clientId = AuthService.getClientId();
  }

  @Input() fieldFlag;

  @Input() set data(data) {
    console.log(data, 'user data1');
    this.userData = data;
  }
  @Input() set isRefreshBank(data) {
    if (data) {
      this.getBankList();
    }
  }
  ngOnInit() {
    this.advisorId = AuthService.getUserInfo().advisorId;
    // this.clientId = AuthService.getClientId();
    // this.addDocObj.clientId = this.clientId;

    this.proofTypes = this.enumService.getProofType();
    this.bankLIst = this.enumService.getBank();
    this.getBankList();
    const obj = {
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ?
        this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    };
    this.custumService.getClientUploadFile(obj).subscribe((data) => {
      console.log('added get', data);
      if (data && data.length > 0) {
        this.getUploadedImg(data);
      }
    });   ////////// user data////////////////////
  }

  saveClose() {
    this.close();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  getUploadedImg(data) {
    data.forEach(imgData => {
      if (imgData.documentType == 1) {
        this.fileComPanImg.view = imgData.imageUrl;
        this.fileComPanImg.store = imgData;
      } else if (imgData.documentType == 2) {
        this.filePerPanImg.store = imgData;
        this.filePerPanImg.view = imgData.imageUrl;
      } else if (imgData.documentType == 3) {
        this.fileProof1Img.view = imgData.imageUrl;
        this.fileProof1Img.store = imgData;
        this.selectedBank = imgData.documentId;
        this.bankProof = imgData.proofType;
        this.errProof1 = false;
      } else if (imgData.documentType == 4 && imgData.proofSubType == 1) {
        this.fileProof2Img.view = imgData.imageUrl;
        this.fileProof2Img.store = imgData;
        this.addressProof = imgData.proofType;
        this.proofSubType = imgData.proofSubType;
        this.errProof2 = false;
      } else if (imgData.documentType == 4 && imgData.proofSubType == 2) {
        this.fileProof2BackImg.view = imgData.imageUrl;
        this.fileProof2BackImg.store = imgData;
        this.addressProof = imgData.proofType;
        this.proofSubType = imgData.proofSubType;
        this.errProof2 = false;
      }
      console.log(data, 'imge');
    }
    );
  }

  getFile(e, type) {
    this.addDocObj = {
      advisorId: this.advisorId,
      clientId: 0,
      userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
      userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3,
      documentId: 0,
      documentType: 0,
      proofType: 0,
      proofSubType: 0,
      fileName: ''
    };
    this.imageType = type;
    this.myFiles = [];
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    this.fileComPanRef;
    reader.onload = () => {
      // this.imageViewer = reader.result;
      switch (type) {
        case 'company-pan':
          if (this.fileComPanImg.store) { // to remove existing img
            this.deleteImg(this.fileComPanImg.store.id);
          }
          this.fileComPanImg.view = reader.result;
          this.fileComPanImg.store = e.target.files[0];
          break;
        case 'personal-pan':
          if (this.filePerPanImg.store) { // to remove existing img
            this.deleteImg(this.filePerPanImg.store.id);
          }
          this.filePerPanImg.store = e.target.files[0];
          this.filePerPanImg.view = reader.result;
          break;
        case 'proof-type1':
          if (this.fileProof1Img.store) { // to remove existing img
            this.deleteImg(this.fileProof1Img.store.id);
          }
          this.fileProof1Img.store = e.target.files[0];
          this.fileProof1Img.view = reader.result;
          break;
        case 'proof-type2':
          if (this.viewFront) {
            if (this.fileProof2Img.store) { // to remove existing img
              this.deleteImg(this.fileProof2Img.store.id);
            }
            this.fileProof2Img.store = e.target.files[0];
            this.fileProof2Img.view = reader.result;
          } else {
            if (this.fileProof2BackImg.store) { // to remove existing img
              this.deleteImg(this.fileProof2BackImg.store.id);
            }
            this.fileProof2BackImg.store = e.target.files[0];
            this.fileProof2BackImg.view = reader.result;
          }
          break;
        default:
          break;
      }
    };
    reader.readAsDataURL(file);
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
    });
    console.log(this.myFiles);
    this.uploadFile(type, e);
  }

  uploadFile(imgType, e) {
    this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
    this.countFile++;
    let fileName;
    switch (imgType) {
      case 'company-pan':
        fileName = this.fileComPanImg.store;
        this.fetchData('PAN', e);
        break;
      case 'personal-pan':
        fileName = this.filePerPanImg.store;
        this.fetchData('Aadhaar', e);
        // this.addDocObj.proofType = 1;
        break;
      case 'proof-type1':
        fileName = this.fileProof1Img.store;
        this.fetchData('Bank Account', e);
        // this.addDocObj.documentType = 1;
        break;
      case 'proof-type2':
        fileName = this.fileProof2Img.store;
        this.fetchData('Address', e);
        // this.addDocObj.documentType = 2;
        break;
    }
    // if (this.userData.userId) {
    //   const obj = {
    //     userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
    //     userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
    //   };
    //   this.custumService.clientUploadFile(obj).subscribe(
    //     data => this.uploadFileRes(data.preSignedUrl, data.fileName, imgType)
    //   );
    // }
  }
  fetchData(value, fileName) {
    this.isLoadingUpload = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.userData.clientId,
      familyMemberId: (this.userData.familyMemberId) ? this.userData.familyMemberId : 0,
      asset: value
    };
    this.myFiles = [];
    for (let i = 0; i < fileName.target.files.length; i++) {
      this.myFiles.push(fileName.target.files[i]);
    }
    this.fileUploadData = this.fetchFileUploadData(obj, this.myFiles);
    // if (this.fileUploadData) {
    //   this.file = fileName
    //   this.urlResponse = this.fileUpload.uploadFile(fileName)
    // }
    setTimeout(() => {
      this.isLoadingUpload = false;
    }, 7000);
  }

  fetchFileUploadData(value, myFiles) {
    const obj = {
      advisorId: value.advisorId,
      clientId: value.clientId,
      familyMemberId: (value.familyMemberId) ? value.familyMemberId : 0,
      searchTerm: (value.asset) + '',
    };
    this.custumService.fetchFileUpload(obj).subscribe(
      data => {
        this.fileUploadData = data || [];
        this.folderId = data;
        console.log('fileUploadData', this.fileUploadData);
        myFiles.forEach(fileName => {
          this.filenm = fileName;
          this.uploadFileData(this.filenm, value);
        });

      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  uploadFileData(fileName, value) {
    this.countFile++;
    const obj = {
      clientId: value.clientId,
      advisorId: value.advisorId,
      familyMemberId: (value.familyMemberId) ? value.familyMemberId : 0,
      folderId: this.folderId,
      fileName: fileName.name
    };
    this.custumService.uploadFile(obj).subscribe(
      data => {
        const fileuploadurl = data;
        this.fileuploadurl = data;
        const httpOptions = {
          headers: new HttpHeaders()
            .set('Content-Type', '')
        };
        this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
          console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
          if (responseData == null) {
            this.uploadFileRes(fileName, this.imageType, fileuploadurl);
            // this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
            return responseData;
          }
        });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  removeImg(imgType) {
    switch (imgType) {
      case 'company-pan':
        this.deleteImg(this.fileComPanImg.store.id);
        this.fileComPanImg = { view: '', store: '' };
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
      case 'personal-pan':
        this.deleteImg(this.filePerPanImg.store.id);
        this.filePerPanImg = { view: '', store: '' };
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
      case 'proof-type1':
        this.deleteImg(this.fileProof1Img.store.id);
        this.fileProof1Img = { view: '', store: '' };
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
      case 'proof-type2':
        this.deleteImg(this.fileProof2Img.store.id);
        this.fileProof2Img = { view: '', store: '' };
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
    }
  }
  getBankList() {
    const obj =
      [{
        userId: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? this.userData.clientId : this.userData.familyMemberId,
        userType: (this.fieldFlag == 'client' || this.fieldFlag == 'lead' || this.fieldFlag == undefined) ? 2 : 3
      }];
    this.custumService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;
          this.selectedBank = data[0].bankId;
        } else {
          this.bankList = [];
        }
      },
      err => {
        this.bankList = [];
        this.selectedBank = '';
      }
      // this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  deleteImg(imgId) {
    const obj = { id: imgId };
    this.custumService.deleteClientProof(obj).subscribe((data) => {
      console.log('delete proof', data);
    });
  }

  uploadFileRes(fileName, type, url) {
    this.addDocObj.fileName = fileName;
    switch (type) {
      case 'company-pan':
        this.addDocObj.documentType = 1;
        break;
      case 'personal-pan':
        this.addDocObj.documentType = 2;
        break;
      case 'proof-type1':
        this.addDocObj.proofType = this.bankProof;
        this.addDocObj.documentType = 3;
        this.addDocObj.documentId = this.selectedBank;
        break;
      case 'proof-type2':
        this.addDocObj.proofType = this.addressProof;
        this.addDocObj.documentType = 4;
        this.addDocObj.proofSubType = this.proofSubType;
        break;
    }
    this.countFile++;
    url = url.substring(url.search('x-amz-meta-uuid'), url.length - 1);
    url = url.substring(0, url.indexOf('&'));
    const uuID = url.replace('x-amz-meta-uuid=', '');
    this.addDocObj.fileName = uuID;
    this.addDocumentUsers(this.addDocObj);
    // const fileuploadurl = data;
    // const httpOptions = {
    //   headers: new HttpHeaders()
    //     .set('Content-Type', '')
    // };
    // this.http.putExternal(data, fileName, httpOptions).subscribe((responseData) => {
    //   console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
    //   this.addDocumentUsers(this.addDocObj);
    // }, error => {
    //   console.log('DocumentsComponent uploadFileRes error : ', error);

    // });
  }

  addDocumentUsers(obj) {
    console.log(obj, 'save obj');
    this.custumService.saveClientUploadFile(obj).subscribe((data) => {
      console.log('added', data);

    });
  }

  getSubType(sub) {
    this.proofSubType = sub;
    if (sub == 1) {
      this.viewFront = true;
    } else {
      this.viewFront = false;
    }
  }

  checkSelected(proof, err) {
    switch (proof) {
      case 'proof-type1':
        if (this.selectedBank != '' && this.bankProof != '') {
          this.errProof1 = false;
        } else {
          if (err) {
            this.showErr1 = true;
          }
        }
        break;

      case 'proof-type2':
        if (this.addressProof != '') {
          this.errProof2 = false;
        } else {
          if (err) {
            this.showErr2 = true;
          }
        }
        break;
    }
  }

  zoomInOut(zoom, imgType) {
    switch (imgType) {
      case 'company-pan':
        if (this.imgWidth < 300 && zoom == 'zoomIn') {
          this.imgWidth += 10;
          this.imgStyleCom.width = this.imgWidth + '%';
        } else if (this.imgWidth > 100 && zoom == 'zoomOut') {
          this.imgWidth -= 10;
          this.imgStyleCom.width = this.imgWidth + '%';
        }
        break;
      case 'personal-pan':
        if (this.imgWidth < 300 && zoom == 'zoomIn') {
          this.imgWidth += 10;
          this.imgStylePer.width = this.imgWidth + '%';
        } else if (this.imgWidth > 100 && zoom == 'zoomOut') {
          this.imgWidth -= 10;
          this.imgStylePer.width = this.imgWidth + '%';
        }
        break;
    }
  }
}
