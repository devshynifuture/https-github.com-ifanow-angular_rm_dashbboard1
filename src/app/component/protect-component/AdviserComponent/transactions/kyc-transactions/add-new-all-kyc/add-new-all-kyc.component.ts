import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Subscription, Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-add-new-all-kyc',
  templateUrl: './add-new-all-kyc.component.html',
  styleUrls: ['./add-new-all-kyc.component.scss']
})
export class AddNewAllKycComponent implements OnInit {
  step1: boolean;
  stateCtrl = new FormControl();
  selectedClientData: any;
  showSuggestion: boolean;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  isLoding: boolean;
  emailBody = `
  <body style="height: 100%;margin: 0;padding: 0;width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;"><!--*|IF:MC_PREVIEW_TEXT|*--><!--[if !gte mso 9]><!----><!--<![endif]--><!--*|END:IF|*-->
<center>
<table align="center"  cellpadding="0" cellspacing="0" height="100%" id="bodyTable" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #FAFAFA;" width="100%">
<tbody>
<tr>
<td align="center" id="bodyCell" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;" valign="top"><!-- BEGIN TEMPLATE // --><!--[if (gte mso 9)|(IE)]>
<table align="center"  cellspacing="0" cellpadding="0" width="600" style="width:600px;">
<tr>
<td align="center" valign="top" width="600" style="width:600px;">
<![endif]-->
<table  cellpadding="0" cellspacing="0" class="templateContainer" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;" width="100%">
<tbody>
<tr>
<td id="templateBody" style="background:#FFFFFF none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 0;padding-bottom: 0;" valign="top">
<table  cellpadding="0" cellspacing="0" class="mcnImageBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody class="mcnImageBlockOuter">
<tr>
<td class="mcnImageBlockInner" style="padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #fafafa;" valign="top">
<table align="left"  cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table  cellpadding="0" cellspacing="0" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody class="mcnTextBlockOuter">
<tr>
<td class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="top">
<table align="left"  cellpadding="0" cellspacing="0" class="mcnTextContentContainer" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody>
<tr>
<td class="mcnTextContent" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;" valign="top"> </td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table  cellpadding="0" cellspacing="0" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody class="mcnTextBlockOuter">
<tr>
<td class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="top"><!--[if mso]>
<table align="left"  cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
<tr>
<![endif]--><!--[if mso]>
<td valign="top" width="600" style="width:600px;">
<![endif]-->
<table align="left"  cellpadding="0" cellspacing="0" class="mcnTextContentContainer" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody>
<tr>
<td class="mcnTextContent" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: center;" valign="top">


<table  cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td>
<table align="left"  cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td style="line-height: 150%; text-align: left;">Dear $username&lt;member’s personal profile name&gt;,</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>


<p>Please click the below link to complete and verify your KYC. The verification process is completely online and seamless via Video KYC.</p>



<a href="#" style="
    background-color: #3276dc;
    border: none;
    border-radius: 3px;
    color: #fff;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    outline: none!important;
    padding: 12px 35px;
    text-decoration: none;
    margin: 0px;
    ">Complete KYC Now</a>


<p>For any questions, please reply to this email or call us on &lt;admin advisor mobile number&gt;.</p>

<p>Regards</p><p> &lt;admin advisor personal profile name&gt; OR &lt;admin advisor organization profile name&gt;</p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table  cellpadding="0" cellspacing="0" class="mcnDividerBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;" width="100%">
<tbody class="mcnDividerBlockOuter">
<tr>
<td class="mcnDividerBlockInner" style="min-width: 100%;/* padding: 18px; */mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
<table  cellpadding="0" cellspacing="0" class="mcnDividerContent" style="min-width: 100%;/* border-top: 2px solid #E7E7E7; */border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%">
<tbody>
<tr>
<td style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"> </td>
</tr>
</tbody>
</table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
--></td>
</tr>
</tbody>
</table>


</td>
</tr>


</tbody>
</table>
<!--[if (gte mso 9)|(IE)]>
</td>
</tr>
</table>
<![endif]--><!-- // END TEMPLATE --></td>
</tr>
</tbody>
</table>
</center>

</body>
  `;
  advisorId: any;
  getVerifiedList: any;
  emailLists: any;
  kycForm: FormGroup;
  constructor(
    private datePipe: DatePipe,
    private enumDataService: EnumDataService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService,
    private peopleService: PeopleService) { }

  ngOnInit() {
    this.step1 = true;
    this.advisorId = AuthService.getAdvisorId();
    this.getEmailList();
    this.kycForm = this.fb.group({
      from: [, [Validators.required]],
      subject: ["Complete and verify your Video KYC", [Validators.required]],
    })
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SEND KYC LINK EMAIL',
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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  clientList: [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];



  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  previewEmail() {
    if (!this.selectedClientData.email) {
      this.eventService.openSnackBar("Please add email address for further process", "Dismiss");
      return;
    }
    this.step1 = false;
    this.fruits.push({ name: this.selectedClientData.email })
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: flag
    });
  }

  mergeOptionSelected(value) {
    this.stateCtrl.setValue(value.name)
    value.dateOfBirth = (value.birthDate) ? this.datePipe.transform(value.dateOfBirth, 'dd/MM/yyyy') : '-'
    value = this.formatEmailAndMobile(value);
    this.selectedClientData = value;
    this.showSuggestion = false
  }

  formatEmailAndMobile(data) {
    if (data.mobileList && data.mobileList.length > 0) {
      data.mobileNo = data.mobileList[0].mobileNo;
    }
    if (data.emailList && data.emailList.length > 0) {
      data.email = data.emailList[0].email;
    }
    return data;
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
    this.getVerifiedList = []
    if (data && data.length > 0) {
      this.emailLists = data;
      this.getVerifiedList = this.emailLists.filter(element => element.emailVerificationStatus == 1);
      this.kycForm.get("from").setValue(this.getVerifiedList[0].emailAddress)
    }
  }

  searchClientFamilyMember(value) {
    if (value.length == 2) {
      return;
    }
    this.isLoding = true;
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
            if (responseArray) {
              if (value.length >= 0) {
                this.clientList = responseArray;
                this.isLoding = false;
              } else {
                this.isLoding = false;
                this.clientList = undefined;
              }
            } else {
              this.stateCtrl.setErrors({ invalid: true });
              this.isLoding = false;
              this.clientList = undefined;
            }
          }, error => {
            this.clientList = undefined;
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }

  kycAdvisorSectionMethod() {
    this.barButtonOptions.active = true;
    const hostNameOrigin = window.location.origin;
    const obj = {
      name: this.selectedClientData.name,
      clientId: this.selectedClientData.clientId,
      email: this.selectedClientData.email,
      mobileNo: this.selectedClientData.mobileNo,
      redirectUrl: `${hostNameOrigin}/kyc-redirect`,
      fromEmail: this.kycForm.get('from').value
    }
    this.peopleService.sendKYCLink(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar("Email sent sucessfully", "Dismiss");
        this.close(true);
      }, err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }


}


