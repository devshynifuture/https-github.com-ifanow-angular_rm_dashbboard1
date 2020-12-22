import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth-service/authService';
import {RoleService} from '../auth-service/role.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {PeopleService} from '../component/protect-component/PeopleComponent/people.service';
import {LoginService} from '../component/no-protected/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private myRoute: Router, private authService: AuthService,
              private roleService: RoleService, private peopleService: PeopleService, private loginService: LoginService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.authService.logout();
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
      } else if (state && state.url.split('/').includes('support') && state.url.split('/').includes('dashboard')) {
        if (AuthService.getUserInfo().isRmLogin) {
          return true;
        } else {
          this.myRoute.navigate(['/']);
          return false;
        }
      } else if (state && state.url.split('/').includes('admin') && !this.authService.isAdvisor()) {
        console.log('advisorGuard failed general: ', next, state);
        this.myRoute.navigate(['unauthorized']);
        return false;
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
      const winName = window.name;
      console.log('AppComponent getRandomStringFromPlanner winName: ', winName);

      if (winName.includes('uniqueString')) {
        return this.peopleService.getLoginDataFromUniqueString(winName)

          ./*pipe(*/map((response) => {
            console.log('AppComponent getRandomStringFromPlanner response: ', response);
            window.name = undefined;
            if (response) {
              this.loginService.handleUserData(this.authService, this.myRoute, response);
              return true;
            } else {
              return false;
            }
          }, catchError(err => {
            this.myRoute.navigate(['/login']);
            console.log('AppComponent getRandomStringFromPlanner err: ', err);
            return of(false);
          }));
      } else if (state && state.url.split('/').includes('login')) {
        return true;
      }
      if (state && state.url.split('/').includes('invite')) {
        console.log(next, this.myRoute);
        this.myRoute.navigate(['/login/signup'], {queryParams: {code: next.params ? next.params.param : ''}});
        return true;
      }
      this.myRoute.navigate(['/login']);
      return false;
    }
  }

  // advisorGuard()
}
