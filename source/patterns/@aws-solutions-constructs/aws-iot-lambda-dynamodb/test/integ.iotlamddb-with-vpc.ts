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

import { App, Stack } from "aws-cdk-lib";
import { IotToLambdaToDynamoDB, IotToLambdaToDynamoDBProps } from "../lib";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { generateIntegStackName, suppressCustomHandlerCfnNagWarnings, SetConsistentFeatureFlags } from '@aws-solutions-constructs/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as defaults from '@aws-solutions-constructs/core';

const app = new App();
const stack = new Stack(app, generateIntegStackName(__filename));
SetConsistentFeatureFlags(stack);

const props: IotToLambdaToDynamoDBProps = {
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(`${__dirname}/lambda`),
    runtime: defaults.COMMERCIAL_REGION_LAMBDA_NODE_RUNTIME,
    handler: 'index.handler'
  },
  iotTopicRuleProps: {
    topicRulePayload: {
      ruleDisabled: false,
      description: "Processing of DTC messages from the AWS Connected Vehicle Solution.",
      sql: "SELECT * FROM 'connectedcar/dtc/#'",
      actions: []
    }
  },
  deployVpc: true,
  tableEnvironmentVariableName: 'CUSTOM_TABLE_NAME',
};

new IotToLambdaToDynamoDB(stack, 'test-iot-lambda-dynamodb-stack', props);

suppressCustomHandlerCfnNagWarnings(stack, 'Custom::VpcRestrictDefaultSGCustomResourceProvider');

new IntegTest(stack, 'Integ', { testCases: [
  stack
] });
