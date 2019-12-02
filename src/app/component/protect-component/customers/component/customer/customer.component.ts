import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../../../auth-service/authService";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  selected: number;
  clientId;
  value: number;
  overview = false;
  plans = false;
  activity = false;
  accounts = false;
  transact = false;
  currentUrl: string;


  constructor(private router: Router) {
    console.log(router.getCurrentNavigation().extras.state);

  }

  status: boolean = false;


  ngOnInit() {

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
