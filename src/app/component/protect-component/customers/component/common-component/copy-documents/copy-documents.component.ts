import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  displayedColumns: string[] = ['name', 'lastModi', 'type', 'size'];
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
  commonFileFolders: any;
  openFolderName: any;
  backUpfiles: any;
  i = 0;
  resetData: any;
  tabValue: any;
  valueTab: any;
  valueFirst: any;
  animal: string;
  name: string;
  viewMode: string;
  parentId: any;
  showLoader: boolean;
  showDots: boolean;
  sendToCopy: any;
  CopyOrMove: string;
  constructor(
    public dialogRef: MatDialogRef<CopyDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private custumService: CustomerService, public utils: UtilService, ) {
    console.log('data', this.data);
    this.sendToCopy = this.data.animal
    this.CopyOrMove = this.data.name
  }

  ngOnInit() {
    const tabValue = 'Documents';
    this.viewMode = 'tab1';
    this.commonFileFolders = [];
    this.backUpfiles = [];
    this.openFolderName = [];
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAllFileList(tabValue);
    this.showLoader = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  fileSizeConversion() {
    this.commonFileFolders.forEach(element => {
      const data = parseInt(element.size);
      if (data >= 1024) {
        element.size = data / 1024;
        element.size = (this.utils.formatter(element.size) + '' + 'Kb');
      } else if (data >= 1000000) {
        element.size = data / 1000000;
        element.size = (this.utils.formatter(element.size) + '' + 'Mb');
      }
    });
  }


  getAllFileList(tabValue) {
    tabValue = (tabValue == 'Documents' || tabValue == 1) ? 1 : (tabValue == 'Recents' || tabValue == 2) ? 2 : (tabValue == 'Starred' || tabValue == 3) ? 3 : 4;
    this.valueTab = tabValue;
    this.backUpfiles = [];
    this.commonFileFolders = [];
    this.openFolderName = [];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: tabValue,
      folderParentId: 0,
    };
    this.showLoader = true;
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value')
    );
  }

  getAllFilesRes(data, value) {
    console.log(data);
    this.allFiles = data.files;
    this.AllDocs = data.folders;
    this.commonFileFolders = data.folders;
    this.commonFileFolders.push.apply(this.commonFileFolders, this.allFiles);
    console.log('commonFileFolders', this.commonFileFolders);

    if (this.commonFileFolders.openFolderId == undefined || this.openFolderName.length == 0) {
      Object.assign(this.commonFileFolders, { openFolderNm: value.folderName });
      Object.assign(this.commonFileFolders, { openFolderId: value.id });
      this.parentId = (value.folderParentId == undefined) ? 0 : value.id
      console.log('parentId', this.parentId)
      this.openFolderName.push(this.commonFileFolders);
      this.valueFirst = this.openFolderName[0];
      if (this.commonFileFolders.length > 0) {
        this.backUpfiles.push(this.commonFileFolders);
      }
      console.log('this.backUpfiles', this.backUpfiles);
    }
    this.showLoader = false;
    if (this.openFolderName.length > 2) {
      this.showDots = true;
    }
    this.fileSizeConversion();
  }

  getFolders(data, index) {
    this.parentId = (data == undefined) ? 0 : data[0].folderParentId
    console.log('parentId', this.parentId)
    // this.openFolderName = _.reject(this.openFolderName, function (n) {
    //   return n.openFolderId > data.openFolderId + 1;
    // });
    this.openFolderName = this.openFolderName.filter((element, i) => i <= index);
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    // this.openFolderName = _.reject(this.openFolderName, function (n) {
    //   return n.openFolderId > data.openFolderId;
    // });
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
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: this.valueTab,
      folderParentId: (value.id == undefined) ? 0 : value.id,
    };
    this.parentId = value.folderParentId;
    console.log('this.parentId', this.parentId)
    console.log('backUpfiles', this.backUpfiles);
    this.custumService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, value)
    );
  }
  copyFile(element) {
    var value = this.sendToCopy
    if (element == 'Copy') {
      const obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        parentFolderId: this.parentId,
        id: value.id
      };
      this.custumService.copyFiles(obj).subscribe(
        data => this.copyFilesRes(data)
      );
    } else {
      if (value.folderName == undefined) {
        const obj = {
          clientId: this.clientId,
          advisorId: this.advisorId,
          parentFolderId: this.parentId,
          id: value.id
        };
        this.custumService.moveFiles(obj).subscribe(
          data => this.moveFilesRes(data)
        );
      } else {
        const obj = {
          clientId: this.clientId,
          advisorId: this.advisorId,
          folderParentId: this.parentId,
          id: value.id
        };
        this.custumService.moveFolder(obj).subscribe(
          data => this.moveFolderRes(data)
        );
      }
    }
  }
  moveFolderRes(data) {
    console.log(data)
    this.reset()
    this.dialogRef.close('Documents')
  }
  moveFilesRes(data) {
    console.log(data);
    this.reset()
    this.dialogRef.close('Documents')
  }
  copyFilesRes(data) {
    console.log(data);
    this.reset()
    this.dialogRef.close('Documents')
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