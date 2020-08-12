import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../../../customers/component/common-component/document-new-folder/document-new-folder.component';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'archit.gupta@gmail.com', name: 'ARN-83865', weight: 'Verification successful' },

];
@Component({
  selector: 'app-dashboard-guide-dialog',
  templateUrl: './dashboard-guide-dialog.component.html',
  styleUrls: ['./dashboard-guide-dialog.component.scss']
})
export class DashboardGuideDialogComponent implements OnInit {

  page = 1;
  step: number;

  serviceList = [
    { name: 'Portfolio review', selected: false },
    { name: 'Financial planning', selected: false },
    { name: 'Emergency planning', selected: false },
    { name: 'Insurance planning', selected: false },
    { name: 'Investment management', selected: false },
    { name: 'Investment consulting', selected: false },
    { name: 'Reitrement planning', selected: false },
    { name: 'Asset allocation', selected: false },
    { name: 'Tax planning', selected: false },
    { name: 'Cash flow planning', selected: false },
    { name: 'Real estate advisory', selected: false },
    { name: 'Will writing', selected: false },
    { name: 'Estate planning', selected: false },
    { name: 'Raising capital or Dept', selected: false },
    { name: 'Personal leading', selected: false },

  ]

  constructor(
    public dialogRef: MatDialogRef<DashboardGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.step = 1;
  }
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;

  showPageByIndex(index) {
    this.page = index;
  }

}

