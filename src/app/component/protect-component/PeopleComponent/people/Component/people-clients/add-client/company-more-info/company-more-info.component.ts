import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ValidatorType} from '../../../../../../../../services/util.service';
import {DatePipe} from '@angular/common';
import {EventEmitter, Output} from '@angular/core/src/metadata/*';
import {AuthService} from '../../../../../../../../auth-service/authService';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-company-more-info',
  templateUrl: './company-more-info.component.html',
  styleUrls: ['./company-more-info.component.scss']
})
export class CompanyMoreInfoComponent implements OnInit, OnChanges {
  moreInfoData: any = {};
  advisorId: any;
  mobileNumberFlag = 'Mobile';
  mobileData: any;
  invCategory = '1';
  validatorType = ValidatorType;
  prevData;
  barButtonOptions: MatProgressButtonOptions = {
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
  moreInfoForm;
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
              private peopleService: PeopleService, private eventService: EventService,
              private datePipe: DatePipe) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.prevData = data;
    if (!data) {
      this.prevData = {};
    }
    console.log(data);

  }


  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [data.displayName],
      adhaarNo: [data.aadhaarNumber, [this.validatorType.ADHAAR]],
      maritalStatus: [(data.martialStatusId) ? String(data.martialStatusId) : '1'],
      dateOfBirth: [new Date(data.dateOfBirth)],
      bio: [data.bio],
      myNotes: [data.remarks],
      name: [data.name],
      email: [data.email, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      designation: [(data.occupationId) ? String(data.occupationId) : '1'],
      gender: [(data.genderId) ? data.genderId : '1'],
    });
  }

  ngOnInit() {
    this.getCompanyDetails(this.prevData);
    this.createMoreInfoForm(null);
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  getCompanyDetails(data) {
    const obj = {
      userId: data.clientId,
      userType: data.userType
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
        }
        console.log(responseData);
      }, err => {
        console.error(err);
      }
    );
  }

  saveNext(flag) {
    const mobileList = [];
    if (this.mobileData) {
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          userType: 8,
          mobileNo: element.get('number').value,
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
    this.barButtonOptions.active = true;
    const obj = {
      emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      bio: this.moreInfoForm.controls.bio.value,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      occupationId: this.moreInfoForm.controls.designation.value,
      companyPersonDetailId: this.moreInfoData.companyPersonDetailId,
      pan: this.moreInfoForm.value.pan,
      clientId: this.moreInfoData.clientId ? this.moreInfoData.clientId : this.prevData.clientId,
      kycComplaint: 0,
      roleId: 0,
      genderId: this.moreInfoForm.value.gender,
      aadhaarNumber: this.moreInfoForm.controls.adhaarNo.value,
      dateOfBirth: this.datePipe.transform(this.moreInfoForm.value.dateOfBirth._d, 'dd/MM/yyyy'),
      userId: this.moreInfoData.clientId ? this.moreInfoData.clientId : this.prevData.clientId,
      mobileList,
      name: this.moreInfoForm.value.name,
      bioRemarkId: this.moreInfoData.bioRemarkId,
      remarks: this.moreInfoForm.controls.myNotes.value,
    };
    this.barButtonOptions.active = true;
    if (this.moreInfoData.companyPersonDetailId) {
      this.peopleService.updateCompanyPersonDetail(obj).subscribe(
        data => {
          this.barButtonOptions.active = false;
          console.log(data);
          if (data) {
            (flag == 'Next') ? this.tabChange.emit(1) : this.close(data);
          } else {
            this.eventService.openSnackBar('Unknown error', 'Dismiss');
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
        }
      );
    } else {
      this.peopleService.saveCompanyPersonDetail(obj).subscribe(
        data => {
          console.log(data);
          this.barButtonOptions.active = false;
          (flag == 'Next') ? this.tabChange.emit(1) : this.close(data);
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  close(data) {
    this.subInjectService.changeNewRightSliderState({state: 'close', clientData: data});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !!changes.data.currentValue) {
      this.getCompanyDetails(changes.data);
      this.createMoreInfoForm(null);
    }
  }
}
