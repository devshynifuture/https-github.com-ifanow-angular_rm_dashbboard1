import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-client-invocies',
  templateUrl: './invocies.component.html',
  styleUrls: ['./invocies.component.scss']
})
export class ClientInvociesComponent implements OnInit {

  data:any = {};
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.data = AuthService.getSubscriptionUpperSliderData();
    this.isLoading = false;
  }

}
