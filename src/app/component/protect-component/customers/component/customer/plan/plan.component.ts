import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RoutingState } from '../../../../../../services/routing-state.service';
import { AuthService } from 'src/app/auth-service/authService';
import { RoleService } from 'src/app/auth-service/role.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { CustomerOverviewService } from '../customer-overview/customer-overview.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  _value: number;
  clientData: any;

  set value(value: number) {
    this._value = value;
  }

  constructor(private router: Router, private routingStateService: RoutingState,
    public authService: AuthService, public roleService: RoleService,
    public enumDataService: EnumDataService,
    private customerOverview: CustomerOverviewService
  ) {
  }

  selected;

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    this.selected = 0;
    if (this.router.url.split('/')[3] == 'summary') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] == 'profile') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] == 'insurance') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] == 'goals') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] == 'taxes') {
      this._value = 5;
    } else if (this.router.url.split('/')[3] == 'cash-flow') {
      this._value = 6;
    } else if (this.router.url.split('/')[3] == 'investments') {
      this._value = 7;
    } else if (this.router.url.split('/')[3] == 'scenarios') {
      this._value = 8;
    }
  }

  goToAdvisorHome() {
    this.roleService.getClientRoleDetails(AuthService.getUserInfo().roleId, (rolesData) => {
      this.roleService.constructAdminDataSource(rolesData);
      localStorage.removeItem('clientData');
      sessionStorage.removeItem('clientData');
      this.routingStateService.goToSpecificRoute('/admin/dashboard');
      this.customerOverview.clearServiceData();
    });
  }
}
