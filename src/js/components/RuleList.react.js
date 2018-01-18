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
const RuleActions = require('../data/RuleActions');
const { remote: { dialog: Dialog } } = require('electron');
const Fs = require('fs');

import { RuleFactory } from '../models/Rule';
import RuleExporter from '../utils/RuleExporter';
import type { Rule } from '../models/Rule';
import type { Props } from '../containers/AppContainer.react';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

const dialogDefaultPath = 'rules.json';
const dialogFilter = {
  name: 'JSON',
  extensions: ['json'],
};
const importExportEncoding = 'utf8';

const SortableItem = SortableElement((props: any) => <RulePicker {...props} />);

const SortableList = SortableContainer((props: any) => {
  return (
    <ul>
      {props.items.map((rule, index) => (
        <SortableItem
          {...props}
          key={rule.guid}
          index={index}
          rule={rule}
          value={rule}
        />
      ))}
    </ul>
  );
});

class RuleList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  loadFromExportedData = (data: string) => {
    RuleExporter.import(data, this.props.ruleDefinitions);
  };

  handleExport = (e: Event) => {
    Dialog.showSaveDialog(
      {
        defaultPath: dialogDefaultPath,
        filters: [dialogFilter],
      },
      fileName => {
        if (fileName) {
          const contents = JSON.stringify(
            RuleExporter.export(this.props.rules)
          );
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

  handleNew = (event: Event) => {
    RuleActions.removeAllRules();
  };

  handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number,
    newIndex: number
  }) => {
    RuleActions.changeOrder(oldIndex, newIndex);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.rules.count() < this.props.rules.count()) {
      this.refs.scrollable.scrollTop = 99999;
    }
  }

  render() {
    return (
      <div className="rule-list">
        <div className="tools">
          <button className="button" id="new-button" onClick={this.handleNew}>
            📄 New
          </button>
          <button
            className="button"
            id="import-button"
            onClick={this.handleImport}
          >
            📂 Open
          </button>
          <button
            className="button"
            id="export-button"
            onClick={this.handleExport}
          >
            💾 Save
          </button>
        </div>
        <form className="selectors-form">
          <select
            className="rule-selector"
            onChange={this.handleAddRule}
            value=""
          >
            <option value="" disabled={true}>
              + Add a new Rule...
            </option>
            <optgroup>
              {this.props.ruleDefinitions
                .sortBy(defintion => defintion.displayName)
                .valueSeq()
                .map(ruleDefinition => (
                  <option key={ruleDefinition.name} value={ruleDefinition.name}>
                    {ruleDefinition.displayName}
                  </option>
                ))}
            </optgroup>
          </select>
        </form>

        <div className="scrollable" ref="scrollable">
          <SortableList
            {...this.props}
            pressDelay={200}
            items={this.props.rules.valueSeq()}
            onSortEnd={this.handleSortEnd}
          />
        </div>
      </div>
    );
  }
}

module.exports = RuleList;
