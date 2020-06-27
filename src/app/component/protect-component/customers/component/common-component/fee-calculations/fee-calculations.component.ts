import { Component, OnInit, Input } from '@angular/core';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "ICICI Top 100 fund - weekly dividend plan regular", name: 'Liquid', weight: "47,240", symbol: '12,000' },
  { position: "DSP Equity Fund", name: 'Liquid', weight: "36,005", symbol: '1,400' },

];
@Component({
  selector: 'app-fee-calculations',
  templateUrl: './fee-calculations.component.html',
  styleUrls: ['./fee-calculations.component.scss']
})

export class FeeCalculationsComponent implements OnInit {
  @Input() padding;
  directDataSource: any;
  regulatDataSource: any;
  otherAssets: any;
  directTotal: any = 0;
  directTotalValue: any;
  otherAssetTotalValue: any;
  regularTotalValue: any;
  TotalValue: any = 0;
  share: any;
  @Input() feeAmount;
  splitRatioValue: any;
  feeCalculationDataLength: any;
  @Input() set feeCalculationData(data) {
    if (data.invoiceFeeCalculation) {
      this.feeCalculationDataLength = data.invoiceFeeCalculation.length;
      let feeCalculationData = data.invoiceFeeCalculation;
      this.share = data.share
      feeCalculationData.forEach(element => {
        element['fees'] = Math.round(element.fees);
        element['avgAum'] = Math.round(element.avgAum);
        this.TotalValue += element.fees
      });
      this.splitRatioValue = this.TotalValue * this.share
      this.splitRatioValue = this.splitRatioValue / 100;
      this.directDataSource = feeCalculationData.filter(element => element.directOrRegular == 1);
      this.regulatDataSource = feeCalculationData.filter(element => element.directOrRegular == 2);
      this.otherAssets = feeCalculationData.filter(element => element.directOrRegular == 0);
      if (this.directDataSource.length > 0) {
        this.directTotalValue = this.calculateTotal(this.directDataSource, 0)
      }
      if (this.regulatDataSource.length > 0) {
        this.regularTotalValue = this.calculateTotal(this.regulatDataSource, 0)
      }
      if (this.otherAssets.length > 0) {
        this.otherAssetTotalValue = this.calculateTotal(this.otherAssets, 0)
      }
    }
  };

  calculateTotal(data, totalValue) {
    data.map(element => {
      totalValue += Math.round(element.fees);
    })
    return totalValue
  }

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
