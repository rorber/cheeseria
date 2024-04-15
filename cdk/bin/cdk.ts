#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { CoreVPCStack } from '../lib/coreVPCStack';
import { EnvConfig } from '../lib/envConfig';

const app = new App();
const config = demandConfig(app);

new CoreVPCStack(
  app,
  `CheeseriaCoreVPC`,
  config,
);

function demandConfig(app: App): EnvConfig {
  const env = app.node.tryGetContext(`config`);
  if (!env) {
    throw new Error('Context variable missing on CDK command. Pass in as `-c config=dev`');
  }

  const unparsedEnv = app.node.tryGetContext(env);
  return {
    coreVpcCidr: demandString(unparsedEnv, `coreVpcCidr`),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function demandString(object: { [name: string]: any }, propName: keyof EnvConfig): string {
  if (!object[propName]?.trim || object[propName].trim().length === 0) {
    throw new Error(`${propName} does not exist or is empty`);
  }
  return object[propName];
}
