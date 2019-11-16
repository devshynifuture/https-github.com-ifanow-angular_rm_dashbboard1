import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-po-td-scheme',
  templateUrl: './po-td-scheme.component.html',
  styleUrls: ['./po-td-scheme.component.scss']
})
export class PoTdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns22 = ['no', 'owner','cvalue','rate','amt','tenure','mvalue','mdate','number','desc','status','icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPoTdSchemedata();
  }
  getPoTdSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId,
      requiredDate:''
    }
    this.cusService.getSmallSavingSchemePOTDData(obj).subscribe(
      data=>this.getPoTdSchemedataResponse(data)
    )
  }
  getPoTdSchemedataResponse(data)
  {
    this.datasource=data
    console.log(data)
  }
}
