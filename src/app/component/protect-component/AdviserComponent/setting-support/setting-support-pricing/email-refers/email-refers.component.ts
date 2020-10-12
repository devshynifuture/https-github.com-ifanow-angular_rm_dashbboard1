import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-email-refers',
  templateUrl: './email-refers.component.html',
  styleUrls: ['./email-refers.component.scss']
})
export class EmailRefersComponent implements OnInit {
  advisorId: any;
  emailLists: any;
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
  };
  emailForm: FormGroup;

  constructor(
    private peopleService: PeopleService,
    private eventService: EventService,
    private fb: FormBuilder,
    public subInjectService: SubscriptionInject,
    private cusService: CustomerService
  ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getEmailList();

  }

  @Input() set data(data) {
    this.emailForm = this.fb.group({
      from: [],
      To: [data],
      subject: ["Referral code"],
      body: ['']
    })
  }

  getEmailList() {
    let obj = {
      advisorId: this.advisorId
    }
    this.peopleService.getEmailList(obj).subscribe(
      data => this.getEmailListRes(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
      }
    );
  }

  getEmailListRes(data) {
    if (data && data.length > 0) {
      this.emailLists = data;
      this.emailForm.get('from').setValue(data[0].emailAddress)
    } else {
      this.emailLists = [{ emailAddress: "support@futurewise.co.in" }];
      this.emailForm.get('from').setValue("support@futurewise.co.in")
    }
    console.log('getEmailList', data)
  }


  sendEmail() {
    if (this.emailForm.get('body').value == '') {
      this.eventService.openSnackBar("Please fill body first", "Dimiss");
      return;
    }
    this.barButtonOptions.active = true;
    const obj = {
      fromEmail: this.emailForm.get('from').value,
      toEmail: [{ emailAddress: this.emailForm.get('To').value }],
      emailSubject: this.emailForm.get('subject').value,
      messageBody: this.emailForm.get('body').value
    }
    this.cusService.sendSharebleLink(obj).subscribe(data => {
      if (data) {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar("Email sent sucessfully", "Dismis")
        this.close(true)
      }
    }, err => {
      this.eventService.openSnackBar(err, "Dimiss");
    })
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


}
