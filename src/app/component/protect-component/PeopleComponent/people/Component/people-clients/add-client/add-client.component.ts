import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from '../../../../people.service';
import { CancelFlagService } from '../../people-service/cancel-flag.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  headingData: any;
  tabData: any = {};
  isRefreshFlag: any;
  matTabGroupFlag: boolean;

  constructor(private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject, private cancelFlagService: CancelFlagService, public dialog: MatDialog) { }
  ngOnInit() {
  }
  @Input() set data(data) {
    this.headingData = data;
    console.log(data);
    this.tabData = data;
    if (this.tabData.clientType == 2 || this.tabData.familyMemberType == 2) {
      this.matTabGroupFlag = true;
    }
    else {
      this.matTabGroupFlag = false;
    }
  }
  selected = 0;
  close(data) {
    (this.isRefreshFlag) ? this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true }) : (data == 'close') ? this.subInjectService.changeNewRightSliderState({ state: 'close' }) : this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }
  getTabData(data) {
    console.log(data);
    (data == undefined) ? this.tabData = { id: undefined } : this.tabData = data;
  }
  changeTab(flag) {
    (flag == 1) ? this.selected++ : '';
  }
  refreshFlagData(flag) {
    this.isRefreshFlag = flag;
    this.cancelFlagService.setCancelFlag(flag);
  }
  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let obj =
        {
          "familyMemberId": this.tabData.familyMemberId,
          "userId": this.tabData.familyMemberId
        }
        this.cusService.deleteFamilyMember(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.isRefreshFlag = true;
            this.close('close')
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
