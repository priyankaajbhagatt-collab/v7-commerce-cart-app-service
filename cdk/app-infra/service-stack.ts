// app-infra stack — Layer 3 in the Amway pattern.
//
// Generated at scaffold time. The L3 constructs below were instantiated
// because you ticked their box on the Backstage form. To add MORE resources
// later, edit this file (in your service repo) and add another L3 import +
// instantiation — that is the Amway pattern. NOT via Backstage UI.
//
// <PROJEN:USER-CONSTRUCTS>
// Add additional constructs in the marked block below — projen will not
// overwrite this block when the platform template is regenerated.
// </PROJEN:USER-CONSTRUCTS>

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface ServiceStackProps extends cdk.StackProps {
  readonly serviceName: string;
  readonly product: string;
}

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    // <PROJEN:USER-CONSTRUCTS-START>
    // Add custom constructs here. Re-running projen will preserve this block.
    // <PROJEN:USER-CONSTRUCTS-END>

    // No seed infra was selected at scaffold time. Add resources here by
    // importing from @amway/cdk-l3-constructs and instantiating below.
    //
    //   import { DemoDB } from '@amway/cdk-l3-constructs';
    //   const t = new DemoDB(this, 'MyTable', { ... });

    cdk.Tags.of(this).add('Service', props.serviceName);
    cdk.Tags.of(this).add('Product', props.product);
  }
}

const app = new cdk.App();
new ServiceStack(app, 'V7CommerceCartAppServiceStack', {
  serviceName: 'v7-commerce-cart-app-service',
  product: 'commerce-cart',
});
