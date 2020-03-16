import { EventService } from './../../../../../../Data-service/event.service';
import { UtilService } from './../../../../../../services/util.service';
import { SupportUpperService } from './../support-upper.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
// import { FormControl } from '@angular/forms';

export interface SchemeI {
  id: number;
  schemeCode: string;
  schemeName: string;
  balanceUnit: number;
  amountInvested: number;
  currentValue: number;
  absoluteReturn: number;
  allocatedPercentage: number;
  switchIn: number;
  switchOut: number;
  redemption: number;
  dividendPayout: number;
  dividendReinvestment: number;
  netInvestment: number;
  marketValue: number;
  netGain: number;
  isActive: number;
  amountInv: number;
  amc_id: number;
  njCount: number;
}

@Component({
  selector: 'app-support-upper-nj',
  templateUrl: './support-upper-nj.component.html',
  styleUrls: ['./support-upper-nj.component.scss']
})
export class SupportUpperNjComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  isLoadingForDropDown: boolean = false;
  previousSchemesValues: {} = {};
  changedSchemesValues: Object = {};
  interval: NodeJS.Timeout;
  isFilteredSchemesCalled: boolean = false;
  dataTable: elementI[];
  filteredSchemeError: boolean = false;
  selectedElement: any;
  apiCallingStack: any[] = [];

  constructor(
    private supportUpperService: SupportUpperService,
    private eventService: EventService
  ) { }

  schemeControl: FormControl = new FormControl();
  filteredSchemes: any[] = [];
  errorMsg: string;
  isLoading: boolean = false;

  ngOnInit() {
    // console.log(this.schemeFormControl);
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.isLoading = true;
    this.getUnmappedNjSchemes();
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
  checkIfDataNotPresentAndShowError(data) {
    if (data && data.length > 0) {
      this.filteredSchemeError = false;
    } else {
      this.filteredSchemeError = true;
      this.errorMsg = 'No data Found';
    }
  }

  logValue(value) {
    console.log("this is some value:::::::::", value);
  }

  getFilteredSchemesList(value) {

    this.logValue('clicked frmo value changed')
    if (value === '') {
      let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
      this.apiCallingStack.push(threeWords);
      if (this.apiCallingStack[1] !== threeWords) {
        return this.supportUpperService.getFilteredSchemes({ scheme: threeWords });
      }
    } else {
      return this.supportUpperService.getFilteredSchemes({ scheme: value });
    }
  }

  mapSchemeCodeAndOther(element, scheme) {
    this.logValue('again clicked');
    element.schemeCode = scheme.schemeCode;
    element.njCount = scheme.njCount;
  }

  showSuggestionsBasedOnSchemeName(element) {
    console.log(element);
    this.isLoadingForDropDown = true;
    this.selectedElement = element;
    let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords })
        .subscribe(res => {
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
          this.filteredSchemes = [];
          this.filteredSchemes = res;
          console.log(res);
          this.checkIfDataNotPresentAndShowError(res);
        });
    }
  }

  displayFn(scheme?: Scheme): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  mapNjScheme(element) {
    console.log("this is some mapping value:::::;", element);
  }

  getUnmappedNjSchemes() {
    const data = {};
    this.supportUpperService.getUnmappedSchemesNj(data).subscribe(res => {
      console.log("this is unmapped Nj schemes::::::::::", res);
      this.isLoading = false;
      let dataTable: elementI[] = [];
      res.forEach(item => {
        console.log(item);
        dataTable.push({
          name: item.schemeName,
          nav: '',
          schemeName: '',
          schemeCode: '',
          amficode: '',
          navTwo: '',
          navDate: '',
          njCount: '',
          map: ''
        });
      });
      console.log("this is some data::::::", dataTable);
      this.dataTable = dataTable;
      this.dataSource.data = dataTable;
    }, err => {
      console.error(err);
    });
  }

  dialogClose() {
    clearInterval(this.interval);
    this.eventService.changeUpperSliderState({ state: 'close' });
  }



}

export interface Scheme {
  schemeName: string;
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
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
]