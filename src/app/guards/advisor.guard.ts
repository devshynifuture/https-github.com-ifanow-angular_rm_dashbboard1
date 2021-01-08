import { Injectable } from '@angular/core/src/metadata/*';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth-service/authService';
import { of } from "rxjs";
import { PeopleService } from "../component/protect-component/PeopleComponent/people.service";
import { LoginService } from "../component/no-protected/login/login.service";
import { catchError } from "rxjs/operators";
import { RoleService } from '../auth-service/role.service';

@Injectable({
  providedIn: 'root'
})
export class AdvisorGuard implements CanActivate {
  constructor(private myRoute: Router,
    private authService: AuthService,
    private roleService: RoleService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (true) {
    // return true;
    // }
    if (this.authService.isAdvisor()) {
      console.log('AuthGuard : ', next, state);
      // const user = this.authService.decode();
      //
      // if (user.Role === next.data.role) {
      //   return true;
      // }

      // navigate to not found page
      // this.myRoute.navigate(['/404']);

      return true;
    } else {
      if (state && state.url.match('login')) {
        console.log('advisorGuard failed login regex: ', next, state);
        const url = this.roleService.goToValidClientSideUrl();
        this.myRoute.navigate([url]);
      } else {
        console.log('advisorGuard failed general: ', next, state);
        this.myRoute.navigate(['unauthorized']);
      }
      return false;

    }
  }

  // advisorGuard()
}
