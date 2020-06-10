import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from '../../../../../../../../Data-service/event.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';

@Component({
  selector: 'app-all-sip',
  templateUrl: './all-sip.component.html',
  styleUrls: ['./all-sip.component.scss']
})
export class AllSipComponent implements OnInit {
  advisorId: any;
  dataSource: any;
  showLoader = true;
  displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate',
    'frequency', 'amount'];
  totalAmount = 0;
  isLoading = false;
  parentId = AuthService.getUserInfo().parentId ? AuthService.getUserInfo().parentId : -1;
  @Input() mode;
  @Input() data;
  @Output() changedValue = new EventEmitter();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;

  constructor(
    private backoffice: BackOfficeService,
    private sip: SipComponent,
    private eventService: EventService,
    private excelGen: ExcelGenService
  ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    if(this.mode == 'expired'){
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate','ceaseDate', 'amount'];
    }else if(this.mode == 'expiring'){
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate', 'amount'];
    }else{
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate',
      'frequency', 'amount'];
    }
    this.getAllSip();
  }
  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    const data = this.excelGen.generateExcel(rows, tableTitle);

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
  getAllSip() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    const obj = {
      limit: 20,
      offset: 0,
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaId!=-1) ? 0 :[this.data.adminAdvisorIds],
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1
    }
    if(this.mode=='all')
    {
      this.backoffice.allSipGet(obj).subscribe(
        data => {
          this.isLoading = false;
          if(data){
            this.response(data);
          }else{
            this.dataSource.filteredData=[]
          }
  
        },
        err => {
          this.isLoading = false;
        }
      )
    }else if(this.mode == 'expired'){
      this.backoffice.GET_expired(obj).subscribe(
        data => {
          this.isLoading = false;
          if(data){
            this.response(data);
          }else{
            this.dataSource.filteredData=[]
          }
  
        },
        err => {
          this.isLoading = false;
        }
      )
    }else{
      this.backoffice.GET_EXPIRING(obj).subscribe(
        data => {
          this.isLoading = false;
          if(data){
            this.response(data);
          }else{
            this.dataSource.filteredData=[]
          }
  
        },
        err => {
          this.isLoading = false;
        }
      )
    }

  }
  response(data){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.filteredData.forEach(element => {
      this.totalAmount += element.amount;
    });
  }
  aumReport() {
    this.changedValue.emit(true);
    //  this.sip.sipComponent=true;
  }
}
