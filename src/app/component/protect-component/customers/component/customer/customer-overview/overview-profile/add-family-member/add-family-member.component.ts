import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import * as moment from 'moment';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {
  displayedColumns: string[] = ['details', 'status', 'pan', 'relation', 'gender', 'add', 'remove'];
  dataSource = ELEMENT_DATA;
  typeOfFamilyMemberAdd;
  selectedCount = 0;
  step = 1;
  validatorType = ValidatorType
  createFamily: any;
  maxDateForAdultDob = moment().subtract(18, 'years');
  familyMemberList = {
    'firstRow': [
      { name: 'Wife', imgUrl: '/assets/images/svg/wife-profile.svg', selected: false, relationshipTypeId: 2 }
    ],
    'secondRow': [
      { name: 'Father', imgUrl: '/assets/images/svg/father-profile.svg', selected: false, relationshipTypeId: 6 },
      { name: 'Mother', imgUrl: '/assets/images/svg/mother-profile.svg', selected: false, relationshipTypeId: 5 }
    ],
    'thirdRow': [
      { name: 'Son', imgUrl: '/assets/images/svg/son-profile.svg', selected: false, count: 1, relationshipTypeId: 3 },
      { name: 'Daughter', imgUrl: '/assets/images/svg/daughter-profile.svg', selected: false, count: 1, relationshipTypeId: 4 },
      { name: 'Others', imgUrl: '/assets/images/svg/man-profile.svg', selected: false, count: 1, relationshipTypeId: 7 }
    ]
  }
  constructor(private datePipe: DatePipe, private subInjectService: SubscriptionInject, private fb: FormBuilder, private eventService: EventService, private peopleService: PeopleService) { }
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
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
  ngOnInit() {
    this.createFamily = this.fb.group({
      familyMemberList: new FormArray([])
    })
  }
  get getFamilyForm() { return this.createFamily.controls; }
  get getFamilyListList() { return this.getFamilyForm.familyMemberList as FormArray; }
  addFamilyType(value) {
    this.typeOfFamilyMemberAdd = value;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  next() {
    this.step++;
  }
  saveFamilyMembers() {
    if (this.createFamily.invalid) {
      this.createFamily.markAllAsTouched();
    }
    else {
      this.barButtonOptions.active = true;
      let arrayObj = [];
      this.getFamilyListList.controls.forEach(element => {
        arrayObj.push({
          "isKycCompliant": 0,
          "taxStatusId": 0,
          "emailList": [
            {
              "verificationStatus": 0,
              "id": 0,
              "userType": 0,
              "isActive": 1,
              "userId": 0,
              "email": null
            }
          ],
          "displayName": element.get('name').value,
          "guardianId": 0,
          "martialStatusId": 0,
          "isActive": 0,
          "addressModelList": null,
          "occupationId": 0,
          "id": 0,
          "dematList": null,
          "pan": null,
          "familyMemberType": (element.get('relationTypeId').value == 3 || element.get('relationTypeId').value == 4) ? 2 : 1,
          "clientId": AuthService.getClientData().clientId,
          "genderId": 0,
          "dateOfBirth": this.datePipe.transform(element.get('date').value._d, 'dd/MM/yyyy'),
          "bankDetailList": null,
          "relationshipId": element.get('relationTypeId').value,
          "mobileList": [
            {
              "verificationStatus": 0,
              "id": 0,
              "userType": 0,
              "mobileNo": 0,
              "isActive": 1,
              "userId": 0
            }
          ],
          "anniversaryDate": null,
          "aadhaarNumber": null,
          "name": element.get('name').value,
          "bioRemarkId": 0,
          "bioRemark": {
            "bio": null,
            "remark": null,
            "id": 0
          },
          "guardianData": {
            "mobileList": null,
            "aadhaarNumber": null,
            "anniversaryDate": null,
            "occupationId": 0,
            "emailList": null,
            "name": null,
            "genderId": 0,
            "martialStatusId": 0,
            "id": 0,
            "pan": null,
            "relationshipId": 0,
            "birthDate": null
          }
        })
      })

      this.peopleService.addMultipleFamilyMembers(arrayObj).subscribe(
        data => {
          console.log(data),
            this.close();
          this.barButtonOptions.active = false;
        },
        err => {
          this.eventService.openSnackBar(err, "Dismiss");
          this.barButtonOptions.active = false;
        }
      )
    }
  }
  selectFamilyMembers(selectedFamilyMember) {
    if (selectedFamilyMember.selected) {
      selectedFamilyMember.selected = false;
      this.selectedCount--;
    }
    else {
      selectedFamilyMember.selected = true;
      this.selectedCount++;
    }
  }
  remove(selectedMember) {
    (selectedMember.count > 1) ? selectedMember.count-- : '';
  }
  add(selectedMember) {
    selectedMember.count++;
  }
  selectFamilyMembersCount() {
    this.next();
  }
  familyMemberNameList = [];
  createFamilyMember() {
    if (this.selectedCount == 0) {
      this.eventService.openSnackBar("Please select member", "dismiss")
      return;
    }
    this.familyMemberList.firstRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(
          this.fb.group({
            name: [, [Validators.required]],
            date: [, [Validators.required]],
            relationTypeId: [element.relationshipTypeId],
            maxDateValue: [this.maxDateForAdultDob]
          }))
        this.familyMemberNameList.push(element.name)
      }
    })
    this.familyMemberList.secondRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]],
          relationTypeId: [element.relationshipTypeId],
          maxDateValue: [this.maxDateForAdultDob]
        }))
        this.familyMemberNameList.push(element.name)
      }
    })
    this.familyMemberList.thirdRow.forEach(element => {
      while (element.selected && element.count > 0) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]],
          relationTypeId: [element.relationshipTypeId],
          maxDateValue: [new Date()]
        }))
        this.familyMemberNameList.push(element.name)
        element.count--;
      }

    })
    this.step++;
  }
}

export interface PeriodicElement {
  details: string;
  status: string;
  pan: string;
  relation: string;
  gender: string;
  add: string;
  remove: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { details: 'Aditya Rahul Jain', status: 'Minor', pan: 'AATPH4939L', relation: 'Mother', gender: 'Female', add: 'ADDED', remove: '' },
  { details: 'Aditya Rahul Jain', status: 'Minor', pan: 'AATPH4939L', relation: 'Mother', gender: 'Female', add: 'ADDED', remove: '' },

];