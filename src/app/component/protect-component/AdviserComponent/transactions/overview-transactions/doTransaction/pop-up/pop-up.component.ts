import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
    dataSource = ELEMENT_DATA;
  investorList: any;
  popUP: any;
  iin: any;
  constructor( public dialogRef: MatDialogRef<PopUpComponent>,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
    
    isLoading = false
    dataS =[]
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
     console.log('investorList == ',this.data)
     this.investorList = this.data.investor;
      ELEMENT_DATA.forEach(item => item.selected = false);
  }
  selectedIINUCC(iin){
    this.iin = iin
  }
  onNoClick(): void {
    this.dialogRef.close(this.iin);
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