import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth-service/authService';
import {RoleService} from "../auth-service/role.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private myRoute: Router, private authService: AuthService,
              private roleService: RoleService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      // if (state && state.url === '/login') {
      //   this.myRoute.navigate(['admin', 'subscription', 'dashboard']);
      // }
      if (state && state.url.split('/').includes('login')) {
        // TODO comment for old login
        if (this.authService.isAdvisor()) {
          this.myRoute.navigate(['admin', 'dashboard']);
        } else if (AuthService.getUserInfo().isRmLogin) {
          this.myRoute.navigate(['support', 'dashboard']);
        } else {
          this.myRoute.navigate(['customer', 'detail', 'overview', 'myfeed']);
        }
        return false;
      } else if(state && state.url.split('/').includes('support') && state.url.split('/').includes('dashboard')){
        if(AuthService.getUserInfo().isRmLogin){
          this.myRoute.navigate(['support', 'dashboard']);
          return true;
        } else {
          this.myRoute.navigate(['/']);
          return false;
        }
      }
      // const user = this.authService.decode();
      //
      // if (user.Role === next.data.role) {
      //   return true;
      // }

      // navigate to not found page
      // this.myRoute.navigate(['/404']);

      return true;
    } else {

      if (state && state.url.split('/').includes('login')) {
        return true;
      }
      this.myRoute.navigate(['/login']);
      return false;
    }
  }

  // advisorGuard()
}
