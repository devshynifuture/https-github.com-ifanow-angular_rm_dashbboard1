import {Component, OnInit} from '@angular/core';
import {RoutingState} from '../../../../../../services/routing-state.service';
import {AuthService} from '../../../../../../auth-service/authService';
import {EventService} from '../../../../../../Data-service/event.service';
import {EnumDataService} from '../../../../../../services/enum-data.service';
import {Router} from '@angular/router';
import {NgZone} from '@angular/core/src/metadata/*';

@Component({
  selector: 'app-customer-transact',
  templateUrl: './customer-transact.component.html',
  styleUrls: ['./customer-transact.component.scss']
})
export class CustomerTransactComponent implements OnInit {
  clientData: any;
  loading: boolean;
  showRouter = false;
  selected;

  constructor(private eventService: EventService, private enumDataService: EnumDataService, private router: Router, private ngZone: NgZone,
              public routingStateService: RoutingState, public authService: AuthService) {
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }

  _value: number;

  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }

  getTabChangeData(data) {
    setTimeout(() => {
      this._value = data;
      this.loading = false;
    }, 300);
  }

  ngOnInit() {
    this.showRouter = true;
    this.selected = 1;
    this._value = 1;
    this.loading = false;
    this.clientData = AuthService.getClientData();
    this.enumDataService.getAccountList();
    console.log('this is child url now->>>>>', this.router.url.split('/')[3]);
  }

  goToAdvisorHome() {
    this.showRouter = false;
    setTimeout(() => {
      this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
    }, 200);
  }

}
