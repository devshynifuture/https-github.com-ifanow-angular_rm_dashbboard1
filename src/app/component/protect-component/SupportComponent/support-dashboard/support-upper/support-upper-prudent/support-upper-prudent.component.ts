import { EventService } from './../../../../../../Data-service/event.service';
import { SupportUpperService } from './../support-upper.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { switchMap, finalize, debounceTime, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-support-upper-prudent',
  templateUrl: './support-upper-prudent.component.html',
  styleUrls: ['./support-upper-prudent.component.scss']
})
export class SupportUpperPrudentComponent implements OnInit {

  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  selectedElement: any;
  isLoadingForDropDown: boolean;
  filteredSchemes: any[];
  filteredSchemeError: boolean;
  errorMsg: string;
  schemeControl: FormControl = new FormControl();
  apiCallingStack: any = [];
  dataTable: elementI[];
  isLoading: boolean = false;

  constructor(
    public supportUpperService: SupportUpperService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.isLoading = true;
    this.getUnmappedPrudentList();

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
        if (data && data.length > 0) {
          this.errorMsg = 'No Data Found';
        } else {
          this.errorMsg = '';
        }
        console.log(this.filteredSchemes);
      });
  }


  displayFn(scheme?: Scheme): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  searchSchemeName(element) {
    console.log(element);
    this.isLoadingForDropDown = true;
    let threeWords = element;
    //let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    //this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords && element.length >= 3) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords })
        .subscribe(res => {
          let dataTable: elementI[] = [];
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
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
          console.log(res);
          // this.checkIfDataNotPresentAndShowError(res);
        });
    }
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
          if (this.supportUpperService.checkIfDataNotPresentAndShowError(res)) {
            this.errorMsg = 'No Data Found';
          } else {
            this.errorMsg = '';
          }
        });
    }
  }

  mapSchemeCodeAndOther(element, scheme) {
    this.supportUpperService.getSchemesDetails({ id: scheme.id })
      .subscribe(res => {
        console.log('scheme details', res)
        element.navDate = res.navDate
        element.nav = res.nav
        element.amfiCode = res.amfiCode
        element.njPrudentCount = res.njPrudentCount
        element.schemeCode = scheme.schemeCode;
        element.njCount = scheme.njCount;
      });
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

  getUnmappedPrudentList() {
    let data = {
      rtMasterId: 4,
      startLimit: 0,
      endLimit: 50
    };
    this.supportUpperService.getUnmappedSchemesPrudent(data).subscribe(res => {
      console.log("this is unmapped Prudent schemes::::::::::", res);
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
    this.eventService.changeUpperSliderState({ state: 'close' });
    console.log('close');
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
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
]