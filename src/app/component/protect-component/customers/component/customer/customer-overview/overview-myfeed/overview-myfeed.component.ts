import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Chart } from 'angular-highcharts';
import { AppConstants } from 'src/app/services/app-constants';
import { RoutingState } from 'src/app/services/routing-state.service';
import { slideInAnimation } from 'src/app/animation/router.animation';

@Component({
  selector: 'app-overview-myfeed',
  templateUrl: './overview-myfeed.component.html',
  styleUrls: ['./overview-myfeed.component.scss'],
  animations: [
    slideInAnimation,
  ]
})
export class OverviewMyfeedComponent implements OnInit {
  constructor(
    public routingStateService: RoutingState
  ) {}


  ngOnInit() {
  }
}
