import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-small-saving-mob',
  templateUrl: './small-saving-mob.component.html',
  styleUrls: ['./small-saving-mob.component.scss']
})
export class SmallSavingMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  @Output() outputValue = new EventEmitter<any>();
  totalCurrentValue: any;
  PomisCv: any;
  potdCv: any;
  pordCv: any;
  poSavingCv: any;
  scssCv: any;
  kvpCv: any;
  ssyCv: any;
  nscCv: any;
  ppfCv: any;

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPpf();
    this.getNsc();
    this.getSsy();
    this.getKvp();
    this.getScss();
    this.getPosaving();
    this.getpord();
    this.getPotd();
    this.getPomis();
  }
  getPpf(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePPFData(obj).subscribe(
      data => {
        if(data){
          this.ppfCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getNsc(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeNSCData(obj).subscribe(
      data => {
        if(data){
          this.nscCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSsy(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => {
        if(data){
          this.ssyCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getKvp(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => {
        if(data){
          this.kvpCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getScss(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => {
        if(data){
          this.scssCv = data.sumOfAmountInvested;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getPosaving(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => {
        if(data){
          this.poSavingCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getpord(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePORDData(obj).subscribe(
      data => {
        if(data){
          this.pordCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getPotd(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => {
        if(data){
          this.potdCv = data.sumOfCurrentValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  } 
  getPomis(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => {
        if(data){
          this.PomisCv = data.sumOfCurrentValue;
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
    this.totalCurrentValue = this.ppfCv+this.nscCv+this.ssyCv+this.kvpCv+this.scssCv+this.poSavingCv+this.pordCv+this.potdCv+this.PomisCv
  }
}
