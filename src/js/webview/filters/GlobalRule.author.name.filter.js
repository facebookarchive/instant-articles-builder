/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { CSSSelectorResolver } from '../CSSSelectorResolver';
import type { FeatureWeights } from '../CSSSelectorResolver';

/*
 * A dictionary for the word 'author' in several languages
 */
const authorTranslations = [
  'auctor',
  'auteur',
  'author',
  'autor',
  'autore',
  'autorius',
  'autors',
  'avtor',
  'awdur',
  'awtur',
  'aŭtoro',
  'egileak',
  'forfatter',
  'författare',
  'höfundur',
  'kaituhi',
  'kirjailija',
  'kumbhali',
  'marubucin',
  'may-akda',
  'mlembi',
  'mongoli',
  'mpanoratra',
  'muallif',
  'mwandishi',
  'müəllif',
  'na-ede akwụkwọ',
  'onkowe',
  'otè',
  'penulis',
  'qoraaga',
  'sau',
  'skrywer',
  'szerző',
  'tagsulat',
  'tác giả',
  'yazar',
  'údar',
  'συγγραφέας',
  'автор',
  'аутор',
  'аўтар',
  'зохиогч',
  'муаллиф',
  'հեղինակ',
  'מְחַבֵּר',
  'מחבר',
  'مؤلف',
  'مصنف',
  'نویسنده',
  'लेखक',
  'লেখক',
  'લેખક',
  'ஆசிரியர்',
  'రచయిత',
  'ಲೇಖಕ',
  'രചയിതാവ്',
  'කර්තෘ',
  'ผู้เขียน',
  'စာရေးသူ',
  'ავტორი',
  'អ្នកនិពន្ធ',
  '作者',
  '著者',
  '저자',
];

/*
 * A dictionary for the word 'name' in several languages
 */
const nameTranslations = [
  'ad',
  'aha',
  'ainm',
  'anarana',
  'dzina',
  'emër',
  'enw',
  'igama',
  'ime',
  'ingoa',
  'isem',
  'isim',
  'ism',
  'izen',
  'jeneng',
  'jina',
  'lebitso la',
  'lub npe',
  'magaca',
  'naam',
  'nafn',
  'nama',
  'name',
  'namn',
  'navn',
  'nazwa',
  'ngalan',
  'nimi',
  'nom',
  'nombre',
  'nome',
  'nomine',
  'nomo',
  'non',
  'nosaukums',
  'nume',
  'název',
  'názov',
  'név',
  'orukọ',
  'pangalan',
  'prénom',
  'sunan',
  'tên',
  'vardas',
  'όνομα',
  'ат',
  'име',
  'имя',
  'ном',
  'нэр',
  "ім'я",
  'імя',
  'անուն',
  'נאָמען',
  'שֵׁם',
  'اسم',
  'نام',
  'नाम',
  'नाव',
  'নাম',
  'નામ',
  'பெயர்',
  'పేరు',
  'ಹೆಸರು',
  'പേര്',
  'නාමය',
  'ชื่อ',
  'ຊື່',
  'နာမတျောကို',
  'სახელი',
  'ឈ្មោះ',
  '名',
  '名称',
  '名稱',
  '이름',
];

/**
 * Adds weight to the presence of className and absense of tagName
 */
function weightsFilter(weights: FeatureWeights): FeatureWeights {
  // The better author tags usually have classes
  // let's penalize by half
  weights.leafHasClass *= 0.5;
  // The better author tags don't have tag names
  // let's penalize it more
  weights.leafHasTagName *= 2;
  return weights;
}

/**
 * Penalize selectors that match too many elements
 *
 * Prioritize selectors with the words 'author' or 'name' in it
 * using the translations dictionary.
 */
function scoreFilter(
  score: number,
  selector: string,
  contextSelector: string
): number {
  const findings = document.querySelectorAll(selector);
  const lowerCaseSelector = selector.toLowerCase();
  for (let word of authorTranslations) {
    if (lowerCaseSelector.includes(word)) {
      score += 50;
    }
  }
  for (let word of nameTranslations) {
    if (lowerCaseSelector.includes(word)) {
      score += 25;
    }
  }
  if (findings.length > 3) {
    score -= 10 * (findings.length - 3);
  }
  return score;
}

CSSSelectorResolver.addFeatureWeightsFilter(
  weightsFilter,
  'GlobalRule.author.name'
);

CSSSelectorResolver.addScoreFilter(scoreFilter, 'GlobalRule.author.name');
