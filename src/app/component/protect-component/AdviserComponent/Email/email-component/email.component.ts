import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-component',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabs = ['Primary', 'Social', 'Promotions', 'Forum'];
  selected = new FormControl(0);


}
