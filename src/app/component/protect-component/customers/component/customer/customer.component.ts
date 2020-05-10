import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../../auth-service/authService';
import {DialogContainerComponent} from '../../../../../common/dialog-container/dialog-container.component';
import {EventService} from '../../../../../Data-service/event.service';
import {SubscriptionInject} from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {DynamicComponentService} from '../../../../../services/dynamic-component.service';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../../../../animation/animation';
import {PeopleService} from '../../../PeopleComponent/people.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
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
  user:any;

  constructor(
    private router: Router, 
    protected eventService: EventService, 
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService, 
    private route: ActivatedRoute,
    private authService: AuthService, 
    private peopleService: PeopleService, 
    private _formBuilder: FormBuilder
  ) {
    super(eventService, subinject, dynamicComponentService);
    this.user = AuthService.getUserInfo();
    if (router.getCurrentNavigation().extras.state && router.getCurrentNavigation().extras.state.clientId) {
      this.getClientData(router.getCurrentNavigation().extras.state);
    }
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

  logout() {
    // if (!this.authService.isAdvisor()) {
    this.authService.logout();
    this.router.navigate(['/login']);
    // }
  }
}
