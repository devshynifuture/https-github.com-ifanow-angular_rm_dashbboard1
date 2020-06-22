import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-client-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class ClientSettingsComponent implements OnInit {

  data:any = {};
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.data = AuthService.getSubscriptionUpperSliderData();
    this.isLoading = false;
  }

}
