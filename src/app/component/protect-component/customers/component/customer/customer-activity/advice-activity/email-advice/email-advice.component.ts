import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-email-advice',
  templateUrl: './email-advice.component.html',
  styleUrls: ['./email-advice.component.scss']
})
export class EmailAdviceComponent implements OnInit {
  groupId: any;
  @ViewChild('tempRef', { static: true }) tempRef: ElementRef;
  @ViewChild('EmailIdTo', { static: true }) EmailIdToRef: ElementRef;
  @ViewChild('subBody', { static: true }) subBodyRef: ElementRef;
  selectedAssetId = [];
  emailIdList = [{ emailAddress: 'gayatri@futurewise.co.in' }];
  flag: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  subjectFormCOntrol = new FormControl();
  _inputData = { toEmail :'',fromEmail: '', subjectEditable: false, subject: '', bodyChange: '' };
  getOrgData = AuthService.getOrgDetails();
  emailBody = `
  <html>
  <head></head>
  <body>
     <p #subBody class="pt-28 f-700 roboto">Request for advice consent from $company_name.
      </p>
      <p>
          <span style="color: rgb(29, 28, 29); font-family: Slack-Lato, appleLogo, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: common-ligatures; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;  text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear
              $client_name,</span></p>
     <p class="pt-10 roboto">As discussed,we have reviewed your portfolio and given after thorough review &
              analysis</p>
      <p class="pt-10 roboto">You need to give your Consent in order to help us proceed further.You can go by
      clicking here or on the button below</p>
      <button mat-stroked-button class="btn-primary">PROCEED
     </button>
      <p class="pt-10 roboto">Consent link URL : http://www.my-planner/consent_confimramtion.html</p>
      <p class="pt-10 ">Feel free to get back to us if you have any questions</p>
      <i class="material-icons">
      more_horiz</i>
  </body>
  </html>`;

  validatorType = ValidatorType;
  getData: any;
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService, private route: Router, private datePipe: DatePipe) { }
  @Input() set data(data) {
    this.getData = data.selectedAssetData;
    this.getIds(data);
    this.flag = data.flagData;
    this._inputData.fromEmail = 'sarvesh@futurewise.co.in';
    this._inputData.subjectEditable = false;
    this._inputData.subject = 'Email advice request for consent ';
    this._inputData.toEmail = 'gayatri@futurewise.co.in';

    console.log(this.selectedAssetId, "selected id")
  }
  ngOnInit() {
  }
  getIds(data) {
    data.selectedAssetData.forEach(element => {
      this.selectedAssetId.push(element.id)
    });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && value.length > 0) {
      if (this.validatorType.EMAIL.test(value)) {
        this.emailIdList.push({ emailAddress: value });
      } else {
        this.eventService.openSnackBar('Enter valid email address', 'Dismiss');
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  OpenProceedConsent() {
    const fragmentData = {
      flag: 'plan',
      id: 1,
      direction: 'top',
      // componentName: AdviceConsentReportComponent,
      state: 'open',
      Name: 'plan-upper-slider'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        console.log(upperSliderData, 'show what happens');

        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
          }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  saveData(data) {
    this.emailBody = data;
  }

  sendEmail() {
    this.emailBody.replace('$company_name', this.getOrgData.companyName);
    let obj = this.selectedAssetId;
    if (this.flag == 'BypassConsent') {
      this.cusService.consentBypass(obj).subscribe(
        data => this.getResponse(data), (error) => {
        }
      );
    } else {
      this.cusService.generateGroupId(obj).subscribe(
        data => this.getResponse(data)
      )
    }
  }
  getResponse(data) {
    console.log(data);
    this.groupId = data;
    let dateObj = new Date();
    // this.elemRef.nativeElement.innerHTML
    let obj =
    {
      "messageBody": "Test",
      "toEmail": [
        {
          "emailAddress": 'gayatri@futurewise.co.in'
        }
      ],
      "targetObject": {
        "adviceUuid": this.groupId,
        // "adviceUuid": 'abe26153-d112-410e-8ee1-5268a8911b4a',
        "sent": this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      },
      "fromEmail": "sarvesh@futurewise.co.in",
      "emailSubject": this.emailBody,
      "placeholder": [
        {
          "user": "$user"
        }
      ]
    }
    this.cusService.sentEmailConsent(obj).subscribe(
      data => {
        console.log(data)
        // const obj={
        //   adviceToCategoryTypeMasterId: this.getData[0].adviceToCategoryTypeMasterId,
        //   adviceId : this.getData[0].id
        // }
        this.route.navigate(['/cus/email-consent'], { queryParams: { gropID: this.groupId } });
        // this.route.navigate(['/cus/email-consent'], { queryParams: { gropID: 'abe26153-d112-410e-8ee1-5268a8911b4a', } });

        this.close(false)
      }
    )
  }
  removeEmailId(index) {
    // const index = this.emailIdList.indexOf(singleEmail);

    // if (index >= 0) {
    if (this.emailIdList.length == 1) {
      return;
    }
    this.emailIdList.splice(index, 1);
    // }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
