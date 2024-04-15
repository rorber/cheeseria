import { Duration, RemovalPolicy, StackProps, SymlinkFollowMode } from 'aws-cdk-lib';
import { Cors, LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Alias, Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { readdirSync } from 'fs';
import { join } from 'path';
import { EnvConfig } from './envConfig';

interface Props extends StackProps {
  vpc: Vpc;
}

export class APIService extends Construct {
  private readonly resourceNamePrefix = `cheeseria-api`;
  private readonly lambdaAliasName = `Live`;

  constructor(scope: Construct, id: string, readonly props: Props, readonly config: EnvConfig) {
    super(scope, id);

    const lambdaAlias = this.addLambda();

    const apiGw = this.addApiGateway(lambdaAlias);

    lambdaAlias.addPermission(`${this.resourceNamePrefix}-gw-permission`, {
      principal: new ServicePrincipal(`apigateway.amazonaws.com`),
      sourceArn: apiGw.arnForExecuteApi(`*`),
    });
  }

  private addLambda(): Alias {
    const servicePath = join(`..`, `services`, `core-api`);

    const lambdaFn = new LambdaFunction(this, `${this.resourceNamePrefix}1`, {
      code: Code.fromAsset(servicePath, {
        exclude: readdirSync(servicePath)
          .filter((f) => ![`package.json`, `node_modules`, `dist`, `src`, `types`].includes(f))
          .concat(join(`.`, `src`, `**`))
          .concat(join(`.`, `types`, `**`)),
        // Includes the node_modules/.bin directory otherwise the Lambda cant find the entry point
        followSymlinks: SymlinkFollowMode.ALWAYS,
      }),
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
      description: `Cheeseria API deployed via CDK`,
      environment: {
        STAGE: this.node.tryGetContext(`config`),
      },
      functionName: `${this.resourceNamePrefix}1`,
      handler: `dist/services/core-api/src/index.handler`,
      memorySize: 1024,
      reservedConcurrentExecutions: 2,
      retryAttempts: 0,
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(29),
      vpc: this.props.vpc,
      vpcSubnets: { subnets: this.props.vpc.privateSubnets },
    });

    // const lambdaFn = new DockerImageFunction(this, this.resourceNamePrefix, {
    //   code: DockerImageCode.fromImageAsset(servicePath, {
    //     cmd: [`dist/services/core-api/src/index.handler`],
    //     entrypoint: [`/lambda-entrypoint.sh`],
    //     exclude: readdirSync(servicePath)
    //       .filter((f) => ![`package.json`, `node_modules`, `dist`, `src`, `types`].includes(f))
    //       .concat(join(`.`, `src`, `**`))
    //       .concat(join(`.`, `types`, `**`)),
    //     // Includes the node_modules/.bin directory otherwise the Lambda cant find the entry point
    //     followSymlinks: SymlinkFollowMode.ALWAYS,
    //   }),
    //   currentVersionOptions: {
    //     removalPolicy: RemovalPolicy.RETAIN,
    //   },
    //   description: `Cheeseria API deployed via CDK`,
    //   environment: {
    //     STAGE: this.node.tryGetContext(`config`),
    //   },
    //   functionName: this.resourceNamePrefix,
    //   memorySize: 1024,
    //   reservedConcurrentExecutions: 5,
    //   retryAttempts: 0,
    //   timeout: Duration.seconds(29),
    //   vpc: this.props.vpc,
    //   vpcSubnets: { subnets: this.props.vpc.privateSubnets },
    // });

    // If this isn't here, it doesnt create a new version
    lambdaFn.currentVersion;

    const alias = lambdaFn.addAlias(this.lambdaAliasName, {
      provisionedConcurrentExecutions: 1
    });

    return alias;
  }

  private addApiGateway(lambdaAlias: Alias): RestApi {
    return new LambdaRestApi(this, `${this.resourceNamePrefix}-gw`, {
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: [
          `Authorization`,
          `Baggage`,
          `Content-Type`,
          `Sentry-Trace`,
          `X-Amz-Date`,
          `X-Amz-Security-Token`,
          `X-Api-Key`,
        ],
      },
      deployOptions: {
        stageName: this.node.tryGetContext(`config`),
      },
      description: `REST Gateway serving API`,
      handler: lambdaAlias,
      proxy: true,
      restApiName: this.resourceNamePrefix,
    });
  }
}
