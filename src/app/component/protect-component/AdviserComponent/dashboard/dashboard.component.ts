import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';

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
}