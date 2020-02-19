import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../../../../Activities/calendar/calendar.component';
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
    dataSource = ELEMENT_DATA;
  constructor( public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
    
    isLoading = false
    dataS =[]
  ngOnInit() {
    const ELEMENT_DATA = this.dataS;
      // this.invoiceClientData = data;
      ELEMENT_DATA.forEach(item => item.selected = false);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // changeSelect() {
  //   this.dataCount = 0;
  //   this.dataSource.forEach(item => {
  //     if (item.selected) {
  //       this.dataCount++;
  //     }
  //   });
  // }
  // selectAll(event) {
  //   this.dataCount = 0;
  //   if (this.dataSource != undefined) {
  //     this.dataSource.forEach(item => {
  //       item.selected = event.checked;
  //       if (item.selected) {
  //         this.dataCount++;
  //       }
  //     });
  //   }
  // }

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