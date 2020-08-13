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
  bscData = new Date().getTime();
  nscData: any = {};
  goldData: any = {};
  silverData: any = {};
  nifty500Data: any = {};
  letsideBarLoader: boolean;
  deptDataFlag: boolean;
  nifty500DataFlag: boolean;
  bse: any = {};
  nifty50: any = {};
  isLoading: boolean = true;

  constructor(private cusService: CustomerService) {
  }

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
        this.StockFeedFlag = false;
        this.loaderFun()
        console.log(data);
        this.getStockFeedsResponse(data);
      }, error => {
        console.log('get stockfeed error : ', error);
        //this.StockFeedFlag = false;
      });
  }

  getDeptData() {
    this.deptDataFlag = true;
    this.cusService.getDeptData().subscribe(
      data => {
        console.log(data);
        this.deptDataFlag = false;
        this.loaderFun()
        if (data) {
          data.current_value = Math.round(data.current_value.replace(',', ''));
          this.deptData = data;
          this.deptData.change_in_percentage = parseFloat(this.deptData.change_in_percentage);
          data['colourFlag'] = this.checkNumberPositiveAndNegative(data.change_in_percentage);
        }
      }, error => {
        console.log('get DeptData error : ', error);
        this.deptDataFlag = false;

      }
    );
  }

  getStockFeedsResponse(data) {
    //   this.StockFeedFlag = false;
    let { bse_and_nse, carat_22, carat_24, silver } = data;
    if (bse_and_nse) {
      const regex = /\=/gi;

      // bse_and_nse = (bse_and_nse as string).replace(regex, ':');
      bse_and_nse = JSON.parse(bse_and_nse);
      bse_and_nse.date = new Date(bse_and_nse.date).getTime();
      this.bse = JSON.parse(bse_and_nse.bse);
      this.nifty50 = JSON.parse(bse_and_nse.nifty);
      this.bse.current_value = Math.round((this.bse.closing_value).replace(',', ''));
      this.bse.change_in_percentage = parseFloat(this.bse.change_in_percentage).toFixed(2);
      this.bse['colourFlag'] = this.checkNumberPositiveAndNegative(this.bse.change_in_percentage);
      this.nifty50.current_value = Math.round((this.nifty50.closing_value).replace(',', ''));
      this.nifty50.change_in_percentage = parseFloat(this.nifty50.change_in_percentage).toFixed(2);
      this.nifty50['colourFlag'] = this.checkNumberPositiveAndNegative(this.nifty50.change_in_percentage);
    }
    if (carat_22) {
      carat_22 = JSON.parse(carat_22);
      carat_22.change_in_percentage = parseFloat(carat_22.change_in_percentage).toFixed(2);
      carat_22['colourFlag'] = this.checkNumberPositiveAndNegative(carat_22.change_in_percentage.replace('%', ''));
    }
    if (carat_24) {
      carat_24 = JSON.parse(carat_24);
      carat_24.change_in_percentage = parseFloat(carat_24.change_in_percentage).toFixed(2);
      carat_24['colourFlag'] = this.checkNumberPositiveAndNegative(carat_24.change_in_percentage.replace('%', ''));
    }
    if (silver) {
      silver = JSON.parse(silver);
      silver.current_value = (silver.current_value).replace('₹', '');
      silver.current_value = (silver.current_value).replace(',', '');
      silver.current_value = Math.round(silver.current_value);
      silver.change_in_percentage = parseFloat(silver.change_in_percentage).toFixed(2);
      silver['colourFlag'] = this.checkNumberPositiveAndNegative(silver.change_in_percentage);
    }
    // this.bscData = bse_and_nse;
    // this.nscData = nse;
    this.goldData = { carat_24, carat_22 };
    this.silverData = silver;
  }

  getNifty500Data() {
    this.nifty500DataFlag = true;
    this.cusService.getNiftyData().subscribe(
      data => {
        this.nifty500DataFlag = false;
        this.loaderFun()
        console.log(data);
        if (data) {
          data.current_value = Math.round(data.current_value.replace(',', ''));
          data['colourFlag'] = this.checkNumberPositiveAndNegative(data.change_in_percentage.replace('%', ''));
          this.nifty500Data = data;
        }
      }, error => {
        console.log('get getNifty500Data error : ', error);
        this.nifty500DataFlag = false;
      }
    );
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

  loaderFun() {
    if (!this.StockFeedFlag && !this.deptDataFlag && !this.nifty500DataFlag) {
      this.isLoading = false
    } else {
      this.isLoading = true;
    }
  }

}
