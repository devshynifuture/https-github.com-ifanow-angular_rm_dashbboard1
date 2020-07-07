import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../auth-service/authService';
import { DialogContainerComponent } from '../../../../../common/dialog-container/dialog-container.component';
import { EventService } from '../../../../../Data-service/event.service';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { DynamicComponentService } from '../../../../../services/dynamic-component.service';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from '../../../../../animation/animation';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumDataService } from '../../../../../services/enum-data.service';
import { ChangeClientPasswordComponent } from './customer-overview/overview-profile/change-client-password/change-client-password.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  //templateUrl: './customer.mobile.component.html',
  //templateUrl: './transact-mob.html',
  // templateUrl: './document-mob.html',
  styleUrls: ['./customer.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
export class CustomerComponent extends DialogContainerComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  status = false;
  loading: boolean;
  user: any;

  organizationLogo = 'https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png';
  advisorName: any;
  role: any;
  clientName: any;
  userInfo: any;

  constructor(
    private router: Router,
    protected eventService: EventService,
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private peopleService: PeopleService,
    private _formBuilder: FormBuilder,
    private enumDataService: EnumDataService,
  ) {
    super(eventService, subinject, dynamicComponentService);
    this.user = AuthService.getUserInfo();
    // if (router.getCurrentNavigation().extras.state && router.getCurrentNavigation().extras.state.clientId) {
    //   this.getClientData(router.getCurrentNavigation().extras.state);
    // }
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }

  _value: number;
  selected: number;
  clientId;
  overview = false;
  plans = false;
  activity = false;
  accounts = false;
  transact = false;
  currentUrl: string;
  clientData: any;
  showRouter = false;

  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  getTabChangeData(data) {
    setTimeout(() => {
      this.value = data;
    }, 300);
  }


  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    if (!this.enumDataService.searchData || this.enumDataService.searchData.length == 0) {
      this.enumDataService.searchClientList();
      this.enumDataService.searchClientAndFamilyMember();
    }
    this.userInfo = AuthService.getUserInfo();
    this.advisorName = AuthService.getUserInfo().name;
    this.role = AuthService.getUserRoleType().roleName;
    this.clientName = AuthService.getClientData().userName;
    this.clientData = AuthService.getClientData();
    this.showRouter = true;
    this.selected = 1;
    this._value = 1;
    this.loading = false;
    const routeName = this.router.url.split('/')[3];
    if (routeName == 'overview') {
      this.value = 1;
    } else if (routeName == 'account') {
      this.value = 2;
    } else if (routeName == 'plan') {
      this.value = 3;
    } else if (routeName == 'activity') {
      this.value = 4;
    } else if (routeName == 'transact') {
      this.value = 5;
    }

    this.selected = 2;
    const passedParameter = history.state;
    this.clientId = passedParameter ? passedParameter.id : undefined;
    this.clientId = AuthService.getClientId();

  }

  getClientData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        console.log('ClientBasicDetailsComponent getClientOrLeadData data: ', data);
        if (data == undefined) {
          return;
        } else {
          this.authService.setClientData(data);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  openChangePassword(value, data) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: ChangeClientPasswordComponent,

    };
    const rightSideDataSub = this.subinject.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  logout() {
    this.enumDataService.setSearchData([]);
    // if (!this.authService.isAdvisor()) {
    this.authService.logout();
    this.router.navigate(['/login']);
    // }
  }

  goHome() {
    AuthService.goHome(this.router);
  }
}
