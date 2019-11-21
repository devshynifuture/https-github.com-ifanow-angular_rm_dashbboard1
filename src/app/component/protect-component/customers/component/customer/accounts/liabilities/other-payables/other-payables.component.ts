import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-other-payables',
  templateUrl: './other-payables.component.html',
  styleUrls: ['./other-payables.component.scss']
})
export class OtherPayablesComponent implements OnInit {
  displayedColumns = ['no', 'name', 'dateOfReceived', 'creditorName', 'amountBorrowed', 'interest', 'dateOfRepayment', 'outstandingBalance', 'description','status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  dataSource: any;
  @Input() payableData;
  @Output() OtherDataChange = new EventEmitter();
  constructor(public custmService:CustomerService,public util:UtilService,public subInjectService:SubscriptionInject) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.dataSource=this.payableData;
  }
  getPayables(){
    let obj={
      'advisorId':this.advisorId,
      'clientId':2978
    }
    this.custmService.getOtherPayables(obj).subscribe(
      data => this.getOtherPayablesRes(data)
    );
  }
  getOtherPayablesRes(data){
    console.log(data);
    this.dataSource=data;
    this.OtherDataChange.emit(this.dataSource);

  }
  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data :data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.getPayables();
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement {
  no: string;
  name: string;
  dateOfReceived: string;
  creditorName: string;
  amountBorrowed: string;
  interest: string;
  dateOfRepayment: string;
  outstandingBalance: string;
  description: string;
  status: string;

}

