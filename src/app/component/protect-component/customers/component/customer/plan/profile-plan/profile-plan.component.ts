import { AddProfilePlanComponent } from './add-profile-plan/add-profile-plan.component';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-profile-plan',
  templateUrl: './profile-plan.component.html',
  styleUrls: ['./profile-plan.component.scss']
})
export class ProfilePlanComponent implements OnInit {

  viewMode;
  constructor(private subInjectService: SubscriptionInject,
    public enumDataService: EnumDataService,
    public roleService: RoleService) { }
  isLoading = false;
  ngOnInit() {
    if (this.roleService.planPermission.subModule.profile.subModule.income.enabled) {
      this.viewMode = "tab1";
      return;
    }
    if (this.roleService.planPermission.subModule.profile.subModule.expenses.enabled) {
      this.viewMode = "tab2";
      return;
    }
    if (this.roleService.planPermission.subModule.profile.subModule.financialPlan.enabled) {
      this.viewMode = "tab6";
      return;
    }
    console.log(this.viewMode);
  }

  open(flagValue) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: null,
      state: 'open',
      componentName: AddProfilePlanComponent
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

  panelOpenState = false;


}
