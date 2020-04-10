import { Component, OnInit } from '@angular/core';
import { RoutingState } from "../../../../../../services/routing-state.service";
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {
  clientData: any;

  constructor(private routingStateService: RoutingState) {
  }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    console.log('customer activity');
  }

  goToAdvisorHome() {
    this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
  }
}
