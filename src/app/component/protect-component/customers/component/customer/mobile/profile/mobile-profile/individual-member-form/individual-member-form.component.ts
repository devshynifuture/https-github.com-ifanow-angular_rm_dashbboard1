import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { relationListFilterOnID } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-basic-details/relationypeMethods';

@Component({
  selector: 'app-individual-member-form',
  templateUrl: './individual-member-form.component.html',
  styleUrls: ['./individual-member-form.component.scss']
})
export class IndividualMemberFormComponent implements OnInit {
  relationList: { name: string; value: number; }[];
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private peopleService: PeopleService,
    private eventService: EventService,
    private utilService: UtilService
  ) { }
  @Output() savedData = new EventEmitter();
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
      this.relationList = relationListFilterOnID(data)
    }
    else {
      this.relationshipTypeMethod(data.genderId, data.age)
    }
    this.createIndividualForm(data);
  }
  individualForm: FormGroup;
  validatorType = ValidatorType;
  userData: any;
  @Input() categoryType;
  @Input() taxStatusType;

  ngOnInit() {
  }
  createIndividualForm(data) {
    (data == undefined) ? data = {} : '';
    this.individualForm = this.fb.group({
      fullName: [data.name, [Validators.required]],
      email: [(data.emailList && data.emailList.length > 0) ? data.emailList[0].email : '', [Validators.pattern(this.validatorType.EMAIL)]],
      pan: [data.pan, [Validators.pattern(this.validatorType.PAN)]],
      dobAsPerRecord: [(data.dateOfBirth == null) ? '' : new Date(data.dateOfBirth)],
      gender: [(data.genderId) ? String(data.genderId) : '1'],
      relationType: [(data.relationshipId != 0) ? data.relationshipId : '']
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

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }
  editFamilyMember() {
    const obj = {
      adminAdvisorId: AuthService.getAdminId(),
      advisorId: AuthService.getClientData().advisorId,
      familyMemberId: this.userData.familyMemberId,
      clientId: this.userData.clientId,
      name: this.individualForm.controls.fullName.value,
      displayName: null,
      dateOfBirth: this.datePipe.transform(this.individualForm.controls.dobAsPerRecord.value, 'dd/MM/yyyy'),
      martialStatusId: null,
      genderId: this.individualForm.controls.gender.value,
      occupationId: 1,
      pan: this.individualForm.controls.pan.value,
      residentFlag: this.taxStatusType,
      relationshipId: this.individualForm.controls.relationType.value,
      familyMemberType: this.categoryType,
      isKycCompliant: 1,
      aadhaarNumber: null,
      // mobileList,
      bio: null,
      remarks: null,
      emailList: [
        {
          email: this.individualForm.controls.email.value,
          verificationStatus: 0
        }
      ],
      // guardianData: gardianObj,
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
      },
      err => { this.eventService.openSnackBar(err, 'Dismiss'); });
  }
}
