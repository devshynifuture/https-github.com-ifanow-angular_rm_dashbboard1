import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from 'src/app/animation/animation';
import { DialogContainerComponent } from 'src/app/common/dialog-container/dialog-container.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from '../../AdviserComponent/Subscriptions/subscription.service';
import { Router } from '@angular/router';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';

@Component({
  selector: 'app-support-sidebar',
  templateUrl: './support-sidebar.component.html',
  styleUrls: ['./support-sidebar.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
export class SupportSidebarComponent extends DialogContainerComponent implements OnInit {
  userInfo: any;
  changeName: any;
  shouldShowMainNav = true;

  constructor(private authService: AuthService, private _eref: ElementRef,
    protected eventService: EventService, protected subinject: SubscriptionInject,
    private subService: SubscriptionService, private router: Router, private ngZone: NgZone,
    protected dynamicComponentService: DynamicComponentService) {
    super(eventService, subinject, dynamicComponentService);
  }
  logoText = 'Your Logo here';
  ngOnInit() {
    this.userInfo = AuthService.getUserInfo();
    this.changeName = "Dashboard";
    if (this.router.url === '/support/dashboard') {
      this.shouldShowMainNav = false;
    }
  }
  changeNavigation(name) {
    this.changeName = name;
  }
}
