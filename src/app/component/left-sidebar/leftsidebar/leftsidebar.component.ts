import {Component, ElementRef, NgZone, OnInit} from '@angular/core';
import $ from 'jquery';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from '../../../Data-service/event.service';
import {SubscriptionInject} from '../../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormControl} from '@angular/forms';
import {SubscriptionService} from '../../protect-component/AdviserComponent/Subscriptions/subscription.service';
import {Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {DialogContainerComponent} from '../../../common/dialog-container/dialog-container.component';
import {DynamicComponentService} from '../../../services/dynamic-component.service';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../../animation/animation';

@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})

export class LeftsidebarComponent extends DialogContainerComponent implements OnInit {

  showTabs = true;
  showSettings = false;
  arrow = false;
  userInfo: any;
  sideNavContainerClass;
  filteredOptions: any = null;
  advisorId: any;
  clientList: any;
  myControl: FormControl;
  advisorName;
  loginType = 1;
  showDefaultDropDownOnSearch: boolean;

  logoText = 'Your Logo here';

  constructor(private authService: AuthService, private _eref: ElementRef,
              protected eventService: EventService, protected subinject: SubscriptionInject,
              private subService: SubscriptionService, private router: Router, private ngZone: NgZone,
              protected dynamicComponentService: DynamicComponentService) {
    /*constructor(private router: Router, protected eventService: EventService, protected subinject: SubscriptionInject,
      protected dynamicComponentService: DynamicComponentService, private route: ActivatedRoute,
      private authService: AuthService) {*/
    super(eventService, subinject, dynamicComponentService);
  }

  serachClientData(data) {
    console.log(data);
    this.getClientSubscriptionList();
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.subService.getSubscriptionClientsList(obj).subscribe(
      data => this.getClientListResponse(data)
    );
  }

  getClientListResponse(data) {
    console.log(data);
    this.clientList = data;
    this.myControl.setValue(data);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value == 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.clientList.slice())
    );

    if (data) {
      this.showDefaultDropDownOnSearch = false;
    } else {
      this.showDefaultDropDownOnSearch = true;
    }
  }

  selectClient(singleClientData) {
    console.log(singleClientData);
    this.ngZone.run(() => {
      this.router.navigate(['customer', 'detail', 'account', 'assets'], {state: {...singleClientData}});
    });
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.advisorName = AuthService.getUserInfo().fullName;
    this.onResize();
    this.userInfo = AuthService.getUserInfo();
    this.myControl = new FormControl();
    this.getClientSubscriptionList();
  }

  private _filter(name: string): Client[] {
    const filterValue = name.toLowerCase();

    return this.clientList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(client?: Client): string | undefined {
    return client ? client.name : undefined;
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
    $('#left').css('margin-left', '60px');
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
      $('#left').css('margin-left', '60px');
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
    this.router.navigate(['/login']);
  }

  // prepareRoute(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  // }
}

export interface Client {
  name: string;
}

