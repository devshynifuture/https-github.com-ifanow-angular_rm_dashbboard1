import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { FixedDepositMobComponent } from '../fixed-income-mob/fixed-deposit-mob/fixed-deposit-mob.component';
import { upperSliderAnimation, rightSliderAnimation } from 'src/app/animation/animation';

@Component({
  selector: 'app-bank-detailed-assets',
  templateUrl: './bank-detailed-assets.component.html',
  styleUrls: ['./bank-detailed-assets.component.scss'],
  animations: [
    rightSliderAnimation,
    upperSliderAnimation
  ],
})
export class BankDetailedAssetsComponent implements OnInit {

  constructor(
    public eventService : EventService,
  ) { }

  ngOnInit() {
  }
  addFixedDeposit(){
      const fragmentData = {
        flag: 'addNewCustomer',
        id: 1,
        direction: '',
        componentName: FixedDepositMobComponent,
        state: 'open'
      };
      // this.router.navigate(['/subscription-upper'])
      AuthService.setSubscriptionUpperSliderData(fragmentData);
      const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
        upperSliderData => {
          if (UtilService.isDialogClose(upperSliderData)) {
            // this.getClientSubscriptionList();
            subscription.unsubscribe();
          }
        }
      );
      }
}
