import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { BackOfficeService } from '../../../back-office.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-folios',
  templateUrl: './folios.component.html',
  styleUrls: ['./folios.component.scss']
})
export class FoliosComponent implements OnInit {
 displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  folioDetails: any;
  dataList: any;
  advisorId: any;
  dataSource:any;
  folioList:any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor( private fb: FormBuilder,private backoffice:BackOfficeService) { }
  isLoading = false;
  searchGroupHead = new FormControl();
  searchInvestorName = new FormControl();


  ngOnInit() {
    // this.getFolioDetails();
    this.advisorId = AuthService.getAdvisorId();

  }

  // getFolioDetails(){
  //   this.folioDetails = this.fb.group({
  //     searchGroupHead: [],
  //     searchInvestorName:[]
  //   });
  // }
  displayFn(value): string | undefined {
    return value ? value.name : undefined;
  }

  getList(data,value){//for seraching and dropdown of pan and folio

    if(value=='groupyHead'){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        clientName:data
      }
      this.backoffice.folioGroupHeadList(obj).subscribe(
        data =>{
            this.dataList=data;
        }
      )
    }else{
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMemberName:data
      }
      this.backoffice.folioApplicantList(obj).subscribe(
        data =>{
            this.folioList=data;
        }
      )
    }

  }
  selectedData(data,value) {//for getting selected option data 
    if(data){
      this.isLoading = true;
      let tempData=[{}, {}, {}];
      this.dataSource = new MatTableDataSource(tempData);
      if(value=='groupyHead'){
        const obj={
          advisorId:this.advisorId,
          arnRiaDetailsId:-1,
          parentId:-1,
          clientName:data
        }
        this.backoffice.folioSearchByGroupHead(obj).subscribe(
          data =>{
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
  
          }
        )
      }else{
        const obj={
          advisorId:this.advisorId,
          arnRiaDetailsId:-1,
          parentId:-1,
          familyMemberName:data
        }
        this.backoffice.folioSearchByInvestor(obj).subscribe(
          data =>{
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
  
          }
        )
      }
    }
  }
  getData(data,value){//for pan and folio search data
    if(data){
      this.isLoading = true;
    let tempData=[{}, {}, {}];
    this.dataSource = new MatTableDataSource(tempData);
    if(value=='pan'){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        pan:data
      }
      this.backoffice.folioSearchByPan(obj).subscribe(
        data =>{
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;

        }
      )
    }else{
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        folioNumber:data
      }
      this.backoffice.folioSearchByfolio(obj).subscribe(
        data =>{
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;

        }
      )
    }
    }
  }
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},

];
