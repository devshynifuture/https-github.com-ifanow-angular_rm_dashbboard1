import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { HttpHeaders } from '@angular/common/http';
import { DocumentNewFolderComponent } from '../../../common-component/document-new-folder/document-new-folder.component';
import { HttpService } from 'src/app/http-service/http-service';
import { CopyDocumentsComponent } from '../../../common-component/copy-documents/copy-documents.component';
import { ViewActivityComponent } from './view-activity/view-activity.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EmailQuotationComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/email-quotation/email-quotation.component';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-document-explorer',
  templateUrl: './document-explorer.component.html',
  styleUrls: ['./document-explorer.component.scss']
})

export class DocumentExplorerComponent implements AfterViewInit, OnInit {

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
  myFiles: string[] = [];
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
  getInnerDoc: any;
  name: string;
  isLoading = false;
  dataToCommon: any;
  showMsg = false;
  showResult = false;
  noResult = false;
  selectedFolder: any;
  countFile: any;

  constructor(private eventService: EventService, private http: HttpService, private _bottomSheet: MatBottomSheet,
    private event: EventService, private router: Router, private fb: FormBuilder,
    private custumService: CustomerService, public subInjectService: SubscriptionInject,
    public utils: UtilService, public dialog: MatDialog,
    public roleService: RoleService) {
  }

  showDots = false;
  parentId: any;
  filenm: string;
  viewFolder: string[] = [];
  createdFolderName: any;
  sendObj: { clientId: any; advisorId: any; parentFolderId: any; folderName: any; };
  detailed: { clientId: any; advisorId: any; folderParentId: any; folderName: any; };
  uploadFolder: string[] = [];
  folderNameToDisplay: any;
  getSort: any;
  viewMode;

  ngAfterViewInit(): void {
    this.commonFileFolders = new MatTableDataSource(this.data);
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
    this.getAllFileList(tabValue);
  }

  openDialog(element, value): void {
    this.selectedFolder = element;
    const dialogRef = this.dialog.open(DocumentNewFolderComponent, {
      width: '30%',
      data: { name: value, animal: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getInnerDoc = result;
      // if (element == 'CREATE') {
      //   this.createFolder(this.getInnerDoc);
      // }
      if (element == 'RENAME') {
        if (this.getInnerDoc.rename.flag == 'fileName') {
          this.renameFile(this.getInnerDoc);
        } else {
          this.renameFolders(this.getInnerDoc);
        }
      }
      if (result.isRefreshRequired) {
        this.getAllFileList(this.valueTab);
      }

    });

  }

  getSharebleLink(element) {
    this.downloadFiles(element, 'getSharebleLink');
  }

  // openDocumentPreview() {
  //   // const obj = {
  //   //   documentRepositoryId: this._upperData.documentData.documentRepositoryId
  //   // };
  //   // this.subService.getQuotationServiceData(obj).subscribe(
  //   //   data => console.log(data)
  //   // );
  //   let d = new Date();
  //   this.serviceData.forEach(element => {
  //     this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(service_' + element.id + ')'), 'g'),
  //       element.serviceName);
  //     this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(client_name)'), 'g'),
  //       'Ronak Hindocha');
  //     this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(service_fee_' + element.id + ')'), 'g'),
  //       tableHtml);
  //     this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(advisor_name)'), 'g'), 'Ronak Hindocha')
  //     this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(date)'), 'g'),
  //       d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear())
  //   });
  //   let obj =
  //     {
  //       data: this.dataTerms.docText,
  //       cancelButton: () => {
  //         this.utilservice.htmlToPdf(this.dataTerms.docText, 'document');
  //         dialogRef.close();
  //       }
  //     }
  //   const dialogRef = this.dialog.open(DocumentPreviewComponent, {
  //     width: '1800px',
  //     height: '900px',
  //     data: obj,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });

  // }
  copyFilesRes(data) {
    this.eventService.openSnackBar('copy file successfully', 'Dismiss');
    this.reset();
  }

  moveFilesRes(data) {
    this.eventService.openSnackBar('move file successfully', 'Dismiss');
    this.getAllFileList('Documents');
    this.reset();
  }

  moveFolderRes(data) {
    this.eventService.openSnackBar('move folder successfully', 'Dismiss');
    this.getAllFileList('Documents');
    this.reset();
  }

  openDialogCopy(element, value): void {
    const dialogRef = this.dialog.open(CopyDocumentsComponent, {
      width: '40%',
      data: { name: value, animal: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return;
      }
      console.log('The dialog was closed', element);
      this.getInnerDoc = result;
      if (result.value == 'Copy') {
        delete result.value;
        this.custumService.copyFiles(result).subscribe(
          data => this.copyFilesRes(data)
        );
      } else if (result.value == 'Move') {
        if (element.folderName == undefined) {
          delete result.value;
          this.custumService.moveFiles(result).subscribe(
            data => this.moveFilesRes(data)
          );
        } else {
          delete result.value;
          this.custumService.moveFolder(result).subscribe(
            data => this.moveFolderRes(data)
          );
        }
      }
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
    console.log('helooooo');
    // if(data==204){
    //   this.eventService.openSnackBar('Folder name already exist', 'Ok');
    // }
    console.log('newFolderRes', data);
    this.getAllFileList(this.valueTab);
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

  fileSizeConversion() {
    this.commonFileFolders.filteredData.forEach(element => {
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
      folderParentId: (this.parentId) ? this.parentId : 0,
    };
    this.isLoading = true;
    this.commonFileFolders.data = [{}, {}, {}];
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value'), (error) => {
        this.eventService.showErrorMessage(error);
        this.commonFileFolders.data = [];
        this.isLoading = false;
      }
    );
  }

  getAllFilesRes(data, value) {
    if (data.files.length == 0 && data.folders.length == 0) {
      this.showMsg = true;
    } else {
      this.showMsg = false;
    }
    this.isLoading = false;
    this.allFiles = data.files;
    this.AllDocs = data.folders;
    this.dataToCommon = data.folders;
    this.getSort = this.dataToCommon;
    this.dataToCommon.push.apply(this.dataToCommon, this.allFiles);
    if (this.dataToCommon.openFolderId == undefined || this.openFolderName.length == 0) {
      Object.assign(this.dataToCommon, { openFolderNm: value.folderName });
      Object.assign(this.dataToCommon, { openFolderId: value.id });
      this.parentId = (value.id == undefined) ? 0 : value.id;
      this.openFolderName.push(this.dataToCommon);
      this.valueFirst = this.openFolderName[0];
      if (this.dataToCommon.length > 0) {

        this.dataToCommon.forEach(element => {
          if (element.fileName) {
            var type = /^.+\.([^.]+)$/.exec(element.fileName);
            element.fileType = (type == null) ? '' : type[1];
          }
        });
        this.commonFileFolders = this.dataToCommon;
        this.commonFileFolders = new MatTableDataSource(this.dataToCommon);
        this.commonFileFolders.sort = this.sort;
        this.fileTypeGet();
        this.backUpfiles.push(this.dataToCommon);
      }
      console.log('this.backUpfiles', this.backUpfiles);
      this.commonFileFolders = this.dataToCommon;
      this.commonFileFolders = new MatTableDataSource(this.dataToCommon);
      this.commonFileFolders.sort = this.sort;
    }
    if (this.openFolderName.length > 2) {
      this.showDots = true;
    }
    this.fileSizeConversion();
    console.log('sorted', this.commonFileFolders);
  }

  keyPress(event) {
    if (event == ' ') {
      this.reset();
    } else {
      console.log('search', event);
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        name: event
      };
      if (event.length > 2) {
        this.custumService.searchFile(obj).subscribe(
          data => this.searchFileRes(data, 'value')
        );
      }
    }
  }

  searchFileRes(data, value) {
    this.showResult = true;
    const obj = [];
    console.log(data);
    Object.assign(obj, { files: data.SEARCHED_FILE });
    Object.assign(obj, { folders: data.SEARCHED_FOLDER });
    if (data.SEARCHED_FILE.length == 0 && data.SEARCHED_FILE.length == 0) {
      this.noResult = true;
    } else {
      this.isLoading = true;
      this.commonFileFolders.data = [{}, {}, {}];
      this.commonFileFolders = new MatTableDataSource(this.data);
      this.getAllFilesRes(obj, value);
    }

  }

  fileTypeGet() {
    this.commonFileFolders.filteredData.forEach(p => {
      this.fileType.forEach(n => {
        if (n.id == p.fileTypeId) {
          p.fileTypeId = n.name;
        }
        this.isLoading = false;
      });
    });
  }

  getFolders(data, index) {
    this.isLoading = true;
    this.showMsg = false;
    this.commonFileFolders.data = [{}, {}, {}];
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.parentId = (data == undefined) ? 0 : data[0].folderParentId;
    console.log('parentId', this.parentId);
    this.openFolderName = this.openFolderName.filter((element, i) => i <= index);
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    this.commonFileFolders = new MatTableDataSource(data);
    this.commonFileFolders.sort = this.sort;
    this.fileTypeGet();
    this.valueFirst = this.openFolderName[0];
  }

  reset() {
    this.showMsg = false;
    this.showResult = false;
    this.noResult = false;
    if (this.openFolderName.length > 0) {
      this.commonFileFolders = this.backUpfiles[0];
    }
    this.commonFileFolders = new MatTableDataSource(this.backUpfiles[0]);
    this.commonFileFolders.sort = this.sort;
    this.openFolderName = [];
    this.parentId = 0;
  }

  openFolder(value) {
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
        docGetFlag: this.valueTab,
        folderParentId: (value.id == undefined) ? 0 : value.id,
      };
      console.log('this.parentId', this.parentId);
      console.log('backUpfiles', this.backUpfiles);
      this.commonFileFolders.data = [{}, {}, {}];
      this.commonFileFolders = new MatTableDataSource(this.data);
      this.custumService.getAllFiles(obj).subscribe(
        data => this.getAllFilesRes(data, value)
      );
      console.log('we have opened the folder,,', value);
    }
  }

  downloadFiles(element, value) {
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
    console.log(data);
    if (value == 'getSharebleLink') {
      console.log('getSharebleLink', data);
    } else {
      window.open(data);
    }
  }

  deleteModal(flag, data) {
    const dialogData = {
      data: flag,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
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
              this.eventService.openSnackBar('Deleted', 'Dismiss');
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
              this.eventService.openSnackBar('Deleted', 'Dismiss');
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
    this.myFiles = [];
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
    this.countFile = 0;
    this.myFiles = [];
    const array = [];
    this.viewFolder = [];

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
      viewFolder: this.viewFolder,
      countFiles: this.countFile++

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
    this.countFile++;
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
    this.countFile++;
    const fragData = {
      uploadFolder: this.uploadFolder,
      flag: 'uploadFolder',
      viewFolder: this.viewFolder,
      countFiles: this.countFile
    };
    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);

    });
    this.getAllFileList(this.valueTab);
    this._bottomSheet.dismiss();
    this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
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
