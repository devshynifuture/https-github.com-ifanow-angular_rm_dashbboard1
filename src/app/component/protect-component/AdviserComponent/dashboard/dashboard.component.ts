import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  apr: string;
  may: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Gross sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Redemptions', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Net sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },

];
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Rahul Jain', name: 'Extend the account for an', weight: 'Nita Shinde' },
  { position: 'Mohan Kumar', name: 'Re-invest FD to goal', weight: 'Sajith Thilakan' },
  { position: 'Sagar Shah', name: 'Surrender insurance policy', weight: 'Khushboo Sidapara' },
  { position: 'Rahul Jain', name: 'File IT returns through CA', weight: 'Satish Patel' },

];
export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];
export interface PeriodicElement4 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];
export interface PeriodicElement5 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { position: 'Vishnu Khandelwal	', name: 'SIP Rejection', weight: '23/04/2019' },
  { position: 'Saniya Kishore Parmar rep by Kishore Babulal Parmar	', name: 'Redemption Rejection', weight: '23/04/2019' },



];
export interface PeriodicElement6 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA6: PeriodicElement6[] = [
  { position: 'Mandira Gangakhedkar	', name: 'Investment Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Abhishek Mane	', name: 'Financial Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Sagar Shroff	', name: 'Tax Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },




];
export interface PeriodicElement7 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  match: string;
  report: string;

}

const ELEMENT_DATA7: PeriodicElement7[] = [

  { position: 'CAMS	', name: 'INA000004409', weight: 'Today', symbol: 'Aniket Shah', match: '8', report: 'Report' },
  { position: 'Karvy	', name: 'INA000004409', weight: '1 day ago', symbol: 'System', match: '23', report: 'Report' },
  { position: 'FT	', name: 'INA000004409', weight: '10 days ago', symbol: 'Aniket Shah', match: '0', report: 'Report' },
  { position: 'CAMS	', name: 'INA000004409', weight: '2 days ago', symbol: 'System', match: '18', report: 'Report' },




];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openGuideDialog(): void {
    const dialogRef = this.dialog.open(DashboardGuideDialogComponent, {
      width: '250px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'apr', 'may'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name', 'weight'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource4 = ELEMENT_DATA4;
  displayedColumns5: string[] = ['position', 'name', 'weight'];
  dataSource5 = ELEMENT_DATA5;
  displayedColumns6: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource6 = ELEMENT_DATA6;
  displayedColumns7: string[] = ['position', 'name', 'weight', 'symbol', 'match', 'report'];
  dataSource7 = ELEMENT_DATA7;
}