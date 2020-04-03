import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-aum',
  templateUrl: './aum.component.html',
  styleUrls: ['./aum.component.scss']
})
export class AumComponent implements OnInit {
  viewMode: string;
  showMainWrapperFlag: boolean = true;
  categoryshow: boolean = false;
  showSubTable: boolean = false;
  showAddBtn: boolean = true;
  showRemoveBtn: boolean;
  clientTotalAum;
  amcTotalAum;
  category;
  subcategory;
  MiscData;
  MiscData1;
  aumComponent = true;
  componentWise;
  advisorId: any;


  constructor(private backoffice: BackOfficeService, private dataService: EventService) { }

  teamMemberId = 2929;
  ngOnInit() {
    this.viewMode = 'Select option';
    this.advisorId = AuthService.getAdvisorId();
    setTimeout(() => {
      this.pieChart('pieChartAum');
    }, 1000);
    this.getGraphData();
    this.getTotalAum();
    // this.getSubCatScheme();
    this.getSubCatAum()
    this.getMisData();
  }


  showMainWrapper() {
    this.categoryshow = false;
    this.showMainWrapperFlag = true;
  }

  categorywise() {
    this.categoryshow = true;
    this.showMainWrapperFlag = false;
  }

  showSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = true;
    this.showAddBtn = false;
    this.showRemoveBtn = true;
  }


  hideSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = false;
    this.showAddBtn = true;
    this.showRemoveBtn = false;
  }

  getTotalAum() {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.getClientTotalAUM(obj).subscribe(
      data => this.getFileResponseDataAum(data),
      err => this.getFilerrorResponse(err)
    )
  }
  getMisData() {
    this.backoffice.getMisData(this.advisorId).subscribe(
      data => this.getFileResponseDataForMis(data),
      err => this.getFilerrorResponse(err)
    )
  }
  getSubCatAum() {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:-1,
      parentId:-1
    }
    this.backoffice.getSubCatAum(obj).subscribe(
      data => this.getFileResponseDataForSub(data),
      err => this.getFilerrorResponse(err)
    )
  }

  getSubCatSchemeRes(data) {
    console.log(data);
  }
  getFileResponseDataAum(data) {

    console.log("top clients", data)

    this.clientTotalAum = data.clientTotalAum;
    this.amcTotalAum = data.amcTotalAum;
  }
  getFileResponseDataForMis(data) {
    console.log("mis", data)
    this.MiscData1 = data;
  }
  getFileResponseDataForSub(data) {
    console.log("inside", data)
    this.category = data.category;
    this.subcategory = data.subcategory;
  }
  getFileResponseDataForSubScheme(data) {
    console.log(":", data)
    this.MiscData = data.categories;
  }
  getFileResponseDataForSubSchemeName(data) {
    console.log("scheme Name", data)
  }
  getFilerrorResponse(err) {
    this.dataService.openSnackBar('Something went wrong', 'Dismiss')
  }
  categoryWise(value) {
    this.componentWise = value;
    this.aumComponent = false;
  }
  getGraphData(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:-1,
      parentId:-1
    }
    this.backoffice.aumGraphGet(obj).subscribe(
      data => {
        console.log(data)
      }
    )
  }
  pieChart(id){
    Highcharts.chart('pieChartAum', {
      chart: {
          type: 'column'
      },
      title: {
        text: ''
      },    
      xAxis: {
          categories: ['0-30days', '31-60days ', '61-90days', '91-120days', '121-150days','151-180days']
      },
      credits: {
          enabled: false
      },
      series: [{
        type: undefined ,
        name: 'Purchase',
        color: '#70ca86',
        data: [5, 3, 4, 7, 2]
      }, {
        type: undefined,
          name: 'Redemption',
          color: '#f05050',
          data: [2, -2, -3, 2, 1]
      }, {
        type: undefined,
          name: 'Net Sales',
          color:'#55c3e6',
          data: [3, 4, 4, -2, 5]
      }]
  });
}
}

