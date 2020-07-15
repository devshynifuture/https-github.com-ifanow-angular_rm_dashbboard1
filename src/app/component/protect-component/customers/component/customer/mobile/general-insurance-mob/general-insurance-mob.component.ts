import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-general-insurance-mob',
  templateUrl: './general-insurance-mob.component.html',
  styleUrls: ['./general-insurance-mob.component.scss']
})
export class GeneralInsuranceMobComponent implements OnInit {
  @Output() outputValue = new EventEmitter<any>();
  advisorId: any;
  clientId: any;
  fireCv: any;
  HomewCv: any;
  travelCv: any;
  motorCv: any;
  criticalIllnessCv: any;
  personalAccidentCv: any;
  HealthCv: any;
  totalCurrentValue: any;

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getHealthInsurance();
    this.getPersonalAccidentInsurance();
    this.getCriticalIllnessInsurance();
    this.getMotorInsurance();
    this.getTravelInsurance();
    this.getHomeInsurance();
    this.getFireInsurance();
  }
  getHealthInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 5,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.HealthCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getPersonalAccidentInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 7,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.personalAccidentCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getCriticalIllnessInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 6,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.criticalIllnessCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getMotorInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 4,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.motorCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getTravelInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 8,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.travelCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getHomeInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 10,
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.HomewCv = data.totalSumInsured;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getFireInsurance(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      insuranceSubTypeId: 1,
      insuranceTypeId: 1
    };
    this.custumService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if(data){
          this.fireCv = data.totalSumInsured;
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
          this.totalCurrentValue = this.HealthCv+this.personalAccidentCv+this.criticalIllnessCv+this.motorCv+this.travelCv+this.HomewCv+this.fireCv
  }
}
