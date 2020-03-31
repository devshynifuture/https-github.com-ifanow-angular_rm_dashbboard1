import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

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
  constructor(private backoffice:BackOfficeService,private dataService:EventService) { }
 
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
   this.sipCountGet();
   this.getAllSip();
   this.expiredGet();
   this.expiringGet();
   this.sipRejectionGet();
   this.schemeSearchGet();
   this.clientSearchGet();
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
  schemeSearchGet()
  {
    const obj={
      schemeName:'Aditya Birla',
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_SIP_SCHEME_SEARCH(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  clientSearchGet()
  {
    const obj={
      clientName:'Ronak Hindocha',
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_SIP_REJECTION(obj).subscribe(
      data =>{
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


}
