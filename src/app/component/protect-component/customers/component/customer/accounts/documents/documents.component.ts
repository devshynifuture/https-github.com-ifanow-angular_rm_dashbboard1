import { Component, OnInit, ɵConsole } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { EventService } from 'src/app/Data-service/event.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer.service';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth-service/authService';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  displayedColumns: string[] = ['emptySpace', 'name', 'lastModi', 'type', 'size', 'icons'];
  dataSource = ELEMENT_DATA;
  percentDone: number;
  uploadSuccess: boolean;
  myFiles:string [] = [];
  sMsg:string = '';
  setTab: string;
  advisorId: any;
  clientId: any;
  allFiles: any;
  AllDocs: any;
  commonFileFolders: any;
  openFolderName: any;
  backUpfiles: any;
  i = 0;
  resetData: any;
  tabValue: any;
  valueTab: any;
  valueFirst: any;
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
  ]
  showDots = false;

  constructor( private http: HttpClient,private _bottomSheet: MatBottomSheet, private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
  viewMode
  ngOnInit() {
    let tabValue = 'Documents'
    this.viewMode = "tab1"
    this.commonFileFolders = [];
    this.backUpfiles = [];
    this.openFolderName = [];
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllFileList(tabValue)
  }
  fileSizeConversion() {
    this.commonFileFolders.forEach(element => {
      var data = parseInt(element.size)
      if (data >= 1024) {
        element.size = data / 1024;
        element.size = (this.utils.formatter(element.size) + "" + 'Kb');
      } else if (data >= 1000000) {
        element.size = data / 1000000;
        element.size = (this.utils.formatter(element.size) + "" + 'Mb');
      }
    });
  }
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }
  getAllFileList(tabValue) {
    tabValue = (tabValue == 'Documents') ? 1 : (tabValue == 'Recents') ? 2 : (tabValue == 'Starred') ? 3 : 4;
    this.valueTab = tabValue
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: tabValue,
      folderParentId: 0,
    }
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value')
    );
  }
  getAllFilesRes(data, value) {
    console.log(data)
    this.allFiles = data.files
    this.AllDocs = data.folders;
    this.commonFileFolders = data.folders;
    this.commonFileFolders.push.apply(this.commonFileFolders, this.allFiles)
    console.log('commonFileFolders', this.commonFileFolders)

    if (this.commonFileFolders.openFolderId == undefined || this.openFolderName.length == 0) {
      Object.assign(this.commonFileFolders, { 'openFolderNm': value.folderName });
      Object.assign(this.commonFileFolders, { 'openFolderId': value.id });
      this.openFolderName.push(this.commonFileFolders)
      this.valueFirst = this.openFolderName[0]
      if (this.commonFileFolders.length > 0) {
        this.backUpfiles.push(this.commonFileFolders);
      }
      console.log('this.backUpfiles', this.backUpfiles)
    }
    if (this.openFolderName.length > 2) {
      this.showDots = true
    }
    this.fileSizeConversion()
  }
  getFolders(data) {
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId + 1;
    });
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1]
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId;
    });
    this.commonFileFolders = data;
    this.valueFirst = this.openFolderName[0];
  }
  reset() {
    if (this.openFolderName.length > 0) {
      this.commonFileFolders = this.backUpfiles[0];
    }
    this.commonFileFolders = this.backUpfiles[0];
    this.openFolderName = [];
  }
  openFolder(value) {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: this.valueTab,
      folderParentId: (value.id == undefined) ? 0 : value.id,
    }
    console.log('backUpfiles', this.backUpfiles)
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, value)
    );
  }
  downlodFiles(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element.parentFolderId,
      fileName: element.fileName
    }
    this.custumService.downloadFile(obj).subscribe(
      data => this.downloadFileRes(data)
    );
  }
  downloadFileRes(data) {
    console.log(data)
    window.open(data);
  }
  deleteFile(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      parentFolderId: element.parentFolderId,
      id: element.id
    }
    this.custumService.deleteFile(obj).subscribe(
      data => this.deleteFileRes(data)
    );
  }
  deleteFileRes(data) {
    console.log(data)
  }
  moveFile(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      parentFolderId: element.parentFolderId,
      id: element.id
    }
    this.custumService.moveFiles(obj).subscribe(
      data => this.moveFilesRes(data)
    );
  }
  moveFilesRes(data) {
    console.log(data)
  }
  copyFile(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      parentFolderId: element.parentFolderId,
      id: element.id
    }
    this.custumService.copyFiles(obj).subscribe(
      data => this.copyFilesRes(data)
    );
  }
  copyFilesRes(data) {
    console.log(data)
  }
  renameFile(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element.id,
      fileName: element.fileName
    }
    this.custumService.renameFiles(obj).subscribe(
      data => this.renameFilesRes(data)
    );
  }
  renameFilesRes(data) {
    console.log(data)
  }
  renameFolders(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      folderId: element.id,
      fileName: element.folderName
    }
    this.custumService.renameFolder(obj).subscribe(
      data => this.renameFolderRes(data)
    );
  }
  renameFolderRes(data) {
    console.log(data)
  }
  trashFolder(element) {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.id
    }
    this.custumService.deleteFolder(obj).subscribe(
      data => this.deleteFolderRes(data)
    );
  }
  deleteFolderRes(data) {
    console.log(data)
  }

  starFiles(element){
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.id,
      flag: (element.folderName == undefined)?2:1
    }
    this.custumService.starFile(obj).subscribe(
      data => this.starFileRes(data)
    );
  }
  starFileRes(data){
    console.log(data)
  }
  viewActivities(element){
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.id,
    }
    this.custumService.viewActivity(obj).subscribe(
      data => this.viewActivityRes(data)
    );
  }
  viewActivityRes(data){
    console.log(data)
  }
  getFileDetails (e) {
    for (var i = 0; i < e.target.files.length; i++) { 
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles)
    const bottomSheetRef =this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
  }

  uploadFiles () {
    const frmData = new FormData();
    for (var i = 0; i < this.myFiles.length; i++) { 
      frmData.append("fileUpload", this.myFiles[i]);
    }
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

