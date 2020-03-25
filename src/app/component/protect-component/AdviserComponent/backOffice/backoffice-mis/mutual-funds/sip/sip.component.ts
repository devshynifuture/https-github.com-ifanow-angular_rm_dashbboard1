import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-sip',
  templateUrl: './sip.component.html',
  styleUrls: ['./sip.component.scss']
})
export class SipComponent implements OnInit {
  teamMemberId=2929;
  SipData1;
  sipComponent : boolean =true;
  sipcomponentWise;
  sipshow: boolean = false;
  showMainWrapperFlag: boolean = true;
  constructor(private backoffice:BackOfficeService,private dataService:EventService) { }
 
  ngOnInit() {
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
    this.backoffice.getSipcountGet(this.teamMemberId).subscribe(
      data =>this.getsipCountGet(data)
    )
  }
  getsipCountGet(data)
  {
    console.log("sip count",data);
    this.SipData1=data;
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
      limit:10,
      offset:0,
      teamMemberId:this.teamMemberId
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
      limit:10,
      offset:0,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_expired(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  expiringGet()
  {
    const obj={
      limit:10,
      offset:0,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_EXPIRING(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  sipRejectionGet()
  {
    const obj={
      limit:10,
      offset:0,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.GET_SIP_REJECTION(obj).subscribe(
      data =>{
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
