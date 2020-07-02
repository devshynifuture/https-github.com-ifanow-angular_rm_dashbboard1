import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../../../customers/component/common-component/document-new-folder/document-new-folder.component';

@Component({
  selector: 'app-dashboard-guide-dialog',
  templateUrl: './dashboard-guide-dialog.component.html',
  styleUrls: ['./dashboard-guide-dialog.component.scss']
})
export class DashboardGuideDialogComponent implements OnInit {

  page = 1;

  constructor(
    public dialogRef: MatDialogRef<DashboardGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

  showPageByIndex(index) {
    this.page = index;
  }

}

