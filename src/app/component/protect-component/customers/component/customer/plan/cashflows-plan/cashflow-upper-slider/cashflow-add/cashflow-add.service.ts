import { AuthService } from './../../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../../cashflows-plan.service';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CashflowAddService implements OnInit {

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  familyMemberList: {}[];
  ownerName: any;
  familyMemberId: any;

  constructor(private cashflowService: CashFlowsPlanService) { }

  ngOnInit() {
    this.getFamilyMemberData();
  }

  formValidations(whichTable) {
    // console.log("this is formGroup::::::::::", whichTable);
    for (let key in whichTable.controls) {
      if (whichTable.get(key).invalid) {
        whichTable.get(key).markAsTouched();
        return false;
      }
    }
    return (whichTable.valid) ? true : false;
  }

  getFamilyMemberData() {
    return this.cashflowService.getFamilyMemberData({ advisorId: this.advisorId, clientId: this.clientId });
  }

  display(value) {
    console.log('value selected:::::::::::::', value);
    this.ownerName = value;
    this.familyMemberId = value.id;
  }

  familyMemberListAssign(value) {
    console.log(value);
    this.familyMemberList = Object.assign([], value.familyMembersList);
  }


}
