/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The maximum depth to explore on the DOMTree when creating candidate selectors
 * for the algorithm.
 * The time and space complexity of this algorithm grows exponentially with
 * this number.
 *
 * @constant
 * @type {number}
 * @default
 */
const MAX_DEPTH = 3;

/**
 * The maximum number of candidate selectors to consider for ranking.
 * Used to ensure a hard limit for the calculations and DOM queries.
 *
 * @constant
 * @type {number}
 * @default
 */
const MAX_CANDIDATES = 512;

/**
 * The weight for the features of the selectors, used for calculating the score.
 *
 * @see {@link getScore}
 * @constant
 * @type {Object.<string, number>}
 * @default
 */
const FEATURE_WEIGHTS = {
  // IDs are more likely unique across all articles, let's prioritize them
  leafHasID: -1,
  // classes are fine, but not guaranteed to be unique in other articles
  leafHasClass: -2,
  // simple tags look nice, but are unlikely to be unique across articles
  leafHasTagName: -4,
  // selectors ending with numbers might contain article-specific
  // ID numbers we want to avoid
  endsWithNumber: -8,
  // longer selectors are bad
  numberOfComponents: -16,
  // Better leaf is better than better trunk
  // (ex: 'header .post-title' is better than '#article h1')
  trunkScore: 0.5,
};

/**
 * Heuristicaly finds the simplest CSS selector that matches the provided
 * element within the article.
 * If no simple selector is found, uses {@link resolveAbsoluteCSSSelector}.
 *
 * @exports resolveCSSSelector
 * @see {@link getScore}
 * @param {Element} element
 * @param {boolean} multiple Whether to allow multiple elements being matched
 * @param {string} contextSelector The context selector
 * @returns {List<string>} Selectors for the given element ordered by score
 */
function resolveCSSSelector(element, multiple, contextSelector) {
  // Generate candidates
  let candidates = generateCandidates(element, MAX_DEPTH);

  // Hard limit at MAX_CANDIDATES tries, for performance
  candidates = candidates.slice(0, MAX_CANDIDATES);

  let filteredCandidates = [];

  if (!multiple) {
    // Allow only candidates that return a single element
    // and matching the target element
    filteredCandidates = candidates.filter(candidate =>
      isUnique(candidate, element, contextSelector)
    );
  } else {
    // Allow all candidates that match the target element
    filteredCandidates = candidates.filter(candidate =>
      element.matches(candidate)
    );
  }

  // If none was found, return the absolute selector
  if (filteredCandidates.length === 0) {
    return [resolveAbsoluteCSSSelector(element)];
  }

  // Rank candidates
  let rankedCandidates = rankCandidates(filteredCandidates);

  // Returns the highest ranked candidate
  return rankedCandidates;
}

/**
 * @returns {boolean} Whether the selector is unique in each context node.
 *
 * @param {string} selector
 * @param {(DOMElement)} element
 */
function isUnique(selector, element, contextSelector) {
  if (!selector) {
    return false;
  }
  let contextElements = document.querySelectorAll(contextSelector);
  let foundInOneContext = false;
  for (let context of contextElements) {
    if (context.querySelectorAll(selector).length > 1) {
      return false;
    }
    if (context.querySelectorAll(selector).length == 1) {
      foundInOneContext = true;
    }
  }
  return foundInOneContext;
}

/**
 * Generate candidate CSS selectors for the provided element.
 * - These selectors are not guaranteed to match the element uniquely
 * - The number of candidates generated grows exponentially with depth
 *
 * @param {(DOMElement)} element
 * @param {number} depth Levels to explore upwards in the DOM tree (1-indexed)
 * @return {string[]} A list of candidate CSS selectors
 */
function generateCandidates(element, depth) {
  return generateCandidatesRecursive(element, 0, depth - 1);
}

/**
 * Recursively generate candidate selectors for the provided element.
 *
 * @see {@link generateCandidates}
 * @param {(DOMElement)} element
 * @param {number} currentLevel Current recursion level (0-indexed)
 * @param {number} lastLevel Index of the last tree level to explore (0-indexed)
 * @return {string[]} A list of candidate CSS selectors
 */
function generateCandidatesRecursive(element, currentLevel, lastLevel) {
  // Ends recursion when reaching the root or the lastLevel
  if (currentLevel > lastLevel || element === document.body) {
    return [];
  }

  let classes = element.classList;
  let tagName = element.tagName.toLowerCase();
  let id = element.getAttribute('id');

  let candidates = new Set();
  let selector = '';

  // .class candidates
  for (let className of classes) {
    if (!className.startsWith('facebook-instant-articles-sdk-rules-editor')) {
      selector = '.' + className;
      candidates.add(selector);
    }
  }

  // tagName.class candidates
  for (let className of classes) {
    if (!className.startsWith('facebook-instant-articles-sdk-rules-editor')) {
      selector = tagName + '.' + className;
      candidates.add(selector);
    }
  }

  // #id candidate
  if (id) {
    selector = '#' + id;
    candidates.add(selector);
  }

  // tagName candidate
  selector = tagName;
  candidates.add(selector);

  // tagName#id candidate
  if (id) {
    selector = tagName + '.' + id;
    candidates.add(selector);
  }

  // empty selector candidate (creating selectors with ancestors
  // that omit the intermediate elements)
  if (currentLevel > 0 && currentLevel < lastLevel) {
    candidates.add('');
  }

  // Recursively find the candidates for the parentNode (1 level less deeply)
  let parent = element.parentNode;
  let parentCandidates = generateCandidatesRecursive(
    parent,
    currentLevel + 1,
    lastLevel
  );

  // candidates = candidates ∪ (parentCandidates × candidates)
  let candidatesClone = [...candidates];
  for (let parentCandidate of parentCandidates) {
    for (let candidate of candidatesClone) {
      let newCandidate = parentCandidate.trim() + ' ' + candidate.trim();
      candidates.add(newCandidate.trim());
    }
  }

  // return as array
  return Array.from(candidates);
}

/**
 * Rank candidate selectors by score.
 *
 * @see {@link getScore}
 * @param {string[]} candidates The list of candidate CSS selectors
 * @returns {string[]} The list of candidate CSS selectors sorted by score
 */
function rankCandidates(candidates) {
  let scoredCandidates = candidates.map(candidate => ({
    selector: candidate,
    score: getScore(candidate),
  }));
  return scoredCandidates
    .sort((a, b) => b.score - a.score)
    .map(candidate => candidate.selector);
}

/**
 * Calculates a score for the simplicity of the selector.
 * The ideal selector should rely as least as possible on the current page
 * structure, so it still matches the intended element on different articles
 * from the same site.
 *
 * @see {@link FEATURE_WEIGHTS}
 * @param {string[]} candidates The list of candidate CSS selectors
 * @returns {string[]} The list of candidate CSS selectors sorted by score
 */
function getScore(candidate) {
  // Ends recursion on empty candidate
  if (!candidate) {
    return 0;
  }

  // Extracts components
  // ex components('article head h1') = ['article', 'head', 'h1']
  let components = candidate.split(/\s+/);

  // Extracts leaf
  // ex: leaf('article head h1') = 'h1'
  let leaf = components[components.length - 1];

  // Extracts trunk
  // ex: trunk('article head h1') = 'article head'
  let trunk = components
    .slice(0, components.length - 2)
    .join(' ')
    .trim();

  // Extracts features for score calculations
  // This will recursively look for the trunk score
  let features = {
    leafHasID: leaf.indexOf('#') !== -1 ? 1 : 0,
    leafHasClass: leaf.indexOf('.') !== -1 ? 1 : 0,
    leafHasTagName: leaf.match(/^[a-zA-Z]+/) ? 1 : 0,
    endsWithNumber: leaf.match(/[0-9]+$/) ? 1 : 0,
    numberOfComponents: components.length ? components.length : 0,
    trunkScore: getScore(trunk),
  };

  // score = features * FEATURE_WEIGHTS
  let score = Object.keys(features)
    .map(([key, feature]) => FEATURE_WEIGHTS[key] * feature)
    .reduce((total, current) => total + current, 0);

  return score;
}

/**
 * Gets a CSS selector witht the absolute path to the element starting on the
 * first ancestor with an ID.
 * - The returned selector always matches a single element, unless IDs are
 *   incorrectly duplicated on the page
 * - The returned selector is likely to be very dependent on the page structure
 *
 * @param {(DOMElement)} element
 * @returns {string} A full path CSS selector for the element in the document.
 */
var resolveAbsoluteCSSSelector = function(element) {
  if (!(element instanceof Element)) {
    return null;
  }
  let path = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();
    if (element.id) {
      selector = '#' + element.id;
    } else {
      let foundSameNodeNameSibling = false;
      let sib = element;
      let nth = 1;
      while (
        sib.nodeType === Node.ELEMENT_NODE &&
        (sib = sib.previousElementSibling)
      ) {
        nth++;
        if (sib.nodeName.toLowerCase() === selector) {
          foundSameNodeNameSibling = true;
        }
      }
      if (!foundSameNodeNameSibling) {
        sib = element.nextElementSibling;
        while (sib && sib.nodeType === Node.ELEMENT_NODE) {
          if (sib.nodeName.toLowerCase() === selector) {
            foundSameNodeNameSibling = true;
            break;
          }
          sib = sib.nextElementSibling;
        }
      }
      if (foundSameNodeNameSibling) {
        selector += ':nth-child(' + nth + ')';
      }
    }
    path.unshift(selector);
    if (element.id) {
      break;
    }
    element = element.parentNode;
  }
  return path.join(' > ');
};

module.exports = resolveCSSSelector;
