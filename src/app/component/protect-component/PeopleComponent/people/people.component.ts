import {Component, OnInit} from '@angular/core';
import {EnumDataService} from 'src/app/services/enum-data.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  roleObj:any;

  constructor(private enumDataService: EnumDataService) {
    this.roleObj = AuthService.getUserRoleType();
  }

  value = 1;
  ngOnInit() {
    this.enumDataService.getRoles();
    this.enumDataService.getProofType();
    // this.enumDataService.getAccountList();
    this.enumDataService.getClientRole();
  }

}
