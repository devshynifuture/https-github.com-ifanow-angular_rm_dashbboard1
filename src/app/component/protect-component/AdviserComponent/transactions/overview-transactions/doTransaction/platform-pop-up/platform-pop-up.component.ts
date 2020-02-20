import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-platform-pop-up',
  templateUrl: './platform-pop-up.component.html',
  styleUrls: ['./platform-pop-up.component.scss']
})
export class PlatformPopUpComponent implements OnInit {

  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no',];
  dataSource = ELEMENT_DATA;
  platformList: any;
  popUP: any;
  platform: any;
  constructor(public dialogRef: MatDialogRef<PlatformPopUpComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
    console.log('platformList == ', this.data)
    this.platformList = this.data.platform;
    ELEMENT_DATA.forEach(item => item.selected = false);
  }
  selectedPlatform(platform) {
    this.platform = platform
  }
  onNoClick(): void {
    this.dialogRef.close(this.platform);
  }

}
export interface PeriodicElement {
  no: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: 'test'

  },
];