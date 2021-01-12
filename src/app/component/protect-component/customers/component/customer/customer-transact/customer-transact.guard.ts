import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTransactGuard implements CanActivateChild {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.roleService.transactionPermission.subModule.transactionsModule.enabled && state.url === '/customer/detail/transact/list') {
      return true;
    }
    else if (this.roleService.transactionPermission.subModule.investorsModule.enabled && state.url === '/customer/detail/transact/investors') {
      return true;
    }
    else if (this.roleService.transactionPermission.subModule.mandateModule.enabled && state.url === '/customer/detail/transact/mandate') {
      return true;
    } else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }

}
