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
  fixdeposit
  backToMf
  constructor(
    public eventService : EventService,
  ) { }

  ngOnInit() {
  }
  addFixedDeposit(){     
      }
}
