import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { element } from 'protractor';
import { EventService } from 'src/app/Data-service/event.service';

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
  createFamily: any;
  familyMemberList = {
    'firstRow': [
      { name: 'You', imgUrl: '/assets/images/svg/man-profile.svg', selected: false },
      { name: 'Wife', imgUrl: '/assets/images/svg/wife-profile.svg', selected: false }
    ],
    'secondRow': [
      { name: 'Father', imgUrl: '/assets/images/svg/father-profile.svg', selected: false },
      { name: 'Mother', imgUrl: '/assets/images/svg/mother-profile.svg', selected: false }
    ],
    'thirdRow': [
      { name: 'Son', imgUrl: '/assets/images/svg/son-profile.svg', selected: false },
      { name: 'Daughter', imgUrl: '/assets/images/svg/daughter-profile.svg', selected: false, count: 0 },
      { name: 'Others', imgUrl: '/assets/images/svg/man-profile.svg', selected: false, count: 0 }
    ]
  }
  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder, private eventService: EventService) { }

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
      this.close();
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
    (selectedMember.count > 0) ? selectedMember.count-- : '';
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
            date: [, [Validators.required]]
          }))
        this.familyMemberNameList.push(element.name)
      }
    })
    this.familyMemberList.secondRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]]
        }))
        this.familyMemberNameList.push(element.name)
      }
    })
    this.familyMemberList.thirdRow.forEach(element => {
      if (element.selected) {
        this.getFamilyListList.push(this.fb.group({
          name: [, [Validators.required]],
          date: [, [Validators.required]]
        }))
        this.familyMemberNameList.push(element.name)
        element.count--;
      }
      // else {
      //   this.getFamilyListList.push(this.fb.group({
      //     name: [, [Validators.required]],
      //     date: [, [Validators.required]]
      //   }))
      // }
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