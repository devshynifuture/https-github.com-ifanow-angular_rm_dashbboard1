import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../../auth-service/authService';
import {Router} from '@angular/router';
import {EventService} from 'src/app/Data-service/event.service';
import {RoutingState} from 'src/app/services/routing-state.service';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.scss'],

})
export class CustomerOverviewComponent implements OnInit {
  showRouter: boolean = false;
  selected: number;
  clientData: any;
  loading: boolean;
  name: string;

  constructor(public authService: AuthService, private router: Router,
              private eventService: EventService, public routingStateService: RoutingState) {

  }

  _value: any;

  set value(value: number) {
    this._value = value;
  }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    if (this.clientData.name && this.clientData.name == '') {
      this.clientData.name = this.clientData.displayName;
      this.name = this.clientData.displayName;

    } else {
      this.name = this.clientData.name;
    }
    this.name = this.clientData.displayName;

    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
    console.log('customer overview  clientdata:', this.clientData);
    console.log('customer overview  name:', this.name);

    this.showRouter = true;
    this.selected = 1;
    this._value = 1;
    this.loading = false;
    const routeName = this.router.url.split('/')[3];
    if (routeName == 'overview') {
      this.value = 1;
    } else if (routeName == 'myFeed') {
      this.value = 2;
    } else if (routeName == 'profile') {
      this.value = 3;
    } else if (routeName == 'documents') {
      this.value = 4;
    } else if (routeName == 'emails') {
      this.value = 5;
    } else if (routeName == 'subscription') {
      this.value = 5;
    } else if (routeName == 'settings') {
      this.value = 5;
    }
    // this.clientData = JSON.parse(sessionStorage.getItem('clientData'));
  }

  getTabChangeData(data) {
    setTimeout(() => {
      this._value = data;
      this.loading = false;
    }, 300);
  }

  goToAdvisorHome() {
    this.showRouter = false;
    setTimeout(() => {
      this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
    }, 200);
  }

  logout() {
    if (!this.authService.isAdvisor()) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
