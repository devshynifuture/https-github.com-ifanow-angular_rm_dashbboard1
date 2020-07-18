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
  showDetailedPPF:boolean=false;
  showDetailedKVP : boolean = false;
  showDetailedNSC : boolean = false;
  showDetailedPORD : boolean = false;
  showDetailedPOSavings : boolean = false;
  showDetailedPOTD : boolean = false;
  showDetailedPOMis : boolean = false;
  showDetailedSSY : boolean = false;
  detailedData;
  showDetailedSCSS : boolean = false;
  showDetailed: boolean;
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
  openDetailed(item){
    console.log('sdgfhkjagdshjfghjdgas',item) 
    this.detailedData = item;
    if(this.inputData.assetType == 'PPF'){
          this.showDetailedPPF = true
    }else if(this.inputData.assetType == 'KVP'){
          this.showDetailedKVP = true
    }else if(this.inputData.assetType == 'SCSS'){
      this.showDetailedSCSS = true      
    }else if(this.inputData.assetType == 'SSY'){
      this.showDetailedSSY = true      
    }else if(this.inputData.assetType == 'PO RD'){
      this.showDetailedPORD = true      
    }else if(this.inputData.assetType == 'PO TD'){
      this.showDetailedPOTD = true      
    }else if(this.inputData.assetType == 'PO Savings'){
      this.showDetailedPOSavings = true      
    }else if(this.inputData.assetType == 'PO Mis'){
      this.showDetailedPOMis = true      
    }else if(this.inputData.assetType == 'NSC'){
      this.showDetailedNSC = true
    }
  }
}
