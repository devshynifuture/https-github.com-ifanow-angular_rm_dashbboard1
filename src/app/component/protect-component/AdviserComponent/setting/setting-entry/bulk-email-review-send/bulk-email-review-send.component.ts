import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { element } from 'protractor';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit {
  clientList: any = [];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'name', 'email'];
  isLoading = false
  dataCount: number = 0;
  advisorId: any;
  mailForm: any;
  verifiedAccountsList: any = [];
  step1Flag: boolean;
  step2Flag: boolean;
  subject = new FormControl('Your new money management account is created!');
  selectedFromEmail = new FormControl('');

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SEND',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };

  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
    private orgSetting: OrgSettingServiceService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }



  logoText = 'Your Logo here';
  emailBody = `
  <p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear $client_name,</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">It gives us great pleasure to invite you to our whole new money management tool.</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We have created a dedicated account for you. Please complete the account sign-up process by clicking below.</span></p>
<p style='font-family: "Noto Sans", Helvetica, Arial, sans-serif; font-size: 15px; line-height: 23px; margin-top: 16px; margin-bottom: 24px; color: rgb(33, 33, 33); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'>Your USERNAME is: $username</p>
<p style='font-family: "Noto Sans", Helvetica, Arial, sans-serif; font-size: 15px; line-height: 23px; margin-top: 16px; margin-bottom: 24px; color: rgb(33, 33, 33); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'>PASSWORD is: $password</p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><a data-sk="tooltip_parent" data-stringify-link="http://beta.my-planner.in/" href="https://slack-redir.net/link?url=https%3A%2F%2Fwww.ifanow" rel="noopener noreferrer" style="box-sizing: inherit; color: rgba(var(--sk_highlight,18,100,163),1); text-decoration: none; font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248);" target="_blank">http://beta.my-planner.in/</a></span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">If the above does not work, please click on the following URL -&nbsp;</span><a data-sk="tooltip_parent" data-stringify-link="https://www.ifanow.com" href="https://slack-redir.net/link?url=https%3A%2F%2Fwww.ifanow" rel="noopener noreferrer" style="box-sizing: inherit; color: rgba(var(--sk_highlight,18,100,163),1); text-decoration: none; font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248);" target="_blank">https://www.ifanow</a><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&hellip;..</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We look forward to working with you. See you there!</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Regards</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">$advisor_name</span></p>
<p><span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(248, 248, 248); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Footer: For more information, contact $organization_name at $organization_mobile or write an email to $organization_email</span></p>
 `

  ngOnInit() {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId()
    this.step1Flag = true;
    if (data && data.length > 0) {
      data.forEach(element => {
        element.selected = false
      });
      this.dataSource.data = data
    }
    this.getEmailVerification();
    this.mailForm = this.fb.group({
      mail_body: [''],
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(element => {
      if (element['selected']) {
        this.dataCount++;
      }
    });
  }

  selectAll(event) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(element => {
        element['selected'] = event.checked;
        if (element['selected']) {
          this.dataCount++;
        }
      });
    }
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item['selected']) {
        this.dataCount++;
      }
    });
  }

  getEmailVerification() {
    let obj = {
      userId: this.advisorId,
      // advisorId: this.advisorId
    }
    this.isLoading = true;
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
        this.isLoading = false;
      },
    );
  }

  getEmailVerificationRes(data) {
    console.log(data)
    if (data.listItems && data.listItems.length > 0) {
      data.listItems.map(element => {
        if (element.emailVerificationStatus == 1) {
          this.verifiedAccountsList.push(element)
        }
      })
      if (this.verifiedAccountsList.length > 1) {
        this.selectedFromEmail.setValue(this.verifiedAccountsList[0].emailAddress);
        this.selectedFromEmail.setValidators([Validators.required]);
      }
    }
  }

  selectedClientListStep() {
    if (this.dataCount > 0 && this.dataSource.filteredData.length > 0) {
      this.dataSource.filteredData.forEach(element => {
        if (element['selected']) {
          this.clientList.push(element['clientId'])
        }
      })
      this.step1Flag = false;
      this.step2Flag = true;
    } else {
      this.dataCount == 0 ? this.eventService.openSnackBar("Please select clients", "Dismiss") : this.eventService.openSnackBar("No clients found", "Dismiss");
    }
  }

  sendEmailToclients() {
    if (this.selectedFromEmail.invalid) {
      return;
    }
    this.barButtonOptions.active = true;
    const obj =
    {
      advisorId: this.advisorId,
      clientIds: this.clientList,
      fromEmail: this.verifiedAccountsList.length == 0 ? 'no-reply@my-planner.in' : (this.verifiedAccountsList.length == 1) ? this.verifiedAccountsList[0].emailAddress : this.selectedFromEmail.value,
      subject: this.subject.value,
      messageBody: this.emailBody
    }
    this.orgSetting.sendEmailToClients(obj).subscribe(
      data => {
        this.eventService.openSnackBar(data, "Dismiss")
        this.close(true);
        this.barButtonOptions.active = false;
      },
      err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, "Dismiss")
      }
    )
  }

  bulkEmail(value) {
    const dialogData = {
      data: value,
      header: 'EMAIL VERIFICATION REQUIRED',
      body: 'If you wish to send an email with your email address, Please verify it before proceeding. Please make a note the process of verification takes 24 to 48 hours. Would you like to proceed?',
      body2: '',
      btnYes: 'CANCEL',
      btnNo: 'PROCEED',
      positiveMethod: () => {
        dialogRef.close();
        this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true, tab2view: true });
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


  back() {
    this.step1Flag = true;
    this.step2Flag = false;
  }

  close(flag) {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: flag });
  }
}




