import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-profile-plan',
  templateUrl: './add-profile-plan.component.html',
  styleUrls: ['./add-profile-plan.component.scss']
})
export class AddProfilePlanComponent implements OnInit {
  _inputData: any;
  advisorId: any;
  clientId: any;
  familyMemberList: any;
  checkFamList = false;
  ownerCount = 0;
  removeCount=0;
  addCount=0;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  close() {
    let data = this._inputData;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }
  getFamilyMemberList() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    (data.familyMembersList.length == 0) ? this.checkFamList = false : this.checkFamList = true;
    this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data.familyMembersList);
    this.familyMemberList.forEach(element => {
      element.selected = false;
    });
    console.log(this.familyMemberList);
    this.getDataList()
  }
  addRemove(key) {
    if (key == 'add') {
      this.removeCount = ++this.removeCount;
    } else {
      this.removeCount = --this.removeCount;
    }
  }
  addRemoveOthers(key){
    if (key == 'add') {
      this.addCount = ++this.addCount;
    } else {
      this.addCount = --this.addCount;
    }
  }
  getDataList() {
    if (this.familyMemberList.length == 0) {
      return;
    }
    if (this.ownerCount == 0) {
      this.eventService.openSnackBar('Please select earning member', 'Dismiss');
      return;
    }
    const obj = {
      data: this.familyMemberList,
      stpeNo: 2,
      flag: 'addIncome'
    };
  }
  nextStep() {
    this.getFamilyMemberList();
  }
  select(familyMember) {
    if (familyMember.selected) {
      familyMember.selected = false;
      const obj = []
      familyMember['incomeTypeList'] = obj
      this.ownerCount--;
    } else {
      familyMember.selected = true;
      const obj = [
        { name: "Salaried", checked: false, incomeTypeList: 1 },
        { name: "Business", checked: false, incomeTypeList: 2 },
        { name: 'Profession', checked: false, incomeTypeList: 3 },
        { name: "Rental", checked: false, incomeTypeList: 4 },
        { name: "Others", checked: false, incomeTypeList: 5 }
      ]
      familyMember['incomeTypeList'] = obj
      this.ownerCount++;
    }
  }
}
