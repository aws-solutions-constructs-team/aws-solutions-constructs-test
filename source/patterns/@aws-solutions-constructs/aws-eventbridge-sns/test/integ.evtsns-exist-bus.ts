/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { EventbridgeToSns, EventbridgeToSnsProps } from '../lib';
import * as events from 'aws-cdk-lib/aws-events';
import { App, Stack } from 'aws-cdk-lib';
import { generateIntegStackName, SetConsistentFeatureFlags } from '@aws-solutions-constructs/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, generateIntegStackName(__filename));
SetConsistentFeatureFlags(stack);
// Create existing custom EventBus
const existingEventBus = new events.EventBus(stack, `existing-event-bus`);
const props: EventbridgeToSnsProps = {
  eventRuleProps: {
    eventPattern: {
      source: ['solutionsconstructs']
    }
  },
  existingEventBusInterface: existingEventBus
};

new EventbridgeToSns(stack, 'test-construct', props);

new IntegTest(stack, 'Integ', { testCases: [
  stack
] });
