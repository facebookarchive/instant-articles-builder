/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import AdsTypes from '../data/AdsTypes';
import { remote as ElectronRemote } from 'electron';
import Immutable from 'immutable';
import type { Rule } from '../models/Rule';
import type { RuleProperty } from '../models/RuleProperty';
import type { RuleDefinition } from '../models/RuleDefinition';
import type { RulePropertyDefinition } from '../models/RulePropertyDefinition';
import type { TransformationSettings } from '../models/TransformationSettings';
import RuleActions from '../data/RuleActions';
import { RuleFactory } from '../models/Rule';
import { RulePropertyFactory } from '../models/RuleProperty';
import RulePropertyTypes from '../models/RulePropertyTypes';
import { RuleUtils } from '../utils/RuleUtils';
import { RulePropertyUtils } from '../utils/RulePropertyUtils';
import SettingsActions from '../data/SettingsActions';

const GENERATOR_NAME = 'facebook-instant-articles-builder';

export type JSONFormat = {
  ads?: { audience_network_placement_id?: string, raw_html?: string },
  analytics?: { fb_pixel_id?: string, raw_html?: string },
  generator_name: string,
  generator_version: string,
  rules: RuleJSON[],
  style_name?: string
};

type RulePropertyJSON = {
  attribute: ?string,
  format?: string,
  selector: string,
  type: string
};

type RuleJSON = {
  class: string,
  selector?: string,
  properties?: { [string]: RulePropertyJSON }
};

type AdsJSON = {
  audience_network_placement_id?: string,
  raw_html?: string
};

type AnalyticsJSON = {
  fb_pixel_id?: string,
  raw_html?: string
};

class RuleExporter {
  static import(
    data: string,
    ruleDefinitions: Immutable.Map<string, RuleDefinition>
  ) {
    let json: JSONFormat = JSON.parse(data);
    let rulesJSON: RuleJSON[] = json.rules;
    let rules = rulesJSON.map(ruleJSON =>
      this.createRuleFromJSON(ruleJSON, ruleDefinitions.get(ruleJSON.class))
    );
    // Register all rules on the store
    RuleActions.removeAllRules();
    rules
      .filter(rule => rule != null)
      .forEach(rule => (rule != null ? RuleActions.addRule(rule) : null));

    this.importSettings(json);
  }

  static importSettings(json: JSONFormat): void {
    // Restore style name, if present
    if (json.style_name) {
      SettingsActions.editStyleName(json.style_name);
    }

    this.importAdsSettings(json);
    this.importAnalyticsSettings(json);
  }

  static importAdsSettings(json: JSONFormat): void {
    const { ads } = json;

    // Restore Ads Settings, if present
    if (ads) {
      if (ads.audience_network_placement_id) {
        SettingsActions.editAudienceNetworkPlacementId(
          ads.audience_network_placement_id
        );
        SettingsActions.editAdsType(AdsTypes.AUDIENCE_NETWORK);
        return;
      } else if (ads.raw_html) {
        SettingsActions.editAdsRawHtml(ads.raw_html);
        SettingsActions.editAdsType(AdsTypes.RAW_HTML);
        return;
      }
    }

    SettingsActions.editAdsType(AdsTypes.NONE);
  }

  static importAnalyticsSettings(json: JSONFormat): void {
    const { analytics } = json;
    // Restore Analytics Settings, if present
    if (!analytics) {
      return;
    }
    const { fb_pixel_id: fbPixelId, raw_html: rawHtml } = analytics;

    // Restore FB Pixel ID, if present
    if (fbPixelId) {
      SettingsActions.editFbPixelId(fbPixelId);
    }

    // Restore Analytics Raw HTML, if present
    if (rawHtml) {
      SettingsActions.editAnalyticsRawHtml(rawHtml);
    }
  }

  static export(
    rules: Immutable.Map<string, Rule>,
    settings: TransformationSettings
  ): JSONFormat {
    let exported = {
      // We are NOT using ElectronRemote.app.getName() because it defaults to
      // the 'productName' field in the package.json file
      // (Facebook Instant Articles Builder) and we are looking for 'name'
      generator_name: GENERATOR_NAME,
      generator_version: ElectronRemote.app.getVersion(),
      rules: [
        { class: 'TextNodeRule' },
        ...Array.from(
          rules
            .filter(rule => RuleUtils.isValid(rule))
            .map((rule: Rule): ?RuleJSON => this.createJSONFromRule(rule))
            .filter(Boolean)
            .values()
        ),
      ],
    };

    if (settings && settings.styleName) {
      exported = { style_name: settings.styleName, ...exported };
    }

    const ads = this.createAdsJSON(settings);
    if (ads) {
      exported = { ads, ...exported };
    }

    const analytics = this.createAnalyticsJSON(settings);
    if (analytics) {
      exported = { analytics, ...exported };
    }

    return exported;
  }

  static createJSONFromRule(rule: Rule): ?RuleJSON {
    if (rule.selector != null) {
      let properties = rule.properties.isEmpty()
        ? null
        : this.createJSONFromRuleProperties(rule.properties);
      return {
        class: rule.definition.name,
        selector: rule.selector,
        ...(properties != null ? { properties } : {}),
      };
    }
    return null;
  }

  static createJSONFromRuleProperties(
    properties: ?Immutable.Map<string, RuleProperty>
  ): ?{ [string]: RulePropertyJSON } {
    if (properties != null) {
      return properties
        .filter(property => RulePropertyUtils.isValid(property))
        .map(property => this.createJSONFromRuleProperty(property))
        .filter(Boolean)
        .toJSON();
    }
    return null;
  }

  static createJSONFromRuleProperty(property: RuleProperty): ?RulePropertyJSON {
    if (property != null && property.selector != null) {
      return {
        ...((property.attribute || property.definition.defaultAttribute) !=
          null &&
        (property.attribute || property.definition.defaultAttribute) !=
          'innerContent' &&
        (property.attribute || property.definition.defaultAttribute) !=
          'textContent' &&
        (property.attribute || property.definition.defaultAttribute) !=
          'dateTextContent'
          ? {
            attribute:
                property.attribute || property.definition.defaultAttribute,
          }
          : {}),
        ...((property.type || property.definition.defaultType) ==
        RulePropertyTypes.DATETIME
          ? { format: property.format }
          : {}),
        selector: property.selector,
        type:
          property.type != null
            ? property.type
            : property.definition.defaultType,
      };
    }
    return null;
  }

  static createAdsJSON(settings: TransformationSettings): ?AdsJSON {
    if (!settings || !settings.adsSettings) {
      return null;
    }

    const adsSettings = settings.adsSettings;
    switch (adsSettings.type) {
      case AdsTypes.AUDIENCE_NETWORK:
        return adsSettings.audienceNetworkPlacementId
          ? {
            audience_network_placement_id:
                adsSettings.audienceNetworkPlacementId,
          }
          : null;
      case AdsTypes.RAW_HTML:
        return adsSettings.rawHtml
          ? {
            raw_html: adsSettings.rawHtml,
          }
          : null;
      case AdsTypes.NONE:
      default:
        return null;
    }
  }

  static createAnalyticsJSON(settings: TransformationSettings): ?AnalyticsJSON {
    if (!settings || !settings.analyticsSettings) {
      return null;
    }

    // Do not build the object if there are no settings
    const analyticsSettings = settings.analyticsSettings;
    if (!analyticsSettings.fbPixelId && !analyticsSettings.rawHtml) {
      return null;
    }

    return {
      fb_pixel_id: settings.analyticsSettings.fbPixelId,
      raw_html: settings.analyticsSettings.rawHtml,
    };
  }

  static createRuleFromJSON(
    ruleJSON: RuleJSON,
    ruleDefinition: ?RuleDefinition
  ): ?Rule {
    if (ruleDefinition != null) {
      return RuleFactory({
        definition: ruleDefinition,
        selector: ruleJSON.selector || '',
        properties: this.createRulePropertiesFromJSON(
          ruleJSON.properties,
          ruleDefinition
        ),
      });
    }
    return null;
  }

  static createRulePropertiesFromJSON(
    rulePropertiesJSON: ?{ [string]: RulePropertyJSON },
    ruleDefinition: RuleDefinition
  ): Immutable.Map<string, RuleProperty> {
    if (rulePropertiesJSON != null && ruleDefinition != null) {
      return Immutable.Map(rulePropertiesJSON)
        .map(
          (rulePropertyJSON: RulePropertyJSON, name: string): ?RuleProperty => {
            return this.createRulePropertyFromJSON(
              rulePropertyJSON,
              ruleDefinition.properties.get(name)
            );
          }
        )
        .filter(Boolean);
    }
    return Immutable.Map();
  }

  static createRulePropertyFromJSON(
    rulePropertyJSON: RulePropertyJSON,
    rulePropertyDefinition: ?RulePropertyDefinition
  ): ?RuleProperty {
    if (rulePropertyDefinition != null) {
      return RulePropertyFactory({
        definition: rulePropertyDefinition,
        selector: rulePropertyJSON.selector,
        attribute: this.inferAttributeName(rulePropertyJSON),
        format: rulePropertyJSON.format,
        type: rulePropertyJSON.type,
      });
    }
    return null;
  }

  static inferAttributeName(rulePropertyJSON: RulePropertyJSON): string {
    if (rulePropertyJSON.attribute != null) {
      return rulePropertyJSON.attribute;
    } else {
      switch (rulePropertyJSON.type) {
        case RulePropertyTypes.DATETIME:
          return 'dateTextContent';
        case RulePropertyTypes.STRING:
          return 'textContent';
        default:
          return 'innerContent';
      }
    }
  }
}

export default RuleExporter;
