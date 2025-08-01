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

import { App, Stack, RemovalPolicy, Duration } from "aws-cdk-lib";
import { EventbridgeToKinesisFirehoseToS3 } from "../lib";
import { generateIntegStackName, suppressCustomHandlerCfnNagWarnings, SetConsistentFeatureFlags } from '@aws-solutions-constructs/core';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from 'aws-cdk-lib/aws-events';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

// Empty arguments
const stack = new Stack(app, generateIntegStackName(__filename));
SetConsistentFeatureFlags(stack);

new EventbridgeToKinesisFirehoseToS3(stack, 'evtfhss3-custom-log-bucket', {
  eventRuleProps: {
    schedule: events.Schedule.rate(Duration.minutes(5))
  },
  bucketProps: {
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  },
  loggingBucketProps: {
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    // This functionality is inconsequential, it just confirms
    // that these props continue to be utilized
    lifecycleRules: [{
      enabled: true,
      transitions: [{
        storageClass: s3.StorageClass.GLACIER,
        transitionAfter: Duration.days(7)
      }]
    }]
  },
  logGroupProps: {
    removalPolicy: RemovalPolicy.DESTROY
  }
});

suppressCustomHandlerCfnNagWarnings(stack, 'Custom::S3AutoDeleteObjectsCustomResourceProvider');
new IntegTest(stack, 'Integ', { testCases: [
  stack
] });
