import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UtilService} from "../../../../../../../services/util.service";
import {EventService} from "../../../../../../../Data-service/event.service";
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {SubscriptionUpperSliderComponent} from '../upper-slider/subscription-upper-slider.component';
import {SubscriptionService} from '../../../subscription.service';


@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {


  constructor(public dialog: MatDialog, private eventService: EventService,private subService:SubscriptionService) {
  }

  @Input() singleDocument;
  @Output() valueChange = new EventEmitter();

  ngOnInit() {
  }

  // editDocument() {

  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     data: {documentData: this.singleDocument, flag: 'documents'},
  //     id: 1,
  //     state: 'open'
  //   };
  //   console.log('editDocument: ', fragmentData);
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
  //     const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //       upperSliderData => {
  //         if (UtilService.isDialogClose(upperSliderData)) {
  //           // this.getDocumentsSetting();
  //           this.valueChange.emit('close');
  //           subscription.unsubscribe();
  //         }
  //       }
  //     );

  // }

  editDocument() {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openUpper',
      id: 1,
      data: { documentData: this.singleDocument, flag: 'documents' },
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          this.valueChange.emit('close');

          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  // deleteModal(value,element) {
  //   const dialogData = {
  //     data: value,
  //     header: 'DELETE',
  //     body: 'Are you sure you want to delete?',
  //     body2: 'This cannot be undone',
  //     btnYes: 'CANCEL',
  //     btnNo: 'DELETE',
  //     positiveMethod: () => {
  //     },
  //     negativeMethod: () => {
  //       console.log('2222222222222222222222222222222222222');
  //     }
  //   };
  //   console.log(dialogData + '11111111111111');

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '400px',
  //     data: dialogData,
  //     autoFocus: false,

  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteSettingsDocument(data).subscribe(
          data => {
            this.eventService.openSnackBar('document is deleted', 'dismiss');
            this.valueChange.emit('close');
            dialogRef.close();
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
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
