import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { element } from 'protractor';
import { OrgSettingServiceService } from '../../org-setting-service.service';
import { FormBuilder } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

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



  constructor(
    public authService: AuthService,
    protected eventService: EventService,
    public enumDataService: EnumDataService,
    private orgSetting: OrgSettingServiceService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }



  logoText = 'Your Logo here';
  emailBody = '';


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
    if (data && data.length > 0) {
      data.map(element => {
        if (element.emailVerificationStatus == 1) {
          this.verifiedAccountsList.push(element)
        }
      })
    }
  }

  selectedClientListStep() {
    if (this.dataCount > 0) {
      this.dataSource.filteredData.forEach(element => {
        if (element['selected']) {
          this.clientList.push(element['clientId'])
        }
      })
      this.step1Flag = false;
      this.step2Flag = true;
    } else {
      this.eventService.openSnackBar("Please select clients", "Dismiss");
    }
  }

  sendEmailToclients() {
    const obj =
    {
      advisorId: this.advisorId,
      clientIds: this.clientList,
      fromEmail: "email",
      subject: "subject",
      messageBody: "message"
    }
    this.orgSetting.sendEmailToClients(obj).subscribe(
      data => {
        this.eventService.openSnackBar(data, "Dismiss")
        this.close(true);
      },
      err => { this.eventService.openSnackBar(err, "Dismiss") }
    )
  }

  bulkEmail(value) {
    const dialogData = {
      data: value,
      header: 'EMAIL VERIFICATION REQUIRED',
      body: 'If you wish to send an email with your email address, Please verify it before proceeding. Please make a note the process of verification takes 24 to 48 hours. Would you like to proceed?',
      body2: '',
      btnYes: 'CHANGE',
      btnNo: 'PROCEED',
      positiveMethod: () => {
        this.close(false);
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




