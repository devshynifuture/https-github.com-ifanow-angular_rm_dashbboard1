import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';

@Component({
  selector: 'app-history-risk-profile',
  templateUrl: './history-risk-profile.component.html',
  styleUrls: ['./history-risk-profile.component.scss']
})
export class HistoryRiskProfileComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  advisorId: any;
  clientId: any;
  dataSourceHistory: any;
  storeResult: any;

  constructor(private subInjectService: SubscriptionInject, public planService: PlanService,) { }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.riskHistory()
  }
  riskHistory(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    this.planService.getRiskHistory(obj).subscribe(
      data => this.getRiskHistoryRes(data), error => {
      });
  }
  viewResult(obj){
    const data = {
      clientRiskProfileId : obj.id
    }
    this.planService.getResultRisk(data).subscribe(
      data => this.getResultRiskRes(data), error => {
      });
  }
  getResultRiskRes(data){
    console.log(data)
    this.storeResult = data
    this.Close(data)
  }
  getRiskHistoryRes(data){
    console.log('getRiskHistoryRes',data)
    this.dataSourceHistory = data.clientRiskProfileList
  }
  open(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data,
      id: 1,
      state: 'open30'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }

      }
    );
  }
  Close(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close',data });
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '2019-09-20', name: 'Aggressive', weight: 90, symbol: 'H'},
  {position: '2019-09-21', name: 'Moderate', weight: 40, symbol: 'He'},
  {position: '2019-09-22', name: 'Moderately conservative', weight: 60, symbol: 'Li'}
];