import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bank-select-pop-up',
  templateUrl: './bank-select-pop-up.component.html',
  styleUrls: ['./bank-select-pop-up.component.scss']
})
export class BankSelectPopUpComponent implements OnInit {
  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  dataSource = ELEMENT_DATA;
  bankList: any;
  popUP: any;
  bank: any;
  constructor(public dialogRef: MatDialogRef<BankSelectPopUpComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
    console.log('investorList == ', this.data)
    this.bankList = this.data.bank;
    ELEMENT_DATA.forEach(item => item.selected = false);
  }
  selectedBank(bank) {
    this.bank = bank
  }
  onNoClick(): void {
    this.dialogRef.close(this.bank);
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