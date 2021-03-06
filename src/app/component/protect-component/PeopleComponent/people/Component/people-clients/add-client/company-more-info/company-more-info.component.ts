import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType, UtilService } from '../../../../../../../../services/util.service';
import { DatePipe } from '@angular/common';
import { EventEmitter, Output } from '@angular/core/src/metadata/*';
import { AuthService } from '../../../../../../../../auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { AppConstants } from 'src/app/services/app-constants';

@Component({
  selector: 'app-company-more-info',
  templateUrl: './company-more-info.component.html',
  styleUrls: ['./company-more-info.component.scss']
})
export class CompanyMoreInfoComponent implements OnInit {
  moreInfoData: any = {};
  advisorId: any;
  mobileNumberFlag = 'Mobile';
  mobileData: any;
  invCategory = '1';
  validatorType = ValidatorType;
  prevData;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & CLOSE',
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
  barButtonOptions1: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & NEXT',
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
  formPlaceHolders = AppConstants.formPlaceHolders;

  moreInfoForm;
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() saveNextData = new EventEmitter();
  @Output() tabDisableFlag = new EventEmitter();

  companyIndividualData: any;
  maxDate = new Date();
  disableBtn: boolean;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private peopleService: PeopleService, private eventService: EventService,
    private datePipe: DatePipe, private utilService: UtilService) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.createMoreInfoForm(null);
    this.getCompanyDetails(data);
    this.companyIndividualData = data;
  }
  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }

  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [(data.displayName) ? data.displayName : (this.companyIndividualData) ? this.companyIndividualData.name : ''],
      adhaarNo: [(data.aadhaarNumber != 0) ? data.aadhaarNumber : null, [Validators.pattern(this.validatorType.ADHAAR)]],
      maritalStatus: [(data.martialStatusId) ? String(data.martialStatusId) : '1'],
      dateOfBirth: [data.dateOfBirth ? new Date(data.dateOfBirth) : ''],
      bio: [data.bio],
      myNotes: [data.remarks],
      name: [data.name],
      email: [data.email, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      designation: [(data.occupationId) ? String(data.occupationId) : ''],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      anniversaryDate: [data.anniversaryDate ? new Date(data.anniversaryDate) : '']
    });
    console.log(this.moreInfoForm);
  }
  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  ngOnInit() {
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  getCompanyDetails(data) {
    const obj = {
      clientId: data.clientId,
      familyMemberId: data.familyMemberId
    };
    this.peopleService.getCompanyPersonDetail(obj).subscribe(
      responseData => {
        if (responseData && responseData.length > 0) {
          const singleData = responseData[0];
          if (singleData.emailList && singleData.emailList.length > 0) {
            singleData.email = singleData.emailList[0].email;
          }
          this.moreInfoData = singleData;
          this.createMoreInfoForm(this.moreInfoData);
        } else {
          this.moreInfoForm.get('name').setValue(this.companyIndividualData.name);
        }
        console.log(responseData);
      }, err => {
        console.error(err);
      }
    );
  }

  saveNext(flag) {
    const mobileList = [];
    if (this.mobileData.invalid) {
      this.mobileData.markAllAsTouched();
      return;
    }
    if (this.mobileData) {
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          userType: 8,
          mobileNo: (element.get('number').value != '') ? element.get('number').value : undefined,
          isdCodeId: element.get('code').value
        });
      });
    }
    const emailId = this.moreInfoForm.value.email;
    const emailList = [];
    if (emailId) {
      emailList.push({
        userType: 8,
        email: emailId
      });
    }
    (flag == 'Save') ? this.barButtonOptions.active = true : this.disableBtn = false;
    (flag == 'Next') ? this.barButtonOptions1.active = true : this.disableBtn = false;
    const obj = {
      emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      bio: this.moreInfoForm.controls.bio.value,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      occupationId: (this.moreInfoForm.controls.designation.value != '') ? this.moreInfoForm.controls.designation.value : null,
      companyPersonDetailId: this.moreInfoData.companyPersonDetailId,
      pan: this.moreInfoForm.value.pan,
      clientId: (this.moreInfoData && this.moreInfoData.length > 0) ? this.moreInfoData.clientId : this.companyIndividualData.clientId,
      kycComplaint: 0,
      roleId: 0,
      genderId: this.moreInfoForm.value.gender,
      aadhaarNumber: this.moreInfoForm.controls.adhaarNo.value,
      dateOfBirth: this.datePipe.transform((this.moreInfoForm.value.dateOfBirth._d) ? this.moreInfoForm.value.dateOfBirth._d : this.moreInfoForm.value.dateOfBirth, 'dd/MM/yyyy'),
      // userId: (this.moreInfoData && this.moreInfoData.length > 0) ? this.moreInfoData.clientId : this.companyIndividualData.clientId,
      familyMemberId: (this.moreInfoData && this.moreInfoData.length > 0) ? this.moreInfoData.familyMemberId : this.companyIndividualData.familyMemberId,
      mobileList,
      name: this.moreInfoForm.value.name,
      bioRemarkId: this.moreInfoData.bioRemarkId,
      remarks: this.moreInfoForm.controls.myNotes.value,
      anniversaryDate: this.datePipe.transform((this.moreInfoForm.value.anniversaryDate._d) ? this.moreInfoForm.value.anniversaryDate._d : this.moreInfoForm.value.anniversaryDate, 'dd/MM/yyyy'),
      gstin: this.moreInfoData.gstin
    };
    if (this.moreInfoData.companyPersonDetailId) {
      this.peopleService.updateCompanyPersonDetail(obj).subscribe(
        data => {
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
          console.log(data);
          if (data) {
            if (flag == 'Next') {
              this.tabDisableFlag.emit(false);
              this.saveNextData.emit(true);
              this.tabChange.emit(1);
            } else {
              this.close(data);
            }
          } else {
            this.eventService.openSnackBar('Unknown error', 'Dismiss');
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
        }
      );
    } else {
      this.peopleService.saveCompanyPersonDetail(obj).subscribe(
        data => {
          console.log(data);
          this.barButtonOptions.active = false;
          this.barButtonOptions1.active = false;
          this.tabDisableFlag.emit(false);
          if (flag == 'Next') {
            this.tabChange.emit(1);
            this.saveNextData.emit(true);
          } else {
            this.close(data);
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  close(data) {
    (data == 'close') ? this.cancelTab.emit('close') : this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.data && !!changes.data.currentValue) {
  //     this.getCompanyDetails(changes.data);
  //     this.createMoreInfoForm(null);
  //   }
  // }
}
