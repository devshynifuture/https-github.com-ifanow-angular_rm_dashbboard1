import { EventService } from './../../../../../Data-service/event.service';
import { UtilService, ValidatorType } from './../../../../../services/util.service';
import { SupportService } from './../../support.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-stock-master',
  templateUrl: './add-stock-master.component.html',
  styleUrls: ['./add-stock-master.component.scss']
})
export class AddStockMasterComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  subCategories = [
    'Agro Inputs',
    'Auto Ancillaries',
    'Automobiles',
    'Aviation',
    'Banks',
    'Batteries',
    'Breweries and Distilleries',
    'Cement',
    'Chemicals',
    'Cigarettes',
    'Const/Bldg Material',
    'Consumer Durables',
    'Courier and Logistic Services',
    'Cycle & Accessories',
    'Diversified',
    'Dye Stuff',
    'Engineering',
    'Financial Services',
    'Food',
    'Gems & Jewellery',
    'Glass',
    'Healthcare/Hospitals',
    'Housing Finance',
    'Information Technology',
    'Infrastructure',
    'Leather & Footwear',
    'Media and Entertainment',
    'Mining',
    'Newsprint',
    'Non Ferrous Metals',
    'Office Automation Equipment',
    'Oil and Gas',
    'Others',
    'Packaging',
    'Paints',
    'Pan Masala/Chewing Tobacco',
    'Paper',
    'Personal Care',
    'Petrochemicals',
    'Pharmaceuticals',
    'Photographic & Allied products',
    'Plantation',
    'Plastic Processing',
    'Power',
    'Printing and Stationery',
    'Real Estate',
    'Retail',
    'Shipping',
    'Starch',
    'Steel',
    'Sugar',
    'Telecom',
    'Telecomm',
    'Textile',
    'Tourism / Hotels',
    'Trading',
    'Tyres',
    'Not Categorised',
    'PMS',
    'ETF',
    'Life Insurance',
    'Defence',
    'Electronic Goods',
    'TV broadcasting',
    'Travel Support Services'
  ]

  validatorType = ValidatorType;

  addStockMasterForm = this.fb.group({
    "scriptName": [, Validators.required],
    "bseSymbol": [, Validators.required],
    "nseSymbol": [, Validators.required],
    "subCategory": [, Validators.required],
    "prevDayClosingPrice": [, Validators.required],
  })

  ngOnInit() {
  }

  dialogClose() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  addStockMaster() {
    // if(this.addStockMasterForm.get(''))

    if (this.utilService.formValidations(this.addStockMasterForm)) {
      // api Calling
      this.dialogClose();
    } else {
      this.eventService.openSnackBar('Must complete form values', "DISMISS");
    }
  }

}
