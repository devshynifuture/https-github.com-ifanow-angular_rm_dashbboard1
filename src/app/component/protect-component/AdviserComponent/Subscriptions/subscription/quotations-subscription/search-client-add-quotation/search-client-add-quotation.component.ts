import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {startWith} from 'rxjs/internal/operators/startWith';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {SubscriptionService} from '../../../subscription.service';
import {CommonFroalaComponent} from '../../common-subscription-component/common-froala/common-froala.component';
import {UtilService} from 'src/app/services/util.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {EventService} from 'src/app/Data-service/event.service';
import {Router} from '@angular/router';
import {SettingsService} from '../../../../setting/settings.service';

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

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  feeStructureHtmlData: string = '';
  billerInfo: any;
  orgDetails: any;

  constructor(public subInjectService: SubscriptionInject,
    private subService: SubscriptionService,
    private eventService: EventService,
    private router: Router,
    private settingsService: SettingsService) { }


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
      clientId: data.id,
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
    if (!data.quotation) {
      this.eventService.openSnackBar("Please map quotation to plan", "Dismiss");
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: false });
      this.router.navigate(['/admin/subscription/settings/documents']);
      return;
    }
    data.quotation['planId'] = data.id;
    data.quotation.documentText = data.quotation.documentText.replace(new RegExp(UtilService.escapeRegExp('$plan_name'), 'g'), data.name);
    data = data['quotation'];
    data['feeStructureFlag'] = data.documentText.includes('$service_fee');
    data['quotationFlag'] = true;
    this.getServicesForPlan(data);
  }

  getServicesForPlan(quotationData) {
    this.barButtonOptions.active = true;
    const obj =
    {
      advisorId: this.advisorId,
      planId: quotationData.planId
    }
    this.subService.getSettingPlanServiceData(obj).subscribe(
      responseData => {
        if (responseData && responseData.length > 0) {
          console.log(responseData);
          this.createFeeStructureForFroala(responseData, quotationData);
        }
      }
    )
  }

  createFeeStructureForFroala(responseData, quotationData) {
    let servicesName = '';
    responseData.forEach(element => {
      let feeStructureTable = `<div class="hide">
<table style="width: 100%; margin: 0px auto; border: 1px solid rgba(0, 0, 0, 0.12);" align="center">
   <tr>
       <td>
           <table style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12); background: #F5F7F7; ">
               <tr>
                   <td style="padding: 28px 22px;  ">
                       <h3 style="margin: 0px; font-size: 24px;">${element.serviceName}</h3>
                       <h5 style="margin: 0px; font-size: 16px;">${element.serviceCode}</h5>
                   </td>
               </tr>
           </table>
       </td>
   </tr>
   <tr>
       <td>
           <table style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12);">
               <tr>
                   <td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">BILLING NATURE</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.servicePricing.billingNature == 1) ? 'Recurring' : 'Once'}</h4>
                   </td>

                   <td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">BILLING MODE</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.servicePricing.billingMode == 1) ? 'Start Of Period' : 'End Of Period'}</h4>
                   </td>

                   <td style="padding: 24px; border: none;">
                   ${(element.servicePricing.feeTypeId == 1) ? ` <p style="font-size: 12px; margin:0px;">FEES</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">₹${element.averageFees}</h4>` : ''}
                   </td>
               </tr>
           </table>
       </td>
   </tr>
   <tr>
       <td>
           <table style="width: 100%;">
               <tr>
                   <td style="padding: 24px; border: none; width: 50%; vertical-align: top; border: none;">
                       <p style="font-size: 12px; margin:0px;">DESCRIPTION</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.description) ? element.description : 'N/A'}</h4>
                   </td>
               ${(element.servicePricing.feeTypeId == 2) ? `<td style="padding: 24px; border: none;pointer-event:none;">
                       <p style="font-size: 12px; margin:0px;">VARIABLE FEE DETAILS </p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">Mutual Funds </h4>
                       <table style="width: 100%; border: 1px solid rgba(0, 0, 0, 0.12);  background: #F5F7F7;">
                           <tr>
                               <td colspan="3" style=" border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);  text-align: center; padding: 10px;">
                                   Direct</td>
                               <td colspan="3" style=" border-bottom: 1px solid rgba(0, 0, 0, 0.12); padding: 10px;  text-align: center;">
                                   Regular</td>
                           </tr>
                           <tr>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12); ">Equity</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Debt</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Liquid</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Equity</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Debt</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12);">Liquid</td>
                           </tr>
                           <tr>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].equityAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].debtAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].liquidAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].equityAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].debtAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].liquidAllocation}%</td>
                           </tr>
                       </table>
                   </td>
                   </tr>` : ''}
           </table>
       </td>
   </tr>
</table>
<br>
</div>`;
      this.feeStructureHtmlData += feeStructureTable;
      servicesName += element.serviceName + ','
    });
    quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$service_fee'), 'g'), this.feeStructureHtmlData);
    quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$service_name'), 'g'), servicesName);
    this.getOrgProfiles(quotationData);
  }

  getOrgProfiles(quotationData) {

    const obj = {
      advisorId: this.advisorId,
    };
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        if (data) {
          this.orgDetails = data;
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_profile_mobile'), 'g'), this.orgDetails.mobileNumber);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_profile_email'), 'g'), this.orgDetails.email);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$company_name'), 'g'), this.orgDetails.companyName);
          // $logo_for_reports
          this.getProfileBillerData(quotationData);
        }
      }
    );
  }

  getProfileBillerData(quotationData) {
    this.subService.getPreferenceBillerProfile(this.advisorId).subscribe(
      data => {
        if (data) {
          this.billerInfo = data.filter(element => element.primary == true);
          this.billerInfo = this.billerInfo[0];
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$biller_profile_address'), 'g'), this.billerInfo.billerAddress);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$biller_profile_city'), 'g'), this.billerInfo.city);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$biller_profile_pin'), 'g'), this.billerInfo.zipCode);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$company_display_name'), 'g'), this.billerInfo.companyDisplayName);
          // quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$biller_profile_address'), 'g'), this.billerInfo.mobileNumber);
          this.openFroala(quotationData, 'openQuotation');
        }
      }
    );
  }

  openFroala(data, value) {
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
          this.close();
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
