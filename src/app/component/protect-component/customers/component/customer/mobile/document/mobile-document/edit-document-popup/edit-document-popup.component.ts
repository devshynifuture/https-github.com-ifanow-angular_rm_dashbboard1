import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatDialog, MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CopyDocumentsComponent } from '../../../../../common-component/copy-documents/copy-documents.component';
import { BottomSheetComponent } from '../../../../../common-component/bottom-sheet/bottom-sheet.component';
import { DocumentNewFolderComponent } from '../../../../../common-component/document-new-folder/document-new-folder.component';

@Component({
  selector: 'app-edit-document-popup',
  templateUrl: './edit-document-popup.component.html',
  styleUrls: ['./edit-document-popup.component.scss']
})
export class EditDocumentPopupComponent implements OnInit {
  clientId: any;
  advisorId: any;
  selectedFolder: any;
  getInnerDoc: any;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private custumService: CustomerService,
    private eventService: EventService,
    public subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    // ) { }
    private _bottomSheetRef: MatBottomSheetRef<EditDocumentPopupComponent>) { }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    console.log(this.data, this._bottomSheetRef)
  }

  deleteModal(flag, data) {
    this._bottomSheetRef.dismiss();
    const dialogData = {
      data: flag,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (flag == 'FOLDER') {
          const obj = {
            clientId: this.clientId,
            advisorId: this.advisorId,
            id: data.id
          };
          this.custumService.deleteFolder(obj).subscribe(
            data => {
              this.eventService.openSnackBar('Deleted sucessfully', 'Dismiss');
              this.subInjectService.addSingleProfile(true);
              dialogRef.close();
              this._bottomSheetRef.dismiss();
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
              this.eventService.openSnackBar('Deleted sucessfully', 'Dismiss');
              this.subInjectService.addSingleProfile(true);
              this._bottomSheetRef.dismiss();
              dialogRef.close();

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

  openDialogCopy(element, value): void {
    // this._bottomSheetRef.dismiss();
    this._bottomSheet.open(CopyDocumentsComponent, {
      data: { name: value, animal: element }
    });
  }

  openDialog(element, value): void {
    this._bottomSheetRef.dismiss();
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
        if (this.getInnerDoc.data.rename.flag == 'fileName') {
          this.renameFile(this.getInnerDoc);
        } else {
          this.renameFolders(this.getInnerDoc);
        }
      }
    });

  }

  renameFile(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.data.rename.value.id,
      fileName: element.data.newFolder
    };
    this.custumService.renameFiles(obj).subscribe(
      data => this.renameFilesRes(data)
    );
  }

  renameFilesRes(data) {
    console.log(data);
    console.log(data);
    if (data) {
      this.eventService.openSnackBar("File rename sucessfully", "Dismiss");
      this.subInjectService.addSingleProfile(true);
    }
  }

  renameFolders(element) {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      id: element.data.rename.value.id,
      folderName: element.data.newFolder
    };
    this.custumService.renameFolder(obj).subscribe(
      data => this.renameFolderRes(data)
    );
  }

  renameFolderRes(data) {
    console.log(data);
    if (data) {
      this.eventService.openSnackBar("Folder rename sucessfully", "Dismiss");
      this.subInjectService.addSingleProfile(true);
    }
  }

  starFiles(element) {
    this._bottomSheetRef.dismiss();
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
    if (data) {
      this.subInjectService.addSingleProfile(true);
    }
  }


}
