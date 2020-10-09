import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ReferEarnService } from '../refer-earn.service';

@Component({
  selector: 'app-refer-earn',
  templateUrl: './refer-earn.component.html',
  styleUrls: ['./refer-earn.component.scss']
})
export class ReferEarnComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  advisorId: any; referedUsers:
    any; userData: any;
  referralCode = new FormControl();
  totalCreditEarn = new FormControl();
  isLoading: boolean;
  constructor(private referEarnService: ReferEarnService, private eventService: EventService) { }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.userData = AuthService.getUserInfo();
    this.referralCode.setValue(this.userData.referralCode)
    this.getReferredusers();
  }
  getReferredusers() {
    this.isLoading = true;
    const obj = { advisorId: this.advisorId }
    this.referEarnService.getReferredusersData(obj)
      .subscribe(data => {
        this.isLoading = false;
        if (data) {
          this.referedUsers = data;
          let totalCreditEarn = 0
          this.referedUsers.forEach(element => {
            totalCreditEarn += element.referralCredit;
          });
          this.totalCreditEarn.setValue(totalCreditEarn);
        }
      })
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.eventService.openSnackBar("Referral code is copied", "Dismiss");
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Amitesh Anand', name: 'Trial user', weight: '₹0' },
  { position: 'Rajan Prakash', name: 'Successfully signed up', weight: '₹2,0000' },
  { position: 'Sunil Kumar', name: 'Successfully signed up', weight: '₹2,000' },
  { position: 'Arnav Pandit', name: 'Successfully signed up', weight: '₹2,000' },

];

