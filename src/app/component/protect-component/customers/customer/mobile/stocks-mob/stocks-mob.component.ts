import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-stocks-mob',
  templateUrl: './stocks-mob.component.html',
  styleUrls: ['./stocks-mob.component.scss']
})
export class StocksMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  stocksData: any;
  backToMf;
  @Output() outputValue = new EventEmitter<any>();
  stockCv: any;

  constructor(private eventService: EventService, private custumService: CustomerService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getStockData();
  }
  changeValue(flag) {
    this.outputValue.emit(flag);
  }
  getStockData() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getAssetStockData(obj).subscribe(
      data => {
        if (data) {
          this.stocksData = data;
          this.stockCv = data.grandTotalCurrentValue;
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
}
