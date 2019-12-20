import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../../../../../auth-service/authService";
import { DialogContainerComponent } from "../../../../../common/dialog-container/dialog-container.component";
import { EventService } from "../../../../../Data-service/event.service";
import { SubscriptionInject } from "../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { DynamicComponentService } from "../../../../../services/dynamic-component.service";
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from "../../../../../animation/animation";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
export class CustomerComponent extends DialogContainerComponent implements OnInit {
  selected: number;
  clientId;
  value: number;
  overview = false;
  plans = false;
  activity = false;
  accounts = false;
  transact = false;
  currentUrl: string;
  clientData: any;


  constructor(private router: Router, protected eventService: EventService, protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService, private route: ActivatedRoute) {
    super(eventService, subinject, dynamicComponentService);
    console.log(router.getCurrentNavigation().extras.state);

  }

  status: boolean = false;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clientData = params['clientData']
    });
    console.log("clientData", this.clientData)
    if (this.router.url.split('/')[2] === 'overview') {
      this.value = 1;
    } else if (this.router.url.split('/')[2] === 'account') {
      this.value = 2;
    } else if (this.router.url.split('/')[2] === 'plan') {
      this.value = 3;
    } else if (this.router.url.split('/')[2] === 'activity') {
      this.value = 4;
    } else if (this.router.url.split('/')[2] === 'transact') {
      this.value = 5;
    }

    this.selected = 2;
    const passedParameter = history.state;
    this.clientId = passedParameter ? passedParameter.id : undefined;
    console.log('passedParameter: ', passedParameter);
    console.log('session storage clientData', AuthService.getClientData());
    this.clientId = AuthService.getClientId();
  }

  clickEvent(value) {
    this.value = value;
  }

}
