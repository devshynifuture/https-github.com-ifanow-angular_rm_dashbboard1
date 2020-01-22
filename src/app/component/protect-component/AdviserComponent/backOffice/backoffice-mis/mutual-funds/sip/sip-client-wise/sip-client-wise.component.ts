import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../../../../back-office.service';
import {SipComponent} from '../sip.component';
@Component({
  selector: 'app-sip-client-wise',
  templateUrl: './sip-client-wise.component.html',
  styleUrls: ['./sip-client-wise.component.scss']
})
export class SipClientWiseComponent implements OnInit {
  showLoader=true;
  constructor(private backoffice:BackOfficeService,public sip:SipComponent) { }

  ngOnInit() {
    this.showLoader = false;
  }
  aumReport()
  {
   this.sip.sipComponent=true;
  }  
}
