import {Router} from '@angular/router';
import {Component, NgZone, OnInit} from '@angular/core';
import {RoutingState} from "../../../../../../services/routing-state.service";
import {EventService} from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  _value: number;
  loading: boolean;
  showRouter = false;

  set value(value: number) {
    console.log('now value is ->>>>', value);
    this._value = value;
  }

  constructor(private eventService: EventService, private router: Router, private ngZone: NgZone, private routingStateService: RoutingState) {
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
      );
  }
  getTabChangeData(data){
    setTimeout(() => {
    this._value = data
    this.loading = false
    }, 300);
  }
  selected;

  ngOnInit() {
    this.showRouter = true;
    this.selected = 1;
     this.loading = false
    console.log('this is child url now->>>>>', this.router.url.split('/')[3]);
    if (this.router.url.split('/')[3] === 'summary') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] === 'assets') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] === 'liabilities') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] === 'insurance') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] === 'documents') {
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
