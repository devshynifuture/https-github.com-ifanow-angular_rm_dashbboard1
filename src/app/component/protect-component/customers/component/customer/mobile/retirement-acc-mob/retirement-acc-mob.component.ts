import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-retirement-acc-mob',
  templateUrl: './retirement-acc-mob.component.html',
  styleUrls: ['./retirement-acc-mob.component.scss']
})
export class RetirementAccMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  epfData: any;
  npsData: any;
  gratuity: any;
  totalCurrentValue = 0;
  @Output() outputValue = new EventEmitter<any>();

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getEpf();
    this.getNps();
    this.getGratuity();
  }
  getEpf(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getEPF_EPS(obj).subscribe(
      data => {
        if(data){
          this.epfData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  getNps(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getNPS(obj).subscribe(
      data => {
        if(data){
          this.npsData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
     
      }
    );
  }
  getGratuity(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getGrauity(obj).subscribe(
      data => {
        if(data){
          this.gratuity = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
  calculateSum(){
    this.totalCurrentValue = this.epfData.sumOfEpfBalanceTillToday+this.npsData.sumOfCurrentValue+this.gratuity.sumOfAmountReceived
  }
}
