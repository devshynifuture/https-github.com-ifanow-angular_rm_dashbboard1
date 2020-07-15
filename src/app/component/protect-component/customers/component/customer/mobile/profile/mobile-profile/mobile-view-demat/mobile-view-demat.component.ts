import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-mobile-view-demat',
  templateUrl: './mobile-view-demat.component.html',
  styleUrls: ['./mobile-view-demat.component.scss']
})
export class MobileViewDematComponent implements OnInit {
  userData: any;
  dematFlag: boolean;
  dematList: any;

  constructor(private cusService: CustomerService) { }
  selectedDemat;
  @Output() backfunc = new EventEmitter();
  ngOnInit() {
  }
  @Input() set data(data) {
    this.userData = data;
    this.getDematList(data);
  }

  getDematList(data) {
    this.dematFlag = true;
    const obj = {
      userId: data.familyMemberId,
      userType: data.userType
    };
    this.cusService.getDematList(obj).subscribe(
      data => {
        this.dematFlag = false;
        console.log(data);
        if (data && data.length > 0) {
          this.dematList = data;
        }
      }, err => {
        this.dematFlag = false;
        this.dematList = undefined;
        console.error(err);
      }
    );
  }
  back() {
    this.backfunc.emit(undefined);
  }
  addEditDemat(data) {
    this.selectedDemat = this.userData;
    this.selectedDemat['dematData'] = data;
  }
  addEditFlag(data) {
    this.selectedDemat = undefined;
    this.getDematList(this.userData);
  }
}
