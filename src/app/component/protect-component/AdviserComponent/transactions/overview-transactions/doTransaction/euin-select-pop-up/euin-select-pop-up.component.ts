import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-euin-select-pop-up',
  templateUrl: './euin-select-pop-up.component.html',
  styleUrls: ['./euin-select-pop-up.component.scss']
})
export class EuinSelectPopUpComponent implements OnInit {
  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  dataSource = ELEMENT_DATA;
  subBrokerList: any;
  popUP: any;
  euin: any;
  constructor(public dialogRef: MatDialogRef<EuinSelectPopUpComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
    console.log('investorList == ', this.data)
    this.subBrokerList = this.data.subBroker;
    ELEMENT_DATA.forEach(item => item.selected = false);
  }
  selectedEuin(euin) {
    this.euin = euin
  }
  onNoClick(): void {
    this.dialogRef.close(this.euin);
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