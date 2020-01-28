import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';

// import { MatProgressButtonOptions } from '../../mat-progress-buttons.interface';

@Component({
  selector: 'app-progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: ['./progress-button.component.scss']
})
export class ProgressButtonComponent implements AfterViewInit {
  @Input() options: MatProgressButtonOptions;
  @Output() btnClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  _logEvent: any;
  @Input() set logEvent(logEvent) {
    this._logEvent = logEvent;
    if (this._logEvent == 13) {

      this.onClick(null);
      console.log(this._logEvent, "event hostlistner 2");
    }
  }

  get logEvent() {
    return this._logEvent
  }
  /*@ViewChild('progressBar', {
    static: false, read: ElementRef,
  }) progressBar: ElementRef;*/

  // progressBarStyle;

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    console.log(event, "event hostlistner");

    if (!this.options.disabled && !this.options.active) {
      this.btnClick.emit(event);
    } else if (this.options.active) {
      // console.log(' progressBar : ', this.progressBar);
      // console.log(' progressBar nativeElement : ', this.progressBar.nativeElement);
    }
    this.setTimeOutRecursiveForProgressValue();

  }

  setTimeOutRecursiveForProgressValue() {
    if (this.options.active) {
      setTimeout(() => {
        if (this.options.active && this.options.value < 100) {
          this.options.value = this.options.value + 3;
          this.setTimeOutRecursiveForProgressValue();
        } else {
          // this.options.value = 0;

        }
      }, 50);
    }
  }


  ngAfterViewInit(): void {

  }

}

export interface MatProgressButtonOptions {
  active: boolean;
  text: string;
  spinnerText?: string;
  buttonColor?: ThemePalette;
  spinnerColor?: ThemePalette;
  barColor?: ThemePalette;
  raised?: boolean;
  stroked?: boolean;
  flat?: boolean;
  fab?: boolean;
  spinnerSize?: number;
  mode?: ProgressSpinnerMode;
  value?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: MatProgressButtonIcon;
  type?: string;
  customClass?: string;
  buttonIcon?: MatProgressButtonIcon;
}

interface MatProgressButtonIcon {
  color?: ThemePalette;
  fontIcon?: string;
  fontSet?: string;
  inline?: boolean;
  svgIcon?: string;
  customClass?: string;
}
