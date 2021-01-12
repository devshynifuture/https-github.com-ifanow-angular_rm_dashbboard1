import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AssetsGuard implements CanActivateChild {
  constructor(private roleService: RoleService, private router: Router) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.roleService.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled && state.url === '/customer/detail/account/assets/cash_bank') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled && state.url === '/customer/detail/account/assets/mutual') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled && state.url === '/customer/detail/account/assets/fix') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled && state.url === '/customer/detail/account/assets/small') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.commodities.enabled && state.url === '/customer/detail/account/assets/commodities') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.stocks.enabled && state.url === '/customer/detail/account/assets/stock') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.realEstate.enabled && state.url === '/customer/detail/account/assets/real') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled && state.url === '/customer/detail/account/assets/retire') {
      return true;
    }
    if (state.url === '/customer/detail/account/assets/others') {
      return true;
    }
    else {
      this.router.navigate(['unauthorized'])
      return false;
    }
  }

}
