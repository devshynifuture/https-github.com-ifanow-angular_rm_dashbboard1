import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../../../../auth-service/authService";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  selected: number;
  clientId;
  value = 1;
  overview = false;
  plans = false;
  activity = false;
  accounts = false;
  transact = false;

  constructor(private router: Router) {
    console.log(router.getCurrentNavigation().extras.state);

  }

  status: boolean = false;


  ngOnInit() {
    this.selected = 1;
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
