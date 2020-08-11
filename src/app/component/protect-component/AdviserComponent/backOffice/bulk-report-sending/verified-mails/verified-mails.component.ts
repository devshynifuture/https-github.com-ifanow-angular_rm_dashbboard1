import { Component, OnInit } from '@angular/core';
import { OrgSettingServiceService } from '../../../setting/org-setting-service.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { OpenEmailVerificationComponent } from '../../../setting/setting-preference/open-email-verification/open-email-verification.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-verified-mails',
  templateUrl: './verified-mails.component.html',
  styleUrls: ['./verified-mails.component.scss']
})
export class VerifiedMailsComponent implements OnInit {
  displayedColumns: string[] = ['select','position', 'name', 'weight'];
  counter: any;
  isLoading: boolean;
  advisorId: any;
  emailList: any[] = [{}, {}, {}];
  emailDetails: any;
  element: any;
  constructor(private orgSetting: OrgSettingServiceService,
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
      userId: this.advisorId,
      // advisorId: this.advisorId
    }
    this.isLoading = true;
    this.orgSetting.getEmailVerification(obj).subscribe(
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
      console.log('tlist',this.emailList)
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
  selectedEmail(email){
    
  }
}
