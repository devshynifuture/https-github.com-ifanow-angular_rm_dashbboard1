import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-get-small-saving-scheme',
  templateUrl: './get-small-saving-scheme.component.html',
  styleUrls: ['./get-small-saving-scheme.component.scss']
})
export class GetSmallSavingSchemeComponent implements OnInit {
  asset: any[];
  inputData: any;
  backToSS;
  fixdeposit;
  backToMf;
  showDetailedPPF;
  showDetailedKVP;
  showDetailedNSC;
  showDetailedPORD;
  showDetailedPOSavings;
  showDetailedPOTD;
  showDetailedPOMis;
  showDetailedSSY;
  detailedData;
  showDetailedSCSS;
  @Input()
  set data(data) {
    this.inputData = data;
    if(data.asset){
      this.asset = data.asset.assetList
    }else{
      this.asset = []
    }
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
