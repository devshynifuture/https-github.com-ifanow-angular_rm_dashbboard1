import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelthInsurancePolicyComponent } from './helth-insurance-policy/helth-insurance-policy.component';

@Component({
  selector: 'app-add-insurance-planning',
  templateUrl: './add-insurance-planning.component.html',
  styleUrls: ['./add-insurance-planning.component.scss']
})

export class AddInsurancePlanningComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'critical', 'cancer'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'sum', 'mname', 'advice'];
  dataSource2 = ELEMENT_DATA2;
  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
  }

}


export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];
export interface PeriodicElement1 {

  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];

export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  sum: string;
  mname: string;
  advice: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'Apollo Munich Optima Restore', name: 'Individual', weight: '27,290',
    symbol: '38 Days', sum: '5,00,000', mname: 'Rahul Jain', advice: 'Port to another policy'
  },

];
