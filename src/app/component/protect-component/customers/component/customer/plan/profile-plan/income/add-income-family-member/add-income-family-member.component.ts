import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import * as _ from 'lodash';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-income-family-member',
  templateUrl: './add-income-family-member.component.html',
  styleUrls: ['./add-income-family-member.component.scss']
})
export class AddIncomeFamilyMemberComponent implements OnInit {
  advisorId: any;
  clientId: any;
  familyMemberList: any;
  setFlag = "addIncome"
  @Output() selectedFamilyMembersData = new EventEmitter();
  selectedFamilyMembers = [];
  ownerCount=0;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService,private eventService:EventService) { }

  ngOnInit() {
  }
  @Input() set familyData(data) {
    if (data == null) {
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId();
      this.getFamilyMemberList()
    }
    else {
      (data.setFlag == "addIncome") ? data.flag == "editIncome" : console.log("dsdas");
      data.data.forEach(element => {
        if(element.selected)
        {
          this.ownerCount++;
        }
      });
      this.setFlag = data.flag
      this.familyMemberList = data.data
    }
  }
  getFamilyMemberList() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    }
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data.familyMembersList)
    this.familyMemberList.forEach(element => {
      element.selected = false
    });
    console.log(this.familyMemberList)
  }
  nextStep() {
    if(this.ownerCount==0)
    {
      this.eventService.openSnackBar("Please select earning member","dismiss");
      return;
    }
    const obj =
    {
      data: this.familyMemberList,
      stpeNo: 2,
      flag: this.setFlag
    }
    this.selectedFamilyMembersData.emit(obj)
  }
  select(familyMember) {
    if (familyMember.selected) {
      familyMember.selected = false;
      this.ownerCount--;
    }
    else {
      familyMember.selected = true;
      this.ownerCount++;
    }
  }
  close() {

    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
