import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-po-rd-scheme',
  templateUrl: './po-rd-scheme.component.html',
  styleUrls: ['./po-rd-scheme.component.scss']
})
export class PoRdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;

  constructor(private cusService:CustomerService) { }
  displayedColumns21 = ['no', 'owner', 'cvalue', 'rate', 'deposit', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getPoRdSchemedata();
  }
  getPoRdSchemedata() {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId,
      requiredDate:''
    }
    this.cusService.getSmallSavingSchemePORDData(obj).subscribe(
      data=>this.getPoRdSchemedataResponse(data)
    )
  }
  getPoRdSchemedataResponse(data)
  {
    this.datasource=data
    console.log(data)
  }
}
