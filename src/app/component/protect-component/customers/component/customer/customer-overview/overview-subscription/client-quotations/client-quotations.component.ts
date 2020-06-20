import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-client-quotations',
  templateUrl: './client-quotations.component.html',
  styleUrls: ['./client-quotations.component.scss']
})
export class ClientQuotationsComponent implements OnInit {

  data:any = {};
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.data = AuthService.getSubscriptionUpperSliderData();
    this.isLoading = false;
  }

}
