import { debounceTime, switchMap } from 'rxjs/operators';
import { PeopleService } from './../../../../PeopleComponent/people.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-bulk-email-review-send',
  templateUrl: './bulk-email-review-send.component.html',
  styleUrls: ['./bulk-email-review-send.component.scss']
})
export class BulkEmailReviewSendComponent implements OnInit, AfterViewInit {

  clientList: any = [];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild('clientTableSort', { static: false }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;

  displayedColumns: string[] = ['checkbox', 'name', 'email', 'status'];
  isLoading = false;
  dataCount = 0;
  advisorId: any;
  mailForm: any;
  verifiedAccountsList: any = [];
  step1Flag: boolean;
  step2Flag: boolean;
  subject = new FormControl('Your new money management account is created!');
  selectedFromEmail = new FormControl('');
  isAllSelected = false;
  selectedClientsCount = 0;

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
  hasEndReached: any = false;
  infiniteScrollingFlag: boolean = false;
  infiniteScrollClientList = [];
  storedObj: boolean;
  obj: {
    advisorId: any;
    // status: 1,
    limit: number; offset: any;
  };
  fromSearch: boolean = false;
  searchFC: FormControl;
  searchName: string;
  selectedClientArray = [];

  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
    private orgSetting: OrgSettingServiceService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private peopleService: PeopleService
  ) {
  }


  logoText = 'Your Logo here';
  emailBody = `
  <html>
  <head></head>
  <body>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear
              $client_name,</span></p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">It
              gives us great pleasure to invite you to our whole new money management tool.</span></p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We
              have created a dedicated account for you. Please complete the account sign-up process by clicking
              below.</span></p>
      <p style='font-family: "Noto Sans", Helvetica, Arial, sans-serif; font-size: 15px; line-height: 23px; margin-top: 16px;  color: rgb(33, 33, 33); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;'>
          Your USERNAME is: $username</p>
          <a href="https://$Website?$hidden_username"
      style="background-color:#008FFF; font-family: 'Noto Sans', Helvetica, Arial, sans-serif;  border-radius:4px;color:#ffffff;display:inline-block;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">
      Go to account
    </a>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">If
              the above does not work, please click on the following URL -&nbsp;$Website</span>
      </p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We
              look forward to working with you. See you there!</span></p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Regards</span>
      </p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">$advisor_name</span>
      </p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">
              For more information, contact $organization_name at $organization_mobile or write an email to
              $organization_email</span></p>
  </body>
  </html>`;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.step1Flag = true;
    this.getClientListValue(0);
    this.getEmailVerification();
    this.searchFC = new FormControl();
    this.mailForm = this.fb.group({
      mail_body: [''],
    });

    this.searchFC.valueChanges.pipe(
      debounceTime(1000),
      switchMap(data => {
        this.searchName = data;
        if (data === '') {
          this.storedObj = false;
          this.fromSearch = false;
        } else {
          this.storedObj = true;
          this.fromSearch = true;
        }
        this.isLoading = true;
        if (this.dataSource) {
          this.dataSource.data = ELEMENT_DATA;
        }
        return this.getFilteredClientList(data);
      })
    ).subscribe(data => this.responseHandlerForClientApi(data));
  }

  getFilteredClientList(data) {
    if (data !== '') {
      let obj = {
        advisorId: this.advisorId,
        displayName: data
      }
      return this.peopleService.getFilteredClientListForBulkReviewSend(obj)
    } else {
      this.getClientListValue(0);
    }
  }

  getClientListValue(offset) {
    let obj = {
      advisorId: this.advisorId,
      // status: 1,
      limit: 50,
      offset
    };

    if (this.infiniteScrollClientList.length === 0) {
      this.isLoading = true;
    } else {
      this.infiniteScrollingFlag = true;
    }
    this.peopleService.getClientList(obj)
      .subscribe(data => this.responseHandlerForClientApi(data));
  }

  responseHandlerForClientApi(data) {
    this.barButtonOptions.active = false;
    if (data && data.length > 0) {
      data.forEach((singleData) => {
        if (singleData.emailList && singleData.emailList.length > 0) {
          singleData.email = singleData.emailList[0].email;
        }
      });
    }
    if (data && data.length > 0) {
      data.forEach(element => {
        element.selected = false;
        element.ownerName = '';
        element.name = '';
        element.userName = '';
      });
      if (data) {
        console.log("this is all sip table data, ------", data);
        if (this.isAllSelected) {
          data.map(o => o.selected = true);
        }
        if (this.fromSearch || this.searchName === '') {
          this.infiniteScrollClientList = [];
          if (this.searchName == '') {

          }
        }
        this.infiniteScrollClientList = this.infiniteScrollClientList.concat(data);

        this.infiniteScrollClientList = this.infiniteScrollClientList.filter(item => {
          return data.some(item2 => item2.advisorId !== item.advisorId);
        });

        console.log(this.infiniteScrollClientList);
        this.dataSource.data = this.infiniteScrollClientList;

        this.dataSource.sort = this.sort;
        if (this.infiniteScrollClientList.length === 0) {
          this.isLoading = false;
        } else {
          this.infiniteScrollingFlag = false;
        }
        if (this.infiniteScrollingFlag) {
          this.infiniteScrollingFlag = false;
        }
        if (this.isLoading) {
          this.isLoading = false;
        }

      } else {
        this.dataSource.data = (this.infiniteScrollClientList.length > 0) ? this.infiniteScrollClientList : null;
        this.dataSource.sort = this.sort;
        if (this.infiniteScrollClientList.length === 0) {
          this.isLoading = false;
        } else {
          this.infiniteScrollingFlag = false;
        }
        if (this.infiniteScrollingFlag) {
          this.infiniteScrollingFlag = false;
        }
        if (this.isLoading) {
          this.isLoading = false;
        }
        this.dataSource.filteredData = [];
        this.eventService.openSnackBar('No More Data Found', "DISMISS");
        this.hasEndReached = true;
      }
    } else {
      this.dataSource = null;
    }

  }

  onWindowScroll(e: any) {

    console.log(this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop, (e.target.scrollTop + e.target.offsetHeight));
    let tableOffsetTop = this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop;
    let tableOffsetHeight = (e.target.scrollTop + e.target.offsetHeight - 38);
    if (tableOffsetTop <= tableOffsetHeight) {
      if (!this.hasEndReached) {
        console.log("on entering inside", this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop, (e.target.scrollTop + e.target.offsetHeight));
        this.infiniteScrollingFlag = true;
        if (!this.fromSearch) {
          this.getClientListValue(this.infiniteScrollClientList.length);
        }
        // this.getAllSip(this.finalSipList.length, 20);
        // this.getClientList(this.finalSipList[this.finalSipList.length - 1].clientId)
      }

    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // @Input() set data(data) {
  //   this.advisorId = AuthService.getAdvisorId();
  //   this.step1Flag = true;
  //   if (data && data.length > 0) {
  //     data.forEach(element => {
  //       element.selected = false;
  //       element.ownerName = '';
  //       element.name = '';
  //       element.userName = '';
  //     });
  //     this.dataSource.data = data;
  //     this.dataSource.sort = this.sort;
  //   }
  //   this.getEmailVerification();
  //   this.mailForm = this.fb.group({
  //     mail_body: [''],
  //   });
  // }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // this.dataSource.sort = this.sort;
    // this.dataCount = 0;
    // this.dataSource.filteredData.forEach((element: any) => {
    //   if (element.selected) {
    //     this.dataCount++;
    //   }
    // });
    if (filterValue === '') {
      this.storedObj = false;
      this.fromSearch = false;
      filterValue === null;
    } else {
      this.storedObj = true;
      this.fromSearch = true;
    }
    // this.getClientListValue(0, filterValue);
  }

  selectAll(event) {
    this.dataCount = 0;
    this.isAllSelected = true;
    if (!event.checked) {
      this.selectedClientsCount = 0;
      this.isAllSelected = false;
    }
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach((element: any) => {
        element.selected = event.checked;
        if (element.selected) {
          this.dataCount++;
        }
      });
    }
  }

  changeSelect(element) {
    this.dataCount = 0;
    this.selectedClientArray.push(element.clientId);
    if (element.selected) {
      this.selectedClientsCount++;
    } else {
      this.selectedClientsCount--;
    }
    this.dataSource.filteredData.forEach((item: any) => {
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  getEmailVerification() {
    const obj = {
      userId: this.advisorId,
      // advisorId: this.advisorId
    };
    this.isLoading = true;
    this.orgSetting.getEmailVerification(obj).subscribe(
      data => {
        this.getEmailVerificationRes(data);
      },
    );
  }

  getEmailVerificationRes(data) {
    console.log(data);
    if (data.listItems && data.listItems.length > 0) {
      data.listItems.map(element => {
        if (element.emailVerificationStatus == 1) {
          this.verifiedAccountsList.push(element);
        }
      });
      if (this.verifiedAccountsList.length > 1) {
        this.selectedFromEmail.setValue(this.verifiedAccountsList[0].emailAddress);
        this.selectedFromEmail.setValidators([Validators.required]);
      }
    }
  }

  selectedClientListStep() {
    if (this.dataCount > 0 && this.dataSource.filteredData.length > 0) {
      this.dataSource.filteredData.forEach((element: any) => {
        if (element.selected) {
          this.clientList.push(element.clientId);
        }
      });
      this.step1Flag = false;
      this.step2Flag = true;
    } else {
      this.dataCount == 0 ? this.eventService.openSnackBar('Please select clients', 'Dismiss') : this.eventService.openSnackBar('No clients found', 'Dismiss');
    }
  }

  sendEmailToclients() {
    if (this.selectedFromEmail.invalid) {
      return;
    }
    this.barButtonOptions.active = true;
    let arr = [];
    if (this.selectedClientArray.length > 0) {
      this.selectedClientArray.forEach(item => {
        if (!arr.includes(item)) {
          arr.push(item);
        }
      })
    }

    if (this.clientList.length > 0) {
      this.clientList.forEach(element => {
        if (!arr.includes(element)) {
          arr.push(element);
        }
      });

    }



    const obj = {
      advisorId: this.advisorId,
      clientIds: arr,
      fromEmail: this.verifiedAccountsList.length == 0 ? 'no-reply@my-planner.in' : (this.verifiedAccountsList.length == 1) ? this.verifiedAccountsList[0].emailAddress : this.selectedFromEmail.value,
      subject: this.subject.value,
      messageBody: this.emailBody
    };
    if (this.isAllSelected) {
      obj['allClient'] = true;
    }

    console.log(arr);
    // this.orgSetting.sendEmailToClients(obj).subscribe(
    //   data => {
    //     this.eventService.openSnackBar(data, 'Dismiss');
    //     this.close(true);
    //     this.barButtonOptions.active = false;
    //   },
    //   err => {
    //     this.barButtonOptions.active = false;
    //     this.eventService.openSnackBar(err, 'Dismiss');
    //   }
    // );
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

const ELEMENT_DATA = [
  {}, {}, {}
]




