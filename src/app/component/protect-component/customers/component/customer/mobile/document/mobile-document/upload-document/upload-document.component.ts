import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA, MatDialog, MatBottomSheetRef } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { HttpHeaders } from '@angular/common/http';
import { EventService } from 'src/app/Data-service/event.service';
import { HttpService } from 'src/app/http-service/http-service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DocumentNewFolderComponent } from '../../../../../common-component/document-new-folder/document-new-folder.component';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  myFiles: any[];
  clientId: any;
  advisorId: any;
  parentId: any;
  filenm: any;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private custumService: CustomerService,
    private eventService: EventService,
    private http: HttpService,
    public subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<UploadDocumentComponent>) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
  }

  uploadFile(e) {
    this.parentId = this.data
    this.myFiles = [];
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    this.myFiles.forEach(fileName => {
      this.filenm = fileName;
      this.parentId = (this.parentId == undefined) ? 0 : this.parentId;
      this.uploadFileOnServer(this.parentId, this.filenm);
    });
    console.log(this.myFiles);
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
    console.log('dfh hfdgj  hhgj gfdgh hjhg  hh gfh', bottomSheetRef);
  }

  uploadFileOnServer(element, fileName) {
    // this.countFile++;
    // this.parentId = element
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
    // this.countFile++;
    const fileuploadurl = data;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('Content-Type', '')
    };
    this.http.put(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);
      if (responseData == null) {
        setTimeout(() => {
          this._bottomSheet.dismiss();
          this.subInjectService.addSingleProfile(true);
          this.eventService.openSnackBar('Uploaded successfully', 'Dismiss');
        }, 1000);
        setTimeout(() => {
          // this.getAllFileList(1, 'uplaodFile')
        }, 2000);
      }
    });

  }

  openDialog(element, value): void {
    this._bottomSheetRef.dismiss();
    const dialogRef = this.dialog.open(DocumentNewFolderComponent, {
      width: '30%',
      data: { parentId: value, animal: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.subInjectService.addSingleProfile(true);
      }
    });

  }

}
