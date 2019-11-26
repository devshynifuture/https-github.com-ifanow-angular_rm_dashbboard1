import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  displayedColumns: string[] = ['emptySpace', 'name', 'lastModi', 'type', 'size', 'icons'];
  dataSource = ELEMENT_DATA;
  setTab: string;
  advisorId: any;
  clientId: any;
  allFiles: any;
  AllDocs: any;
  commonFileFolders: any;
  openFolderName: any;
  backUpfiles: any;
  i = 1;
  resetData: any;
  tabValue: any;
  valueTab: any;
  valueFirst: any;

  constructor(private _bottomSheet: MatBottomSheet, private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
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


  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }
  getAllFileList(tabValue) {
    tabValue=(tabValue == 'Documents')?1:(tabValue == 'Recents')?2:(tabValue == 'Starred')?3:4;
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
  }
  getFolders(data) {
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId+1;
    });
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1]
    this.openFolderName = _.reject(this.openFolderName, function (n) {
      return n.openFolderId > data.openFolderId;
    });
    this.valueFirst = this.openFolderName[0];
  }
  reset(){
    this.commonFileFolders = this.valueFirst;
    this.openFolderName = [];
    this.backUpfiles = [];
  }
  openFolder(value) {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag:  this.valueTab,
      folderParentId: (value.id == undefined) ? 0 : value.id,
    }
    if(this.commonFileFolders.openFolderId == undefined || this.commonFileFolders.openFolderId == null || this.openFolderName.length == 0){
      Object.assign(this.commonFileFolders, { 'openFolderNm': value.folderName });
      Object.assign(this.commonFileFolders, { 'openFolderId': this.i++ });
      this.openFolderName.push(this.commonFileFolders)
      if (this.commonFileFolders.length > 0) {
        this.backUpfiles.push(this.commonFileFolders);
      }
      console.log('this.backUpfiles', this.backUpfiles)
    }
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, value)
    );
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

