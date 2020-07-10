import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-move-copy-mobile-view',
  templateUrl: './move-copy-mobile-view.component.html',
  styleUrls: ['./move-copy-mobile-view.component.scss']
})
export class MoveCopyMobileViewComponent implements OnInit {
  clientId: any;
  parentId: any;
  advisorId: any;
  sendObj: { clientId: any; advisorId: any; parentFolderId: any; id: any; };
  sendToCopy: any;
  openFolderName: any[];
  valueTab: any;
  backUpfiles: any[];
  allFiles: any;
  AllDocs: any;
  dataToCommon: any;
  commonFileFolders: any = [];
  valueFirst: any;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<MoveCopyMobileViewComponent>,
    private cusService: CustomerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    const tabValue = 'Documents';
    // this.viewMode = 'tab1';
    // this.backUpfiles = [];
    this.openFolderName = [];
    this.getAllFileList(tabValue);
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
    // this.isLoading = true;
    this.cusService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, 'value')
    );
  }

  getAllFilesRes(data, value) {
    if (data) {
      // this.isLoading = false;
      this.allFiles = data.files;
      this.AllDocs = data.folders;
      this.dataToCommon = data.folders;
      if (this.dataToCommon.openFolderId == undefined || this.openFolderName.length == 0) {
        // Object.assign(this.dataToCommon, { openFolderNm: value.folderName });
        // Object.assign(this.dataToCommon, { openFolderId: value.id });
        this.parentId = (value.id == undefined) ? 0 : value.id;
        this.openFolderName.push(this.dataToCommon);
        this.valueFirst = this.openFolderName[0];
        if (this.dataToCommon.length > 0) {
          this.commonFileFolders = this.dataToCommon;
          this.backUpfiles.push(this.dataToCommon);
        }
        console.log('this.backUpfiles', this.backUpfiles);
        this.commonFileFolders = this.dataToCommon;
      }
      // if (this.openFolderName.length > 2) {
      //   this.showDots = true;
      // }
    }
  }

  getFolders(data, index) {
    this.parentId = (data == undefined) ? 0 : data[0].folderParentId;
    this.openFolderName = this.openFolderName.filter((element, i) => i <= index);
    this.commonFileFolders = this.openFolderName[this.openFolderName.length - 1];
    this.valueFirst = this.openFolderName[0];
  }

  openFolder(value) {
    // this.isLoading = true
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      docGetFlag: this.valueTab,
      folderParentId: (value.id == undefined) ? 0 : value.id,
    };
    this.parentId = value.folderParentId;
    console.log('this.parentId', this.parentId)
    console.log('backUpfiles', this.backUpfiles);
    this.cusService.getAllFiles(obj).subscribe(
      data => this.getAllFilesRes(data, value)
    );
  }

  copyFile(value) {
    const idTOsend = this.sendToCopy
    let obj;
    if (idTOsend.fileName) {
      obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        parentFolderId: this.parentId,
        id: idTOsend.id
      };
      if (value == 'Move') {
        this.cusService.moveFiles(obj).subscribe(
          data => {
            this._bottomSheetRef.dismiss();
          }
        );
      }
      else {
        this.cusService.copyFiles(obj).subscribe(
          data => {
            this._bottomSheetRef.dismiss();
          }
        );
      }
    } else {
      obj = {
        clientId: this.clientId,
        advisorId: this.advisorId,
        folderParentId: this.parentId,
        id: idTOsend.id
      };
      if (value == 'Move') {
        this.cusService.moveFolder(obj).subscribe(
          data => {
            this._bottomSheetRef.dismiss();
          }
        );
      }
      else {
        this.cusService.copyFolders(obj).subscribe(
          data => {
            this._bottomSheetRef.dismiss();
          }
        );
      }
    }
  }

  close() {
    this.commonFileFolders = undefined;
    this.openFolderName = undefined;
    this._bottomSheetRef.dismiss()
  }

}
