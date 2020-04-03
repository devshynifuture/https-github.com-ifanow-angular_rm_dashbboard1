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
  newSipObj: any;
  ceaseSipObj: any;
  constructor(private backoffice:BackOfficeService,private dataService:EventService) { }
 
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.newSip();
    this.ceaseSip();
   this.sipCountGet();
   this.expiredGet();
   this.expiringGet();
   this.sipRejectionGet();
   this.getSipPanCount();
   setTimeout(() => {
    this.pieChart('pieChartSip');
  }, 1000);

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
       this.newSipObj=data;
       this.newSipObj.forEach(o => {
          o[0]=30;
          o[1]=60;
          o[2]=90;
          o[3]=120
          o[4]=150;
          o[5]=180;
        })
      });
      }
    
  ceaseSip(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.ceaseSipGet(obj).subscribe(
      data =>{
        this.ceaseSipObj=data;
        this.ceaseSipObj.forEach(o => {
          o[0]=30;
          o[1]=60;
          o[2]=90;
          o[3]=120
          o[4]=150;
          o[5]=180;
        })
      }
    )
  }
  
  getValuesForGraph(days) {
   var obj={
    newSipAmount:null,
    ceaseSipAmount:null,
    net:null
   };
   obj.newSipAmount= this.newSipObj.filter(element => element.days ==days);
   obj.newSipAmount = (obj.newSipAmount[0].totalAmount)?obj.newSipAmount[0].totalAmount:0

    obj.ceaseSipAmount=this.ceaseSipObj.filter(element => element.days ==days);
    obj.ceaseSipAmount = (obj.ceaseSipAmount[0].totalAmount)?obj.ceaseSipAmount[0].totalAmount:0

    obj.net=obj.newSipAmount - obj.ceaseSipAmount
  return obj;
  }
  pieChart(id){
      var obj30 =this.getValuesForGraph(30)
      var obj60 =this.getValuesForGraph(60)
      var obj90 =this.getValuesForGraph(90)
      var obj120 =this.getValuesForGraph(120)
      var obj150 =this.getValuesForGraph(150)
      var obj180 =this.getValuesForGraph(180)
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
      data: [obj30.newSipAmount,obj60.newSipAmount,obj90.newSipAmount,obj120.newSipAmount,obj150.newSipAmount,obj180.newSipAmount]
    }, {
      type: undefined,
        name: 'cease',
        color: '#f05050',
        data: [obj30.ceaseSipAmount,obj60.ceaseSipAmount,obj90.ceaseSipAmount,obj120.ceaseSipAmount,obj150.ceaseSipAmount,obj180.ceaseSipAmount]
    }, {
      type: undefined,
        name: 'net',
        color:'#55c3e6',
        data: [obj30.net,obj60.net,obj90.net,obj120.net,obj150.net,obj180.net]
    }]
});
  }
 


}
