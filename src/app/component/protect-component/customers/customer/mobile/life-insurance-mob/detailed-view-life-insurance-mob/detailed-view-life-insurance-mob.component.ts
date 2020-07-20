import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-view-life-insurance-mob',
  templateUrl: './detailed-view-life-insurance-mob.component.html',
  styleUrls: ['./detailed-view-life-insurance-mob.component.scss']
})
export class DetailedViewLifeInsuranceMobComponent implements OnInit {
  _data: any;
  insuranceSubTypeId: any;
  showInsurance: string;
  nominee: any;
  cashFlowList: any;
  bankList: any;
  backPage = false;
  @Output() outputValue = new EventEmitter<any>();

  constructor(private enumService: EnumServiceService) { }
  @Input()
  set data(inputData) {
    this._data = inputData;
    this.insuranceSubTypeId = this._data.insuranceSubTypeId;
    this.showInsurance = (this._data.insuranceSubTypeId == '1') ? 'Term insurance' : (this._data.insuranceSubTypeId == '2') ? 'Traditional insurance' : (this._data.insuranceSubTypeId == '3') ? 'ULIP' : 'Life insurance';
    console.log('AddLiabilitiesCompon.insuranceSubTypeIdent.insuranceSubTypeId Input data : ', this._data);
    this.nominee = this._data.nominees;
    this.cashFlowList = this._data.insuranceCashflowList;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);

  }
  get data() {
    return this._data;
  }
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.bankList.forEach(element => {
      if (element.id == this._data.linkedBankAccountId) {
        this._data.bankName = element.bankName;
      }
    });
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }

}
