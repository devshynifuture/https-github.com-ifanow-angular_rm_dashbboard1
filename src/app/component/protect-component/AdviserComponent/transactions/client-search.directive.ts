import { Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OnlineTransactionService } from './online-transaction.service';

@Directive({
  selector: '[appClientSearch]'
})
export class ClientSearchDirective implements OnInit {
  familyMemberData: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();

  constructor(private onlineTransact: OnlineTransactionService) { }
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getFamilyList(data);
  }
  ngOnInit() {
    console.log("client search")
  }
  getFamilyList(value) {
    (value == '') ? this.familyMemberData = undefined : '';
    let obj = {
      advisorId: this.advisorId,
      name: value
    }
    if (value.length > 2) {
      this.onlineTransact.getFamilyMemberList(obj).subscribe(
        data => this.getFamilyMemberListRes(data)
      );
    }
  }
  getFamilyMemberListRes(data) {
    console.log('getFamilyMemberListRes', data)
    this.nomineesListFM = data.familyMembers
    this.valueChange1.emit(this.nomineesListFM)
  }
}
