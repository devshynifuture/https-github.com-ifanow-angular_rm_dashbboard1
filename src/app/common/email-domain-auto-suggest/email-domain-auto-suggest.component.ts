import { Component, OnInit, Input, OnDestroy, HostBinding, Optional, Self, ElementRef, DoCheck } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AppConstants } from 'src/app/services/app-constants';
import { map } from 'rxjs/operators';
import { MatFormFieldControl } from '@angular/material';
import { FocusMonitor } from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';


@Component({
  selector: 'app-email-domain-auto-suggest',
  templateUrl: './email-domain-auto-suggest.component.html',
  styleUrls: ['./email-domain-auto-suggest.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: EmailDomainAutoSuggestComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class EmailDomainAutoSuggestComponent implements OnInit, MatFormFieldControl<string>, OnDestroy, DoCheck {
  email:FormControl = new FormControl('');
  suggestionEmails: Observable<string[]>;
  emailDomains:string[] = [];
  stateChanges = new Subject<void>();
  static nextId = 0;
  @HostBinding() id = `email-domain-autosuggest-${EmailDomainAutoSuggestComponent.nextId++}`;

  @Input()
  get value() {
    return this.email.value;
  }
  set value(email) {
    this.email.patchValue(email);
    this.stateChanges.next();
  }

  private _placeholder: string;
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _readonly:boolean = false;
  @Input()
  set readonly(read){
    this._readonly = coerceBooleanProperty(read);
  }

  get readonly(){
    return this._readonly;
  }

  onChanged: any = () => {};
  onTouched: any = () => {};
  
  focused = false;

  get empty() {
    return !this.email.value;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false; 

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.email.disable() : this.email.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  // associated   with ngcontrol
  errorState = false;

  controlType = 'email-domain-autosuggest';

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor, 
    private elRef: ElementRef<HTMLElement>
  ) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    this.emailDomains = AppConstants.EMAIL_DOMAINS;
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this.email.valueChanges.subscribe(
      val => this.setInputValue()
    );
  }

  ngDoCheck(){
   if(this.ngControl) {
        this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  ngOnInit() {
    const validators = this.ngControl.control.validator;
    this.email.setValidators(validators ? validators : null);
    this.email.updateValueAndValidity();

    this.suggestionEmails = this.email.valueChanges.pipe(map(email => {
      if(email) {
        let parts = email.split('@');
        if(parts.length !== 2 || parts[0].length === 0) {
            return [];
        } else {
            let matches = this.emailDomains.filter(function(item) {
                return item.match(new RegExp('^'+parts[1], 'i')) !== null;
            });
            return matches.map(function(item) {
                return parts[0]+'@'+item;
            }).sort();
        }
      }
    }));
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj:string = ''): void {
    this.email.patchValue(obj);
  }

  setInputValue() {
    this.onChanged(this.value);
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }
}
