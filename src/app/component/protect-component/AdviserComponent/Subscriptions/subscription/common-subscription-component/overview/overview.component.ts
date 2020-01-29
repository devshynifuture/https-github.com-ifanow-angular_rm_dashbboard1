import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../../../subscription.service';
import { AddPlanDetailComponent } from '../add-structure/add-plan-detail.component';
import { AddEditDocumentComponent } from '../add-edit-document/add-edit-document.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewDesign: any = 'true';
  advisorId: any;
  @Output() changePlanData = new EventEmitter();
  constructor(public dialog: MatDialog, private subService: SubscriptionService,
    private eventService: EventService,
    private subinject: SubscriptionInject, public subInjectService: SubscriptionInject) {
  }

  _upperData;
  @Input() componentFlag: string;

  @Input()
  set upperData(upperData) {
    this._upperData = upperData;
    console.log('OverviewComponent upperData: ', upperData);
    if (upperData && upperData.documentData) {
      this.changeDisplay();
    }
  };

  get upperData() {
    return this._upperData;
  }

  singlePlanData;

  ngOnInit() {
    // this.overviewDesign = 'true';
    this.advisorId = AuthService.getAdvisorId();
    // this.openForm('','addPlanDetails','open');
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  changeDisplay() {
    this.overviewDesign = 'false';
  }

  openForm(data, value) {
    let component;
    (value == "addPlan") ? component = AddPlanDetailComponent : component = AddEditDocumentComponent
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data) {
            this.upperData = sideBarData.data
            this._upperData = sideBarData.data
            this.changePlanData.emit(this.upperData)
          }
          // console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteModal(singlePlan, value) {
    this.singlePlanData = singlePlan
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          id: this.singlePlanData.id
        };
        this.subService.deleteSubscriptionPlan(obj).subscribe(
          data => {
            this.deletedData(data);
            dialogRef.close();
          }
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

  deletedData(data) {
    if (data == true) {
      this.eventService.changeUpperSliderState({ state: 'close' });
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');
    }
  }
}
