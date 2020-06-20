import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../../../subscription.service';
import { CommonFroalaComponent } from '../../common-subscription-component/common-froala/common-froala.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-search-client-add-quotation',
  templateUrl: './search-client-add-quotation.component.html',
  styleUrls: ['./search-client-add-quotation.component.scss']
})
export class SearchClientAddQuotationComponent implements OnInit {
  clientList: any;
  filteredStates: any;
  stateCtrl: FormControl;
  advisorId: any;
  noDataFoundFlag: boolean;
  planSettingData: any;
  selectedPlan: any;
  loader: boolean;

  constructor(public subInjectService: SubscriptionInject, private subService: SubscriptionService) { }


  @Input() set data(data) {
    this.clientList = data;
    this.advisorId = AuthService.getAdvisorId();
    this.stateCtrl = new FormControl('');
  }


  ngOnInit() {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(state => {
          if (state) {
            const filterValue = state.toLowerCase();
            const list = this.clientList.filter(state => state.client_name.toLowerCase().includes(filterValue));
            if (list.length == 0) {
              this.stateCtrl.setErrors({ invalid: true });
              this.stateCtrl.markAsTouched();
            }
            return this.clientList.filter(state => state.client_name.toLowerCase().includes(filterValue));
          } else {
            return this.clientList;
          }
        }),
      );
  }

  hidePlans(value) {
    if (value == '') {
      this.planSettingData = undefined;
      this.selectedPlan = undefined;
    }
  }

  optionSelected(selectedClientValue) {
    this.stateCtrl.setValue(selectedClientValue.client_name);
    this.getPlanOfAdvisor(selectedClientValue);
  }

  getPlanOfAdvisor(data) {
    this.loader = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: data.client_id,
    };
    this.subService.getQuotationReplatedPlans(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.loader = false;
          this.noDataFoundFlag = false;
          this.planSettingData = data
        }
        else {
          this.loader = false;
          this.noDataFoundFlag = true;
          this.planSettingData = undefined
        }
      }
    );
  }

  select(data) {
    this.planSettingData.forEach(element => {
      if (data.id == element.id) {
        data.selected = true
        this.selectedPlan = data
      }
      else {
        element.selected = false;
      }
    })
  }

  createSubscription(value, data) {
    data.quotation['planId'] = data.id;
    data = data['quotation'];
    data['feeStructureFlag'] = data.documentText.includes('$service_fee');
    data['quotationFlag'] = true;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
