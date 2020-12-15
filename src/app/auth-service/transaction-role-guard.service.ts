import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {RoleService} from './role.service';
import {TransactionRoleService} from '../component/protect-component/AdviserComponent/transactions/transaction-role.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionRoleGuard implements CanActivate {

  constructor(private roleService: RoleService, private transactionRoleService: TransactionRoleService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('TransactionRoleGuard ActivatedRouteSnapshot next ', next);
    console.log('TransactionRoleGuard RouterStateSnapshot state ', state);
    if (state.url.match('settings') && this.transactionRoleService.settingsVisibility.showModule) {
      if (state.url.match('arn-ria-creds')) {
        if (this.transactionRoleService.addArnRiaCredentials.showModule) {
          return true;
        } else {
          this.router.navigate(['/admin/transactions/settings/manage-credentials/sub-broker-team-member']);
          return false;
        }
      }
      if (state.url.match('sub-broker-team-member')) {
        if (this.transactionRoleService.addSubbrokers.showModule) {
          return true;
        } else if (this.transactionRoleService.addArnRiaCredentials.showModule) {
          this.router.navigate(['/admin/transactions/settings/manage-credentials/sub-broker-team-member']);
          return false;
        } else {
          this.router.navigate(['/admin/transactions/settings/client-mapping']);
          return false;
        }
      }
      if (state.url.match('client-mapping')) {
        if (this.transactionRoleService.clientMapping.showModule) {
          return true;
        } else {
          this.router.navigate(['unauthorized']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['unauthorized']);
      return false;
    }


    return false;
  }
}
