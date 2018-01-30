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

import { Set } from 'immutable';
import RuleCategories from '../models/RuleCategories';
import { Dropdown, Label, Icon } from 'semantic-ui-react';
import { RuleFactory } from '../models/Rule';
import RuleExporter from '../utils/RuleExporter';
import type { Props } from '../containers/AppContainer.react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import EditorActions from '../data/EditorActions';
import type { RuleCategory } from '../models/RuleCategories';

function getLabelIcon(category: RuleCategory): string {
  switch (category) {
    case RuleCategories.ADVANCED:
      return 'settings';
    case RuleCategories.BASIC:
      return 'check circle';
    case RuleCategories.TEXT:
      return 'font';
    case RuleCategories.MEDIA:
      return 'video';
    case RuleCategories.WIDGETS:
      return 'browser';
    default:
      '';
  }
}

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

    // Load basic rules
    this.handleNew();
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
        EditorActions.filterRules(
          this.props.editor.categories.add(ruleDefinition.category)
        );
      }
    }
  };

  handleNew = (event: Event) => {
    // Load basic rules
    Fs.readFile(
      'src/js/basic-rules.json',
      importExportEncoding,
      (error, data) => {
        this.loadFromExportedData(data);
      }
    );
    EditorActions.filterRules(Set([RuleCategories.BASIC]));
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

  handleChangeFilters = (event, data) => {
    EditorActions.filterRules(Set(data.value));
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
        <label>
          <Icon name="filter" />Filter Rules:
        </label>
        <Dropdown
          multiple
          labeled
          fluid
          selection
          closeOnChange={true}
          options={Object.values(RuleCategories).map(category => ({
            text: category,
            value: category,
            icon: getLabelIcon(category),
          }))}
          renderLabel={item => ({
            content: item.text,
            icon: item.icon,
          })}
          text="Pick at least 1 category"
          value={this.props.editor.categories.toArray()}
          onChange={this.handleChangeFilters}
        />
        <hr />
        <label>
          <Icon name="list" />Rules:
        </label>
        <select
          className="rule-selector"
          onChange={this.handleAddRule}
          value=""
        >
          <option value="" disabled={true}>
            + Add a new rule...
          </option>
          <optgroup label="-----------------------------------" />
          {Object.values(RuleCategories).map(category => (
            <optgroup key={category} label={category + ' rules'}>
              {this.props.ruleDefinitions
                .sortBy(defintion => defintion.displayName)
                .valueSeq()
                .filter(definition => definition.category == category)
                .map(ruleDefinition => (
                  <option
                    key={ruleDefinition.name}
                    value={ruleDefinition.name}
                    disabled={
                      !this.props.editor.categories.contains(
                        ruleDefinition.category
                      )
                    }
                  >
                    {ruleDefinition.displayName}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
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
