import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { PeopleService } from 'src/app/component/Services/people.service';

@Component({
  selector: 'app-minor-member-form',
  templateUrl: './minor-member-form.component.html',
  styleUrls: ['./minor-member-form.component.scss']
})
export class MinorMemberFormComponent implements OnInit {
  relationList: { name: string; value: number; }[];
  mobileData: any;
  constructor(
    private fb: FormBuilder,
    public utilService: UtilService,
    private datePipe: DatePipe,
    private peopleService: PeopleService
  ) { }
  @Input() set formData(data) {
    this.userData = data;
    if (data.relationshipId == 10 ||
      data.relationshipId == 8 ||
      data.relationshipId == 9 ||
      data.relationshipId == 11 ||
      data.relationshipId == 12 ||
      data.relationshipId == 15 ||
      data.relationshipId == 16 ||
      data.relationshipId == 18 ||
      data.relationshipId == 19 ||
      data.relationshipId == 17) {
      // this.relationList = relationListFilterOnID(data)
    }
    else {
      this.relationshipTypeMethod(data.genderId, data.age)
    }
    this.createMinorForm(data);
  }
  userData: any;
  minorForm: FormGroup;
  validatorType = ValidatorType;
  gDobAsPerRecord;
  @Input() categoryType;
  @Input() taxStatusType;
  @Output() savedData = new EventEmitter();
  mobileNumberFlag = 'Mobile number';


  ngOnInit() {
  }

  getNumberDetails(data) {
    console.log(data);
    this.mobileData = data;
  }

  createMinorForm(data) {
    (data == undefined) ? data = {} : '';
    this.minorForm = this.fb.group({
      minorFullName: [data.name, [Validators.required]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : ''],
      gFullName: [(data.guardianData) ? data.guardianData.name : '', [Validators.required]],
      gDobAsPerRecord: [(data.guardianData) ? new Date(data.guardianData.birthDate) : ''],
      gGender: [(data.guardianData) ? String(data.guardianData.genderId) : '1'],
      relationWithMinor: [(data.guardianData) ? (data.guardianData.relationshipId != 0) ? String(data.guardianData.relationshipId) : '' : ''],
      gEmail: [(data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
    });
  }

  relationshipTypeMethod(gender, age) {
    if (gender == 1 && age > 18) {
      this.relationList = [
        { name: 'Son', value: 4 },
        { name: 'Husband', value: 2 },
        { name: 'Father', value: 6 },
        { name: 'Other', value: 10 },
      ]
    }
    if (gender == 1 && age <= 18) {
      this.relationList = [
        { name: 'Son', value: 4 },
        { name: 'Other', value: 10 },
      ]
    }
    if (gender == 2 && age > 18) {
      this.relationList = [
        { name: 'Daughter', value: 5 },
        { name: 'Wife', value: 3 },
        { name: 'Mother', value: 7 },
        { name: 'Other', value: 20 },
      ]
    }
    if (gender == 2 && age <= 18) {
      this.relationList = [
        { name: 'Daughter', value: 5 },
        { name: 'Other', value: 10 },
      ]
    }
    if (gender == 3) {
      this.relationList = [
        { name: 'Wife', value: 3 },
        { name: 'Husband', value: 2 },
        { name: 'Son', value: 4 },
        { name: 'Daughter', value: 5 },
        { name: 'Father', value: 6 },
        { name: 'Mother', value: 7 },
        { name: 'Other', value: 20 },
      ]
    }
  }

  editFamilyMember() {
    const mobileList = [];
    this.mobileData.controls.forEach(element => {
      console.log(element);
      mobileList.push({
        mobileNo: element.get('number').value,
        verificationStatus: 0,
        isdCodeId: element.get('code').value
      });
    });

    let gardianObj;
    gardianObj = {
      name: this.minorForm.value.gFullName,
      birthDate: this.datePipe.transform(this.minorForm.value.gDobAsPerRecord, 'dd/MM/yyyy'),
      pan: 'pan',
      genderId: this.minorForm.value.gGender,
      relationshipId: (this.minorForm.value.relationWithMinor != '') ? this.minorForm.value.relationWithMinor : null,
      aadhaarNumber: (this.userData.guardianData) ? this.userData.guardianData.aadhaarNumber : null,
      occupationId: 1,
      martialStatusId: 1,
      anniversaryDate: null,
      mobileList: mobileList,
      emailList: [
        {
          email: this.minorForm.value.gEmail,
          userType: 4,
          verificationStatus: 0
        }
      ]
    }

    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      familyMemberId: this.userData.familyMemberId,
      clientId: this.userData.clientId,
      name: this.minorForm.value.minorFullName,
      displayName: null,
      dateOfBirth: this.datePipe.transform(this.minorForm.value.dobAsPerRecord, 'dd/MM/yyyy'),
      martialStatusId: null,
      genderId: this.minorForm.value.gender,
      occupationId: 1,
      pan: this.minorForm.value.pan,
      residentFlag: parseInt(this.taxStatusType),
      // taxStatusId: taxStatusId,
      relationshipId: this.minorForm.controls.relationType.value,
      familyMemberType: parseInt(this.categoryType),
      isKycCompliant: 1,
      aadhaarNumber: null,
      mobileList,
      bio: null,
      remarks: null,
      emailList: [
        {
          email: this.minorForm.value.gEmail,
          verificationStatus: 0
        }
      ],
      guardianData: gardianObj,
      invTypeCategory: 0,
      categoryTypeflag: null,
      anniversaryDate: null
    };
    obj.bio = this.userData.bio;
    obj.remarks = this.userData.remarks;
    obj.aadhaarNumber = this.userData.aadhaarNumber;
    obj.martialStatusId = this.userData.martialStatusId;
    obj.occupationId = this.userData.occupationId;
    obj.displayName = this.userData.displayName;
    obj.anniversaryDate = this.datePipe.transform(this.userData.anniversaryDate, 'dd/MM/yyyy');
    this.peopleService.editFamilyMemberDetails(obj).subscribe(
      data => {
        console.log(data);
        this.savedData.emit(data);
      })
  }
}
