const NameUtils = require('../name-utils.js');

function getInputRuleForClassName(className) {
  return {
    class: className,
  };
}

describe('NameUtils', () => {
  it('should get Display Name for GlobalRule', () => {
    const inputRule = getInputRuleForClassName('GlobalRule');
    expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe('Global');
  });

  it('should get Display Name for URLRule', () => {
    const inputRule = getInputRuleForClassName('URLRule');
    expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe('URL');
  });

  it('should get Display Name for ParagraphFooterRule', () => {
    const inputRule = getInputRuleForClassName('ParagraphFooterRule');
    expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe(
      'Paragraph Footer'
    );
  });
});
