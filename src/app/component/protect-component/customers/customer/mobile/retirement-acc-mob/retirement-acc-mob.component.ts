import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-retirement-acc-mob',
  templateUrl: './retirement-acc-mob.component.html',
  styleUrls: ['./retirement-acc-mob.component.scss']
})
export class RetirementAccMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  epfData: any;
  npsData: any;
  gratuity: any;
  totalCurrentValue = 0;
  backToMf;
  @Output() outputValue = new EventEmitter<any>();
  epfCv: any;
  npsCv: any;
  gratuityCv: any;
  assetSubType: any;
  showBank: boolean;

  constructor(private custumService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.assetSubType = {}
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getEpf();
    this.getNps();
    this.getGratuity();
  }
  openSubAsset(subAsset) {
    if (subAsset == 'EPF') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.epfData });
    } else if (subAsset == 'NPS') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.npsData.data });
    } else {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.gratuity });
    }
    this.showBank = true;
  }
  getEpf() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getEPF_EPS(obj).subscribe(
      data => {
        if (data) {
          this.epfData = data;
          this.epfCv = data.sumOfEpfBalanceTillToday;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  getNps() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getNPS(obj).subscribe(
      data => {
        if (data) {
          this.npsData = data;
          this.npsCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  getGratuity() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getGrauity(obj).subscribe(
      data => {
        if (data) {
          this.gratuity = data;
          this.gratuityCv = data.sumOfAmountReceived;
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
    this.totalCurrentValue = (this.epfCv ? this.epfCv : 0) + (this.npsCv ? this.npsCv : 0)
      + (this.gratuityCv ? this.gratuityCv : 0)
  }
}
