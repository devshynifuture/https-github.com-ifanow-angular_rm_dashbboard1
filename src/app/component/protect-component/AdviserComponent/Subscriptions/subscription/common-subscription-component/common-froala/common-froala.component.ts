/*
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss']
})
export class CommonFroalaComponent implements OnInit {
  showActivityLog: boolean;

  constructor(public subInjectService: SubscriptionInject)  { }

  ngOnInit() {
    this.showActivityLog=false;
  }
  Close(value) {
    if(this.showActivityLog==true){
      this.showActivityLog=false;
    }else{
    this.subInjectService.rightSideData(value);
    }
  }
  openFroala()
  {
    this.showActivityLog=true;
  }
  cancel()
  {
    this.showActivityLog=false;
  }
}
*/
import {Component, Input, Output, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SubscriptionInject} from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonFroalaComponent),
      multi: true
    }
  ]
})
export class CommonFroalaComponent implements ControlValueAccessor, OnInit {
  dataSub: any;
  storeData: any;

  constructor(public subInjectService: SubscriptionInject , public eventService:EventService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data=>this.getcommanFroalaData(data)
    );
  }

  @Input() screenType;
  @Input() changeFooter;
  @Input() changeEmailOnly;
  showActivityLog: boolean;

  // End ControlValueAccesor methods.

  model: any;

  config: Object = {
    charCounterCount: false
  };

  ngOnInit() {
    this.showActivityLog = false;
    console.log('CommonFroalaComponent ngOnInit screenType: ', this.screenType);
    console.log(this.changeEmailOnly)
  }
  getcommanFroalaData(data)
  {
    this.storeData=data;
  }
  Close(value) {
    if (this.showActivityLog == true) {
      this.showActivityLog = false;
    } else {
      this.subInjectService.rightSideData(value);
    }
  }

  openFroala() {
    this.showActivityLog = true;
  }

  cancel() {
    this.showActivityLog = false;
  }

  // Begin ControlValueAccesor methods.
  onChange = (_) => {
  }
  onTouched = () => {
  }

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  Open(value,state,data)
  {
    this.eventService.sidebarData(value)
    this.subInjectService.rightSideData(state);    
    this.subInjectService.addSingleProfile(data);
  }
}
