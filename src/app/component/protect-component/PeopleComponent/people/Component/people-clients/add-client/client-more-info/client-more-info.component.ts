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
  advisorId: any;
  moreInfoData: any;
  mobileNumberFlag = 'Mobile';
  nonindividualForm: any;
  mobileData: any;
  invCategory = '1';
  validatorType = ValidatorType;

  moreInfoForm;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private eventService: EventService, private datePipe: DatePipe) {
  }

  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.moreInfoData = data;
    console.log(data);
    if (this.fieldFlag == 'familyMember') {
      this.createMoreInfoForm(data);
      (this.moreInfoData.familyMemberType == 0 || this.moreInfoData.familyMemberType == 1) ? this.moreInfoData['categoryTypeflag'] = "Individual" : this.moreInfoData['categoryTypeflag'] = "familyMinor";
    }
    else {
      if (this.moreInfoData.userId == null) {
        this.createMoreInfoForm(null);
        return;
      }
      else {
        (this.moreInfoData.clientType == 1) ? this.moreInfoData['categoryTypeflag'] = "Individual" : this.moreInfoData['categoryTypeflag'] = "clientNonIndividual";
        (this.moreInfoData.clientType == '2') ? this.getCompanyDetails(this.moreInfoData) : '';
        this.createMoreInfoForm(data);
      }
    }
  }
  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [],
      adhaarNo: [],
      taxStatus: [],
      occupation: [],
      maritalStatus: ['1'],
      anniversaryDate: [],
      bio: [],
      myNotes: [],
      name: [],
      email: [, [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [],
      designation: [],
      gender: ['1'],
      adhaarMinor: [],
      adhharGuardian: []
    });
  }
  ngOnInit() {

  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  getCompanyDetails(data) {
    const obj = {
      userId: data.userId,
      userType: data.userType
    };
    this.peopleService.getCompanyPersonDetail(obj).subscribe(
      data => {
        console.log(data)
      }, err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

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
      clientType: 0,
      occupationId: (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.occupation.value : null,
      id: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.id : null,
      pan: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.pan : this.moreInfoForm.value.pan,
      clientId: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.clientId : null,
      kycComplaint: 0,
      roleId: 0,
      genderId: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.genderId : this.moreInfoForm.value.genderId,
      companyStatus: 0,
      aadharCard: this.moreInfoForm.controls.adhaarNo.value,
      dateOfBirth: this.datePipe.transform(this.moreInfoData.dateOfBirth, 'dd/MM/yyyy'),
      userName: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.userName : null,
      userId: (this.moreInfoData.invCategory == '1') ? null : this.moreInfoData.userId,
      mobileList: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.mobileList : mobileList,
      referredBy: 0,
      name: (this.moreInfoData.invCategory == '1') ? this.moreInfoData.name : this.moreInfoForm.value.name,
      bioRemarkId: 0,
      userType: 0,
      remarks: (this.moreInfoData.invCategory == '1') ? this.moreInfoForm.controls.myNotes.value : this.moreInfoForm.value.myNotes,
      status: 0,
      companyPersonDetailId: (this.moreInfoData.invCategory == '1') ? null : this.moreInfoData.companyPersonDetailId
    };
    if (this.fieldFlag == 'client' || this.fieldFlag == 'lead') {
      if (this.moreInfoData.invCategory == '1') {
        this.peopleService.editClient(obj).subscribe(
          data => {
            console.log(data);
            (flag == 'Next') ? this.tabChange.emit(1) : this.close();
          },
          err => this.eventService.openSnackBar(err, 'Dismiss')
        );
      } else {
        this.peopleService.updateCompanyPersonDetail(obj).subscribe(
          data => {
            console.log(data);
            (flag == 'Next') ? this.tabChange.emit(1) : this.close();
          },
          err => this.eventService.openSnackBar(err, "Dismiss")
        )
      }
    }
  }

  saveNextFamilyMember(flag) {
    const obj = {
      isKycCompliant: this.moreInfoData.isKycCompliant,
      taxStatusId: this.moreInfoData.taxStatusId,
      emailList: this.moreInfoData.emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      guardianId: 0,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      isActive: 0,
      addressModelList: null,
      occupationId: this.moreInfoForm.controls.occupation.value,
      id: this.moreInfoData.id,
      dematList: null,
      pan: this.moreInfoData.pan,
      familyMemberType: 0,
      clientId: this.moreInfoData.clientId,
      genderId: this.moreInfoData.genderId,
      dateOfBirth: this.moreInfoData.dateOfBirth,
      bankDetailList: this.moreInfoData.bankDetail,
      relationshipId: this.moreInfoData.relationshipId,
      mobileList: this.moreInfoData.mobileList,
      anniversaryDate: this.moreInfoForm.controls.anniversaryDate.value,
      aadhaarNumber: this.moreInfoForm.controls.adhaarNo.value,
      name: this.moreInfoData.name,
      bioRemarkId: 0,
      bio: this.moreInfoForm.controls.bio.value,
      remarks: this.moreInfoForm.controls.myNotes.value,
      guardianData: this.moreInfoData.guardianData
    };
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        console.log(data);
        (flag == 'Next') ? this.tabChange.emit(1) : this.close();
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
