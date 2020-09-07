import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { CommonFroalaComponent } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/common-froala/common-froala.component';
import { Router } from '@angular/router';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';

@Component({
  selector: 'app-add-quotation-subscription',
  templateUrl: './add-quotation-subscription.component.html',
  styleUrls: ['./add-quotation-subscription.component.scss']
})
export class AddQuotationSubscriptionComponent implements OnInit {
  advisorId: any;
  planSettingData: any;
  selectedPlan: any;
  clientData: any;
  noDataFoundFlag: boolean;
  feeStructureHtmlData = '';
  orgDetails: any;
  billerInfo: any;
  organisationFlag: any;
  billerFlag: any;
  isLoadingQuot;

  constructor(public subInjectService: SubscriptionInject,
    private subService: SubscriptionService,
    private eventService: EventService
    , private router: Router,
    private settingsService: SettingsService) { }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'NEXT',
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


  @Input() set data(data) {
    data;
  }
  ngOnInit() {
    this.data;
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getSubscriptionUpperSliderData();
    this.getPlanOfAdvisor();
  }

  getPlanOfAdvisor() {
    const obj = {
      advisorId: this.advisorId,
      clientId: (this.clientData.data) ? this.clientData.data.id : 0,
      flag: (this.clientData) ? 4 : 3
    };
    this.isLoadingQuot = true;
    this.subService.getQuotationReplatedPlans(obj).subscribe(
      data => {
        this.isLoadingQuot = false;
        if (data && data.length > 0) {
          this.noDataFoundFlag = false;
          this.planSettingData = data;
        } else {
          this.noDataFoundFlag = true;
          this.planSettingData = undefined;
        }
      }, error => {
        this.isLoadingQuot = false;
      }
    );
  }

  createSubscription(value, data) {
    if (!data.quotation) {
      this.eventService.openSnackBar('Please map quotation to plan', 'Dismiss');
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: false });
      this.router.navigate(['/admin/subscription/settings/documents']);
      return;
    }
    data.quotation.planId = data.id;
    data.quotation.documentText = data.quotation.documentText.replace(new RegExp(UtilService.escapeRegExp('$plan_name'), 'g'), data.name);
    data = data.quotation;
    data.feeStructureFlag = data.documentText.includes('$service_fee');
    // data['feeStructureFlag'] = data.documentText.includes('$service_name');
    // this.organisationFlag = data.documentText.includes('$organization');
    // this.billerFlag = data.documentText.includes('$biller');
    data.quotationFlag = true;
    this.getServicesForPlan(data);
  }


  getServicesForPlan(quotationData) {
    this.barButtonOptions.active = true;
    const obj = {
      advisorId: this.advisorId,
      planId: quotationData.planId
    };
    this.subService.getSettingPlanServiceData(obj).subscribe(
      responseData => {
        if (responseData && responseData.length > 0) {
          console.log(responseData);
          responseData = responseData.filter(element => element.selected == true);
          this.createFeeStructureForFroala(responseData, quotationData);
        }
      }
    );
  }

  createSubscriptionResponse(data) {
    this.Close(true);
  }

  openFroala(data, value) {
    data.isAdvisor = true;
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
          this.Close(true);
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  createFeeStructureForFroala(responseData, quotationData) {
    let servicesName = '';
    responseData.forEach(element => {
      const feeStructureTable = `
      <div class="hide">
<table style="width: 100%; margin: 0px auto; border: 1px solid rgba(0, 0, 0, 0.12);" align="center">
   <tr>
       <td>
           <table style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12); background: #F5F7F7; ">
               <tr>
                   <td style="padding: 28px 22px;  ">
                       <h3 style="margin: 0px; font-size: 20px;">${element.serviceName}</h3>
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
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">&#8377;${element.averageFees}</h4>` : ''}
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
               ${(element.servicePricing.feeTypeId == 2) ? `<td style="padding: 24px; border: none;pointer-event:none">
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
      servicesName += element.serviceName + ',';
    });
    servicesName = servicesName.slice(0, -1);
    quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$service_fee'), 'g'), this.feeStructureHtmlData);
    quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$service_name'), 'g'), servicesName);
    this.getOrgProfiles(quotationData);

  }

  headerTemplate = `
  <div style="display: flex; width: 100%; margin-bottom: 20px; padding-bottom:20px; border-bottom: 1px solid rgba(0, 0, 0, 0.12);  align-items: center; justify-content: space-between;">
  <div style="width: 100px;">
  <img style="max-width: 100% !important;" src="$organization_logo">
  </div>
  <div style="text-align:right;">
    <h4 style="font-size: 16px; font-weight:600; margin: 0px;"> $company_name </h4>
    <p style="margin: 0px; color: #83959D;"> $organization_address</p>
    <p style="margin: 0px; color: #83959D;">$organization_city – $organization_state - $organization_pincode</p>
  </div>
  </div>`

  getOrgProfiles(quotationData) {

    const obj = {
      advisorId: this.advisorId,
    };
    this.settingsService.getOrgProfile(obj).subscribe(
      data => {
        if (data) {
          this.orgDetails = data;
          quotationData.documentText = this.headerTemplate + '' + quotationData.documentText
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_profile_mobile'), 'g'), this.orgDetails.mobileNumber);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_profile_email'), 'g'), this.orgDetails.email);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$company_name'), 'g'), (this.orgDetails.companyName) ? this.orgDetails.companyName : AuthService.getUserInfo().name);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_state'), 'g'), this.orgDetails.state);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_city'), 'g'), this.orgDetails.city);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_pincode'), 'g'), this.orgDetails.zipCode);
          quotationData.documentText = quotationData.documentText.replace(new RegExp(UtilService.escapeRegExp('$organization_address'), 'g'), this.orgDetails.billerAddress);
          quotationData.documentText = quotationData.documentText.replace('$organization_logo', this.orgDetails.logoUrl);
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
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  select(data) {
    this.planSettingData.forEach(element => {
      if (data.id == element.id) {
        data.selected = true;
        this.selectedPlan = data;
      } else {
        element.selected = false;
      }
    });
  }
  Close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close', refreshRequired: flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });

  }

}
