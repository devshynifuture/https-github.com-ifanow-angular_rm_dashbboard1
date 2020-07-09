import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { PreviewComponent } from '../../../customer-overview/overview-documents/preview/preview.component';
import { HttpHeaders } from '@angular/common/http';
import { GetSharebleLinkComponent } from '../../../customer-overview/overview-documents/get-shareble-link/get-shareble-link.component';
import { MatDialog } from '@angular/material';
import { HttpService } from 'src/app/http-service/http-service';

@Component({
  selector: 'app-mobile-document',
  templateUrl: './mobile-document.component.html',
  styleUrls: ['./mobile-document.component.scss']
})
export class MobileDocumentComponent implements OnInit {

  fileType = [
    { id: 1, name: 'PDF' },
    { id: 2, name: 'DOC' },
    { id: 3, name: 'XLSX' },
    { id: 4, name: 'MP3' },
    { id: 5, name: 'MP4' },
    { id: 6, name: 'WAV' },
    { id: 7, name: 'ZIP' },
    { id: 8, name: 'BIN' },
    { id: 9, name: 'ISO' },
    { id: 10, name: 'JPEG' },
    { id: 11, name: 'JPG' },
    { id: 12, name: 'TXT' },
    { id: 13, name: 'HTML' },
  ];

  openMenue: boolean = false;
  inputData: any;
  advisorId: any;
  clientId: any;
  commonFileFolders: any;
  isLoading: boolean;
  parentId: any;
  openFolderName: any[];
  backUpfiles = [];
  valueTab: any;
  showMsg: boolean;
  noResult: boolean;
  showResult: boolean;
  allFiles: any;
  AllDocs: any;
  dataToCommon: any;
  getSort: any;
  valueFirst: any;
  showDots: boolean;
  urlData: string;
  selectedElement: any;
  previewDoc: boolean;
  element: any;
  shortUrl: any;
  getUserInfo: any;
  folderData = [];

  constructor(
    private custumService: CustomerService,
    private eventService: EventService,
    private utils: UtilService,
    public dialog: MatDialog,
    private http: HttpService
  ) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    const tabValue = 'Documents';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllFileList(tabValue, 'init');
  }
  openMenu(flag) {
    if (flag == false) {
      this.openMenue = true
    } else if ((flag == true)) {
      this.openMenue = false
    } else {
      this.openMenue = true
    }
  }

  getAllFileList(tabValue, flag) {
    tabValue = (tabValue == 'Documents' || tabValue == 1) ? 1 : (tabValue == 'Recents' || tabValue == 2) ? 2 : (tabValue == 'Starred' || tabValue == 3) ? 3 : (tabValue == 'Deleted files' || tabValue == 4) ? 4 : undefined;
    if (tabValue == undefined) {
      tabValue = 1
    }
    if (tabValue == 'Documents' || tabValue == 1) {
      this.openFolderName = []
    }
    if (flag == 'refresh') {
      this.backUpfiles = [];
      this.openFolderName = []
    } else if (this.openFolderName.length > 0) {
      // this.parentId = 
    }
    console.log('openfoldername', this.openFolderName)
    this.valueTab = tabValue;
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: tabValue,
      folderParentId: (this.parentId) ? this.parentId : 0,
    };
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value'), (error) => {
        this.eventService.showErrorMessage(error);
        this.commonFileFolders.data = [];
        this.isLoading = false;
        this.showMsg == true
      }
    );
  }

  getAllFilesRes(data, value) {
    this.isLoading = false;
    this.noResult = false;
    this.showResult = false;
    if (data.files.length == 0 && data.folders.length == 0) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    this.allFiles = data.files;
    this.AllDocs = data.folders;
    this.dataToCommon = data.folders;
    this.getSort = this.dataToCommon;
    this.dataToCommon.push.apply(this.dataToCommon, this.allFiles);
    if (this.dataToCommon.openFolderId == undefined || this.openFolderName.length == 0) {
      // Object.assign(this.dataToCommon, { openFolderNm: value.folderName });
      // Object.assign(this.dataToCommon, { openFolderId: value.id });
      // this.folderData = {
      //   openFolderNm: value.folderName,
      //   openFolderId: value.id
      // }
      this.parentId = (value.id == undefined) ? 0 : value.id;
      this.openFolderName.push(this.dataToCommon);
      this.valueFirst = this.openFolderName[0];
      if (this.dataToCommon.length > 0) {
        this.dataToCommon.forEach(element => {
          if (element.fileName) {
            var type = /^.+\.([^.]+)$/.exec(element.fileName);
            element.fileType = (type == null) ? "" : type[1];
          }
        });
        this.commonFileFolders = this.dataToCommon;
        this.backUpfiles.push(this.dataToCommon);
      }
      console.log('this.backUpfiles', this.backUpfiles);
      this.commonFileFolders = this.dataToCommon;
    }
    if (this.openFolderName.length > 2) {
      this.showDots = true;
    }
    this.fileSizeConversion();
    console.log('sorted', this.commonFileFolders);
  }

  fileTypeGet() {
    this.commonFileFolders.forEach(p => {
      this.fileType.forEach(n => {
        if (n.id == p.fileTypeId) {
          p.fileTypeId = n.name;
        }
        this.isLoading = false;
      });
    });
  }

  fileSizeConversion() {
    this.commonFileFolders.forEach(element => {
      const data = parseInt(element.size);
      if (data >= 1024) {
        element.size = data / 1024;
        element.size = (this.utils.formatter(element.size) + '' + 'KB');
      } else if (data >= 1000000) {
        element.size = data / 1000000;
        element.size = (this.utils.formatter(element.size) + '' + 'MB');
      }
    });
  }

  openFolder(value) {
    this.folderData.push(
      {
        openFolderNm: value.folderName,
        openFolderId: value.id,
        folderParentId: value.folderParentId
      });
    this.showMsg = false;
    this.urlData = ''
    if (this.isLoading) {
      return;
    }
    if (value.fileName != undefined) {
      return;
    } else {
      this.isLoading = true;
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        docGetFlag: 1,
        folderParentId: (value.id == undefined) ? 0 : value.id,
      };
      console.log('this.parentId', this.parentId);
      console.log('backUpfiles', this.backUpfiles);
      this.custumService.getAllFiles(obj).subscribe(
        data => this.getAllFilesRes(data, value)
      );
      console.log('we have opened the folder,,', value);
    }
  }

  getSharebleLink(element, flag) {
    this.selectedElement = element
    if (element.fileName) {
      ``
      this.downlodFiles(element, flag);
    }
  }

  downlodFiles(element, value) {
    this.previewDoc = true
    if (value == 'download') {
      this.isLoading = false
    } else if (value != 'preview') {
      this.isLoading = true
    }
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element.parentFolderId,
      fileName: element.fileName
    };
    this.custumService.downloadFile(obj).subscribe(
      data => this.downloadFileRes(data, value)
    );
  }

  downloadFileRes(data, value) {
    this.isLoading = false
    this.previewDoc = true
    console.log(data);
    if (value == 'shareLink' || value == 'share') {
      console.log('shareLink', data)
      this.urlShorten(data, value)

    } else if (value == 'preview') {
      this.urlData = data
    } else if (value == 'DocPreview') {
      this.urlData = ''
      const dialogRef = this.dialog.open(PreviewComponent, {
        width: '500px',
        height: '600px',
        data: { bank: data, selectedElement: this.selectedElement }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == undefined) {
          return
        }
        console.log('The dialog was closed');
        this.element = result;
        console.log('result -==', this.element)
      });
    } else {
      window.open(data);
    }
    setTimeout(() => {
      this.previewDoc = false
    }, 4000);
  }

  urlShorten(data, value) {
    this.isLoading = true
    var link =
    {
      "destination": data,
      "domain":
      {
        "fullName": "rebrand.ly"
      }
    }
    const httpOptions = {
      headers: new HttpHeaders()
        .set('apiKey', 'b96683be9a4742979e78c6011a3ec2ca')
    };
    this.http.post('https://api.rebrandly.com/v1/links', link, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      if (responseData == null) {
      }
      console.log(responseData)
      this.isLoading = false
      this.shortUrl = responseData.shortUrl
      this.verifyEmail(this.shortUrl, value)
    });
  }

  verifyEmail(value, flag) {
    const dialogRef = this.dialog.open(GetSharebleLinkComponent, {
      width: '400px',
      data: { bank: value, flag: flag }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.element = result;
      console.log('result -==', this.element)
      let obj = {
        fromEmail: "support@futurewise.co.in",
        toEmail: this.element.email,
        emailSubject: "Share link",
        messageBody: 'You have received this email because' + this.getUserInfo.name + ' shared link with you.  ' + '' + this.element.link
      }
      if (this.element != "") {
        this.custumService.sendSharebleLink(obj).subscribe(
          data => this.sendSharebleLinkRes(data),
          err => this.eventService.openSnackBar(err, "Dismiss")
        );
      }
    });
  }
  sendSharebleLinkRes(data) {
    this.eventService.openSnackBar('Link shared on email successfully', 'Dismiss');
  }

  getFolders(data, index) {
    this.urlData = ''
    this.isLoading = true;
    this.showMsg = false;
    // this.commonFileFolders.data = [{}, {}, {}];
    // this.commonFileFolders = new MatTableDataSource(this.data);
    this.parentId = (data == undefined) ? 0 : data.folderParentId;
    console.log('parentId', this.parentId);
    this.folderData.splice(this.folderData.length - 1,1);
    this.openFolderName = this.openFolderName.filter((element, i) => i <= index);
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    // this.commonFileFolders = new MatTableDataSource(data);
    // this.commonFileFolders.sort = this.sort;
    this.fileTypeGet();
    this.valueFirst = this.openFolderName[0];
  }
}

