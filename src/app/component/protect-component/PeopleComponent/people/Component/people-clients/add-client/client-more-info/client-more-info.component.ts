import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';

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

  moreInfoForm;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,
    private peopleService: PeopleService, private eventService: EventService,
    private datePipe: DatePipe) {
  }

  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log('ClientMoreInfoComponent data : ', data);
    if (this.fieldFlag == 'familyMember') {
      this.createMoreInfoForm(data);
      (this.moreInfoData.familyMemberType == 0 || this.moreInfoData.familyMemberType == 1) ?
        this.moreInfoData.categoryTypeflag = 'Individual' : this.moreInfoData.categoryTypeflag = 'familyMinor';
    } else {
      if (this.moreInfoData.userId == null) {
        this.createMoreInfoForm(null);
        return;
      } else {
        if (this.moreInfoData.clientType == 1 || this.moreInfoData.clientType == 0) {
          this.moreInfoData.categoryTypeflag = 'Individual';
          this.moreInfoData.invCategory = '1';
        } else {
          this.moreInfoData.categoryTypeflag = 'clientNonIndividual';
          this.moreInfoData.invCategory = '2';
        }
        this.createMoreInfoForm(data);
      }
    }
  }

  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [data.displayName],
      adhaarNo: [data.aadhaarNumber],
      taxStatus: [],
      occupation: [(data.occupationId == 0) ? '1' : String(data.occupationId)],
      maritalStatus: [(data.martialStatusId) ? String(data.martialStatusId) : '1'],
      anniversaryDate: [],
      bio: [data.bio],
      myNotes: [data.remarks],
      name: [data.name],
      email: [data.email, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      gender: ['1'],
      adhaarMinor: [data.aadhaarNumber],
      adhharGuardian: [(data.guardianData) ? data.guardianData.aadhaarNumber : '']
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
    const mobileList = [];
    if (this.mobileData) {
      this.mobileData.controls.forEach(element => {
        console.log(element);
        mobileList.push({
          verificationStatus: 0,
          id: 0,
          userType: 0,
          mobileNo: element.get('number').value,
          isActive: 1,
          userId: 0
        });
      });
    }
    const obj = {
      advisorId: this.moreInfoData.advisorId,
      emailList: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.emailList : this.moreInfoForm.value.email,
      displayName: (this.moreInfoData.invCategory == '1' || this.moreInfoData.invCategory == '2') ? this.moreInfoForm.controls.displayName.value : null,
      bio: this.moreInfoForm.controls.bio.value,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      password: null,
      clientType: this.moreInfoData.clientType,
      occupationId: (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.occupation.value : null,
      id: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.id : null,
      pan: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.pan : this.moreInfoForm.value.pan,
      clientId: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.clientId : null,
      kycComplaint: 0,
      roleId: 0,
      genderId: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.genderId : this.moreInfoForm.value.genderId,
      companyStatus: 0,
      aadhaarNumber: this.moreInfoForm.controls.adhaarNo.value,
      dateOfBirth: this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
      userName: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.userName : null,
      userId: this.moreInfoData.userId,
      mobileList: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.mobileList : mobileList,
      referredBy: 0,
      name: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.name : this.moreInfoForm.value.name,
      bioRemarkId: 0,
      userType: 2,
      remarks: (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.myNotes.value : this.moreInfoForm.value.myNotes,
      status: (this.fieldFlag == 'client') ? 1 : 2,
    };
    if (this.fieldFlag == 'client' || this.fieldFlag == 'lead') {
      if (this.moreInfoData.invCategory == '1') {
        this.peopleService.editClient(obj).subscribe(
          data => {
            console.log(data);
            (flag == 'Next') ? this.tabChange.emit(1) : this.close(data);
          },
          err => this.eventService.openSnackBar(err, 'Dismiss')
        );
      }
      // else {
      //   this.peopleService.updateCompanyPersonDetail(obj).subscribe(
      //     data => {
      //       console.log(data);
      //       (flag == 'Next') ? this.tabChange.emit(1) : this.close(data);
      //     },
      //     err => this.eventService.openSnackBar(err, 'Dismiss')
      //   );
      // }
    }
  }

  saveNextFamilyMember(flag) {
    this.moreInfoData.guardianData['aadhaarNumber'] = this.moreInfoForm.value.adhharGuardian;
    const obj = {
      isKycCompliant: this.moreInfoData.isKycCompliant,
      taxStatusId: this.moreInfoData.taxStatusId,
      emailList: this.moreInfoData.emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      guardianId: 0,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      occupationId: this.moreInfoForm.controls.occupation.value,
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
      aadhaarNumber: this.moreInfoForm.value.adhaarMinor,
      name: this.moreInfoData.name,
      bioRemarkId: 0,
      bio: this.moreInfoForm.controls.bio.value,
      remarks: this.moreInfoForm.controls.myNotes.value,
      anniversaryDate: this.datePipe.transform(this.moreInfoForm.value.anniversaryDate._d, 'dd/MM/yyyy'),
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
        console.log(data);
        (flag == 'Next') ? this.tabChange.emit(1) : this.close(data);
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', clientData: data });
  }

}
