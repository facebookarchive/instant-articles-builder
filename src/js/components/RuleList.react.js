/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const React = require('react');
const RulePicker = require('./RulePicker.react.js');
const FindSelectorTypes = require('../types/FindSelectorTypes.js');
const NameUtils = require('../utils/name-utils.js');
const RuleUtils = require('../utils/rule-utils.js');
const RuleActions = require('../data/RuleActions');
const { remote: { dialog: Dialog } } = require('electron');
const Fs = require('fs');

import { RuleFactory } from '../models/Rule';
import type { Rule } from '../models/Rule';
import type { Props } from '../containers/AppContainer.react';

const dialogDefaultPath = 'rules.json';
const dialogFilter = {
  name: 'JSON',
  extensions: ['json'],
};
const importExportEncoding = 'utf8';

class RuleList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  exportRulesJSON = () => {};
  loadFromExportedData = (data: string) => {};

  handleExport = (e: Event) => {
    Dialog.showSaveDialog(
      {
        defaultPath: dialogDefaultPath,
        filters: [dialogFilter],
      },
      fileName => {
        if (fileName) {
          const contents = JSON.stringify(this.exportRulesJSON(), null, 2);
          Fs.writeFile(fileName, contents, importExportEncoding, error => {
            if (error) {
              Dialog.showErrorBox('Unable to save file', error);
            }
          });
        }
      }
    );

    e.preventDefault();
  };

  handleImport = (e: Event) => {
    Dialog.showOpenDialog(
      {
        defaultPath: dialogDefaultPath,
        filters: [dialogFilter],
        properties: ['openFile'],
      },
      (filePaths: Array<string>) => {
        if (filePaths && filePaths.length === 1) {
          Fs.readFile(filePaths[0], importExportEncoding, (error, data) => {
            this.loadFromExportedData(data);
          });
        }
      }
    );
  };

  handleAddRule = (event: Event) => {
    const selectElement = event.target;
    if (selectElement instanceof HTMLSelectElement) {
      const ruleDefinition = this.props.ruleDefinitions.get(
        selectElement.value
      );
      if (ruleDefinition != null) {
        RuleActions.addRule(RuleFactory({ definition: ruleDefinition }));
      }
    }
  };

  render() {
    return (
      <div>
        <button
          className="button"
          id="export-button"
          onClick={this.handleExport}
        >
          Export
        </button>
        <button
          className="button"
          id="import-button"
          onClick={this.handleImport}
        >
          Import
        </button>
        <hr />
        <form className="selectors-form">
          <select
            className="rule-selector"
            onChange={this.handleAddRule}
            value=""
          >
            <option value="" disabled={true}>
              Add a new Rule
            </option>
            <optgroup>
              {this.props.ruleDefinitions
                .sortBy(defintion => defintion.displayName)
                .valueSeq()
                .map(ruleDefinition => (
                  <option
                    key={ruleDefinition.className}
                    value={ruleDefinition.className}
                  >
                    {ruleDefinition.displayName}
                  </option>
                ))}
            </optgroup>
          </select>
        </form>

        {this.props.rules
          .valueSeq()
          .map(rule => (
            <RulePicker {...this.props} key={rule.guid} rule={rule} />
          ))}
      </div>
    );
  }
}

module.exports = RuleList;
