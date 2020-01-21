import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DialogData } from '../document-new-folder/document-new-folder.component';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer/customer.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-copy-documents',
  templateUrl: './copy-documents.component.html',
  styleUrls: ['./copy-documents.component.scss']
})

export class CopyDocumentsComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  displayedColumns: string[] = ['name', 'lastModi', 'type', 'size'];
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
  name: string;
  viewMode: string;
  parentId: any;
  showDots: boolean;
  sendToCopy: any;
  CopyOrMove: string;
  isLoading = false;
  showMsg = false;
  dataToCommon: any;
  constructor(
    public dialogRef: MatDialogRef<CopyDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dataGet: DialogData, private custumService: CustomerService, public utils: UtilService, public dialog: MatDialog) {
    console.log('data', this.dataGet);
    this.sendToCopy = this.dataGet.animal
    this.CopyOrMove = this.dataGet.name
  }
  ngOnInit() {
    const tabValue = 'Documents';
    this.viewMode = 'tab1';
    this.backUpfiles = [];
    this.openFolderName = [];
    this.advisorId = AuthService.getAdvisorId();
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.commonFileFolders.sort = this.sort;
    this.clientId = AuthService.getClientId();
    this.getAllFileList(tabValue);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getAllFileList(tabValue) {
    tabValue = (tabValue == 'Documents' || tabValue == 1) ? 1 : (tabValue == 'Recents' || tabValue == 2) ? 2 : (tabValue == 'Starred' || tabValue == 3) ? 3 : 4;
    this.valueTab = tabValue;
    this.backUpfiles = [];
    this.openFolderName = [];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: tabValue,
      folderParentId: 0,
    };
    this.isLoading = true;
    this.commonFileFolders.data = [{}, {}, {}];
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value')
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
    if (this.dataToCommon.openFolderId == undefined || this.openFolderName.length == 0) {
      Object.assign(this.dataToCommon, { openFolderNm: value.folderName });
      Object.assign(this.dataToCommon, { openFolderId: value.id });
      this.parentId = (value.id == undefined) ? 0 : value.id;
      this.openFolderName.push(this.dataToCommon);
      this.valueFirst = this.openFolderName[0];
      if (this.dataToCommon.length > 0) {
        this.commonFileFolders = this.dataToCommon;
        this.commonFileFolders = new MatTableDataSource(this.dataToCommon);
        this.commonFileFolders.sort = this.sort;
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
    console.log('sorted', this.commonFileFolders);
  }

  getFolders(data, index) {
    this.showMsg = false;
    this.commonFileFolders.data = [{}, {}, {}];
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.parentId = (data == undefined) ? 0 : data[0].folderParentId;
    this.openFolderName = this.openFolderName.filter((element, i) => i <= index);
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    this.commonFileFolders = new MatTableDataSource(data);
    this.commonFileFolders.sort = this.sort;
    this.valueFirst = this.openFolderName[0];
  }
  reset() {
    this.showMsg = false;
    if (this.openFolderName.length > 0) {
      this.commonFileFolders = this.backUpfiles[0];
    }
    this.commonFileFolders = this.backUpfiles[0];
    this.openFolderName = [];
    this.parentId = 0;
  }

  openFolder(value) {
    this.isLoading = true
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: this.valueTab,
      folderParentId: (value.id == undefined) ? 0 : value.id,
    };
    this.parentId = value.folderParentId;
    console.log('this.parentId', this.parentId)
    console.log('backUpfiles', this.backUpfiles);
    this.commonFileFolders.data = [{}, {}, {}];
    this.commonFileFolders = new MatTableDataSource(this.data);
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, value)
    );
  }
  copyFile(value) {
    var idTOsend = this.sendToCopy
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      parentFolderId: this.parentId,
      id: idTOsend.id
    };
    Object.assign(obj, { value: value });
    this.dialogRef.close(obj)

  }
}

export interface PeriodicElement {

  name: string;
  lastModi: string;
  type: string;
  size: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Identity & address proofs', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { name: 'Accounts', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { name: 'Planning', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { name: 'Transaction', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },
  { name: 'Agreements & invoices', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-' },

];