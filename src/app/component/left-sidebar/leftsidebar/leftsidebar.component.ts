import { ReconciliationService } from 'src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { RoleService } from '../../../auth-service/role.service';
import { MfServiceService } from '../../protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { CustomerOverviewService } from '../../protect-component/customers/component/customer/customer-overview/customer-overview.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { element } from 'protractor';
import { OpenDomainWhiteLabelPopupComponent } from './open-domain-white-label-popup/open-domain-white-label-popup.component';
import { OpenmobilePopupComponent } from './openmobile-popup/openmobile-popup.component';
import { MatDialog } from '@angular/material';

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
  @ViewChild('inputSearch', { static: true }) inputRef: ElementRef;
  logoText = 'Your Logo here';
  role: any;
  isLoding: boolean;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  domainData: any;
  visitedTab = '';
  routedAUMReconTabSubs: Subscription;
  roleData: any;
  element: any;
  getOrgData: any;
  showMobileAD: boolean;
  showDomainAD: boolean;
  showIosAD: boolean;

  constructor(public authService: AuthService, private _eref: ElementRef,
    public dialog: MatDialog,
    protected eventService: EventService, protected subinject: SubscriptionInject,
    private subService: SubscriptionService, private router: Router, private ngZone: NgZone,
    protected dynamicComponentService: DynamicComponentService,
    public enumDataService: EnumDataService,
    private settingsService: SettingsService,
    private auth: AuthService,
    private utilService: UtilService, private peopleService: PeopleService,
    public roleService: RoleService,
    public MfServiceService: MfServiceService,
    private reconService: ReconciliationService,
    private enumService: EnumServiceService,
    private customerOverview: CustomerOverviewService) {
    /*constructor(private router: Router, protected eventService: EventService, protected subinject: SubscriptionInject,
      protected dynamicComponentService: DynamicComponentService, private route: ActivatedRoute,
      private authService: AuthService) {*/
    super(eventService, subinject, dynamicComponentService);
    this.routedAUMReconTabSubs = this.reconService.getRoutedOn()
      .subscribe(value => {
        if (value) {
          this.visitedTab = value;
        } else {
          this.visitedTab = 'cams';
        }
      })
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

  openNew() {
    if (AuthService.getUserInfo()) {
      const obj = {
        // advisorId: AuthService.getAdvisorId()
        userId: AuthService.getUserId(),
        userType: AuthService.getUserInfo().userType
      };

      this.peopleService.generateUUIDForLogin(obj).subscribe(
        data => this.stringRes(data),
      );
    }
  }


  stringRes(data) {
    // const url = 'http://localhost:4100/admin/advisor-marketplace/engage-grow';
    const url = 'https://experts.ifanow.com/admin/advisor-marketplace/engage-grow';
    const outputData = {
      uniqueString: data,
      appName: 'marketplace'
    };
    // const dataString = data.toString();
    const dataString = JSON.stringify(outputData);
    // console.log('dataString : ', dataString);
    // this.getuuid(data);
    window.open(url, dataString);
  }

  /* getuuid(uuid) {
     const obj = {
       uuid: uuid
     }
     this.peopleService.getUUIDLogin(obj).subscribe(
       data => this.uuidRes(data),
     );
   }*/




  getActiveLink(value) {
    const link = this.router.url.split('/')[2];

    switch (link) {
      case 'subscription':
        return link === value ? true : false;

      case 'emails':
        return link === value ? true : false;

      case 'transactions':
        return link === value ? true : false;
    }
  }

  goToSubscriptionValidPage() {
    if (this.roleService.subscriptionPermission.subModule.dashboard.enabled) {
      this.router.navigate(['/admin/subscription/dashboard'])
      return
    }
    if (this.roleService.subscriptionPermission.subModule.clients.enabled) {
      this.router.navigate(['/admin/subscription/clients'])
      return
    }
    if (this.roleService.subscriptionPermission.subModule.subscriptions.enabled) {
      this.router.navigate(['/admin/subscription/subscriptions'])
      return
    }
    if (this.roleService.subscriptionPermission.subModule.quotations.enabled) {
      this.router.navigate(['/admin/subscription/quotations'])
      return
    }
    if (this.roleService.subscriptionPermission.subModule.invoices.enabled) {
      this.router.navigate(['/admin/subscription/invoices'])
      return
    }
    if (this.roleService.subscriptionPermission.subModule.documents.enabled) {
      this.router.navigate(['/admin/subscription/documents'])
      return
    }
  }

  goToPeopleValidPage() {
    if (this.roleService.peoplePermission.subModule.clients.enabled) {
      this.router.navigate(['/admin/people/clients'])
      return
    }
    if (this.roleService.peoplePermission.subModule.leads.enabled) {
      this.router.navigate(['/admin/people/leads'])
      return
    }
  }

  selectClient(singleClientData) {
    if (singleClientData.userType == 3) {
      const obj = {
        clientId: singleClientData.clientId
      };
      this.peopleService.getClientOrLeadData(obj).subscribe(
        data => {
          if (data == undefined) {
            return;
          } else {
            this.auth.setClientData(data);
            this.myControl.setValue(singleClientData.displayName);
            this.ngZone.run(() => {
              this.roleService.getClientRoleDetails(data.roleId, (rolesData) => {
                this.roleService.constructClientDataSource(rolesData);
                let url;
                if (this.roleService.overviewPermission.subModules.profile.enabled) {
                  url = '/customer/detail/overview/profile'
                } else {
                  url = this.roleService.goToValidClientSideUrl();
                }
                this.router.navigate([url], { state: { ...data } });
              });
            });
          }
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.auth.setClientData(singleClientData);
      this.myControl.setValue(singleClientData.displayName);
      const clientRoles = this.enumService.getClientRole();
      if (clientRoles && clientRoles.some(element => element.id === singleClientData.roleId)) {
        this.ngZone.run(() => {
          // this.roleService.getClientRoleDetails(singleClientData.roleId, (rolesData) => {
          //   this.roleService.constructClientDataSource(rolesData);
          let url;
          if (this.roleService.overviewPermission.subModules.profile.enabled) {
            url = '/customer/detail/overview/profile'
          } else {
            url = this.roleService.goToValidClientSideUrl();
          }
          this.router.navigate([url], { state: { ...singleClientData } });
          // });
        });
      } else {
        let url;
        if (this.roleService.overviewPermission.subModules.profile.enabled) {
          url = '/customer/detail/overview/profile'
        } else {
          url = this.roleService.goToValidClientSideUrl();
        }
        this.router.navigate([url], { state: { ...singleClientData } });
      }
    }
  }


  ngOnInit() {
    this.subinject.singleProfileData.subscribe(data => {
      if (data) {
        this.isLoding = false;
        this.showDefaultDropDownOnSearch = false;
        if (this.myControl) {
          this.myControl.setValue(this.myControl.value);
          this.myControl.updateValueAndValidity();
        }
      }
    });
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
    this.roleData = AuthService.getUserRoleType()
      ;
    var waitTime = 30 * 60 * 1000; // = 30min.
    //console.log('enum', this.enumDataService.PRODUCTION)
    if (!this.enumDataService.PRODUCTION) {
      setTimeout(function () {
        if (this.showIosAD == false && this.showMobileAD == false) {
          this.openMobilePopup()
        }
      }, waitTime);
    }
  }

  ngOnDestroy() {
    if (this.routedAUMReconTabSubs) {
      this.routedAUMReconTabSubs.unsubscribe();
    }
  }

  getOrgProfiles() {
    // this.utilService.loader(1)
    const obj = {
      advisorId: this.advisorId,
    };
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        AuthService.setOrgDetails(data);
        // this.utilService.loader(-1);
        this.getOrgData = AuthService.getOrgDetails()
        console.log('getOrgData', this.getOrgData)
        if (this.getOrgData.completeWhiteLabel == "NA") {
          this.showDomainAD = true
        }
        this.showMobileAD = (this.getOrgData.androidStoreUrl) ? true : false
        this.showIosAD = (this.getOrgData.iosStoreUrl) ? true : false
        console.log('this.showDomainAD', this.showDomainAD)
        console.log('this.showIosAD', this.showIosAD)
        console.log('this.showMobileAD', this.showMobileAD)
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.utilService.loader(-1);
      }
    );
  }

  goToDashBoard() {
    if (this.roleService.dashboardPermission.enabled) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/admin/restricted']);
    }
  }

  searchClientFamilyMember(value) {
    if (value.length <= 2) {
      this.showDefaultDropDownOnSearch = false;
      this.isLoding = false;
      this.clientList = undefined;
      return;
    }
    if (!this.clientList) {
      this.showDefaultDropDownOnSearch = true;
      this.isLoding = true;
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
            if (responseArray) {
              if (value.length >= 0) {
                this.clientList = responseArray;
                this.showDefaultDropDownOnSearch = false;
                this.isLoding = false;
              } else {
                this.showDefaultDropDownOnSearch = undefined;
                this.isLoding = undefined;
                this.clientList = undefined;
              }
            } else {
              this.showDefaultDropDownOnSearch = true;
              this.isLoding = false;
              this.clientList = undefined;
            }
          }, error => {
            this.clientList = undefined;
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }

  getPersonalProfiles() {
    // this.utilService.loader(1)
    const obj = {
      id: this.advisorId
    };
    this.settingsService.getPersonalProfile(obj).subscribe(
      data => {
        if (data && data.hasOwnProperty('profilePic')) {
          AuthService.setProfilePic(data.profilePic);
          AuthService.setUserRoleType(data.role || {});
          this.role = AuthService.getUserRoleType().roleName;
          this.roleObj = data.role || {};
          console.log('role', this.roleObj)
        } else {
          AuthService.setProfilePic('/assets/images/svg/comment-icon.svg');
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.utilService.loader(-1);
      }
    );
  }

  showMainNavWrapper() {
    document.getElementById('d').classList.add('width-220');
    document.getElementById('d').classList.remove('width-70');
    document.getElementById('left').classList.remove('width-60');
    document.getElementById('left').style.marginLeft = '220px';
    document.getElementById('left').style.transition = '0.2s';
    this.showTabs = true;
    this.arrow = false;
  }

  showsmallNavWrapper() {
    document.getElementById('d').classList.remove('width-220');
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
    this.customerOverview.clearServiceData();
    this.domainData = AuthService.getDomainDetails();
    this.peopleService.clientList = undefined;
    this.enumDataService.setSearchData(this.clientList);
    this.authService.logout();
    if (this.domainData) {
      let mainDomain;
      let clientSubDomain = this.domainData.hostName;
      mainDomain = `https://www${clientSubDomain.substring(clientSubDomain.indexOf('.'), clientSubDomain.length)}`
      window.open(mainDomain, "_self")
    } else {
      this.router.navigate(['/login'])
    }
    this.MfServiceService.clearStorage();
  }

  // prepareRoute(outlet: RouterOutlet) {
  //   return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  // }

  goHome() {
    AuthService.goHome(this.router);
  }
  domainWhiteLabelling() {
    const dialogRef = this.dialog.open(OpenDomainWhiteLabelPopupComponent, {
      width: '520px',
      data: { reportType: '', selectedElement: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.close()
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
    });
  }
  openMobilePopup() {
    const dialogRef = this.dialog.open(OpenmobilePopupComponent, {
      width: '520px',
      // height: '350px',
      data: { reportType: '', selectedElement: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.close()
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
    });
  }
}


export interface Client {
  name: string;
}

