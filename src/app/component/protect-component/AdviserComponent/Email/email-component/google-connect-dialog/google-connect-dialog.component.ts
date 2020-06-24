import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../../customers/component/common-component/document-new-folder/document-new-folder.component';

@Component({
  selector: 'app-google-connect-dialog',
  templateUrl: './google-connect-dialog.component.html',
  styleUrls: ['./google-connect-dialog.component.scss']
})
export class GoogleConnectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GoogleConnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
