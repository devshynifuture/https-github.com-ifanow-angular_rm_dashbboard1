import { SupportUpperService } from './../support-upper.service';
import { EventService } from './../../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-support-upper-all-rta',
  templateUrl: './support-upper-all-rta.component.html',
  styleUrls: ['./support-upper-all-rta.component.scss']
})
export class SupportUpperAllRtaComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  isLoading: boolean = false;
  schemeControl: FormControl = new FormControl();
  errorMsg: string;
  filteredSchemes: any[] = [];
  isLoadingForDropDown: boolean = false;
  filteredSchemeError: boolean;
  selectedElement: any;
  apiCallingStack: any = [];

  constructor(
    private eventService: EventService,
    private supportUpperService: SupportUpperService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.schemeControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredSchemes = [];
          this.isLoadingForDropDown = true;
        }),
        switchMap(value => this.getFilteredSchemesList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.apiCallingStack = [];
        this.filteredSchemes = data;
        console.log("this is what i need::::::::", data);
        this.checkIfDataNotPresentAndShowError(data);
        console.log(this.filteredSchemes);
      });
  }

  mapSchemeCodeAndOther(element, scheme) {
    element.schemeCode = scheme.schemeCode;
    element.njCount = scheme.njCount;
  }

  checkIfDataNotPresentAndShowError(data) {
    if (data && data.length > 0) {
      this.filteredSchemeError = false;
    } else {
      this.filteredSchemeError = true;
      this.errorMsg = 'No data Found';
    }
  }

  getFilteredSchemesList(value) {
    if (value === '') {
      let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
      if (this.apiCallingStack[1] !== threeWords) {
        return this.supportUpperService.getFilteredSchemes({ scheme: threeWords });
      }
    } else {
      return this.supportUpperService.getFilteredSchemes({ scheme: value });
    }
  }

  mapUnmappedSchemes(element) {
    console.log(element);
  }

  dialogClose() {
    console.log('close');
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  showSuggestionsBasedOnSchemeName(element) {
    console.log(element);
    this.selectedElement = element;
    this.isLoadingForDropDown = true;
    let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords })
        .subscribe(res => {
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
          this.filteredSchemes = res;
          console.log(res);
          this.checkIfDataNotPresentAndShowError(res);
        })
    }
  }

}

export interface elementI {

  name: string;
  nav: string;
  schemeName: string;
  schemeCode: string;
  amficode: string;
  navTwo: string;
  navDate: string;
  njCount: string;
  map: string;
}

const ELEMENT_DATA = [
  { name: 'Aditya Birla Sun Life FTP Series - KH - Regular Div', nav: '1898.988', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: 'Aditya Birla Sun Life FTP Series - KH - Regular Div', nav: '1898.988', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: 'Aditya Birla Sun Life FTP Series - KH - Regular Div', nav: '1898.988', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },

]