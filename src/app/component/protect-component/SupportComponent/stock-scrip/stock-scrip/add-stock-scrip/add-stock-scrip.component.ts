import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupportService } from '../../../support.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-stock-scrip',
  templateUrl: './add-stock-scrip.component.html',
  styleUrls: ['./add-stock-scrip.component.scss']
})
export class AddStockScripComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private supportService: SupportService,
    private eventService: EventService
  ) { }
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  stockScripForm: FormGroup;
  validatorType = ValidatorType;

  ngOnInit() {
    this.stockScripForm = this.fb.group({
      scripName: [, [Validators.required]],
      bseSymbol: [, [Validators.required]],
      nseSymbol: [, [Validators.required]],
      isin: [, [Validators.required]],
      stockCategoryMasterId: [, [Validators.required]],
      nav: [, [Validators.required]]
    })
  }

  dialogClose(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  saveScrip() {
    if (this.stockScripForm.invalid) {
      this.stockScripForm.markAllAsTouched();
      return;
    }
    this.barButtonOptions.active = true;
    const obj = {
      scripName: this.stockScripForm.get('scripName').value,
      bseSymbol: this.stockScripForm.get('bseSymbol').value,
      nseSymbol: this.stockScripForm.get('nseSymbol').value,
      isin: this.stockScripForm.get('isin').value,
      stockCategoryMasterId: parseInt(this.stockScripForm.get('stockCategoryMasterId').value),
      nav: parseFloat(this.stockScripForm.get('nav').value)
    }
    this.supportService.saveStockScrip(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar("Added sucessfully", "Dismiss");
      }, err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, "Dimiss");
      }
    )

  }

}
