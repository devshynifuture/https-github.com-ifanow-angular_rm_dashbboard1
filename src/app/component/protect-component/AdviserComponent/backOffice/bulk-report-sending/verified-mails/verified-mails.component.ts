import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../setting/org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { OpenEmailVerificationComponent } from '../../../setting/setting-preference/open-email-verification/open-email-verification.component';
import { MatDialog } from '@angular/material';
import { VerifyAddEmailComponent } from '../verify-add-email/verify-add-email.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SendNowReportsComponent } from '../send-now-reports/send-now-reports.component';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-verified-mails',
  templateUrl: './verified-mails.component.html',
  styleUrls: ['./verified-mails.component.scss']
})
export class VerifiedMailsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'position', 'name', 'weight'];
  counter: any;
  isLoading: boolean;
  advisorId: any;
  emailList: any[] = [{}, {}, {}];
  emailDetails: any;
  element: any;
  constructor(private orgSetting: OrgSettingServiceService,
    private subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    private eventService: EventService) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getEmailVerification()
  }
  getEmailVerification() {
    this.loader(1);
    this.emailList = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
    }
    this.isLoading = true;
    this.orgSetting.getEmailVerificationReports(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
        this.isLoading = false;
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        //this.hasError = true;
        this.isLoading = false;
        this.loader(-1);
      }
    );
  }
  getEmailVerificationRes(data) {
    if (data) {
      this.emailDetails = data
      this.emailList = data.listItems
      console.log('tlist', this.emailList)
    } else {
      this.emailList = []
    }
    this.loader(-1);
  }
  loader(increament) {
    this.counter += increament;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  verifyEmail(value) {
    const dialogRef = this.dialog.open(OpenEmailVerificationComponent, {
      width: '400px',
      data: { bank: value, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.element = result;
      let obj = {
        id: this.element.id,
        emailAddress: this.element.emailAddress,
        userId: this.advisorId
      }
      this.orgSetting.addEmailVerfify(obj).subscribe(
        data => this.addEmailVerfifyRes(data),
        err => this.eventService.openSnackBar(err, "Dismiss")
      );
      //  this.bankDetailsSend.emit(result);
    });
  }
  addEmailVerfifyRes(data) {
    this.eventService.openSnackBar("An email has been sent to your registered email address", "Dismiss");
    this.getEmailVerification()
  }
  selectedEmail(email) {
    let obj = {
      emailAddress: email.emailAddress,
      advisorId: this.advisorId
    }
    this.orgSetting.editPreEmailTemplate(obj).subscribe(
      data => {
        this.editPreEmailTemplateRes(data, email);
        this.isLoading = false;
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        //this.hasError = true;
        this.isLoading = false;
        this.loader(-1);
      }
    );

  }
  editPreEmailTemplateRes(data, email) {
    console.log('editPreEmailTemplateRes', data)

    if (data == 'not verified') {
      if (email.emailVerificationStatus != 1) {
        this.openAlrt(email)
      } else {
        this.openAlrt(email)
      }
    } else {
      this.openAlrt(email)
    }
  }
  openAlrt(status) {
    const dialogRef = this.dialog.open(VerifyAddEmailComponent, {
      width: '400px',
      data: { verification: status, animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.element = result;
      let obj = {
        id: this.element.id,
        emailAddress: this.element.emailAddress,
        userId: this.advisorId
      }
      //  this.bankDetailsSend.emit(result);
    });
  }
  deleteEmailModal(value, data) {
    if (data.defaultFlag == 1) {
      this.eventService.openSnackBar("Email dependency found!", "Dismiss");
      return;
    }
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.orgSetting.deleteEmailVerify(data.id).subscribe(
          data => {
            dialogRef.close();
            this.getEmailVerification();
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
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
  }
  openSendNow(data) {
    const fragmentData = {
      flag: 'openSendNow',
      data,
      id: 1,
      state: 'open65',
      componentName: SendNowReportsComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          // this.getlistOrder()
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );

  }

}
