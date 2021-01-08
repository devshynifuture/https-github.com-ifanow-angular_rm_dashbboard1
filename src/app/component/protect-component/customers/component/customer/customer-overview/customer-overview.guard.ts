import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerOverviewGuard implements CanActivate {
  constructor(private roleService: RoleService,
    private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.roleService.overviewPermission.subModules.myFeed.enabled && state.url.includes('/customer/detail/overview/myfeed')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.profile.enabled && state.url.includes('/customer/detail/overview/profile')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.documents.enabled && state.url.includes('/customer/detail/overview/documents')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.documents.enabled && state.url.includes('/customer/detail/overview/subscription/documents')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.invoices.enabled && state.url.includes('/customer/detail/overview/subscription/invoices')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.subscriptions.enabled && state.url.includes('/customer/detail/overview/subscription/subscriptions')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.settings.enabled && state.url.includes('/customer/detail/overview/subscription/settings')) {
      return true;
    }
    if (this.roleService.overviewPermission.subModules.subscriptions.subModule.quotations.enabled && state.url.includes('/customer/detail/overview/subscription/quotations')) {
      return true;
    }
    else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }


}
