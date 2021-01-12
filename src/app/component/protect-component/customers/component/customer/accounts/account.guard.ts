import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivateChild {
  constructor(private roleService: RoleService,
    private router: Router) { }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.roleService.portfolioPermission.subModule.portfolioDashboard.enabled && state.url == '/customer/detail/account/summary') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.assets.enabled && state.url.includes('/customer/detail/account')) {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.liabilities.enabled && state.url == '/customer/detail/account/liabilities') {
      return true;
    }
    if (this.roleService.portfolioPermission.subModule.insurance.enabled && state.url == "/customer/detail/account/insurance") {
      return true;
    }
    else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }

}
