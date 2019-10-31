import {Component, OnInit, Input} from '@angular/core';
import {MatDialogRef, MatDialog} from '@angular/material';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewDesign: any;
  singlePlanData = {
    name: 'Starter Plan',
    code: 'PLA123',
    description: 'This plan is ideal for young people who are just starting off their financial journey and want to start saving with a smaller investment amount.'
  };

  constructor(public dialog: MatDialog, private eventService: EventService, private subinject: SubscriptionInject) {
  }


  @Input() componentFlag: string;
  @Input() upperData;

  ngOnInit() {
    this.overviewDesign = 'true';
    // this.openForm('','addPlanDetails','open');
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  changeDisplay() {
    this.overviewDesign = 'false';
  }

  openForm(data, value, state) {
    this.eventService.sliderData(value);
    this.subinject.rightSliderData(state);
    this.subinject.rightSideData(data);
  }

  deleteModal(singlePlan, value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the plan?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      planData: singlePlan
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
