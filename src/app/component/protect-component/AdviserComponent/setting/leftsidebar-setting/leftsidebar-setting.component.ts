import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-leftsidebar-setting',
  templateUrl: './leftsidebar-setting.component.html',
  styleUrls: ['./leftsidebar-setting.component.scss']
})
export class LeftsidebarSettingComponent implements OnInit {

  roleObj:any;
  constructor() {
    this.roleObj = AuthService.getUserRoleType();
  }

  ngOnInit() {
  }

}
