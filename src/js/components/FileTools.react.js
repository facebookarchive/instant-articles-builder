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
const { remote: { dialog: Dialog } } = require('electron');
const Fs = require('fs');
const path = require('path');

import { Set } from 'immutable';
import RuleCategories from '../models/RuleCategories';
import RuleExporter from '../utils/RuleExporter';
import type { Props } from '../containers/AppContainer.react';
import EditorActions from '../data/EditorActions';
import { Icon } from 'semantic-ui-react';

const dialogDefaultPath = 'rules.json';
const dialogFilter = {
  name: 'JSON',
  extensions: ['json'],
};
const importExportEncoding = 'utf8';

class FileTools extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    // Load basic rules
    this.handleNew();
  }

  loadFromExportedData = (data: string) => {
    RuleExporter.import(data, this.props.ruleDefinitions);
  };

  handleExport = () => {
    Dialog.showSaveDialog(
      {
        defaultPath: dialogDefaultPath,
        filters: [dialogFilter],
      },
      fileName => {
        if (fileName) {
          const contents = JSON.stringify(
            RuleExporter.export(this.props.rules, this.props.settings)
          );
          Fs.writeFile(fileName, contents, importExportEncoding, error => {
            if (error) {
              Dialog.showErrorBox('Unable to save file', error);
            }
          });
        }
      }
    );
  };

  handleImport = () => {
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

  handleNew = () => {
    // Load basic rules
    Fs.readFile(
      path.join(__dirname, '../basic-rules.json'),
      importExportEncoding,
      (error, data) => {
        this.loadFromExportedData(data);
      }
    );
    EditorActions.filterRules(Set([RuleCategories.BASIC]));
  };

  render() {
    return (
      <div className="tools">
        <button className="button" id="new-button" onClick={this.handleNew}>
          <Icon name="file outline" /> New
        </button>
        <button
          className="button"
          id="import-button"
          onClick={this.handleImport}
        >
          <Icon name="folder open" /> Open
        </button>
        <button
          className="button"
          id="export-button"
          onClick={this.handleExport}
        >
          <Icon name="save" /> Save
        </button>
      </div>
    );
  }
}

module.exports = FileTools;
