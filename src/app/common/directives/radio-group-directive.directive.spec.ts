import {RadioGroupDirectiveDirective} from './radio-group-directive.directive';

describe('RadioGroupDirectiveDirective', () => {
  it('should create an instance', () => {
    const directive = new RadioGroupDirectiveDirective(new class extends Renderer2 {
    },);
    expect(directive).toBeTruthy();
  });
});
