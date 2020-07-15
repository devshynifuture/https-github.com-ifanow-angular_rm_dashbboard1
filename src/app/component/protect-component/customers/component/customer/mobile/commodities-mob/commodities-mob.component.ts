import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-commodities-mob',
  templateUrl: './commodities-mob.component.html',
  styleUrls: ['./commodities-mob.component.scss']
})
export class CommoditiesMobComponent implements OnInit {
  @Output() outputValue = new EventEmitter<any>();
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  goldData: any;
  othersData: any;

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getGold();
    this.getOthers();
  }
  getGold(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getGold(obj).subscribe(
      data => {
        if(data){
          this.goldData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  getOthers(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getOthers(obj).subscribe(
      data => {
        if(data){
          this.othersData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  calculateSum(){
    this.totalCurrentValue = this.goldData.sumOfMarketValue+this.othersData.sumOfMarketValue
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
}
