/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow
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
 * @default
 */
const FEATURE_WEIGHTS: { [string]: number } = {
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

export class CSSSelectorResolver {
  /**
   * Heuristicaly finds the simplest CSS selector that matches the provided
   * element within the article.
   * If no simple selector is found, uses {@link resolveAbsolute}.
   *
   * @see {@link getScore}
   * @param multiple Whether to allow multiple elements being matched
   * @param contextSelector The context selector
   * @param fieldName The name of the field being selected
   * @returns Selectors for the given element ordered by score
   */
  static resolve(
    element: Element,
    multiple: boolean,
    contextSelector: string,
    fieldName: ?string
  ): string[] {
    // Generate candidates
    let candidates = this.generateCandidates(element, MAX_DEPTH);

    // Hard limit at MAX_CANDIDATES tries, for performance
    candidates = candidates.slice(0, MAX_CANDIDATES);

    let filteredCandidates = [];

    if (!multiple) {
      // Allow only candidates that return a single element
      // and matching the target element
      filteredCandidates = candidates.filter(candidate =>
        this.isUnique(candidate, element, contextSelector)
      );
    } else {
      // Allow all candidates that match the target element
      filteredCandidates = candidates.filter(candidate =>
        element.matches(candidate)
      );
    }

    // If none was found, return the absolute selector
    if (filteredCandidates.length === 0) {
      return [this.resolveAbsolute(element, contextSelector)];
    }

    // Rank candidates
    let rankedCandidates = this.rankCandidates(filteredCandidates);

    // Returns the highest ranked candidate
    return rankedCandidates;
  }

  /**
   * @returns Whether the selector is unique in each context node.
   */
  static isUnique(
    selector: string,
    element: Element,
    contextSelector: string
  ): boolean {
    if (!selector) {
      return false;
    }
    let contextElements = document.querySelectorAll(contextSelector);
    let foundInOneContext = false;
    for (let context of contextElements) {
      let elements = context.querySelectorAll(selector);
      if (elements.length > 1) {
        return false;
      }
      if (elements.length == 1) {
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
   * @param depth Levels to explore upwards in the DOM tree (1-indexed)
   * @returns A list of candidate CSS selectors
   */
  static generateCandidates(element: Element, depth: number): string[] {
    return this.generateCandidatesRecursive(element, 0, depth - 1);
  }

  /**
   * Recursively generate candidate selectors for the provided element.
   *
   * @see {@link generateCandidates}
   * @param {Element} element
   * @param {number} currentLevel Current recursion level (0-indexed)
   * @param {number} lastLevel Index of the last tree level to enter (0-indexed)
   * @return {string[]} A list of candidate CSS selectors
   */
  static generateCandidatesRecursive(
    element: Element,
    currentLevel: number,
    lastLevel: number
  ): string[] {
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
    let parent = element.parentElement;
    let parentCandidates = [];
    if (parent != null) {
      parentCandidates = this.generateCandidatesRecursive(
        parent,
        currentLevel + 1,
        lastLevel
      );
    }

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
  static rankCandidates(candidates: string[]): string[] {
    let scoredCandidates = candidates.map(candidate => ({
      selector: candidate,
      score: this.getScore(candidate),
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
   * @param candidate The candidate CSS selector
   * @returns The score for that candidate selector
   */
  static getScore(candidate: string): number {
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
    let features: { [string]: number } = {
      leafHasID: leaf.indexOf('#') !== -1 ? 1 : 0,
      leafHasClass: leaf.indexOf('.') !== -1 ? 1 : 0,
      leafHasTagName: leaf.match(/^[a-zA-Z]+/) ? 1 : 0,
      endsWithNumber: leaf.match(/[0-9]+$/) ? 1 : 0,
      numberOfComponents: components.length ? components.length : 0,
      trunkScore: this.getScore(trunk),
    };

    // score = features * FEATURE_WEIGHTS
    let score = Object.keys(features)
      .map(key => FEATURE_WEIGHTS[key] * features[key])
      .reduce((total, current) => total + current, 0);

    return score;
  }

  /**
   * Gets a CSS selector witht the absolute path to the element starting on the
   * first ancestor with an ID.
   * - The returned selector always matches a single element, unless IDs are
   *   incorrectly duplicated on the page
   * - The returned selector is likely to be very dependent on the structure
   *
   * @returns A full path CSS selector for the element in the document.
   */
  static resolveAbsolute(element: Element, contextSelector: string): string {
    let path = [];
    while (
      element != null &&
      element instanceof Element &&
      element.nodeType === Node.ELEMENT_NODE &&
      !element.matches(contextSelector)
    ) {
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
      if (element.id != null || element.parentElement == null) {
        break;
      } else {
        element = element.parentElement;
      }
    }
    return path.join(' > ');
  }
}
