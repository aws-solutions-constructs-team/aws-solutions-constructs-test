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
import { DynamoDBStreamsToPipesToStepfunctions, DynamoDBStreamsToPipesToStepfunctionsProps } from "../lib";
import { generateIntegStackName, SetConsistentFeatureFlags } from '@aws-solutions-constructs/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as defaults from '@aws-solutions-constructs/core';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new App();
const stack = new Stack(app, generateIntegStackName(__filename));
SetConsistentFeatureFlags(stack);
const enrichmentStateMachine = new sfn.StateMachine(stack, 'temp', {
  stateMachineType: sfn.StateMachineType.EXPRESS,
  definitionBody: defaults.CreateTestStateMachineDefinitionBody(stack, 'temp')
});
const props: DynamoDBStreamsToPipesToStepfunctionsProps = {
  stateMachineProps: {
    definitionBody: defaults.CreateTestStateMachineDefinitionBody(stack, 's3stp-test')
  },
  enrichmentStateMachine,
  logLevel: defaults.PipesLogLevel.TRACE
};

new DynamoDBStreamsToPipesToStepfunctions(stack, 'test-sqs-pipes-states-construct', props);

new IntegTest(stack, 'Integ', { testCases: [
  stack
] });
