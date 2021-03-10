import { Component, OnInit, Input } from '@angular/core';
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
import { OrgSettingServiceService } from '../../../setting/org-setting-service.service';
import { UtilService } from 'src/app/services/util.service';
import { ManageKycComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/manage-kyc/manage-kyc.component';

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
  emailBody = ``;
  advisorId: any;
  getVerifiedList: any;
  emailLists: any;
  kycForm: FormGroup;
  @Input() data: any = {};
  constructor(
    private datePipe: DatePipe,
    private enumDataService: EnumDataService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService,
    private peopleService: PeopleService,
    private orgSetting: OrgSettingServiceService) { }

  ngOnInit() {
    if (this.data.name) {
      this.selectedClientData = this.data;
      this.previewEmail();
    } else {
      this.step1 = true;
      this.data['btnFlag'] = 'Cancel'
    }
    this.advisorId = AuthService.getAdvisorId() ? AuthService.getAdvisorId() : AuthService.getClientData().advisorId;
    this.getSubjectTemplate();
    this.kycForm = this.fb.group({
      from: [, [Validators.required]],
      subject: ["", [Validators.required]],
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
    this.showSuggestion = false;
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

  getSubjectTemplate() {
    const obj = {
      advisorId: this.advisorId,
      templateId: 9
    }
    this.orgSetting.getEmailBulkSubjectTemplate(obj).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.kycForm = this.fb.group({
            from: [data.fromEmail, [Validators.required]],
            subject: [data.subject, [Validators.required]],
          })
          this.emailBody = data.body;
        } else {
        }
      }, err => {
      }
    )
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
    if (this.selectedClientData.kycComplaint != 0) {
      obj['redo'] = true;
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

  back() {
    this.step1 = true;
    if (this.data.backComponent) {
      this.openFroala(this.selectedClientData, 'manageKYC')
    } else {
      this.data['btnFlag'] = "Cancel";
    }
  }

  openFroala(data, value) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: ManageKycComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
          // this.Close(true);
          // data.kycComplaint = 2;
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

}


