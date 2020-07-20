import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-small-saving-mob',
  templateUrl: './small-saving-mob.component.html',
  styleUrls: ['./small-saving-mob.component.scss']
})
export class SmallSavingMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  @Output() outputValue = new EventEmitter<any>();
  totalCurrentValue: any;
  PomisCv: any;
  potdCv: any;
  pordCv: any;
  poSavingCv: any;
  scssCv: any;
  kvpCv: any;
  ssyCv: any;
  nscCv: any;
  ppfCv: any;
  assetSubType: any;
  showBank: boolean;
  ppf: any;
  nsc: any;
  ssy: any;
  kvp: any;
  scss: any;
  poSavings: any;
  poRd: any;
  poTd: any;
  poMis: any;

  constructor(private custumService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.assetSubType = {}
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPpf();
    this.getNsc();
    this.getSsy();
    this.getKvp();
    this.getScss();
    this.getPosaving();
    this.getpord();
    this.getPotd();
    this.getPomis();
  }
  openSubAsset(subAsset) {
    if (subAsset == 'PPF') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.ppf });
    } else if (subAsset == 'NSC') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.nsc });
    } else if (subAsset == 'KVP') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.ssy });
    } else if (subAsset == 'SSY') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.kvp });
    } else if (subAsset == 'SCSS') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.scss });
    } else if (subAsset == 'PO Savings') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.poSavings });
    } else if (subAsset == 'PO RD') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.poRd });
    } else if (subAsset == 'PO TD') {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.poTd });
    } else {
      this.assetSubType = Object.assign(this.assetSubType, { assetType: subAsset });
      this.assetSubType = Object.assign(this.assetSubType, { asset: this.poMis });
    }
    this.showBank = true;
  }
  getPpf() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePPFData(obj).subscribe(
      data => {
        if (data) {
          this.ppf = data
          this.ppfCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getNsc() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeNSCData(obj).subscribe(
      data => {
        if (data) {
          this.nsc = data
          this.nscCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSsy() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => {
        if (data) {
          this.ssy = data
          this.ssyCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getKvp() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => {
        if (data) {
          this.kvp = data
          this.kvpCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getScss() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => {
        if (data) {
          this.scss = data
          this.scssCv = data.sumOfAmountInvested;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getPosaving() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => {
        if (data) {
          this.poSavings = data
          this.poSavingCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getpord() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePORDData(obj).subscribe(
      data => {
        if (data) {
          this.poRd = data
          this.pordCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getPotd() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => {
        if (data) {
          this.poTd = data
          this.potdCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getPomis() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => {
        if (data) {
          this.poMis = data
          this.PomisCv = data.sumOfCurrentValue;
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
    this.totalCurrentValue = (this.ppfCv ? this.ppfCv : 0) + (this.nscCv ? this.nscCv : 0) +
      (this.ssyCv ? this.ssyCv : 0) + (this.kvpCv ? this.kvpCv : 0) +
      (this.scssCv ? this.scssCv : 0) + (this.poSavingCv ? this.poSavingCv : 0) +
      (this.pordCv ? this.pordCv : 0) + (this.potdCv ? this.potdCv : 0) + (this.PomisCv ? this.PomisCv : 0)
  }
}
