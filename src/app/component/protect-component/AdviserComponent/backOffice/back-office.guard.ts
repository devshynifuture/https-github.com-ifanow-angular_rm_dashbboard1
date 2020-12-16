import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class BackOfficeGuard implements CanActivate {

  constructor(private roleService: RoleService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (state.url.match('backoffice-mis') && (this.roleService.backofficePermission.enabled && this.roleService.backofficePermission.subModule.mis.enabled)) {
      return true;
    }
    if (state.url.match('backoffice-file-upload') && (this.roleService.backofficePermission.enabled && this.roleService.backofficePermission.subModule.fileuploads.enabled)) {
      return true;
    }
    else {
      this.router.navigate(['unauthorized'])
      return false;
    }
  }

}
