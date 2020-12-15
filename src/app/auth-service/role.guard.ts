import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (state.url.match('tasks') && this.roleService.activityPermission.subModule.tasks.enabled) {
      return true;
    }
    else if (state.url.match('emails') && this.roleService.activityPermission.subModule.emails.enabled) {
      return true;
    }
    else if (state.url.match('calendar') && this.roleService.activityPermission.subModule.calendar.enabled) {
      return true;
    }
    else if (state.url.match('clients') && this.roleService.peoplePermission.subModule.clients.enabled) {
      return true;
    }
    else if (state.url.match('leads') && this.roleService.peoplePermission.subModule.leads.enabled) {
      return true;
    }
    else if (state.url.match('dashboard') && this.roleService.dashboardPermission.enabled) {
      return true;
    }
    else {
      this.router.navigate(['unauthorized']);
      return false
    }
  }

}
