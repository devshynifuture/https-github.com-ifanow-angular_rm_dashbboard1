import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-add-income-family-member',
  templateUrl: './add-income-family-member.component.html',
  styleUrls: ['./add-income-family-member.component.scss']
})
export class AddIncomeFamilyMemberComponent implements OnInit {
  advisorId: any;
  clientId: any;
  
  constructor(private subInjectService: SubscriptionInject,private custumService: CustomerService,private utils:UtilService) { }

  ngOnInit() {
    this.advisorId=AuthService.getAdvisorId();
    this.clientId=AuthService.getClientId();
    this.getFamilyMemberList()
  }
  getFamilyMemberList()
  {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    }
    this.custumService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data){
    this.utils.calculateAgeFromCurrentDate(data.familyMembersList)
  } 
  close() {
  
    this.subInjectService.changeNewRightSliderState({ state: 'close'});
  }

}
