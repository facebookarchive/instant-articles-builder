const NameUtils = require('../src/js/utils/name-utils.js');

function getInputRuleForClassName(className) {
  return {
    class: className,
  };
}

test('Gets Display Name for GlobalRule', () => {
  const inputRule = getInputRuleForClassName('GlobalRule');
  expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe('Global');
});

test('Gets Display Name for URLRule', () => {
  const inputRule = getInputRuleForClassName('URLRule');
  expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe('URL');
});

test('Gets Display Name for ParagraphFooterRule', () => {
  const inputRule = getInputRuleForClassName('ParagraphFooterRule');
  expect(NameUtils.getInputRuleDisplayName(inputRule)).toBe('Paragraph Footer');
});
