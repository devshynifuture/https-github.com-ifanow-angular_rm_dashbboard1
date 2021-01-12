import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsGuard implements CanActivateChild {
  constructor(private roleService: RoleService, private router: Router) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.roleService.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.commodities.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.stocks.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.realEstate.enabled) {
    }
    if (this.roleService.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled) {
    }
    return true;
  }

}
