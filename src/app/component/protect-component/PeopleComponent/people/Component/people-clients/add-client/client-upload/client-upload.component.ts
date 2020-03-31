import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss']
})
export class ClientUploadComponent implements OnInit {
  @ViewChild('fileComPan',{static:false}) fileComPanRef;

  constructor(private subInjectService: SubscriptionInject, private http: HttpService, private custumService: CustomerService) { }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  myFiles:any =[];
  filenm:any;
  parentId:any
  fileComPanImg:any = {view:'', store:''};
  filePerPanImg:any= {view:'', store:''};
  fileProof1Img:any = {view:'', store:''};
  fileProof2Img:any = {view:'', store:''};
  imgWidth:any=100;
  imgStyleCom = {
    "width":this.imgWidth + "%",
    "height":"auto"
  }
  imgStylePer= {
    "width":this.imgWidth + "%",
    "height":"auto"
  }
  
  getFile(e, type) {
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
          this.fileProof2Img.store = e.target.files[0];
          this.fileProof2Img.view = reader.result;
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
  }

  advisorId: any;
  clientId: any;
  countFile:any;
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
        break;
      case "proof-type1":
        fileName = this.fileProof1Img.store;
        break;
      case "proof-type2":
        fileName = this.fileProof2Img.store;
        break;
    }
    const obj = {
      userId: 2,
      userType: 2
    };
    this.custumService.clientUploadFile(obj).subscribe(
      data => this.uploadFileRes(data.preSignedUrl, data.fileName)
    );
  }

  removeImg(imgType) {
    switch (imgType) {
      case "company-pan":
        this.fileComPanImg = {view:'', store:''};
        this.fileComPanRef.nativeElement.files.FileList = null;
        break;
      case "personal-pan":
        this.filePerPanImg= {view:'', store:''};
        break;
      case "proof-type1":
        this.fileProof1Img = {view:'', store:''};
        break;
      case "proof-type2":
        this.fileProof2Img = {view:'', store:''};
        break;
    }
  }

  uploadFileRes(data, fileName) {
    this.countFile++;

    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.putExternal(data, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
    }, error => {
      console.log('DocumentsComponent uploadFileRes error : ', error);

    });
  }

  zoomInOut(zoom, imgType){
    switch (imgType) {
      case "company-pan":
        if(this.imgWidth < 300 && zoom == "zoomIn" ){
          this.imgWidth += 10;
          this.imgStyleCom.width = this.imgWidth + "%";
        }
        else if(this.imgWidth > 100 && zoom == "zoomOut"){
          this.imgWidth -= 10;
          this.imgStyleCom.width = this.imgWidth + "%";
        }
        break;
      case "personal-pan":
        if(this.imgWidth < 300 && zoom == "zoomIn" ){
          this.imgWidth += 10;
          this.imgStylePer.width = this.imgWidth + "%";
        }
        else if(this.imgWidth > 100 && zoom == "zoomOut"){
          this.imgWidth -= 10;
          this.imgStylePer.width = this.imgWidth + "%";
        }
        break;
    }
  }
}
