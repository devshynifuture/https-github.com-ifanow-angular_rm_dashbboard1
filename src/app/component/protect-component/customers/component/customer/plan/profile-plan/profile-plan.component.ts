import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-plan',
  templateUrl: './profile-plan.component.html',
  styleUrls: ['./profile-plan.component.scss']
})
export class ProfilePlanComponent implements OnInit {
  viewMode
  constructor( ) { }

  ngOnInit() {
    this.viewMode="tab1"
  }

}
