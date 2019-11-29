import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-document-new-folder',
  templateUrl: './document-new-folder.component.html',
  styleUrls: ['./document-new-folder.component.scss']
})
export class DocumentNewFolderComponent implements OnInit {
  nameFolder: any;

  constructor(
    public dialogRef: MatDialogRef<DocumentNewFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

  createNewFolder(value){
    console.log('folderName',value)
   console.log(this.nameFolder)
  }
}

export interface DialogData {
  animal: string;
  name: string;
}