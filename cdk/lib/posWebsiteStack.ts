import * as cdk from 'aws-cdk-lib';
import { NestedStack } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { join } from 'path';
import { EnvConfig } from './envConfig';

export class POSWebsiteStack extends NestedStack {
  private readonly resourceNamePrefix = `cheeseria-pos-web`;

  constructor(scope: Construct, id: string, readonly config: EnvConfig) {
    super(scope, id);

    const websiteBucket = new s3.Bucket(this, this.resourceNamePrefix, {
      bucketName: this.resourceNamePrefix,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const s3DeployPath = s3deploy.Source.asset(join(__dirname, `..`, `..`, `ui`, `pos`, `dist`));

    new s3deploy.BucketDeployment(this, `${this.resourceNamePrefix}-deployment`, {
      sources: [s3DeployPath],
      destinationBucket: websiteBucket,
      prune: false,
    });

    const cloudfrontOac = new cloudfront.CfnOriginAccessControl(this, `${this.resourceNamePrefix}-oac`, {
      originAccessControlConfig: {
        name: `${this.resourceNamePrefix}-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: `OAC for ${this.resourceNamePrefix}`,
      },
    });

    const cloudfrontDistribution = new cloudfront.Distribution(this, `${this.resourceNamePrefix}-distribution`, {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new S3Origin(websiteBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      },
      comment: `Cheeseria Web Distribution`,
      enableIpv6: true,
      httpVersion: cdk.aws_cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      minimumProtocolVersion: cdk.aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      sslSupportMethod: cdk.aws_cloudfront.SSLMethod.SNI,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    const cfDist = cloudfrontDistribution.node.defaultChild as cloudfront.CfnDistribution;

    cfDist.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cloudfrontOac.getAtt('Id'));
    cfDist.addPropertyOverride('DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', '');

    websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [websiteBucket.arnForObjects('*')],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        conditions: {
          [`StringEquals`]: {
            ['aws:SourceArn']: `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${cloudfrontDistribution.distributionId}`,
          },
        },
      }),
    );
  }
}
