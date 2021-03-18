import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import * as moment from 'moment';
import { MergeClientFamilyMemberComponent } from '../merge-client-family-member/merge-client-family-member.component';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { element } from 'protractor';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {
  @Input() data;
  dataSource;
  validatorType = ValidatorType;
  familyMemberList = {
    firstRow: [],
    secondRow: [
      { name: 'Father', imgUrl: '/assets/images/svg/father-profile.svg', selected: false, relationshipTypeId: 6, genderId: 1 },
      { name: 'Mother', genderId: 2, imgUrl: '/assets/images/svg/mother-profile.svg', selected: false, relationshipTypeId: 7 }
    ],
    thirdRow: [
      {
        name: 'Son', imgUrl: '/assets/images/svg/son-profile.svg', selected: false, genderId: 1, count: 1, relationshipTypeId: 4
      },
      { name: 'Daughter', genderId: 2, imgUrl: '/assets/images/svg/daughter-profile.svg', selected: false, count: 1, relationshipTypeId: 5 },
      { name: 'Others', genderId: 1, imgUrl: '/assets/images/svg/others.svg', selected: false, count: 1, relationshipTypeId: 10 }
    ]
  };

  displayedColumns: string[] = ['details', 'status', 'pan', 'relation', 'gender', 'add', 'remove'];
  familyMemberNameList = [];
  typeOfFamilyMemberAdd;
  selectedCount = 0;
  step = 1;
  clientData: any;
  relationList: any;
  delayTime = 0.1;

  constructor(private datePipe: DatePipe, private subInjectService: SubscriptionInject,
    private fb: FormBuilder, private eventService: EventService,
    private peopleService: PeopleService, private enumDataService: EnumDataService) {
  }

  createFamily: any;
  maxDateForAdultDob = moment().subtract(18, 'years');

  get getFamilyForm() {
    return this.createFamily.controls;
  }

  advisorId: any;

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

  get getFamilyListList() {
    return this.getFamilyForm.familyMemberList as FormArray;
  }

  ngOnInit() {
    this.createFamily = this.fb.group({
      familyMemberList: new FormArray([])
    });
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getUserInfo();
    // if ((this.data.client.martialStatusId == 1 || this.data.client.martialStatusId == 0) && this.data.client.clientType == 1) {
    if (this.data && this.data.client && this.data.client.duplicateFlag == false) {
      const genderId = this.data.client.genderId;
      if (genderId == 2) {
        this.familyMemberList.firstRow.push({
          name: 'Husband',
          imgUrl: '/assets/images/svg/man-profile.svg',
          selected: false,
          relationshipTypeId: 2, genderId: 1
        });
      } else {
        this.familyMemberList.firstRow.push({
          name: 'Wife',
          imgUrl: '/assets/images/svg/wife-profile.svg',
          selected: false,
          relationshipTypeId: 3, genderId: 2
        }
        );
      }
    }
    //   }
    //   else {
    //     this.familyMemberList.firstRow = [];
    //     this.familyMemberList.thirdRow = [{ name: 'Others', genderId: 1, imgUrl: '/assets/images/svg/others.svg', selected: false, count: 1, relationshipTypeId: 10 }]
    //   }
    // }
  }

  addFamilyType(value) {
    this.typeOfFamilyMemberAdd = value;
    if (value == '2') {

      this.openMergeClient();
    }
  }

  hufDateChangeMethod(event, index) {
    if (event.value == 18) {
      this.getFamilyListList.controls[index].get('date').setValue(new Date("0001-01-01"));
    } else {
      this.getFamilyListList.controls[index].get('date').setValue("")
    }
  }

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  close(data) {
    this.subInjectService.changeNewRightSliderState((data == 'close') ? { state: 'close' } : { state: 'close', refreshRequired: true });
  }

  next() {
    this.step++;
  }

  saveFamilyMembers() {
    if (this.createFamily.invalid) {
      this.createFamily.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      const arrayObj = [];
      this.getFamilyListList.controls.forEach(element => {
        let ageData = this.calculateAge(element.get('date').value._d);
        arrayObj.push({
          advisorId: this.advisorId,
          isKycCompliant: 0,
          taxStatusId: 1,
          residentFlag: element.get('resident').value,
          displayName: element.get('name').value,
          familyMemberType: ((element.get('relationTypeId').value == 8 || element.get('relationTypeId').value == 9 || element.get('relationTypeId').value == 15 || element.get('relationTypeId').value == 16 || element.get('relationTypeId').value == 4 || element.get('relationTypeId').value == 5) && ageData.age < 18) ? 2 : (element.get('relationTypeId').value == 17) ? 4 : (element.get('relationTypeId').value == 18 || element.get('relationTypeId').value == 19 || element.get('relationTypeId').value == 23 || element.get('relationTypeId').value == 24 || element.get('relationTypeId').value == 25) ? 3 : 1,// Minor : Major
          clientId: AuthService.getClientData().clientId,
          genderId: element.get('genderId').value,
          dateOfBirth: this.datePipe.transform(element.get('date').value._d, 'dd/MM/yyyy'),
          relationshipId: element.get('relationTypeId').value,
          name: element.get('name').value,
          companyStatus: element.get('relationTypeId').value == 18 ? 7 : element.get('relationTypeId').value == 19 ? 1 : 0
        });
      });

      this.peopleService.addMultipleFamilyMembers(arrayObj).subscribe(
        data => {
          console.log(data),
            this.close(data);
          this.barButtonOptions.active = false;
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  calculateAge(date) {
    const today = new Date();
    const birthDate = date
      ? new Date(date)
      : new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    date.age = age;
    return date;
  }

  selectFamilyMembers(selectedFamilyMember) {
    if (selectedFamilyMember.selected) {
      selectedFamilyMember.selected = false;
      this.selectedCount--;
    } else {
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

  previous() {
    this.step--;
  }

  createFamilyMember() {
    if (this.selectedCount == 0) {
      this.eventService.openSnackBar('Please select member', 'Dismiss');
      return;
    }
    // if (this.data.client.clientType == 1) {
    this.relationList = [
      { name: 'Brother', id: 8 },
      { name: 'Sister', id: 9 },
      { name: 'Daughter_In_Law', id: 11 },
      { name: 'Sister_In_Law', id: 12 },
      // ];
      // }
      // if (this.data.client.clientType == 2) {
      // this.relationList = [
      { name: 'Niece', id: 15 },
      { name: 'Nephew', id: 16 },
      // ]
      // }
      // if (this.data.client.clientType == 3) {
      // this.relationList = [
      { name: 'HUF', id: 18 },
      { name: 'Private Limited', id: 19 },
      // ]
      // }
      // if (this.data.client.clientType == 4) {
      // this.relationList = [
      { name: 'Sole proprietorship', id: 17 },
      // ]
      // }
    ]
    this.familyMemberList.firstRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(
          this.fb.group({
            name: [, [Validators.required]],
            date: [, [Validators.required]],
            relationTypeId: [element.relationshipTypeId, [Validators.required]],
            genderId: [element.genderId],
            resident: [1, [Validators.required]],
            maxDateValue: [this.maxDateForAdultDob]
          }));
        this.familyMemberNameList.push({ name: element.name, value: element.relationshipTypeId });
      }
    });
    this.familyMemberList.secondRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]],
          genderId: [element.genderId],
          resident: [1, [Validators.required]],
          relationTypeId: [element.relationshipTypeId, [Validators.required]],
          maxDateValue: [this.maxDateForAdultDob]
        }));
        this.familyMemberNameList.push({ name: element.name, value: element.relationshipTypeId });
      }
    });
    this.familyMemberList.thirdRow.forEach(element => {
      while (element.selected && element.count > 0) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]],
          genderId: [element.genderId],
          resident: [1, [Validators.required]],
          relationTypeId: [(element.relationshipTypeId == 10) ? '' : element.relationshipTypeId, [Validators.required]],
          maxDateValue: [new Date()]
        }));
        this.familyMemberNameList.push({ name: element.name, value: element.relationshipTypeId });
        element.count--;
      }

    });
    this.step++;
  }

  openMergeClient() {
    const data = {
      flag: 'Add member', clientData: this.data,
      advisorId: this.advisorId
    };

    const fragmentData = {
      flag: 'MergeClient',
      data,
      id: 1,
      state: 'open50',
      componentName: MergeClientFamilyMemberComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

}
