import {Directive, Input} from '@angular/core';
import {animate, animation, state, style, transition, trigger, useAnimation} from '@angular/animations';
import {getRightSliderAnimation} from '../../animation/animation';

export let leftSlideInAnimation = animation([
  style({left: '{{ from }}%'}),
  animate('{{ time }}', style({left: '{{ to }}%'}))
]);

// {time: '1s'}
@Directive({
  selector: '[appCustomRightAnimation]',
  // animations: [
  //   getRightSliderAnimation(this.percentageOpen)
  // ]
})
export class CustomRightAnimationDirective {

  @Input() percentageOpen = 40;

  constructor() {
  }


  rightSliderAnimation = trigger('openClose', [
    state('open', style({
      left: '40%'
    })),
    state('openHelp', style({
      left: '65%'
    })),
    state('close', style({
      left: '100%'
    })),

    transition('close => open', [useAnimation(leftSlideInAnimation, {
      params: {
        from: this.percentageOpen,
        to: 100,
        time: '1s'
      }
    })]),
    transition('open => close', [useAnimation(leftSlideInAnimation, {
      params: {
        from: 100,
        to: this.percentageOpen,
        time: '1s'
      }
    })]),
    transition('open => close', [animate('0.1s')])
  ]);
}
