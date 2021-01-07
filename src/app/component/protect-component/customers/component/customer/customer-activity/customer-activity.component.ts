import { Component, OnInit } from '@angular/core';
import { RoutingState } from '../../../../../../services/routing-state.service';
import { AuthService } from 'src/app/auth-service/authService';
import { RoleService } from 'src/app/auth-service/role.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {
  clientData: any;

  constructor(private routingStateService: RoutingState,
    private roleService: RoleService,
    private enumDataService: EnumDataService,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    console.log('customer activity');
  }

  goToAdvisorHome() {
    localStorage.removeItem('clientData');
    sessionStorage.removeItem('clientData');
    this.routingStateService.goToSpecificRoute('/admin/dashboard');
  }
}
