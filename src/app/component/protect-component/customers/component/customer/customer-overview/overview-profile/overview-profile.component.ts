import { Component, OnInit } from '@angular/core';
import { AddFamilyMemberComponent } from './add-family-member/add-family-member.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { HistoryViewComponent } from './history-view/history-view.component';
import { AddClientComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/add-client.component';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-overview-profile',
  templateUrl: './overview-profile.component.html',
  styleUrls: ['./overview-profile.component.scss']
})
export class OverviewProfileComponent implements OnInit {
  familyMemberList: any;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.getFamilyMembersList();
  }
  getFamilyMembersList() {
    let obj =
    {
      clientId: 2,
      id: 0
    }
    this.cusService.getFamilyMembers(obj).subscribe(
      data => {
        this.familyMemberList = data;
        console.log(data)
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteFamilyMember(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.getFamilyMembersList();
          },
          error => this.eventService.showErrorMessage(error)
        )
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
  open(value, data) {
    let component;
    if (value == 'add') {
      component = AddFamilyMemberComponent;
      (data == null) ? data = { flag: 'Add Family Member', fieldFlag: 'familyMember' } : '';
    }
    else {
      (data == null) ? data = { flag: 'Add Family Member', fieldFlag: 'familyMember' } : '';
      component = AddClientComponent;
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


  openHistory(value, data) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open35',
      componentName: HistoryViewComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }




}
