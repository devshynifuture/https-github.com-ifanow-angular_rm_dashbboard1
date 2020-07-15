import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-mobile-view-more-info',
  templateUrl: './mobile-view-more-info.component.html',
  styleUrls: ['./mobile-view-more-info.component.scss']
})
export class MobileViewMoreInfoComponent implements OnInit {
  userData: any;
  moreInfoForm: FormGroup;
  validatorType = ValidatorType;
  @Output() backfunc = new EventEmitter();
  @Output() savedData = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private peopleService: PeopleService) { }

  ngOnInit() {
  }
  occupationList = [
    { name: 'Goverment', value: 1 },
    { name: 'Service', value: 2 },
    { name: 'Private', value: 3 },
    { name: 'Business', value: 4 },
    { name: 'Self employed', value: 5 },
    { name: 'Home maker', value: 6 },
    { name: 'Student', value: 7 },
    { name: 'Retired', value: 8 }
  ];
  @Input() set fmData(data) {
    this.userData = data;
    this.createMoreInfoForm(data);
  }

  createMoreInfoForm(data) {
    (data == undefined) ? data = {} : data;
    this.moreInfoForm = this.fb.group({
      displayName: [data.displayName],
      adhaarNo: [(data.aadhaarNumber != 0) ? data.aadhaarNumber : null, Validators.pattern(this.validatorType.ADHAAR)],
      occupation: [(data.occupationId == 0) ? '' : (data.occupationId)],
      maritalStatus: [(data.martialStatusId) ? String(data.martialStatusId) : '1'],
      anniversaryDate: [data.anniversaryDate ? new Date(data.anniversaryDate) : ''],
      bio: [data.bio],
      myNotes: [data.remarks],
      name: [data.name],
      email: [data.email, [Validators.pattern(this.validatorType.EMAIL)]],
      gender: ['1'],
      adhharGuardian: [(data.guardianData) ? data.guardianData.aadhaarNumber : '', Validators.pattern(this.validatorType.ADHAAR)]
    });
  }

  back() {
    this.backfunc.emit(undefined);
  }

  editFamilyMember() {
    if (this.userData.guardianData) {
      this.userData.guardianData.aadhaarNumber = this.moreInfoForm.value.adhharGuardian;
      this.userData.guardianData.birthDate = this.datePipe.transform(this.userData.guardianData.birthDate, 'dd/MM/yyyy');
    }
    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      isKycCompliant: this.userData.isKycCompliant,
      taxStatusId: this.userData.taxStatusId,
      residentFlag: this.userData.residentFlag,
      emailList: this.userData.emailList,
      displayName: this.moreInfoForm.controls.displayName.value,
      martialStatusId: this.moreInfoForm.controls.maritalStatus.value,
      occupationId: (this.moreInfoForm.controls.occupation.value != '') ? this.moreInfoForm.controls.occupation.value : null,
      id: this.userData.id,
      familyMemberId: this.userData.familyMemberId,
      pan: this.userData.pan,
      familyMemberType: this.userData.familyMemberType,
      clientId: this.userData.clientId,
      genderId: this.userData.genderId,
      dateOfBirth: this.datePipe.transform(this.userData.dateOfBirth, 'dd/MM/yyyy'),
      bankDetailList: this.userData.bankDetail,
      relationshipId: this.userData.relationshipId,
      mobileList: this.userData.mobileList,
      aadhaarNumber: (this.userData.invCategory == 2) ? this.moreInfoForm.value.adhaarMinor : this.moreInfoForm.value.adhaarNo,
      name: this.userData.name,
      bioRemarkId: 0,
      bio: this.moreInfoForm.controls.bio.value,
      remarks: this.moreInfoForm.controls.myNotes.value,
      anniversaryDate: this.datePipe.transform((this.moreInfoForm.value.anniversaryDate == undefined) ? null : this.moreInfoForm.value.anniversaryDate._d, 'dd/MM/yyyy'),
      guardianData: this.userData.guardianData
    };
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        console.log(data)
        this.savedData.emit(data);
      })
  }
}
