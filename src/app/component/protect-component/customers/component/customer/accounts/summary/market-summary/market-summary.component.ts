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
  deptData: any = {};
  bscData: any = {};
  nscData: any = {};
  goldData: any = {};
  silverData: any = {};
  nifty500Data: any = {};
  letsideBarLoader: boolean;
  deptDataFlag: boolean;
  nifty500DataFlag: boolean;

  constructor(private cusService: CustomerService) { }

  ngOnInit() {
    this.getStockFeeds();
    this.getDeptData();
    this.getNifty500Data();
  }
  getStockFeeds() {
    this.letsideBarLoader = true;
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
    this.deptDataFlag = true
    this.cusService.getDeptData().subscribe(
      data => {
        console.log(data);
        if (data) {
          this.deptDataFlag = false;
          data.current_value = Math.round(data.current_value.replace(',', ''));
          this.deptData = data;
          this.deptData.change_in_percentage = parseFloat(this.deptData.change_in_percentage)
          data['colourFlag'] = this.checkNumberPositiveAndNegative(data.change_in_percentage)
        }
      }
    )
  }

  getStockFeedsResponse(data) {
    this.StockFeedFlag = false;
    this.letsideBarLoader = false;
    const { bse, nse, gold, silver } = data;
    bse.date = new Date(bse.date).getTime();
    if (bse) {
      bse.current_value = Math.round((bse.current_value).replace(',', ''));
      bse.change_in_percentage = parseFloat(bse.change_in_percentage).toFixed(2);
      bse['colourFlag'] = this.checkNumberPositiveAndNegative(bse.change_in_percentage)
    }
    if (nse) {
      nse.current_value = Math.round((nse.current_value).replace(',', ''));
      nse.change_in_percentage = parseFloat(nse.change_in_percentage).toFixed(2);
      nse['colourFlag'] = this.checkNumberPositiveAndNegative(nse.change_in_percentage)
    }
    if (gold) {
      gold.carat_22.change_in_percentage = parseFloat(gold.carat_22.change_in_percentage).toFixed(2);
      gold.carat_22['colourFlag'] = this.checkNumberPositiveAndNegative(gold.carat_22.change_in_percentage.replace('%', ''))
      gold.carat_24.change_in_percentage = parseFloat(gold.carat_24.change_in_percentage).toFixed(2);
      gold.carat_24['colourFlag'] = this.checkNumberPositiveAndNegative(gold.carat_24.change_in_percentage.replace('%', ''))
    }
    if (silver) {
      silver.current_value = (silver.current_value).replace('₹', '')
      silver.current_value = (silver.current_value).replace(',', '')
      silver.current_value = Math.round(silver.current_value);
      silver.change_in_percentage = parseFloat(silver.change_in_percentage).toFixed(2);
      silver['colourFlag'] = this.checkNumberPositiveAndNegative(silver.change_in_percentage)
    }
    this.bscData = bse;
    this.nscData = nse;
    this.goldData = gold;
    this.silverData = silver;
  }
  getNifty500Data() {
    this.nifty500DataFlag = true;
    this.cusService.getNiftyData().subscribe(
      data => {
        console.log(data);
        if (data) {
          data.current_value = Math.round(data.current_value.replace(',', ''));
          this.nifty500DataFlag = false
          data['colourFlag'] = this.checkNumberPositiveAndNegative(data.change_in_percentage.replace('%', ''))
          this.nifty500Data = data;
        }
      }
    )
  }
  checkNumberPositiveAndNegative(value) {
    if (value == 0) {
      return undefined;
    } else {
      const number = Number(value);
      const result = Math.sign(number);
      return (result == -1) ? false : true;
    }
  }
  onValChange(value) {
    this.selectedVal = value;
  }

}
