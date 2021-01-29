import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth-service/authService';
import {RoleService} from '../auth-service/role.service';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {PeopleService} from '../component/protect-component/PeopleComponent/people.service';
import {LoginService} from '../component/no-protected/login/login.service';
import {SettingsService} from '../component/protect-component/AdviserComponent/setting/settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private myRoute: Router, private authService: AuthService,
              private roleService: RoleService, private peopleService: PeopleService,
              private loginService: LoginService, private settingService: SettingsService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.authService.logout();
    if (this.authService.isLoggedIn()) {
      if (!AuthService.getUserInfo()) {
        this.authService.logout();
        this.myRoute.navigate(['/login']);
        return false;
      }
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
          const url = this.roleService.goToValidClientSideUrl();
          this.myRoute.navigate([url]);
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
        try {
          const winNameObj = JSON.parse(winName);
          window.name = undefined;

          return this.handleUuidLatest(winNameObj.uniqueString);
        } catch (e) {
          console.error(e);
          this.myRoute.navigate(['/login']);
          return false;
        }
      } else if (next.queryParams && next.queryParams.uniqueString) {
        try {
          return this.handleUuidLatest(next.queryParams.uniqueString);
        } catch (e) {
          console.error(e);
          this.myRoute.navigate(['/login']);
          return false;
        }
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

  handleUuid(uuidString) {
    const obj = {
      uuid: uuidString
    };
    return this.peopleService.getLoginDataFromUUID(obj)

      .map((userData) => {
        console.log('AppComponent getRandomStringFromPlanner response: ', userData);
        if (!userData) {
          this.myRoute.navigate(['/login']);
          return false;
        } else {
          return userData;
        }
      }, catchError(err => {
        this.myRoute.navigate(['/login']);
        console.error('AppComponent getRandomStringFromPlanner err: ', err);
        return of(false);
      })).map(userData => {
        if (userData.isRmLogin) {
          this.authService.setToken('authTokenInLoginComponent');
          this.authService.setUserInfo(userData);
          this.myRoute.navigate(['support', 'dashboard']);
          return false;
        } else {
          return false;
          /* return this.settingService.getAdvisorOrClientOrTeamMemberRoles({id: userData.roleId}).map((rolesData) => {
             if (rolesData) {
               AuthService.setAdvisorRolesSettings(rolesData);
               this.roleService.setDataInAllPermissionData(rolesData);
               this.roleService.constructAdminDataSource(rolesData);
             }
             if (userData.userType == 1 || userData.userType == 8) {
               this.authService.setToken('authTokenInLoginComponent');
               this.authService.setUserInfo(userData);
               this.myRoute.navigate(['admin', 'dashboard']);
               if (userData.showReferPopup) {
                 this.loginService.openDialog();
               }
             } else {
               this.authService.setToken('authTokenInLoginComponent');
               this.authService.setUserInfo(userData);
               userData.id = userData.clientId;
               this.authService.setClientData(userData);
               this.roleService.constructAdminDataSource(rolesData);
               const url = this.roleService.goToValidClientSideUrl();
               this.myRoute.navigate([url]);
             }
             return false;
           }, catchError(err => {
             this.myRoute.navigate(['/login']);
             console.error('AppComponent getRandomStringFromPlanner err: ', err);
             return of(false);
           }));*/

        }
      });
  }

  handleUuidLatest(uuidString) {
    const obj = {
      uuid: uuidString
    };
    return new Observable<boolean>(observer => {
      this.peopleService.getLoginDataFromUUID(obj).subscribe((userData) => {
        if (userData) {
          this.loginService.handleUserData(this.authService, this.myRoute, userData, (isLoginSuccess) => {
            if (isLoginSuccess) {
              observer.next(false);
              this.myRoute.navigate(['/login']);
            } else {
              observer.next(true);
            }
            observer.complete();
          });
        }
      }, err => {
        console.error(err);
        observer.next(false);
        this.myRoute.navigate(['/login']);
        observer.complete();
      });
    });
  }

// advisorGuard()
}
