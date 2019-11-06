import { Component, OnInit, Input } from '@angular/core';
import { ModifyFeeDialogComponent } from '../modify-fee-dialog/modify-fee-dialog.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {


  constructor(public dialog: MatDialog,) { }
  @Input() singleDocument;
  ngOnInit() {
  }
  changeDisplay() {
    // this.overviewDesign = 'false';
    const dialogRef = this.dialog.open(ModifyFeeDialogComponent, {
      width: '1400px',
      data: '',
      autoFocus: false,
      panelClass: 'dialogBox',
    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
