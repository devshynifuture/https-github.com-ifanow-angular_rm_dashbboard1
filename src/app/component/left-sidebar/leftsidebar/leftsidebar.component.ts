import { Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from '../../../Data-service/event.service';
import { SubscriptionInject } from '../../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormControl } from '@angular/forms';
import { SubscriptionService } from '../../protect-component/AdviserComponent/Subscriptions/subscription.service';
import { Router } from '@angular/router';
import { DialogContainerComponent } from '../../../common/dialog-container/dialog-container.component';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from '../../../animation/animation';
import { EnumDataService } from '../../../services/enum-data.service';
import { SettingsService } from '../../protect-component/AdviserComponent/setting/settings.service';
import { UtilService } from 'src/app/services/util.service';
import { PeopleService } from '../../protect-component/PeopleComponent/people.service';
import { map, startWith } from 'rxjs/operators';

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
  isOpen: boolean;
  roleObj: any = {};

  logoText = 'Your Logo here';
  role: any;

  constructor(public authService: AuthService, private _eref: ElementRef,
    protected eventService: EventService, protected subinject: SubscriptionInject,
    private subService: SubscriptionService, private router: Router, private ngZone: NgZone,
    protected dynamicComponentService: DynamicComponentService,
    private enumDataService: EnumDataService,
    private settingsService: SettingsService,
    private auth: AuthService,
    private utilService: UtilService, private peopleService: PeopleService) {
    /*constructor(private router: Router, protected eventService: EventService, protected subinject: SubscriptionInject,
      protected dynamicComponentService: DynamicComponentService, private route: ActivatedRoute,
      private authService: AuthService) {*/
    super(eventService, subinject, dynamicComponentService);
  }

  // getClientList(data) {
  //   if (this.myControl.value.length == 0) {
  //     this.showDefaultDropDownOnSearch = false;
  //     this.clientList = undefined
  //     return;
  //   }
  //   if (this.myControl.value.length < 3) {
  //     return;
  //   }
  //   const obj = {
  //     advisorId: this.advisorId,
  //     displayName: this.myControl.value
  //   };
  //   this.peopleService.getClientFamilyMemberList(obj).subscribe(
  //     data => this.getClientListResponse(data)
  //   );
  // }

  // getClientListResponse(data) {
  //   if (data) {
  //     this.clientList = data;
  //     this.showDefaultDropDownOnSearch = false
  //   }
  //   else {
  //     this.clientList = undefined;
  //     this.showDefaultDropDownOnSearch = true;
  //   }
  // }

  getActiveLink(value) {
    let link = this.router.url.split('/')[2];

    switch (link) {
      case 'subscription':
        return link === value ? true : false;

      case 'emails':
        return link === value ? true : false;

      case 'transactions':
        return link === value ? true : false;
    }
  }

  selectClient(singleClientData) {
    this.auth.setClientData(singleClientData);
    this.myControl.setValue(singleClientData.displayName)
    this.ngZone.run(() => {
      this.router.navigate(['customer', 'detail', 'account', 'assets'], { state: { ...singleClientData } });
    });
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.advisorName = AuthService.getUserInfo().name;
    this.onResize();
    this.enumDataService.searchClientList();
    this.enumDataService.searchClientAndFamilyMember();
    this.userInfo = AuthService.getUserInfo();
    this.myControl = new FormControl();
    this.enumDataService.getDataForTaxMasterService();
    this.getOrgProfiles();
    this.getPersonalProfiles();
    this.clientList = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            let list = this.enumDataService.getClientSearchData(state);
            if (list.length == 0) {
              this.showDefaultDropDownOnSearch = true;
              return;
            }
            this.showDefaultDropDownOnSearch = false;
            return this.enumDataService.getClientSearchData(state)
          } else {
            this.showDefaultDropDownOnSearch = false;
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      )
  }

  getOrgProfiles() {
    // this.utilService.loader(1)
    let obj = {
      advisorId: this.advisorId,
    }
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        AuthService.setOrgDetails(data);
        // this.utilService.loader(-1);
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
        // this.utilService.loader(-1);
      }
    );
  }

  getPersonalProfiles() {
    // this.utilService.loader(1)
    let obj = {
      id: this.advisorId
    }
    this.settingsService.getPersonalProfile(obj).subscribe(
      data => {
        if (data && data.hasOwnProperty('profilePic')) {
          AuthService.setProfilePic(data.profilePic);
          AuthService.setUserRoleType(data.role || {});
          this.role = AuthService.getUserRoleType().roleName;
          this.roleObj = data.role || {};
        } else {
          AuthService.setProfilePic('/assets/images/svg/comment-icon.svg')
        }
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
        // this.utilService.loader(-1);
      }
    );
  }

  showMainNavWrapper() {
    document.getElementById('d').classList.add('width-230');
    document.getElementById('d').classList.remove('width-70');
    document.getElementById('left').classList.remove('width-60');
    document.getElementById('left').style.marginLeft = '230px';
    document.getElementById('left').style.transition = '0.2s';
    this.showTabs = true;
    this.arrow = false;
  }

  showsmallNavWrapper() {
    document.getElementById('d').classList.remove('width-230');
    document.getElementById('d').classList.add('width-70');
    document.getElementById('left').style.transition = '0.2s';

    this.showTabs = false;
    this.arrow = true;
  }

  onResize() {

    if (window.innerHeight >= 670 || window.innerHeight == 670) {
      this.showSettings = false;
    }
    if (window.innerWidth <= 1100) {
      // this.showTabs = false;
      // $('#left').css('margin-left', '60px');
      // $('#d').addClass('width,60px');
      // $('#d').removeClass('width-230');
      this.showsmallNavWrapper();
    } else {
      if (this.showTabs == false) {
        this.showTabs = false;
      } else {
        // this.showTabs = true;
        // $('#d').addClass('width-230');
        // $('#d').removeClass('width-60');
        this.showMainNavWrapper();
      }
    }
  }

  openSettings() {
    if (this.showSettings == false) {
      // $('#showSettings').css('transition', '0.5s');
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }

  backSections() {
    this.arrow = this.arrow ? this.arrow = false : this.arrow = true;
  }

  logout() {
    this.clientList = [];
    this.enumDataService.setSearchData(this.clientList)
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // prepareRoute(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  // }

  goHome() {
    AuthService.goHome(this.router);
  }
}


export interface Client {
  name: string;
}

