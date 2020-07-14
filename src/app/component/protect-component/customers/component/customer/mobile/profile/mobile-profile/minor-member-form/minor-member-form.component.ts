import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-minor-member-form',
  templateUrl: './minor-member-form.component.html',
  styleUrls: ['./minor-member-form.component.scss']
})
export class MinorMemberFormComponent implements OnInit {
  userData: any;
  minorForm: FormGroup;
  validatorType = ValidatorType;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }
  @Input() categoryType;
  @Input() taxStatusType;
  @Input() set formData(data) {
    this.userData = data;
    this.createMinorForm(data)
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
}
