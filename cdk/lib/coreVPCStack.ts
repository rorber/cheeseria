import * as cdk from 'aws-cdk-lib';
import { IpAddresses, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { EnvConfig } from './envConfig';
import { POSWebsiteStack } from './posWebsiteStack';
import { ServicesStack } from './servicesStack';

export class CoreVPCStack extends cdk.Stack {
  private readonly resourceNamePrefix = `cheeseria-core`;

  constructor(scope: Construct, id: string, config: EnvConfig) {
    super(scope, id);

    const vpc = this.addVPC(`${this.resourceNamePrefix}-vpc`, config.coreVpcCidr);

    new ServicesStack(
      this,
      `CheeseriaServices`,
      {
        env: { account: this.account, region: this.region },
        vpc,
      },
      config,
    );

    new POSWebsiteStack(this, `CheeseriaPOSWebsite`, config);
  }

  private addVPC(name: string, cidr: string): Vpc {
    const vpc = new Vpc(this, `${this.resourceNamePrefix}-vpc`, {
      ipAddresses: IpAddresses.cidr(cidr),
      vpcName: name,
      restrictDefaultSecurityGroup: false,
      subnetConfiguration: [
        {
          name: `${this.resourceNamePrefix}-pub`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: 20,
        },
        {
          name: `${this.resourceNamePrefix}-priv`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 20,
        },
      ],
    });

    vpc.publicSubnets.forEach((sub, i) => {
      cdk.Tags.of(sub).add(`Name`, `${this.resourceNamePrefix}-pub${i + 1}`);
      const ngw = sub.node.findChild('NATGateway');
      cdk.Tags.of(ngw).add(`Name`, `${this.resourceNamePrefix}-pub${i + 1}-ngw`);
      const rtb = sub.node.findChild('RouteTable');
      cdk.Tags.of(rtb).add(`Name`, `${this.resourceNamePrefix}-pub${i + 1}-rtb`);
    });

    vpc.privateSubnets.forEach((sub, i) => {
      cdk.Tags.of(sub).add(`Name`, `${this.resourceNamePrefix}-priv${i + 1}`);
      const rtb = sub.node.findChild('RouteTable');
      cdk.Tags.of(rtb).add(`Name`, `${this.resourceNamePrefix}-priv${i + 1}-rtb`);
    });

    const igw = vpc.node.findChild('IGW');
    cdk.Tags.of(igw).add(`Name`, `${this.resourceNamePrefix}-igw`);

    return vpc;
  }
}
