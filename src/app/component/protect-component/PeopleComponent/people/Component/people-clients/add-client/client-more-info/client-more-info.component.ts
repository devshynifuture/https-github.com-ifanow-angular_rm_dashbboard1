import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType, UtilService } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-client-more-info',
  templateUrl: './client-more-info.component.html',
  styleUrls: ['./client-more-info.component.scss']
})
export class ClientMoreInfoComponent implements OnInit {
  moreInfoData: any;
  advisorId: any;
  mobileNumberFlag = 'Mobile';
  nonindividualForm: any;
  mobileData: any;
  invCategory = '1';
  validatorType = ValidatorType;
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
  moreInfoForm;
  occupationList = [];
  disableBtn = false;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private peopleService: PeopleService, private eventService: EventService,
    private datePipe: DatePipe) {
  }

  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  @Output() clientData = new EventEmitter();
  @Output() cancelTab = new EventEmitter();
  @Output() saveNextData = new EventEmitter();

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log('ClientMoreInfoComponent data : ', data);
    if (this.fieldFlag == 'familyMember') {
      this.occupationList = [
        { name: "Goverment", value: 1 },
        { name: "Service", value: 2 },
        { name: "Private", value: 3 },
        { name: "Business", value: 4 },
        { name: "Self-Occupied", value: 5 },
        { name: "Home maker", value: 6 },
        { name: "Student", value: 7 },
        { name: "Retired", value: 8 }
      ]
      if (this.moreInfoData.familyMemberType == 0 || this.moreInfoData.familyMemberType == 1) {
        this.moreInfoData.categoryTypeflag = 'Individual';
      }
      else {
        this.moreInfoData.categoryTypeflag = 'familyMinor';
      }
      this.createMoreInfoForm(data);
    } else {
      if (this.moreInfoData.userId == null) {
        this.createMoreInfoForm(null);
        return;
      } else {
        this.occupationList = [
          { name: 'Goverment', value: 1 },
          { name: 'Service', value: 2 },
          { name: 'Private sector', value: 3 },
          { name: 'Business', value: 4 },
          { name: 'Self-Occupied', value: 5 },
        ]
        if (this.moreInfoData.clientType == 1 || this.moreInfoData.clientType == 0) {
          this.moreInfoData.categoryTypeflag = 'Individual';
          this.moreInfoData.invCategory = '1';
        }
        else if (this.moreInfoData.clientType == 2) {
          this.moreInfoData.categoryTypeflag = 'familyMinor';
          this.moreInfoData.invCategory = '2';

        } else {
          this.moreInfoData.categoryTypeflag = 'clientNonIndividual';
          this.moreInfoData.invCategory = '3';
        }
        this.createMoreInfoForm(data);
      }
    }
  }

  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [data.displayName],
      adhaarNo: [data.aadhaarNumber, Validators.pattern(this.validatorType.ADHAAR)],
      occupation: [(data.occupationId == 0) ? '' : (data.occupationId)],
      maritalStatus: [(data.martialStatusId) ? String(data.martialStatusId) : '1'],
      anniversaryDate: [String(data.anniversaryDate)],
      bio: [data.bio],
      myNotes: [data.remarks],
      name: [data.name],
      email: [data.email, [Validators.pattern(this.validatorType.EMAIL)]],
      // pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      gender: ['1'],
      adhharGuardian: [(data.guardianData) ? data.guardianData.aadhaarNumber : '', Validators.pattern(this.validatorType.ADHAAR)]
    });
  }

  ngOnInit() {

  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  // getCompanyDetails(data) {
  //   const obj = {
  //     userId: data.userId,
  //     userType: data.userType
  //   };
  //   this.peopleService.getCompanyPersonDetail(obj).subscribe(
  //     data => {
  //       console.log(data);
  //     }, err => this.eventService.openSnackBar(err, 'Dismiss')
  //   );
  // }

  saveNext(flag) {
    if (this.moreInfoForm.invalid) {
      this.moreInfoForm.markAllAsTouched();
      return;
    }
    else {
      if (this.moreInfoData.guardianData) {
        this.moreInfoData.guardianData['aadhaarNumber'] = this.moreInfoForm.value.adhharGuardian;
        this.moreInfoData.guardianData['birthDate'] = this.datePipe.transform(this.moreInfoData.guardianData.birthDate, 'dd/MM/yyyy')
      }
      (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
      const obj = {
        taxStatusId: this.moreInfoData.taxStatusId,
        // advisorId: this.moreInfoData.advisorId,
        emailList: this.moreInfoData.emailList,
        displayName: (this.moreInfoData.invCategory == '1' || this.moreInfoData.invCategory == '2') ? this.moreInfoForm.controls.displayName.value : null,
        bio: this.moreInfoForm.controls.bio.value,
        martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
        password: null,
        clientType: this.moreInfoData.clientType,
        occupationId: (this.moreInfoForm.controls.occupation.value != '') ? this.moreInfoForm.controls.occupation.value : null,
        id: this.moreInfoData.id,
        pan: this.moreInfoData.pan,
        clientId: this.moreInfoData.clientId,
        kycComplaint: 0,
        roleId: this.moreInfoData.roleId,
        genderId: this.moreInfoData.genderId,
        companyStatus: 0,
        aadhaarNumber: this.moreInfoForm.controls.adhaarNo.value,
        dateOfBirth: this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
        userName: this.moreInfoData.userName,
        userId: this.moreInfoData.userId,
        mobileList: this.moreInfoData.mobileList,
        referredBy: 0,
        name: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.name : this.moreInfoForm.value.name,
        bioRemarkId: 0,
        userType: 2,
        remarks: this.moreInfoForm.controls.myNotes.value,
        status: (this.fieldFlag == 'client') ? 1 : 2,
        leadSource: this.moreInfoData.leadSource,
        leadRating: this.moreInfoData.leadRating,
        leadStatus: this.moreInfoData.leaadStatus,
        guardianData: this.moreInfoData.guardianData
      };
      this.peopleService.editClient(obj).subscribe(
        data => {
          this.disableBtn = false;
          this.barButtonOptions.active = false;
          console.log(data);
          this.clientData.emit(data);
          if (flag == 'Next') {
            this.tabChange.emit(1);
            this.saveNextData.emit(true);
          }
          else {
            this.barButtonOptions.active = false;
            this.close(data);
          }
        },
        err => {
          this.disableBtn = false;
          this.eventService.openSnackBar(err, 'Dismiss')
          this.barButtonOptions.active = false
        }
      );
    }
  }

  saveNextFamilyMember(flag) {
    if (this.moreInfoData.guardianData) {
      this.moreInfoData.guardianData['aadhaarNumber'] = this.moreInfoForm.value.adhharGuardian;
      this.moreInfoData.guardianData['birthDate'] = this.datePipe.transform(this.moreInfoData.guardianData.birthDate, 'dd/MM/yyyy')
    }
    if (this.moreInfoForm.invalid) {
      this.moreInfoForm.markAllAsTouched();
      return;
    }
    (flag == 'close') ? this.barButtonOptions.active = true : this.disableBtn = true;
    const obj = {
      isKycCompliant: this.moreInfoData.isKycCompliant,
      taxStatusId: this.moreInfoData.taxStatusId,
      emailList: this.moreInfoData.emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      occupationId: (this.moreInfoForm.controls.occupation.value != '') ? this.moreInfoForm.controls.occupation.value : null,
      id: this.moreInfoData.id,
      familyMemberId: this.moreInfoData.familyMemberId,
      pan: this.moreInfoData.pan,
      familyMemberType: this.moreInfoData.familyMemberType,
      clientId: this.moreInfoData.clientId,
      genderId: this.moreInfoData.genderId,
      dateOfBirth: this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
      bankDetailList: this.moreInfoData.bankDetail,
      relationshipId: this.moreInfoData.relationshipId,
      mobileList: this.moreInfoData.mobileList,
      aadhaarNumber: (this.moreInfoData.invCategory == 2) ? this.moreInfoForm.value.adhaarMinor : this.moreInfoForm.value.adhaarNo,
      name: this.moreInfoData.name,
      bioRemarkId: 0,
      bio: this.moreInfoForm.controls.bio.value,
      remarks: this.moreInfoForm.controls.myNotes.value,
      anniversaryDate: this.datePipe.transform((this.moreInfoForm.value.anniversaryDate == undefined) ? null : this.moreInfoForm.value.anniversaryDate._d, 'dd/MM/yyyy'),
      // guardianData: this.moreInfoData.guardianData,
      guardianData: this.moreInfoData.guardianData
      //  {
      //   name: this.moreInfoData.guardianData.name,
      //   birthDate: this.datePipe.transform(this.moreInfoData.guardianData.birthDate, 'dd/MM/yyyy'),
      //   pan: 'pan',
      //   genderId: this.moreInfoData.guardianData.genderId,
      //   relationshipId: 1,
      //   aadhaarNumber: this.moreInfoForm.value.adhharGuardian,
      //   occupationId: 1,
      //   martialStatusId: 1,
      //   anniversaryDate: this.datePipe.transform(this.moreInfoForm.value.anniversaryDate, 'dd/MM/yyyy'),
      //   mobileList: this.moreInfoData.guardianData.mobileList,
      //   emailList: [
      //     {
      //       email: (this.moreInfoData.guardianData.emailList) ? this.moreInfoData.guardianData.emailList.email : '',
      //       userType: 4,
      //       verificationStatus: 0
      //     }
      //   ]
      // }
    };
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        this.disableBtn = false
        console.log(data);
        this.clientData.emit(data);
        this.barButtonOptions.active = false;
        if (flag == 'Next') {
          this.tabChange.emit(1);
          this.saveNextData.emit(true);
        }
        else {
          this.barButtonOptions.active = false;
          this.close(data);
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss')
        this.barButtonOptions.active = false;
        this.disableBtn = false
      }
    );
  }

  close(data) {
    (data == 'close') ? this.cancelTab.emit('close') :
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

}
