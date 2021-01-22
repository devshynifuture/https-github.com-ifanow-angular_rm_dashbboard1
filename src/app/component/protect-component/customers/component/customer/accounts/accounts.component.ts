import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { RoutingState } from '../../../../../../services/routing-state.service';
import { EventService } from 'src/app/Data-service/event.service';
import { slideInAnimation } from '../../../../../../animation/router.animation';
import { AuthService } from 'src/app/auth-service/authService';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { MfServiceService } from './assets/mutual-fund/mf-service.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { AssetValidationService } from './assets/asset-validation.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { CustomerOverviewService } from '../customer-overview/customer-overview.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [
    slideInAnimation,
  ]
})
export class AccountsComponent implements OnInit {
  clientData: any;

  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }

  _value: number;
  loading: boolean;
  showRouter = false;
  selected;

  constructor(private eventService: EventService, private router: Router, private ngZone: NgZone, private assetValidation: AssetValidationService,
    public routingStateService: RoutingState, public enumService: EnumServiceService, public authService: AuthService, private MfServiceService: MfServiceService,
    public roleService: RoleService,
    private customerOverview: CustomerOverviewService) {
    // this.eventService.tabChangeData.subscribe(
    //   data => this.getTabChangeData(data)
    // );
  }

  // navBarClick(navigationUrl, navId) {
  //   this.routingStateService.goToSpecificRoute('/customer/detail/account/' + navigationUrl);
  //   this.value = navId;
  // }

  getTabChangeData(data) {
    setTimeout(() => {
      this._value = data;
      this.loading = false;
    }, 300);
  }
  bankList: any = [];
  ngOnInit() {
    this.showRouter = true;
    this.selected = 1;
    if (this.router.url.includes('/customer/detail/account/summary')) {
      this._value = 1
    }
    if (this.router.url.includes('/customer/detail/account/assets')) {
      this._value = 2
    }
    if (this.router.url.includes('/customer/detail/account/liabilities')) {
      this._value = 3
    } if (this.router.url.includes('/customer/detail/account/insurance')) {
      this._value = 4
    }
    this.loading = false;
    this.clientData = AuthService.getClientData();
    this.assetValidation.clearAssetData();
    // this.enumDataService.getAccountList();
    console.log('this is child url now->>>>>', this.router.url.split('/')[3]);
    // var roterName = this.router.url.split('/')[3];
    // if (roterName === 'summary') {
    //   this._value = 1;
    // } else if (roterName === 'assets') {
    //   this._value = 2;
    // } else if (roterName === 'liabilities') {
    //   this._value = 3;
    // } else if (roterName === 'insurance') {
    //   this._value = 4;
    // } else if (roterName === 'documents') {
    //   this._value = 5;
    // }
  }

  goToValidAssetUrl() {
    let url;
    if (this.roleService.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled) {
      url = '/customer/detail/account/assets/mutual'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.stocks.enabled) {
      url = '/customer/detail/account/assets/stock'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled) {
      url = '/customer/detail/account/assets/fix'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.realEstate.enabled) {
      url = '/customer/detail/account/assets/real'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled) {
      url = '/customer/detail/account/assets/retire'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled) {
      url = '/customer/detail/account/assets/small'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled) {
      url = '/customer/detail/account/assets/cash_bank'
      this.router.navigate([url])
      return
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.commodities.enabled) {
      url = '/customer/detail/account/assets/commodities'
      this.router.navigate([url])
      return
    }
    this.router.navigate(['/customer/detail/account/assets/others'])
  }

  goToAdvisorHome() {
    /*this.router.navigateByUrl('/admin/subscription').then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });*/
    // this.locationService.go('/admin/subscription');
    /* this.ngZone.run(() => {
       // this.navigateTo('/');

       this.router.navigate(['/admin', 'subscription'], {/!*replaceUrl: true*!/}).then(e => {
         if (e) {
           // this.router.navigate(['/admin', 'subscription']);
           console.log('Navigation is successful!');
           // this.locationService.go('/admin/subscription');

         } else {
           console.log('Navigation has failed!');
         }
       });
     });*/

    this.showRouter = false;
    // setTimeout(() => {
    this.roleService.getClientRoleDetails(AuthService.getUserInfo().roleId, (rolesData) => {
      this.roleService.constructAdminDataSource(rolesData);
      this.customerOverview.clearServiceData();
      localStorage.removeItem('clientData');
      sessionStorage.removeItem('clientData');
      this.routingStateService.goToSpecificRoute('/admin/dashboard');
    });
    // }, 200);
  }

}
