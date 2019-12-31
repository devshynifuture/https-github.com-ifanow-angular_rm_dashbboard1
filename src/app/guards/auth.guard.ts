import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth-service/authService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private myRoute: Router, private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard : ', next, state);
      return true;
    } else {
      this.myRoute.navigate(['login']);
      return false;
    }
  }
}
