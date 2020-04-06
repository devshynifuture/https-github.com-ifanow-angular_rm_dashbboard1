import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../../auth-service/authService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.scss']
})
export class CustomerOverviewComponent implements OnInit {
  clientData: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    console.log('overview is called');
    this.clientData = AuthService.getClientData();
    // this.clientData = JSON.parse(sessionStorage.getItem('clientData'));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
