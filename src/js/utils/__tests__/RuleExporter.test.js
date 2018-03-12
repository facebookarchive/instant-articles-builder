/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map, Set } from 'immutable';
import AdsTypes from '../../data/AdsTypes';
import RuleExporter from '../RuleExporter';
import { RuleFactory } from '../../models/Rule';
import { RuleDefinitionFactory } from '../../models/RuleDefinition';
import { RulePropertyDefinitionFactory } from '../../models/RulePropertyDefinition';
import { RulePropertyFactory } from '../../models/RuleProperty';
import RulePropertyTypes from '../../models/RulePropertyTypes';
import { TransformationSettingsFactory } from '../../models/TransformationSettings';

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

  describe('Settings', () => {
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
