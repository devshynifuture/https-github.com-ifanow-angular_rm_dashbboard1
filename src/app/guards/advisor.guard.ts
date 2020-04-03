import {Injectable} from '@angular/core/src/metadata/*';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth-service/authService';

@Injectable({
  providedIn: 'root'
})
export class AdvisorGuard implements CanActivate {
  constructor(private myRoute: Router, private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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

        this.myRoute.navigate(['customer', 'detail', 'overview', 'myfeed']);
      } else {
        console.log('advisorGuard failed general: ', next, state);
        this.myRoute.navigate(['unauthorized']);
      }
      return false;

    }
  }

  // advisorGuard()
}
