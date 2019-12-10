import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ModifyFeeDialogComponent} from '../modify-fee-dialog/modify-fee-dialog.component';
import {MatDialog} from '@angular/material';
import {UtilService} from "../../../../../../../services/util.service";
import {EventService} from "../../../../../../../Data-service/event.service";
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {


  constructor(public dialog: MatDialog, private eventService: EventService) {
  }

  @Input() singleDocument;
  @Output() valueChange = new EventEmitter();

  ngOnInit() {
  }

  editDocument() {

    const fragmentData = {
      flag: 'app-subscription-upper-slider',
      data: {documentData: this.singleDocument, flag: 'documents'},
      id: 1,
      state: 'open'
    };
    console.log('editDocument: ', fragmentData);
    // this.eventService.changeUpperSliderState(fragmentData);
    // this.overviewDesign = 'false';
    /*  const dialogRef = this.dialog.open(ModifyFeeDialogComponent, {
        width: '1400px',
        data: '',
        autoFocus: false,
        panelClass: 'dialogBox',
      });

      dialogRef.afterClosed().subscribe(result => {

      });*/
      const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
        upperSliderData => {
          if (UtilService.isDialogClose(upperSliderData)) {
            // this.getDocumentsSetting();
            this.valueChange.emit('close');
            subscription.unsubscribe();
          }
        }
      );

  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
