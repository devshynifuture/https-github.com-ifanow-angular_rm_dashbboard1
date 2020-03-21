import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {
  displayedColumns: string[] = ['details', 'status', 'pan', 'relation', 'gender', 'add', 'remove'];
  dataSource = ELEMENT_DATA;
  typeOfFamilyMemberAdd;
  step = 1;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  addFamilyType(value) {
    this.typeOfFamilyMemberAdd = value;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  next() {
    this.step++;
  }
  save() {
    this.close();
  }
  selectFamilyMembers(selectedFamilyMember) {
    (selectedFamilyMember.selected) ? selectedFamilyMember.selected = false : selectedFamilyMember.selected = true;
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