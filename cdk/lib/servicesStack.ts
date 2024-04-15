import { StackProps as CdkStackProps, NestedStack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { APIService } from './apiService';
import { EnvConfig } from './envConfig';

interface StackProps extends CdkStackProps {
  vpc: Vpc;
}

export class ServicesStack extends NestedStack {
  constructor(scope: Construct, id: string, props: StackProps, config: EnvConfig) {
    super(scope, id, props);

    new APIService(this, `APIService`, props, config);
  }
}
