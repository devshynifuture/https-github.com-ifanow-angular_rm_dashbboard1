import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
import { AuthService } from 'src/app/auth-service/authService';
@Component({
  selector: 'app-sip-client-wise',
  templateUrl: './sip-client-wise.component.html',
  styleUrls: ['./sip-client-wise.component.scss']
})
export class SipClientWiseComponent implements OnInit {
  showLoader=true;
  clientId: any;
  teamMemberId=2929;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
    this.clientId=AuthService.getClientId();
    this.clientWiseClientName()
    this.clientWiseApplicantGet()
  }
  aumReport()
  {
   this.sip.sipComponent=true;
  } 
  clientWiseClientName(){
    const obj={
      clientId:this.clientId,
      schemeCode:'abc-123',
      teamMemberId:this.teamMemberId
    }
    this.backoffice.sipClientWiseClientName(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  }
  clientWiseApplicantGet(){
    const obj={
      clientId:this.clientId,
      teamMemberId:this.teamMemberId
    }
    this.backoffice.sipClientWiseApplicant(obj).subscribe(
      data =>{
        console.log(data);
      }
    )
  } 
}
