import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-real-estate-mob',
  templateUrl: './real-estate-mob.component.html',
  styleUrls: ['./real-estate-mob.component.scss']
})
export class RealEstateMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  realEstateData: any;
  @Output() outputValue = new EventEmitter<any>();
  realEstateCv: any;

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getRealesateDate();
  }
  getRealesateDate(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getRealEstate(obj).subscribe(
      data => {
        if(data){
          this.realEstateData = data;
          this.realEstateCv =data.sumOfMarketValue;
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
}
