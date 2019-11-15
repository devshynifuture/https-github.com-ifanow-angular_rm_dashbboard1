import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-nsc-scheme',
  templateUrl: './nsc-scheme.component.html',
  styleUrls: ['./nsc-scheme.component.scss']
})
export class NscSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns17 = ['no', 'owner','cvalue','rate','mvalue','mdate','number','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getNscSchemedata();
  }
  getNscSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId
    }
    this.cusService.getSmallSavingSchemeNSCData(obj).subscribe(
      data=>this.getNscSchemedataResponse(data)
    )
  }
  getNscSchemedataResponse(data)
  {
   console.log(data,"NSC")
   this.datasource=data
  }
}