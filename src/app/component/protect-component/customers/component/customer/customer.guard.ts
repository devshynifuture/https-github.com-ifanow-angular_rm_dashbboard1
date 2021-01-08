import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivateChild {
  constructor(private roleService: RoleService,
    private router: Router) { }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.roleService.overviewPermission.enabled && state.url.includes('/customer/detail/overview')) {
      return true
    }
    if (this.roleService.portfolioPermission.enabled && state.url.includes('/customer/detail/account')) {
      return true
    }
    if (this.roleService.planPermission.enabled && state.url.includes('/customer/detail/plan')) {
      return true
    }
    if (this.roleService.activityPermission.enabled && state.url.includes('/customer/detail/activity')) {
      return true
    }
    if (this.roleService.transactionPermission.enabled && state.url.includes('/customer/detail/transact')) {
      return true
    }
    else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }

}
