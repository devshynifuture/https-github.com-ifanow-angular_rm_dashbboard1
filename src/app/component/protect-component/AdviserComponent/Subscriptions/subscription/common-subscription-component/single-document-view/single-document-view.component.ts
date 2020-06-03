import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UtilService } from "../../../../../../../services/util.service";
import { EventService } from "../../../../../../../Data-service/event.service";
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SubscriptionUpperSliderComponent } from '../upper-slider/subscription-upper-slider.component';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {
  advisorId: any

  constructor(public dialog: MatDialog, private eventService: EventService, private subService: SubscriptionService, private router: Router, private location: Location) {
  }

  @Input() singleDocument;
  @Output() valueChange = new EventEmitter();

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

  }

  // editDocument() {

  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     data: {documentData: this.singleDocument, flag: 'documents'},
  //     id: 1,
  //     state: 'open'
  //   };
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
    this.location.replaceState('/subscription-upper');
    const fragmentData = {
      flag: 'documents',
      id: 1,
      data: { documentData: this.singleDocument, flag: 'documents' },
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'], { state: { ...fragmentData } })
    sessionStorage.setItem("subUpperData", JSON.stringify(fragmentData))
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
            this.valueChange.emit('close');
          }
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
  //     body2: 'This cannot be undone.',
  //     btnYes: 'CANCEL',
  //     btnNo: 'DELETE',
  //     positiveMethod: () => {
  //     },
  //     negativeMethod: () => {
  //     }
  //   };

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '400px',
  //     data: dialogData,
  //     autoFocus: false,

  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }
  deleteModal(value, deleteData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        // const obj = {
        //   advisorId: this.advisorId,
        //   id: deleteData
        // }
        this.subService.deleteSettingsDocument(deleteData).subscribe(
          data => {
            this.eventService.openSnackBar('document is deleted', 'Dismiss');
            this.valueChange.emit('close');
            dialogRef.close(deleteData);
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      this.valueChange.emit(result);
    });
  }
}
