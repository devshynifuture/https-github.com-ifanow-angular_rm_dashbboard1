import {Component, OnInit, Input} from '@angular/core';
import {ModifyFeeDialogComponent} from '../modify-fee-dialog/modify-fee-dialog.component';
import {MatDialog} from '@angular/material';
import {UtilService} from "../../../../../../../services/util.service";
import {EventService} from "../../../../../../../Data-service/event.service";


@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {


  constructor(public dialog: MatDialog, private eventService: EventService) {
  }

  @Input() singleDocument;

  ngOnInit() {
  }

  editDocument() {
    const fragmentData = {
      Flag: 'documents',
      data: {documentData: this.singleDocument},
      id: 1,
      state: 'open'
    };
    console.log('editDocument: ', fragmentData);
    this.eventService.changeUpperSliderState(fragmentData);
    // this.overviewDesign = 'false';
    /*  const dialogRef = this.dialog.open(ModifyFeeDialogComponent, {
        width: '1400px',
        data: '',
        autoFocus: false,
        panelClass: 'dialogBox',
      });

      dialogRef.afterClosed().subscribe(result => {

      });*/

  }
}
