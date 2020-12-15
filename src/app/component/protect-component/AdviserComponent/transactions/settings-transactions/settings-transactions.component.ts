import { Component, OnInit } from '@angular/core';
import {TransactionRoleService} from "../transaction-role.service";

@Component({
  selector: 'app-settings-transactions',
  templateUrl: './settings-transactions.component.html',
  styleUrls: ['./settings-transactions.component.scss']
})
export class SettingsTransactionsComponent implements OnInit {

  constructor(public transactionRoleService: TransactionRoleService) { }

  ngOnInit() {
  }

}
