import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss']
})
export class KeyInfoComponent implements OnInit {
  // displayedColumns = ['year', 'value', 'fvalue', 'equity','debt','equity1','debt1'];
  // dataSource = ELEMENT_DATA;

  
  @Input() data: any = {};
  @Input() popupHeaderText: string = 'KEY INFO';

  constructor(private subInjectService: SubscriptionInject,   
     public utils: UtilService,
    ) { }

  ngOnInit() {
    console.log('key info ==',this.data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
// export interface PeriodicElement {
//   year: string;
//   value: string;
//   fvalue: string;
//   equity: string;
//   debt:string;
//   equity1:string;
//   debt1:string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
//   {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
//   {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
//   {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
// ];