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
  constructor(private backioffice:BackOfficeService,private dataService:EventService) { }
 
  ngOnInit() {
   this.sipCountGet();
  }
  sipCountGet()
  {
    this.backioffice.getSipcountGet(this.teamMemberId).subscribe(
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
  amcwise() {
    this.sipshow = true;
    this.showMainWrapperFlag = false;
  }
  amcWise(value){ 
      this.sipcomponentWise=value;
      this.sipComponent=false; 
  }


}
