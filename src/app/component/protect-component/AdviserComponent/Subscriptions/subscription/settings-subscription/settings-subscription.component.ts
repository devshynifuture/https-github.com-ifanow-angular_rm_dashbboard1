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
  }
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;
  label:any;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.label = params.get("label")
    })
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

      default:
      this.selected = 3;
    }
  }

  

  navTab(){
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
    
    this.router.navigate(['/admin/subscription/settings',this.label]);
  }
}