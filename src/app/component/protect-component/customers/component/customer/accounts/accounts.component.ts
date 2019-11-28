import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor() {
  }

  selected;

  ngOnInit() {
    this.selected = 6;
  }

}
