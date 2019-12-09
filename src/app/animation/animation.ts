import {
  animate,
  animateChild,
  animation,
  group,
  query,
  state,
  style,
  transition,
  trigger,
  useAnimation
} from '@angular/animations';

export let leftSlideInAnimation = animation([
  style({left: '{{ from }}%'}),
  animate('{{ time }}', style({left: '{{ to }}%'}))
]);
export const slideInAnimation =
  trigger('routeAnimations', [
    transition('LeftBar <=> ClientDetails', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('3000ms ease-out', style({left: '100%'}))
        ]),
        query(':enter', [
          animate('3000ms ease-out', style({left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* <=> FilterPage', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('2000ms ease-out', style({left: '100%'}))
        ]),
        query(':enter', [
          animate('3000ms ease-out', style({left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);

export const dialogContainerOpacity = trigger('dialogContainer', [
  state('open', style({
    opacity: 0.25
  })),
  state('close', style({
    opacity: 0

  })),
  transition('close => open', [style({opacity: 0}),
    animate(300, style({opacity: 0.25}))]),
]);

export const upperSliderAnimation = trigger('upperSliderOpenClose', [
  state('open', style({
    top: '0%'
  })),
  state('close', style({
    // width:'0%'
    top: '-100%'
  })),

  transition('close => open', [animate('0.3s')]),
  transition('open => close', [animate('0.1s')]),
  transition('close => openHelp', [animate('0.3s')]),
  transition('openHelp => close', [animate('0.1s')])
]);

export const rightSliderAnimation = trigger('openClose', [
  state('open', style({
    left: '{{from}}%',
    width: '60%'
  }), {params: {from: (100 - 60)}}),
  state('open50', style({
    left: '{{from}}%',
    width: '50%'
  }), {params: {from: (100 - 50)}}),
  state('open25', style({
    left: '{{from}}%',
    width: '25%'
  }), {params: {from: (100 - 25)}}),
  state('open65', style({
    left: '{{from}}%',
    width: '65%'
  }), {params: {from: (100 - 65)}}),
  state('open35', style({
    left: '{{from}}%',
    width: '35%'
  }), {params: {from: (100 - 35)}}),
  state('open30', style({
    left: '{{from}}%',
    width: '30%'
  }), {params: {from: (100 - 30)}}),
  state('openHelp', style({
    left: '{{from}}%',
    width: '35%'
  }),{params: {from: (100 - 65)}}),
  state('open40', style({
    left: '{{from}}%',
    width: '40%'
  }), {params: {from: (100 - 40)}}),
  state('open70', style({
    left: '{{from}}%',
    width: '70%'
  }), {params: {from: (100 - 70)}}),
  state('close', style({
    left: '100%'
  })),
  transition('close => open', [animate('0.3s')]),
  transition('open => close', [animate('0.1s')]),

  transition('close => open65', [animate('0.3s')]),
  transition('open65 => close', [animate('0.1s')]),

  transition('close => open35', [animate('0.3s')]),
  transition('open35 => close', [animate('0.1s')]),

  transition('close => open30', [animate('0.3s')]),
  transition('open30 => close', [animate('0.1s')]),


  transition('close => open70', [animate('0.3s')]),
  transition('open70 => close', [animate('0.1s')]),
]);

export const getRightSliderAnimation = (inputPercent) => {
  return trigger('openClose', [
    state('open', style({
      left: '{{from}}%'
    }), {params: {from: inputPercent}}),
    state('close', style({
      left: '100%'
    })),

    transition('close => open', [animate('0.3s')]),
    transition('open => close', [animate('0.1s')])
  ]);
};
/*transition('close => open', [useAnimation(leftSlideInAnimation, {
    params: {
      from: 40,
      to: 100,
      time: '1s'
    }
  })]),
  transition('open => close', [useAnimation(leftSlideInAnimation, {
    params: {
      from: 100,
      to: 40,
      time: '1s'
    }
  })])*/

