import {Component, OnInit} from '@angular/core';
import {RoutingState} from "../../../../../../services/routing-state.service";

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {

  constructor(private routingStateService: RoutingState) {
  }

  ngOnInit() {
    console.log('customer activity');
  }

  goToAdvisorHome() {
    this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
  }
}
