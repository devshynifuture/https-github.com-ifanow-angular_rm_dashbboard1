import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../../../subscription.service';
import { AddPlanDetailComponent } from '../add-structure/add-plan-detail.component';
import { AddEditDocumentComponent } from '../add-edit-document/add-edit-document.component';
import { Router } from '@angular/router';
import {
  detailsOfClientTemplate,
  letterOfEngagement,
  quotationTemplate,
  redressalofGrievance,
  scopeofService
} from '../../../documentTemplate';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewDesign: any = 'true';
  advisorId: any;
  @Output() changePlanData = new EventEmitter();
  organizationData: any;

  constructor(public dialog: MatDialog, private subService: SubscriptionService, private router: Router,
    private eventService: EventService,
    private subinject: SubscriptionInject, public subInjectService: SubscriptionInject) {
  }

  quotationTemplate = quotationTemplate;
  detailsOfClientTemplate = detailsOfClientTemplate;
  redressalofGrievance = redressalofGrievance;
  letterOfEngagement = letterOfEngagement;
  scopeofService = scopeofService;
  _upperData;
  @Input() componentFlag: string;

  @Input()
  set upperData(upperData) {
    console.log(' upperData : ', upperData);
    this._upperData = upperData;
    if (upperData && upperData.documentData) {
      this.changeDisplay();
    }
  }

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

  openForm(data, value, template) {
    let component;
    const obj = {
      value: data,
      template
    };
    (value == 'addPlan') ? component = AddPlanDetailComponent : component = AddEditDocumentComponent;
    const fragmentData = {
      flag: value,
      data: obj,
      id: 1,
      state: 'open',
      componentName: component
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data) {
            this.upperData = sideBarData.data;
            this._upperData = sideBarData.data;
            this.changePlanData.emit(this.upperData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteModal(singlePlan, value) {
    this.singlePlanData = singlePlan;
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
        //   id: this.singlePlanData.id
        // };
        this.subService.deleteSubscriptionPlan(this.singlePlanData.id).subscribe(
          data => {
            this.deletedData(data);
            dialogRef.close();
          }
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

    });
  }

  deletedData(data) {
    if (data == true) {
      // this.upperData = "plan";
      this.router.navigate(['/admin/subscription/settings', 'plans']);
      this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
    }
  }
}
