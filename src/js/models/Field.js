/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { Record } from 'immutable';
import { RuleFactory } from './Rule';
import { RulePropertyFactory } from './RuleProperty';
import type { Rule } from './Rule';
import type { RuleProperty } from './RuleProperty';

export type Field = Rule | RuleProperty;
