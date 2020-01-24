import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-support-sidebar',
  templateUrl: './support-sidebar.component.html',
  styleUrls: ['./support-sidebar.component.scss']
})
export class SupportSidebarComponent implements OnInit {
  userInfo: any;
  changeName: any;

  constructor() { }
  logoText = 'Your Logo here';
  ngOnInit() {
    this.userInfo = AuthService.getUserInfo();
    this.changeName = "Dashboard"
  }
  changeNavigation(name) {
    this.changeName = name;
  }
}
