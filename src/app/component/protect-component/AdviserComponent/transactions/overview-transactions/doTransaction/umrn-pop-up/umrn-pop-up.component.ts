import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-umrn-pop-up',
  templateUrl: './umrn-pop-up.component.html',
  styleUrls: ['./umrn-pop-up.component.scss']
})
export class UmrnPopUpComponent implements OnInit {
  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  dataSource = ELEMENT_DATA;
  mandateList: any;
  popUP: any;
  mandate: any;
  constructor(public dialogRef: MatDialogRef<UmrnPopUpComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
    console.log('investorList == ', this.data)
    this.mandateList = this.data.mandate;
    ELEMENT_DATA.forEach(item => item.selected = false);
  }
  selectedUmrn(mandate) {
    this.mandate = mandate
  }
  onNoClick(): void {
    this.dialogRef.close(this.mandate);
  }

}
export interface PeriodicElement {
  no: string;
  ownerName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: 'test', ownerName: 'Ronak Hasmukh Hindocha',

  },
  {
    no: 'hello', ownerName: 'Rupa Ronak Hindocha',

  },
];