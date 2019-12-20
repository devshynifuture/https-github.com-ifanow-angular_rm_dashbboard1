import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("customer activity")
  }

}
