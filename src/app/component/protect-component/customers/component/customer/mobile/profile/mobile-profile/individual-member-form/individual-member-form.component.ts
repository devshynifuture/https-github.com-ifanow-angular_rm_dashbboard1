import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-individual-member-form',
  templateUrl: './individual-member-form.component.html',
  styleUrls: ['./individual-member-form.component.scss']
})
export class IndividualMemberFormComponent implements OnInit {
  individualForm: FormGroup;
  validatorType = ValidatorType
  userData: any;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private peopleService: PeopleService,
    private eventService: EventService
  ) { }

  ngOnInit() {
  }
  @Input() categoryType;
  @Input() taxStatusType;
  @Input() set formData(data) {
    this.userData = data;
    this.createIndividualForm(data);
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

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
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
      },
      err => { this.eventService.openSnackBar(err, "Dismiss") })
  }
}
