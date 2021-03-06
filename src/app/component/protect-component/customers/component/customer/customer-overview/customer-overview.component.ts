import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../../auth-service/authService';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';
import { RoutingState } from 'src/app/services/routing-state.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MfServiceService } from '../accounts/assets/mutual-fund/mf-service.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from './customer-overview.service';

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

  constructor(private MfServiceService: MfServiceService, public authService: AuthService, private router: Router,
    private eventService: EventService, public routingStateService: RoutingState,
    private peopleService: PeopleService, public subInjectService: SubscriptionInject,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    this.subInjectService.singleProfileData.subscribe(
      data => {
        if (typeof data === 'string') {
          this.clientData.displayName = data;
        }
      }
    )
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

    // this.eventService.tabChangeData.subscribe(
    //   data => this.getTabChangeData(data)
    // );
    console.log('customer overview  clientdata:', this.clientData);
    console.log('customer overview  name:', this.name);

    this.showRouter = true;
    this.selected = 1;
    // this._value = 1;
    this.loading = false;
    // const routeName = this.router.url.split('/')[3];
    // if (routeName == 'overview') {
    //   this.value = 1;
    // } else if (routeName == 'myFeed') {
    //   this.value = 2;
    // } else if (routeName == 'profile') {
    //   this.value = 3;
    // } else if (routeName == 'documents') {
    //   this.value = 4;
    // }
    if (this.router.url.includes('subscription')) {
      this._value = 5;
    }
    this.getClientData(this.clientData);
    // this.clientData = JSON.parse(sessionStorage.getItem('clientData'));
  }

  getClientData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        if (data == undefined) {
          return;
        } else {
          AuthService.setClientProfilePic(data.profilePicUrl)
          this.authService.setClientData(data)
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getTabChangeData(data) {
    setTimeout(() => {
      this._value = data;
      this.loading = false;
    }, 300);
  }

  goToAdvisorHome() {
    this.showRouter = false;
    this.customerOverview.clearServiceData();
    this.roleService.getClientRoleDetails(AuthService.getUserInfo().roleId, (rolesData) => {
      this.routingStateService.goToSpecificRoute('/admin/dashboard');
      // setTimeout(() => {
      localStorage.removeItem('clientData');
      sessionStorage.removeItem('clientData');
      setTimeout(() => {
        this.roleService.constructAdminDataSource(rolesData);
      }, 200);
    });
    this.MfServiceService.clearStorage();
  }

  goToValidSubscriptionPage() {
    let url;
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.subscriptions.enabled) {
      url = '/customer/detail/overview/subscription/subscriptions';
    }
    else if (this.roleService.overviewPermission.subModules.subscriptions.subModule.quotations.enabled) {
      url = '/customer/detail/overview/subscription/quotations';
    }
    else if (this.roleService.overviewPermission.subModules.subscriptions.subModule.invoices.enabled) {
      url = '/customer/detail/overview/subscription/invoices';
    }
    else if (this.roleService.overviewPermission.subModules.subscriptions.subModule.documents.enabled) {
      url = '/customer/detail/overview/subscription/documents';
    }
    else {
      url = '/customer/detail/overview/subscription/settings';
    }
    this.router.navigate([url])
  }

  logout() {
    // if (!this.authService.isAdvisor()) {
    this.authService.logout();
    this.router.navigate(['/login']);
    // }
  }
}
