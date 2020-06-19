import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  data:any = {};
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.data = AuthService.getSubscriptionUpperSliderData();
    this.isLoading = false;
  }

}
