import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-sip',
  templateUrl: './sip.component.html',
  styleUrls: ['./sip.component.scss']
})
export class SipComponent implements OnInit {
  teamMemberId=2929;
  sipCount;
  sipComponent : boolean =true;
  sipcomponentWise;
  sipshow: boolean = false;
  showMainWrapperFlag: boolean = true;
  advisorId: any;
  clientId: any;
  expiringSip: any;
  expiredSip:any;
  rejectionSip: any;
  sipPanCount: any;
  wbrCount: any;
  clientWithoutSip=0;
  constructor(private backoffice:BackOfficeService,private dataService:EventService) { }
 
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    setTimeout(() => {
      this.pieChart('pieChartSip');
    }, 1000);
    this.newSip();
    this.ceaseSip();
   this.sipCountGet();
   this.expiredGet();
   this.expiringGet();
   this.sipRejectionGet();
   this.getSipPanCount();

  }
  sipCountGet()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.getSipcountGet(obj).subscribe(
      data =>this.getsipCountGet(data)
    )
  }
  getsipCountGet(data)
  {
    console.log("sip count",data);
    this.sipCount=data;
  }
  getFilerrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss')
   }
   showMainWrapper() {
    this.sipshow = false;
    this.showMainWrapperFlag = true;
  }
  getAllSip()
  {
    const obj={
      limit:20,
      offset:0,
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.allSipGet(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  expiredGet()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      limit:10,
      offset:0,
      parentId:-1  
    }
    this.backoffice.GET_expired(obj).subscribe(
      data =>{
        this.expiredSip=data;
        console.log(data);
      }
    )
  }
  expiringGet()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      limit:10,
      offset:0,
      parentId:-1 
    }
    this.backoffice.GET_EXPIRING(obj).subscribe(
      data =>{
        console.log(data);
        this.expiringSip=data;
      }
    )
  }
  sipRejectionGet()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      limit:10,
      offset:0,
      parentId:-1 
    }
    this.backoffice.GET_SIP_REJECTION(obj).subscribe(
      data =>{
        this.rejectionSip=data;
        console.log(data);
      }
    )
  }
  getSipPanCount()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.sipSchemePanCount(obj).subscribe(
      data =>{
        this.sipPanCount=data.sipCount;
        this.getWbrPanCount();
        console.log(data);
      }
    )
  }
  getWbrPanCount()
  {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.Wbr9anCount(obj).subscribe(
      data =>{
        this.wbrCount=data.folioCount;
        this.clientWithoutSip=((this.sipPanCount)?this.sipPanCount:0/(this.wbrCount)?this.wbrCount:0)*100;
        this.clientWithoutSip=(this.clientWithoutSip)?this.clientWithoutSip:0
        console.log(data);
      }
    )
  }
  amcwise() {
    this.sipshow = true;
    this.showMainWrapperFlag = false;
  }
  amcWise(value){ 
      this.sipcomponentWise=value;
      this.sipComponent=false; 
  }
  newSip(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.newSipGet(obj).subscribe(
      data =>{
       
        console.log(data);
      }
    )
  }
  ceaseSip(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.ceaseSipGet(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  pieChart(id){
    Highcharts.chart('pieChartSip', {
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
      name: 'New',
      color: '#70ca86',
      data: [5, 3, 4, 7, 2]
    }, {
      type: undefined,
        name: 'cease',
        color: '#f05050',
        data: [2, -2, -3, 2, 1]
    }, {
      type: undefined,
        name: 'net',
        color:'#55c3e6',
        data: [3, 4, 4, -2, 5]
    }]
});
  }
 


}
