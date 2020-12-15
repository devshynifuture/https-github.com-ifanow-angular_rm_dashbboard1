import { Component, OnInit } from '@angular/core';
import {TransactionRoleService} from '../../transaction-role.service';

@Component({
  selector: 'app-settings-manage-credentials',
  templateUrl: './settings-manage-credentials.component.html',
  styleUrls: ['./settings-manage-credentials.component.scss']
})
export class SettingsManageCredentialsComponent implements OnInit {

  constructor(public transactionRoleService: TransactionRoleService) { }


  ngOnInit() {
  }

}
