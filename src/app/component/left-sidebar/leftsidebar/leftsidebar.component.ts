import { Component, ElementRef, OnInit } from '@angular/core';
import $ from 'jquery';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from '../../../Data-service/event.service';
import { transition } from '@angular/animations';
import { SubscriptionInject } from '../../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.scss']
})

export class LeftsidebarComponent implements OnInit {

  showTabs = true;
  showSettings = false;
  arrow = false;
  userInfo: any;
  sideNavContainerClass;
  myControl = new FormControl();


  constructor(private authService: AuthService, private _eref: ElementRef,
    private eventService: EventService, private subinject: SubscriptionInject) {
    // this.eventService.sideNavContainerClassData.subscribe(
    //   data => this.sideNavContainerClass = data
    // );
  }

  ngOnInit() {
    this.onResize();
    this.userInfo = AuthService.getUserInfo();

    // this.userInfo = this.authService.getUserInfo();
    // console.log(' userInfo', this.userInfo);
    // console.log(this.authService.getAdvisorId());
  }


  showMainNavWrapper() {
    $('#d').addClass('width-230');
    $('#d').removeClass('width-60');
    $('#left').css('margin-left', '230px');
    this.showTabs = true;
    this.arrow = false;
  }

  showsmallNavWrapper() {
    $('#d').removeClass('width-230');
    $('#left').css('margin-left', '65px');
    $('#left').css('transition', 'margin-left 0.3s');
    $('#d').css('transition', 'width 0.2s');
    this.showTabs = false;
    this.arrow = false;
  }

  onResize() {
    if (window.innerHeight >= 670 || window.innerHeight == 670) {
      this.showSettings = false;
    }
    if (window.innerWidth <= 600) {
      this.showTabs = false;
      $('#left').css('margin-left', '65px');
      $('#d').addClass('width,60px');
      $('#d').removeClass('width-230');
    } else {
      if (this.showTabs == false) {
        this.showTabs = false;
      } else {
        this.showTabs = true;
        $('#d').addClass('width-230');
        $('#d').removeClass('width-60');
      }
    }
  }

  openSettings() {
    if (this.showSettings == false) {
      $('#showSettings').css('transition', '0.5s');
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }

  backSections() {
    this.arrow = this.arrow ? this.arrow = false : this.arrow = true;
  }

  logout() {
    this.authService.logout();
  }

  // prepareRoute(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  // }

}

