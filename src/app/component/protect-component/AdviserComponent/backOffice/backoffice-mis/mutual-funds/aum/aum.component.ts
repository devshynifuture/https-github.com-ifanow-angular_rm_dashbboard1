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
  arnRiaList: any;
  aumGraph:any

  constructor(private backoffice: BackOfficeService, private dataService: EventService) { }

  teamMemberId = 2929;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

    this.viewMode = 'Select option';
    this.getArnRiaList();
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
  getArnRiaList(){
    this.backoffice.getArnRiaList(this.advisorId).subscribe(
      data =>{

        this.arnRiaList=data;
        const obj = {
          number: 'All'
        }
        this.arnRiaList.push(obj);
    },
    )
  }
  showSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = true;
    this.showAddBtn = false;
    this.showRemoveBtn = true;
  }
  display(value){
    this.aumComponent=true;
    setTimeout(() => {
      this.pieChart('pieChartAum',this.aumGraph);
    }, 1000);
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
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.aumGraphGet(obj).subscribe(
      data => {
        this.aumGraph=data;
        setTimeout(() => {
          this.pieChart('pieChartAum',data);
        }, 1000);
        console.log(data)
      }
    )
  }
  pieChart(id,obj){
    var obj1 = obj[obj.length - 1]
    var obj2 = obj[obj.length - 2]
    var obj3 = obj[obj.length - 3]
    var obj4 = obj[obj.length - 4]
    var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    Highcharts.chart('pieChartAum', {
      chart: {
          type: 'column'
      },
      title: {
        text: ''
      },    
      xAxis: {
          categories: [months[obj1.Month]+'-'+obj1.Year,months[obj2.Month]+'-'+obj2.Year,months[obj3.Month]+'-'+obj3.Year,months[obj4.Month]+'-'+obj4.Year]
      },
      credits: {
          enabled: false
      },
      series: [{
        type: undefined ,
        name: 'Purchase',
        color: '#70ca86',
        data: [obj1.GrossSale,obj2.GrossSale,obj3.GrossSale,obj4.GrossSale]
      }, {
        type: undefined,
          name: 'Redemption',
          color: '#f05050',
          data: [obj1.Redemption,obj2.Redemption,obj3.Redemption,obj4.Redemption]
      }, {
        type: undefined,
          name: 'Net Sales',
          color:'#55c3e6',
          data: [obj1.GrossSale + obj1.Redemption,obj2.GrossSale + obj2.Redemption,obj3.GrossSale + obj3.Redemption,obj4.GrossSale + obj4.Redemption]
      }]
  });
}
}

