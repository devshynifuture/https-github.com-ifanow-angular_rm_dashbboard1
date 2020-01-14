import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer.service';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth-service/authService';
import { HttpHeaders } from '@angular/common/http';
import { DocumentNewFolderComponent } from '../../../common-component/document-new-folder/document-new-folder.component';
import { HttpService } from 'src/app/http-service/http-service';
import { CopyDocumentsComponent } from '../../../common-component/copy-documents/copy-documents.component';
import { ViewActivityComponent } from './view-activity/view-activity.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EmailQuotationComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/email-quotation/email-quotation.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})

export class DocumentsComponent implements AfterViewInit, OnInit {
  areFoldersAndFilesEmpty: boolean = false;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
  displayedColumns: string[] = ['emptySpace', 'name', 'lastModi', 'type', 'size', 'icons'];
  dataSource = ELEMENT_DATA;
  percentDone: number;
  uploadSuccess: boolean;
  myFiles: string[] = [];
  sMsg = '';
  setTab: string;
  advisorId: any;
  clientId: any;
  allFiles: any;
  AllDocs: any;
  data: Array<any> = [{}, {}, {}];
  commonFileFolders = new MatTableDataSource(this.data);
  openFolderName: any;
  backUpfiles: any;
  i = 0;
  resetData: any;
  tabValue: any;
  valueTab: any;
  valueFirst: any;
  animal: any;
  name: string;
  isLoading = false;

  constructor(private eventService: EventService, private http: HttpService, private _bottomSheet: MatBottomSheet,
    private event: EventService, private router: Router, private fb: FormBuilder,
    private custumService: CustomerService, public subInjectService: SubscriptionInject,
    public utils: UtilService, public dialog: MatDialog) {
  }

  showDots = false;
  parentId: any;
  filenm: string;
  showLoader: boolean;
  viewFolder: string[] = [];
  createdFolderName: any;
  sendObj: { clientId: any; advisorId: any; parentFolderId: any; folderName: any; };
  detailed: { clientId: any; advisorId: any; folderParentId: any; folderName: any; };
  uploadFolder: string[] = [];
  folderNameToDisplay: any;


  getSort: any;

  viewMode;

  ngAfterViewInit(): void {
    this.commonFileFolders = new MatTableDataSource(this.getSort);
    this.commonFileFolders.sort = this.sort;
    console.log('sorted', this.commonFileFolders);
  }

  ngOnInit() {
    const tabValue = 'Documents';
    this.viewMode = 'tab1';
    this.backUpfiles = [];
    this.openFolderName = [];
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.areFoldersAndFilesEmpty = false;
    this.getAllFileList(tabValue);
    this.showLoader = true;
  }

  openDialog(element, value): void {
    const dialogRef = this.dialog.open(DocumentNewFolderComponent, {
      width: '30%',
      data: { name: value, animal: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.animal = result;
      if (element == 'CREATE') {
        this.createFolder(this.animal);
      }
      if (this.animal.rename.flag == 'fileName') {
        this.renameFile(this.animal);
      } else {
        this.renameFolders(this.animal);
      }
    });

  }

  openDialogCopy(element, value): void {
    const dialogRef = this.dialog.open(CopyDocumentsComponent, {
      width: '40%',
      data: { name: value, animal: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      this.getAllFileList(this.animal);
    });
  }

  renameFile(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.rename.value.id,
      fileName: element.newFolder
    };
    this.custumService.renameFiles(obj).subscribe(
      data => this.renameFilesRes(data)
    );
  }

  renameFilesRes(data) {
    console.log(data);
    this.getAllFileList(this.valueTab);
  }

  renameFolders(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.rename.value.id,
      folderName: element.newFolder
    };
    this.custumService.renameFolder(obj).subscribe(
      data => this.renameFolderRes(data)
    );
  }

  renameFolderRes(data) {
    console.log(data);
    this.getAllFileList(this.valueTab);
  }

  createFolder(element) {
    console.log('folder name', element);
    this.createdFolderName = element;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderParentId: (this.parentId == undefined) ? 0 : this.parentId,
      folderName: element.newFolder
    };
    this.detailed = obj;
    this.custumService.newFolder(obj).subscribe(
      data => this.newFolderRes(data)
    );
  }

  newFolderRes(data) {
    console.log('newFolderRes', data);
    this.getAllFileList(this.valueTab);
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
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


  getAllFileList(tabValue) {

    tabValue = (tabValue == 'Documents' || tabValue == 1) ? 1 : (tabValue == 'Recents' || tabValue == 2) ? 2 : (tabValue == 'Starred' || tabValue == 3) ? 3 : 4;
    this.valueTab = tabValue;
    this.backUpfiles = [];
    this.commonFileFolders.data = [];
    this.openFolderName = [];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: tabValue,
      folderParentId: 0,
    };
    this.isLoading = true;
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value')
    );
  }

  getAllFilesRes(data, value) {
    console.log("this is folder length and files length ")
    console.log(data.folders.length, data.files.length);
    if (data.folders.length === 0 && data.files.length === 0) {
      this.areFoldersAndFilesEmpty = true;
    }
    this.allFiles = data.files;
    this.AllDocs = data.folders;
    this.commonFileFolders = data.folders;
    this.getSort = this.commonFileFolders;
    this.commonFileFolders.push.apply(this.commonFileFolders, this.allFiles);
    if (this.commonFileFolders.openFolderId == undefined || this.openFolderName.length == 0) {
      Object.assign(this.commonFileFolders, { openFolderNm: value.folderName });
      Object.assign(this.commonFileFolders, { openFolderId: value.id });
      this.parentId = (value.id == undefined) ? 0 : value.id;
      console.log('parentId', this.parentId);
      this.openFolderName.push(this.commonFileFolders);
      this.valueFirst = this.openFolderName[0];
      if (this.commonFileFolders.length > 0) {
        this.fileTypeGet();
        this.backUpfiles.push(this.commonFileFolders);
      }
      console.log('this.backUpfiles', this.backUpfiles);
    }
    this.isLoading = false;
    if (this.openFolderName.length > 2) {
      this.showDots = true;
    }
    this.fileSizeConversion();
    this.showLoader = false;
    this.commonFileFolders = new MatTableDataSource(this.getSort);
    this.commonFileFolders.sort = this.sort;
    console.log('sorted', this.commonFileFolders);
  }

  fileTypeGet() {
    this.commonFileFolders.forEach(p => {
      this.fileType.forEach(n => {
        if (n.id == p.fileTypeId) {
          p.fileTypeId = n.name;
        }
      });
    });
  }

  getFolders(data) {
    this.parentId = (data == undefined) ? 0 : data[0].folderParentId;
    console.log('parentId', this.parentId);
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId + 1;
    });
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId;
    });
    this.commonFileFolders = data;
    this.fileTypeGet();
    this.valueFirst = this.openFolderName[0];
  }

  reset() {
    this.areFoldersAndFilesEmpty = false;
    if (this.openFolderName.length > 0) {
      this.commonFileFolders = this.backUpfiles[0];
    }
    this.commonFileFolders = this.backUpfiles[0];
    this.openFolderName = [];
    this.parentId = 0;
  }

  openFolder(value) {
    if (value.fileName != undefined) {
      return
    } else {
      this.showLoader = true
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        docGetFlag: this.valueTab,
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

  downlodFiles(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element.parentFolderId,
      fileName: element.fileName
    };
    this.custumService.downloadFile(obj).subscribe(
      data => this.downloadFileRes(data)
    );
  }

  downloadFileRes(data) {
    console.log(data);
    window.open(data);
  }

  deleteModal(flag, data) {
    const dialogData = {
      data,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (flag == 'FOLDER') {

        } else {

        }
        if (flag == 'FOLDER') {
          const obj = {
            clientId: this.clientId,
            advisorId: this.advisorId,
            id: data.id
          };
          this.custumService.deleteFolder(obj).subscribe(
            data => {
              this.eventService.openSnackBar('Deleted', 'dismiss');
              dialogRef.close();
              this.getAllFileList(this.valueTab);
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          const obj1 = {
            clientId: this.clientId,
            advisorId: this.advisorId,
            parentFolderId: data.parentFolderId,
            id: data.id
          };
          this.custumService.deleteFile(obj1).subscribe(
            data => {
              this.eventService.openSnackBar('Deleted', 'dismiss');
              dialogRef.close();
              this.getAllFileList(this.valueTab);
            },
            error => this.eventService.showErrorMessage(error)
          );
        }
      },
      negativeMethod: () => {
      }
    };
    console.log(dialogData + 'dialogData');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  OpenEmail(data) {
    const fragmentData = {
      flag: 'addSchemeHolding',
      data,
      id: 1,
      state: 'open',
      componentName: EmailQuotationComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  starFiles(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.id,
      flag: (element.folderName == undefined) ? 2 : 1
    };
    this.custumService.starFile(obj).subscribe(
      data => this.starFileRes(data)
    );
  }

  starFileRes(data) {
    console.log(data);
    this.getAllFileList(this.valueTab);
  }

  viewActivities(element) {
    if (element.folderName == undefined) {
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        fileId: (element.folderName == undefined) ? element.id : null,
      };
      this.custumService.viewActivityFile(obj).subscribe(
        data => this.viewActivityFileRes(data)
      );
    } else {
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        id: (element.fileName == undefined) ? element.id : null,
      };
      this.custumService.viewActivityFolder(obj).subscribe(
        data => this.viewActivityFolderRes(data)
      );
    }

  }

  viewActivityFolderRes(data) {
    console.log(data);
    this.openActivity(data);
  }

  viewActivityFileRes(data) {
    console.log(data);
    data.foldersNm = this.openFolderName;
    this.openActivity(data);
  }

  openActivity(data) {
    const fragmentData = {
      flag: 'addSchemeHolding',
      data,
      id: 1,
      state: 'open',
      componentName: ViewActivityComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getFileDetails(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
      this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
      this.uploadFile(this.parentId, this.filenm);
    });
    console.log(this.myFiles);
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
  }

  uploadDocumentFolder(data) {
    this.myFiles = [];
    const array = [];

    const folderName = data.target.files[0].webkitRelativePath.split('/');
    this.folderNameToDisplay = {
      newFolder: folderName[0]
    };
    this.createFolder(this.folderNameToDisplay);
    for (let i = 0; i < data.target.files.length; i++) {
      this.myFiles.push(data.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
      this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
      this.uploadFile(this.parentId, this.filenm);
    });
    console.log(data);
    array.push(this.myFiles);
    this.viewFolder.push(array[0]);

    const fragData = {
      uploadFolder: this.uploadFolder,
      flag: 'uploadFolder',
      viewFolder: this.viewFolder
    };
    console.log(this.myFiles);
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: fragData
    });
  }

  uploadFiles() {
    const frmData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
  }

  uploadFile(element, fileName) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element,
      fileName: fileName.name
    };
    this.custumService.uploadFile(obj).subscribe(
      data => this.uploadFileRes(data, fileName)
    );
  }

  uploadFileRes(data, fileName) {

    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
    });
    this.getAllFileList(this.valueTab);
  }
}


export interface PeriodicElement {
  emptySpace: string;
  name: string;
  lastModi: string;
  type: string;
  size: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { emptySpace: '', name: 'Identity & address proofs', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { emptySpace: '', name: 'Accounts', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { emptySpace: '', name: 'Planning', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { emptySpace: '', name: 'Transaction', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { emptySpace: '', name: 'Agreements & invoices', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },

];

