import {Component, OnInit} from '@angular/core';
import {RoutingState} from "../../../../../../services/routing-state.service";

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {

  constructor(private routingStateService: RoutingState) {
  }

  ngOnInit() {
    console.log('customer activity');
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

    this.routingStateService.goToSpecificRoute('/admin/subscription');
  }
}
