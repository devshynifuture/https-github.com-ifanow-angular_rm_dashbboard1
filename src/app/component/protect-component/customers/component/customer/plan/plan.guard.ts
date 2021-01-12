import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class PlanGuard implements CanActivateChild {
  constructor(private roleService: RoleService,
    private router: Router) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.roleService.planPermission.subModule.profile.enabled && state.url.includes('/customer/detail/plan/profile')) {
      return true
    }
    if (this.roleService.planPermission.subModule.goals.enabled && state.url.includes('/customer/detail/plan/goals')) {
      return true
    }
    else {
      this.router.navigate(['unauthorized']);
      return false;
    }
  }

}
