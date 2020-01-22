import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
@Component({
  selector: 'app-sip-amc-wise',
  templateUrl: './sip-amc-wise.component.html',
  styleUrls: ['./sip-amc-wise.component.scss']
})
export class SipAmcWiseComponent implements OnInit {
  showLoader=true;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }
  teamMemberId=2929;

  ngOnInit() {
    this.showLoader = false;
  }

  aumReport()
  {
   this.sip.sipComponent=true;
  }  
}
