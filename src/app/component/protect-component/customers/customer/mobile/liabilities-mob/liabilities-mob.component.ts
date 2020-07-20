import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-liabilities-mob',
  templateUrl: './liabilities-mob.component.html',
  styleUrls: ['./liabilities-mob.component.scss']
})
export class LiabilitiesMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  @Output() outputValue = new EventEmitter<any>();
  liabilityCv: any;
  otherPayableCv: any;
  totalCurrentValue: any;
  showDetail
  liabilityData: any;
  otherPayableeData: any;
  assetSubType = { assetType: '', data: '' };

  constructor(private custumService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getLiabilities();
    this.getOtherPayables();
  }
  getLiabilities() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getLiabilty(obj).subscribe(
      data => {
        if (data) {
          this.liabilityData = data;
          this.liabilityCv = data.totalLoanAmount;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  getOtherPayables() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getOtherPayables(obj).subscribe(
      data => {
        if (data) {
          this.otherPayableeData = data;
          this.otherPayableCv = 0
          data.forEach(element => {
            this.otherPayableCv += element.amountBorrowed
          });
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  changeValue(flag) {
    this.outputValue.emit(flag);
  }
  calculateSum() {
    this.totalCurrentValue = (this.liabilityCv ? this.liabilityCv : 0) + (this.otherPayableCv ? this.otherPayableCv : 0)
  }
  openSubAsset(subAsset, value) {
    this.assetSubType.assetType = subAsset;
    this.assetSubType.data = value;
  }
}
