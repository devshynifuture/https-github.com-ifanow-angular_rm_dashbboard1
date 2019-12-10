import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  _value: number;

  set value(value: number) {
    console.log("now value is ->>>>", value);
    this._value = value;
  }

  constructor(private router: Router) {
  }

  selected;

  ngOnInit() {
    this.selected = 1;
    console.log("this is child url now->>>>>", this.router.url.split('/')[3]);
    if (this.router.url.split('/')[3] === 'summary') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] === 'assets') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] === 'liabilities') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] === 'insurance') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] === 'documents') {
      this._value = 5;
    }
  }

}
