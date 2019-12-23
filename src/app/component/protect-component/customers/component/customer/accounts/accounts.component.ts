import {Router} from '@angular/router';
import {Component, NgZone, OnInit} from '@angular/core';
import {RoutingState} from '../../../../../../services/routing-state.service';
import {EventService} from 'src/app/Data-service/event.service';
import {slideInAnimation} from '../../../../../../animation/router.animation';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [
    slideInAnimation,
  ]
})
export class AccountsComponent implements OnInit {

  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }

  _value: number;
  loading: boolean;
  showRouter = false;
  selected;

  constructor(private eventService: EventService, private router: Router, private ngZone: NgZone,
              public routingStateService: RoutingState) {
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }

  navBarClick(navigationUrl, navId) {
    this.routingStateService.goToSpecificRoute('/customer/detail/account/' + navigationUrl);
    this.value = navId;
  }

  getTabChangeData(data) {
    setTimeout(() => {
      this._value = data;
      this.loading = false;
    }, 300);
    this.ngOnInit()
  }

  ngOnInit() {
    this.showRouter = true;
    this.selected = 1;
    this._value = 1;
    this.loading = false;
    console.log('this is child url now->>>>>', this.router.url.split('/')[3]);
    var roterName = this.router.url.split('/')[3]
    if (roterName=== 'summary') {
      this._value = 1;
    } else if (roterName=== 'assets') {
      this._value = 2;
    } else if (roterName === 'liabilities') {
      this._value = 3;
    } else if (roterName === 'insurance') {
      this._value = 4;
    } else if (roterName === 'documents') {
      this._value = 5;
    }
  }
  goToAdvisorHome() {
    /*this.router.navigateByUrl('/admin/subscription').then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });*/
    // this.locationService.go('/admin/subscription');
    /* this.ngZone.run(() => {
       // this.navigateTo('/');

       this.router.navigate(['/admin', 'subscription'], {/!*replaceUrl: true*!/}).then(e => {
         if (e) {
           // this.router.navigate(['/admin', 'subscription']);
           console.log('Navigation is successful!');
           // this.locationService.go('/admin/subscription');

         } else {
           console.log('Navigation has failed!');
         }
       });
     });*/
    this.showRouter = false;
    setTimeout(() => {
      this.routingStateService.goToSpecificRoute('/admin/subscription/dashboard');
    }, 200);
  }

}
