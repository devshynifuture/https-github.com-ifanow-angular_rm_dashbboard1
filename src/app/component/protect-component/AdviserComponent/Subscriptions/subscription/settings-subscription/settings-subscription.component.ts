import {Component, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatTabGroup} from '@angular/material';
import { ActivatedRoute } from "@angular/router";
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings-subscription',
  templateUrl: './settings-subscription.component.html',
  styleUrls: ['./settings-subscription.component.scss']
})
export class SettingsSubscriptionComponent implements OnInit {
  selected: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation.extras.replaceUrl == false && navigation.extras.state != undefined) {
    //   this.selected = navigation.extras.state.example;
    // } else if (navigation.extras.replaceUrl == undefined && navigation.extras.state != undefined) {
    //   this.selected = navigation.extras.state.example;
    // } else {
    //   this.selected = 0;
    //   // this.selected = 3;
    // }
  }
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  // @Input() set sIndex(data) {
  //   // this.tabGroup.selectedIndex = data
  //   this.selected = data
  //   console.log( data, "this.label 1234");

  // };
  label:any;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.label = params.get("label")
    })
    // this.label = this.route.snapshot.paramMap.get("label")
    switch (this.label) {
      case 'plans':
      this.selected = 0;
      break;

      case 'services':
      this.selected = 1;
      break;
    
      case 'documents':
      this.selected = 2;
      break;
    }
    // this.tabGroup.selectedIndex = 0;
    console.log(this.label, this.selected,"this.label 123");
  }

  

  navTab(){
    // const navigation = this.router.getCurrentNavigation();
    console.log('afterViewInit => ', this.tabGroup.selectedIndex);
    switch (this.tabGroup.selectedIndex) {
      case 0:
        this.label = 'plans'
      break;

      case 1:
        this.label = 'services'
      break;
    
      case 2:
      this.label = 'documents'
      break;

      case 3:
      this.label = 'preferences'
      break;
    }
    this.router.navigate(['/admin/subscription/settings',this.label])
  }


  
  // tabClick(value) {
  //   this.selectedTab = value.tab.textLabel;
  // }
}
