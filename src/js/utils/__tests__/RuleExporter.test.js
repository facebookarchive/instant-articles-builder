/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map, Set } from 'immutable';
import AdsTypes from '../../data/AdsTypes';
import { remote as ElectronRemote } from 'electron';
import RulesEditorDispatcher from '../../data/RulesEditorDispatcher';
import RuleExporter from '../RuleExporter';
import { RuleFactory } from '../../models/Rule';
import { RuleDefinitionFactory } from '../../models/RuleDefinition';
import { RulePropertyDefinitionFactory } from '../../models/RulePropertyDefinition';
import { RulePropertyFactory } from '../../models/RuleProperty';
import RulePropertyTypes from '../../models/RulePropertyTypes';
import SettingsActionTypes from '../../data/SettingsActionTypes';
import { TransformationSettingsFactory } from '../../models/TransformationSettings';

// Replace the default dispatcher with an automatic mock
jest.mock('../../data/RulesEditorDispatcher');

// Rules that are always included in the exported file
const defaultExportedRules = [{ class: 'TextNodeRule' }];

describe('RuleExporter', () => {
  it('should export only default rules if none configured', () => {
    const exportedRules = RuleExporter.export(Map());
    expect(exportedRules.rules).toEqual(defaultExportedRules);
  });

  it('should export only valid configured rules', () => {
    const exportedRules = RuleExporter.export(
      Map({
        'valid-rule': RuleFactory({
          definition: RuleDefinitionFactory({
            name: 'ValidRule',
          }),
          selector: '.some-selector',
        }),
        'invalid-rule': RuleFactory(),
      })
    );
    expect(exportedRules.rules).toEqual([
      ...defaultExportedRules,
      { class: 'ValidRule', selector: '.some-selector' },
    ]);
  });

  it('should export only valid configured rule properties', () => {
    const exportedRules = RuleExporter.export(
      Map({
        'valid-rule': RuleFactory({
          definition: RuleDefinitionFactory({
            name: 'ValidRule',
            properties: Map({
              'valid-property': RulePropertyDefinitionFactory({
                name: 'valid-property',
                supportedTypes: Set([RulePropertyTypes.ELEMENT]),
              }),
              'invalid-property': RulePropertyDefinitionFactory({
                name: 'invalid-property',
              }),
            }),
          }),
          properties: Map({
            'valid-property': RulePropertyFactory({
              type: RulePropertyTypes.ELEMENT,
              selector: '.some-selector',
            }),
            'invalid-property': RulePropertyFactory(),
          }),
          selector: '.some-selector',
        }),
      })
    );
    expect(exportedRules.rules).toEqual([
      ...defaultExportedRules,
      {
        class: 'ValidRule',
        selector: '.some-selector',
        properties: {
          'valid-property': {
            type: RulePropertyTypes.ELEMENT,
            selector: '.some-selector',
          },
        },
      },
    ]);
  });

  describe('Attribution', () => {
    it('should set the generator name', () => {
      // Fixed value
      const expectedName = 'facebook-instant-articles-builder';

      const exported = RuleExporter.export(Map());

      // Ensure the expected fixed value is returned
      expect(exported.generator_name).toEqual(expectedName);
    });

    it('should set the generator version', () => {
      // Generate random version name
      const version = 'v' + Math.random().toString();
      const { app } = ElectronRemote;
      // Override the version with our random value
      app.__setVersion(version);

      const exported = RuleExporter.export(Map());

      // Ensure we are calling app.getVersion()
      expect(exported.generator_version).toEqual(version);
    });
  });

  describe('Settings', () => {
    beforeEach(() => {
      // Clear information of previous calls to the dispatch mock function
      RulesEditorDispatcher.dispatch.mockClear();
    });

    it('should import style name', () => {
      const styleName = 'style' + Math.random().toString();
      const importedObj = {
        rules: [],
        style_name: styleName,
      };

      RuleExporter.import(JSON.stringify(importedObj), Map());

      // Inspect all the arguments (array) passed to the dispatch function
      expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
        {
          type: SettingsActionTypes.EDIT_STYLE_NAME,
          styleName: styleName,
        },
      ]);
    });

    it('should not export style name by default', () => {
      const exported = RuleExporter.export(
        Map(),
        TransformationSettingsFactory()
      );

      expect(exported.style_name).toBeUndefined();
    });

    it('should export style name', () => {
      // use random style name
      const styleName = 'style' + Math.random().toString();
      const transformationSettings = TransformationSettingsFactory({
        styleName,
      });

      const exported = RuleExporter.export(Map(), transformationSettings);

      expect(exported.style_name).toEqual(styleName);
    });

    describe('Ads Settings', () => {
      it('should import Audience Network Placement ID', () => {
        const audienceNetworkPlacementId = Math.random().toString();
        const importedObj = {
          rules: [],
          ads: {
            audience_network_placement_id: audienceNetworkPlacementId,
          },
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set AN ID
            type: SettingsActionTypes.EDIT_AUDIENCE_NETWORK_PLACEMENT_ID,
            audienceNetworkPlacementId: audienceNetworkPlacementId,
          },
        ]);
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Ads type
            type: SettingsActionTypes.EDIT_ADS_TYPE,
            adsType: AdsTypes.AUDIENCE_NETWORK,
          },
        ]);
      });

      it('should import Ads Raw HTML', () => {
        const rawHtml = Math.random().toString();
        const importedObj = {
          rules: [],
          ads: {
            raw_html: rawHtml,
          },
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Raw HTML
            type: SettingsActionTypes.EDIT_ADS_RAW_HTML,
            adsRawHtml: rawHtml,
          },
        ]);
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Ads type
            type: SettingsActionTypes.EDIT_ADS_TYPE,
            adsType: AdsTypes.RAW_HTML,
          },
        ]);
      });

      it('should import no ads if null', () => {
        const importedObj = {
          rules: [],
          // ads: undefined, Excluded
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Raw HTML
            type: SettingsActionTypes.EDIT_ADS_TYPE,
            adsType: AdsTypes.NONE,
          },
        ]);
      });

      it('should import no ads if no ads values', () => {
        const importedObj = {
          rules: [],
          ads: {
            // no ads values
          },
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Raw HTML
            type: SettingsActionTypes.EDIT_ADS_TYPE,
            adsType: AdsTypes.NONE,
          },
        ]);
      });

      it('should not export Ads Settings by default', () => {
        const exported = RuleExporter.export(Map());

        expect(exported.ads).toBeUndefined();
      });

      it('should export Audience Network Placement ID', () => {
        // use random AN Placement ID
        const audienceNetworkPlacementId = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            audienceNetworkPlacementId,
            type: AdsTypes.AUDIENCE_NETWORK,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads.audience_network_placement_id).toEqual(
          audienceNetworkPlacementId
        );
      });

      it('should not export Audience Network Placement ID if Raw', () => {
        // use random AN Placement ID
        const audienceNetworkPlacementId = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            audienceNetworkPlacementId,
            rawHtml: 'somthing',
            type: AdsTypes.RAW_HTML,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads.audience_network_placement_id).toBeUndefined();
      });

      it('should not export Audience Network Placement ID if None', () => {
        // use random AN Placement ID
        const audienceNetworkPlacementId = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            audienceNetworkPlacementId,
            type: AdsTypes.NONE,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads).toBeUndefined();
      });

      it('should export Ads Raw HTML', () => {
        // use random raw HTML
        const rawHtml = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            rawHtml,
            type: AdsTypes.RAW_HTML,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads.raw_html).toEqual(rawHtml);
      });

      it('should not export Ads Raw HTML if AN', () => {
        // use random raw HTML
        const rawHtml = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            rawHtml,
            audienceNetworkPlacementId: 'something',
            type: AdsTypes.AUDIENCE_NETWORK,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads.raw_html).toBeUndefined();
      });

      it('should not export Ads Raw HTML if None', () => {
        // use random raw HTML
        const rawHtml = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          adsSettings: {
            rawHtml,
            type: AdsTypes.NONE,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.ads).toBeUndefined();
      });
    });

    describe('Analytics Settings', () => {
      it('should import FB Pixel ID', () => {
        const fbPixelId = Math.random().toString();
        const importedObj = {
          rules: [],
          analytics: {
            fb_pixel_id: fbPixelId,
          },
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set FB Pixel ID
            type: SettingsActionTypes.EDIT_FB_PIXEL_ID,
            fbPixelId: fbPixelId,
          },
        ]);
      });

      it('should import Analytics Raw HTML', () => {
        const rawHtml = Math.random().toString();
        const importedObj = {
          rules: [],
          analytics: {
            raw_html: rawHtml,
          },
        };

        RuleExporter.import(JSON.stringify(importedObj), Map());

        // Inspect all the arguments (array) passed to the dispatch function
        expect(RulesEditorDispatcher.dispatch.mock.calls).toContainEqual([
          {
            // Expected action to set Raw HTML
            type: SettingsActionTypes.EDIT_ANALYTICS_RAW_HTML,
            analyticsRawHtml: rawHtml,
          },
        ]);
      });

      it('should not export Analytics Settings by default', () => {
        const exported = RuleExporter.export(Map());

        expect(exported.analytics).toBeUndefined();
      });

      it('should export FB Pixel ID', () => {
        // use random FB Pixel ID
        const fbPixelId = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          analyticsSettings: {
            fbPixelId,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.analytics.fb_pixel_id).toEqual(fbPixelId);
      });

      it('should export Analytics Raw HTML', () => {
        // use random raw HTML
        const rawHtml = Math.random().toString();
        const transformationSettings = TransformationSettingsFactory({
          analyticsSettings: {
            rawHtml,
          },
        });

        const exported = RuleExporter.export(Map(), transformationSettings);

        expect(exported.analytics.raw_html).toEqual(rawHtml);
      });
    });
  });
});
