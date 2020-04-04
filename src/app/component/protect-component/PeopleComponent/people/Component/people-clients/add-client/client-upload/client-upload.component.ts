import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss']
})
export class ClientUploadComponent implements OnInit {
  @ViewChild('fileComPan', { static: false }) fileComPanRef;
  advisorId: any;
  clientId: any;
  proofTypes: any = [];
  bankLIst: any = [];
  constructor(private subInjectService: SubscriptionInject, private http: HttpService, private custumService: CustomerService, private enumService: EnumServiceService) { }
  ngOnInit() {
    this.advisorId = AuthService.getUserInfo().advisorId;
    // this.clientId = AuthService.getClientId();
    // this.addDocObj.clientId = this.clientId;
    this.proofTypes = this.enumService.getProofType();
    this.bankLIst = this.enumService.getBank();
    const obj = {
      userId: 2,
      userType: 2
    };
    this.custumService.getClientUploadFile(obj).subscribe((data) => {
      console.log("added get", data);
      this.getUploadedImg(data)
    });
  }

  @Input() set data(data) {
    console.log(data, "user data1")    //////////user data////////////////////
  }

  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  myFiles: any = [];
  filenm: any;
  parentId: any;
  addressProof: any = "";
  bankProof: any = "";
  selectedBank: any = "";
  proofSubType: any = 1;
  fileComPanImg: any = { view: '', store: '' };
  filePerPanImg: any = { view: '', store: '' };
  fileProof1Img: any = { view: '', store: '' };
  fileProof2Img: any = { view: '', store: '' };
  fileProof2BackImg: any = { view: '', store: '' };
  imgWidth: any = 100;
  imgStyleCom = {
    "width": this.imgWidth + "%",
    "height": "auto"
  }
  imgStylePer = {
    "width": this.imgWidth + "%",
    "height": "auto"
  }

  getUploadedImg(data) {
    data.forEach(imgData => {
      // const obj = {
      //   clientId: imgData.clientId,
      //   advisorId: this.advisorId,
      //   folderId: imgData.folderId,
      //   fileName: imgData.fileName
      // };
      const obj = {
        fileId: imgData.fileId
      };
      this.custumService.getClientProof(obj).subscribe(
        (data) => {
          if (imgData.proofType == 2 && imgData.documentId == 0) {
            this.fileComPanImg.view = data.preSignedUrl;
            this.fileComPanImg.store = imgData;
          }
          else if (imgData.proofType == 1 && imgData.documentId == 0) {
            this.filePerPanImg.view = data.preSignedUrl;
            this.filePerPanImg.store = imgData;
          }
          else if (imgData.documentId == 1) {
            this.fileProof1Img.view = data.preSignedUrl;
            this.fileProof1Img.store = imgData;
            this.selectedBank = imgData.documentId;
            this.bankProof = imgData.proofType;
          }
          else if (imgData.documentId == 2 && imgData.proofSubType == 1) {
            this.fileProof2Img.view = data.preSignedUrl;
            this.fileProof2Img.store = imgData;
            this.addressProof = imgData.proofType;
            this.proofSubType = imgData.proofSubType;
          }
          else if (imgData.documentId == 2 && imgData.proofSubType == 2) {
            this.fileProof2BackImg.view = data.preSignedUrl;
            this.fileProof2BackImg.store = imgData;
            this.addressProof = imgData.proofType;
            this.proofSubType = imgData.proofSubType;
          }
          console.log(data, "imge");
        }
      );
    });
  }

  addDocObj:any;

  getFile(e, type) {
    this.addDocObj = {
      advisorId: this.advisorId,
      clientId: 0,
      userId: 2,
      userType: 2,
      documentId: 0,
      documentType: 0,
      proofType: 0,
      proofSubType: 0,
      fileName: ''
    }
    this.myFiles = [];
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    this.fileComPanRef;
    reader.onload = () => {
      // this.imageViewer = reader.result;
      switch (type) {
        case "company-pan":
          this.fileComPanImg.view = reader.result;
          this.fileComPanImg.store = e.target.files[0];
          break;
        case "personal-pan":
          this.filePerPanImg.store = e.target.files[0];
          this.filePerPanImg.view = reader.result;
          break;
        case "proof-type1":
          this.fileProof1Img.store = e.target.files[0];
          this.fileProof1Img.view = reader.result;
          break;
        case "proof-type2":
          if (this.viewFront) {
            this.fileProof2Img.store = e.target.files[0];
            this.fileProof2Img.view = reader.result;
          }
          else {
            this.fileProof2BackImg.store = e.target.files[0];
            this.fileProof2BackImg.view = reader.result;
          }
          break;
        default:
          break;
      }
    }
    reader.readAsDataURL(file);
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
    });
    console.log(this.myFiles);
    this.uploadFile(type);
  }


  countFile: any;
  uploadFile(imgType) {
    this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
    this.countFile++;
    let fileName;
    switch (imgType) {
      case "company-pan":
        fileName = this.fileComPanImg.store;
        break;
      case "personal-pan":
        fileName = this.filePerPanImg.store;
        this.addDocObj.proofType = 1;
        break;
      case "proof-type1":
        fileName = this.fileProof1Img.store;
        this.addDocObj.documentType = 1;
        break;
      case "proof-type2":
        fileName = this.fileProof2Img.store;
        this.addDocObj.documentType = 2;
        break;
    }
    const obj = {
      userId: 2,
      userType: 2
    };
    this.custumService.clientUploadFile(obj).subscribe(
      data => this.uploadFileRes(data.preSignedUrl, data.fileName, imgType)
    );
  }

  removeImg(imgType) {
    switch (imgType) {
      case "company-pan":
        this.deleteImg(this.fileComPanImg.store.id);
        this.fileComPanImg = { view: '', store: '' };
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
      case "personal-pan":
        this.deleteImg(this.filePerPanImg.store.id);
        this.filePerPanImg = { view: '', store: '' };
        break;
      case "proof-type1":
        this.fileProof1Img = { view: '', store: '' };
        break;
      case "proof-type2":
        this.fileProof2Img = { view: '', store: '' };
        break;
    }
  }

  deleteImg(imgId) {
    let obj = { id: imgId }
    this.custumService.deleteClientProof(obj).subscribe((data) => {
      console.log("delete proof", data);
    });
  }

  uploadFileRes(data, fileName, type) {
    this.addDocObj.fileName = fileName;
    switch (type) {
      case "company-pan":
        this.addDocObj.proofType = 2;

        break;
      case "personal-pan":
        this.addDocObj.proofType = 1;
        break;
      case "proof-type1":
        this.addDocObj.proofType = this.bankProof;
        this.addDocObj.documentType = 1;
        this.addDocObj.documentId = this.selectedBank;
        break;
      case "proof-type2":
        this.addDocObj.proofType = this.addressProof;
        this.addDocObj.documentType = 2;
        this.addDocObj.proofSubType = this.proofSubType;
        break;
    }
    this.countFile++;

    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.putExternal(data, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      this.addDocumentUsers(this.addDocObj);
    }, error => {
      console.log('DocumentsComponent uploadFileRes error : ', error);

    });
  }

  addDocumentUsers(obj) {
    console.log(obj, "save obj");

    this.custumService.saveClientUploadFile(obj).subscribe((data) => {
      console.log("added", data);

    });
  }
  viewFront: boolean = true;
  getSubType(sub) {
    this.proofSubType = sub;
    if (sub == 1) {
      this.viewFront = true;
    }
    else {
      this.viewFront = false;
    }
  }
  // getProofType(type){
  //   switch (type) {
  //     case "proof-type1":
  //       this.addDocObj.proofType = this.addressProof;
  //       break;
  //     case "proof-type2":
  //       this.addDocObj.proofType = this.addressProof;
  //       break;
  //   }
  // }
  errProof1: boolean = true;
  showErr1: boolean = false;
  errProof2: boolean = true;
  showErr2: boolean = false;
  checkSelected(proof, err) {
    switch (proof) {
      case 'proof-type1':
        if (this.selectedBank != '' && this.bankProof != "") {
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
      case "company-pan":
        if (this.imgWidth < 300 && zoom == "zoomIn") {
          this.imgWidth += 10;
          this.imgStyleCom.width = this.imgWidth + "%";
        }
        else if (this.imgWidth > 100 && zoom == "zoomOut") {
          this.imgWidth -= 10;
          this.imgStyleCom.width = this.imgWidth + "%";
        }
        break;
      case "personal-pan":
        if (this.imgWidth < 300 && zoom == "zoomIn") {
          this.imgWidth += 10;
          this.imgStylePer.width = this.imgWidth + "%";
        }
        else if (this.imgWidth > 100 && zoom == "zoomOut") {
          this.imgWidth -= 10;
          this.imgStylePer.width = this.imgWidth + "%";
        }
        break;
    }
  }
}
