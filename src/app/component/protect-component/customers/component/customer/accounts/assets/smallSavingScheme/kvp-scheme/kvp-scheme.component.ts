import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-kvp-scheme',
  templateUrl: './kvp-scheme.component.html',
  styleUrls: ['./kvp-scheme.component.scss']
})
export class KvpSchemeComponent implements OnInit {
  clientId: number;
  advisorId: any;

  constructor(private cusService:CustomerService) { }
  displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];
  datasource;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId=2978;
    this.getKvpSchemedata()
  }
  getKvpSchemedata()
  {
    const obj={
      advisorId:this.advisorId,
      clientId:this.clientId,
      requiredDate:''
    }
    this.cusService.getSmallSavingSchemeKVPData(obj).subscribe(
      data=>this.getKvpSchemedataResponse(data)
    )
  }
  getKvpSchemedataResponse(data)
  {
    this.datasource=data
    console.log(data)
  }
}
