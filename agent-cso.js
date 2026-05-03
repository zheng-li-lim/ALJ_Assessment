// agent-cso.js — Rule-based CSO review, no API required

const ABC_UNITS    = ['ABC Motors', 'Automotive Aftermarket', 'ABC Finance'];
const BANNED_WORDS = [
  'leverage', 'utilise', 'facilitate', 'synergies', 'stakeholders',
  'ecosystem', 'holistic', 'robust', 'seamless', 'unlock', 'harness',
  'cutting-edge', 'game-changing', 'transformative', 'delve',
];

export function csoReviewItem(item) {
  const soWhat = item.soWhat || '';

  if (!ABC_UNITS.some(u => soWhat.includes(u)))
    return {
      verdict: 'Revise',
      reason:  'So-what must name ABC Motors, Automotive Aftermarket, or ABC Finance.',
    };

  const found = BANNED_WORDS.find(w => soWhat.toLowerCase().includes(w));
  if (found)
    return {
      verdict: 'Revise',
      reason:  `So-what contains banned language: "${found}". Replace with a specific action.`,
    };

  if (soWhat.length < 60)
    return {
      verdict: 'Revise',
      reason:  'So-what is too brief — needs a concrete implication and a next step.',
    };

  return {
    verdict: 'Keep',
    reason:  'Names a specific ABC business unit with a concrete, actionable implication.',
  };
}

export function runCSOReview(items) {
  return items.map(item => ({ id: item.id, csoReview: csoReviewItem(item) }));
}
