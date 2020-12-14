import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from '../auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {

  constructor(private roleService: RoleService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url.match('dashboard') && this.roleService.subscriptionPermission.subModule.dashboard.enabled) {
      return true;
    }
    else if (state.url.match('clients') && this.roleService.subscriptionPermission.subModule.clients.enabled) {
      return true;
    }
    else if (state.url.match('subscriptions') && this.roleService.subscriptionPermission.subModule.subscriptions.enabled) {
      return true;
    }
    else if (state.url.match('quotations') && this.roleService.subscriptionPermission.subModule.quotations.enabled) {
      return true;
    }
    else if (state.url.match('invoices') && this.roleService.subscriptionPermission.subModule.invoices.enabled) {
      return true;
    }
    else if (state.url.match('documents') && this.roleService.subscriptionPermission.subModule.documents.enabled) {
      return true;
    }
    else if (state.url.match('settings') && this.roleService.subscriptionPermission.subModule.settings.enabled) {
      return true;
    } else {
      this.router.navigate(['unauthorized']);
      return false;
    }

  }

}
