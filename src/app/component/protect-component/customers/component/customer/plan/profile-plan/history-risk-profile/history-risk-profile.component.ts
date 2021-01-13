import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { RoleService } from 'src/app/auth-service/role.service';

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
  dataSourceHistory: Array<any> = [{}, {}, {}];
  storeResult: any;
  isLoading = false;
  riskProfileCapability: any = {};

  constructor(private subInjectService: SubscriptionInject, public planService: PlanService, public roleService: RoleService) { }
  ngOnInit() {
    this.riskProfileCapability = this.roleService.overviewPermission.subModules.profile.subModule.riskProfile.capabilityList
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.riskHistory();
  }
  riskHistory() {
    this.isLoading = true
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    this.planService.getRiskHistory(obj).subscribe(
      data => this.getRiskHistoryRes(data), error => {
      });
  }
  viewResult(obj) {
    if (!this.riskProfileCapability.View) {
      return
    }
    const data = {
      clientRiskProfileId: obj.id
    }
    this.planService.getResultRisk(data).subscribe(
      data => this.getResultRiskRes(data), error => {
      });
  }
  getResultRiskRes(data) {
    this.isLoading = false
    this.storeResult = data;
    this.Close(true, data);
  }
  getRiskHistoryRes(data) {
    this.isLoading = false
    console.log('getRiskHistoryRes', data);
    this.dataSourceHistory = data.clientRiskProfileList;
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
  Close(flag, data = {}) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag, data: data });
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '2019-09-20', name: 'Aggressive', weight: 90, symbol: 'H' },
  { position: '2019-09-21', name: 'Moderate', weight: 40, symbol: 'He' },
  { position: '2019-09-22', name: 'Moderately conservative', weight: 60, symbol: 'Li' }
];