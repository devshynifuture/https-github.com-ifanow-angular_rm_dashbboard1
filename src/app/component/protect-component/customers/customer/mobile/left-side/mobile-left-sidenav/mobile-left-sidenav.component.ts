import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-left-sidenav',
  templateUrl: './mobile-left-sidenav.component.html',
  styleUrls: ['./mobile-left-sidenav.component.scss']
})
export class MobileLeftSidenavComponent implements OnInit {
  document: boolean = false;
  portfolio: boolean = false;
  transaction: boolean = false;
  profile: boolean = false;
  home: boolean;
  dataTosend: any;
  clientHeader: string;

  constructor(private router: Router) { }
  advisorToggle
  ngOnInit() {
    if (this.router.url.includes('/customer/mobile/invest')) {
      this.clientHeader = "Invest";
    }
    else if (this.router.url.includes('/customer/mobile/portfolio')) {
      this.clientHeader = "Portfolio";
    }
    else if (this.router.url.includes('/customer/mobile/profile')) {
      this.clientHeader = "Profile";
    }
    else if (this.router.url.includes('/customer/mobile/document')) {
      this.clientHeader = "Documents";
    }
    else {
      this.clientHeader = "Home"
    }
  }


  openSection(sectionType) {
    if (sectionType == 'Documents') {
      this.dataTosend = { 'openMenue': true }
      this.document = true
      this.portfolio = false
      this.transaction = false
      this.profile = false
      this.home = false
    } else if (sectionType == 'Portfolio') {
      this.dataTosend = { 'openMenue': true }
      this.document = false
      this.portfolio = true
      this.transaction = false
      this.profile = false
      this.home = false
    } else if (sectionType == 'Profile') {
      this.dataTosend = { 'openMenue': true }
      this.document = false
      this.portfolio = false
      this.transaction = false
      this.home = false
      this.profile = true
    } else if (sectionType == 'Transaction') {
      this.dataTosend = { 'openMenue': true }
      this.document = false
      this.portfolio = false
      this.transaction = true
      this.profile = false
      this.home = false
    } else if ('Home') {
      this.dataTosend = {}
      this.document = false
      this.portfolio = false
      this.transaction = false
      this.home = true
      this.profile = false
    }
  }
}
