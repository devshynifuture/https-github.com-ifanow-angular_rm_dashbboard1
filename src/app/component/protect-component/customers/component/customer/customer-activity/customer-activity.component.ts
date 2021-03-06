import { Component, OnInit } from '@angular/core';
import { RoutingState } from '../../../../../../services/routing-state.service';
import { AuthService } from 'src/app/auth-service/authService';
import { RoleService } from 'src/app/auth-service/role.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { CustomerOverviewService } from '../customer-overview/customer-overview.service';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {
  clientData: any;

  constructor(private routingStateService: RoutingState,
    public roleService: RoleService,
    public enumDataService: EnumDataService,
    public authService: AuthService,
    private customerOverview: CustomerOverviewService) {
  }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    console.log('customer activity');
  }

  goToAdvisorHome() {
    localStorage.removeItem('clientData');
    sessionStorage.removeItem('clientData');
    this.routingStateService.goToSpecificRoute('/admin/dashboard');
    this.customerOverview.clearServiceData();
  }
}
