import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Component({
  selector: 'app-market-summary',
  templateUrl: './market-summary.component.html',
  styleUrls: ['./market-summary.component.scss']
})
export class MarketSummaryComponent implements OnInit {
  selectedVal: string;
  StockFeedFlag: boolean;
  deptData: any;
  bscData: any;
  nscData: any;
  goldData: any;
  silverData: any;
  nifty500Data: any;

  constructor(private cusService: CustomerService) { }

  ngOnInit() {
    this.getStockFeeds();
    this.getDeptData();
    this.getNifty500Data();
  }
  getStockFeeds() {
    this.selectedVal = 'Equities';
    this.StockFeedFlag = true;
    this.cusService.getStockFeeds().subscribe(
      data => {
        console.log(data);
        this.getStockFeedsResponse(data)
      }
    )
  }
  getDeptData() {
    this.cusService.getDeptData().subscribe(
      data => {
        console.log(data);
        this.deptData = data;
        this.deptData.change_in_percentage = parseFloat(this.deptData.change_in_percentage)

      }
    )
  }

  getStockFeedsResponse(data) {
    this.StockFeedFlag = false;
    const { bse, nse, gold, silver } = data;
    bse.date = new Date(bse.date).getTime();
    bse.change_in_percentage = parseFloat(bse.change_in_percentage).toFixed(2);
    nse.change_in_percentage = parseFloat(nse.change_in_percentage).toFixed(2);
    if (gold) {
      gold.carat_22.change_in_percentage = parseFloat(gold.carat_22.change_in_percentage).toFixed(2);
      gold.carat_24.change_in_percentage = parseFloat(gold.carat_24.change_in_percentage).toFixed(2);
    }
    silver.change_in_percentage = parseFloat(silver.change_in_percentage).toFixed(2);
    this.bscData = bse;
    this.nscData = nse;
    this.goldData = gold;
    this.silverData = silver;
  }
  getNifty500Data() {
    this.cusService.getNiftyData().subscribe(
      data => {
        console.log(data);
        this.nifty500Data = data;
      }
    )
  }
  checkNumberPositiveAndNegative(value: number) {
    if (value == 0) {
      return undefined;
    } else {
      const result = Math.sign(value);
      return (result == -1) ? false : true;
    }
  }
  onValChange(value) {
    this.selectedVal = value;
  }

}
