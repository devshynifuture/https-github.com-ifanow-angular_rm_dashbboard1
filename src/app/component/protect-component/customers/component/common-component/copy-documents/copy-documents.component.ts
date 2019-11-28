import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../document-new-folder/document-new-folder.component';

@Component({
  selector: 'app-copy-documents',
  templateUrl: './copy-documents.component.html',
  styleUrls: ['./copy-documents.component.scss']
})
export class CopyDocumentsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CopyDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
