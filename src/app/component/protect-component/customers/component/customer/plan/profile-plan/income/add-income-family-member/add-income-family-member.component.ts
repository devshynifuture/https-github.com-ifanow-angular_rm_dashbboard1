import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-add-income-family-member',
  templateUrl: './add-income-family-member.component.html',
  styleUrls: ['./add-income-family-member.component.scss']
})
export class AddIncomeFamilyMemberComponent implements OnInit {
  advisorId: any;
  clientId: any;
  familyMemberList: any;
  setFlag = 'addIncome';
  @Output() selectedFamilyMembersData = new EventEmitter();
  selectedFamilyMembers = [];
  ownerCount = 0;
  checkFamList: boolean;

  constructor(private peopleService :PeopleService,private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) {
  }

  ngOnInit() {
  }

  @Input() set familyData(data) {
    if (data == null) {
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId();
      this.getFamilyMemberList();
    } else {
      (data.flag == 'addIncome') ? data.flag == 'editIncome' : console.log('dsdas');
      data.data.forEach(element => {
        if (element.selected) {
          this.ownerCount++;
        }
      });
      this.setFlag = data.flag;
      this.familyMemberList = data.data;
      (this.familyMemberList == 0) ? this.checkFamList = false : this.checkFamList = true;

    }
  }

  getFamilyMemberList() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    // this.custumService.getListOfFamilyByClient(obj).subscribe(
      this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    // (data.familyMembersList.length == 0) ? this.checkFamList = false : this.checkFamList = true;
    // this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data.familyMembersList);
    (data.length == 0) ? this.checkFamList = false : this.checkFamList = true;
    this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data);
    this.familyMemberList.forEach(element => {
      element.selected = false;
    });
    console.log(this.familyMemberList);
  }

  nextStep() {
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
      flag: this.setFlag
    };
    this.selectedFamilyMembersData.emit(obj);
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

  close() {

    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
