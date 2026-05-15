// Per-region · per-service CodePipeline (Amway pattern).
//
// ONE Pipeline is provisioned PER REGION the dev chose at scaffold time.
// Every region pipeline runs the SAME env stages (dev → qa → uat → prod).
//
// One-time setup (SRE), once per region:
//   cd cdk/pipelines && npm install
//   export CODESTAR_CONNECTION_ARN=arn:aws:codestar-connections:...:connection/...
//   npx cdk deploy --all

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const SERVICE_NAME = 'v7-commerce-cart-app-service';
const REPO_OWNER   = 'priyankaajbhagatt-collab';
const REPO_NAME    = 'v7-commerce-cart-app-service';
const BRANCH       = 'main';

const REGIONS: string[] = [
  'us-east-1',
];

// CodeStar Connection wiring GitHub → CodePipeline. One connection per AWS
// account/org — the same ARN is reused by every per-service pipeline.
// Override at deploy time with `export CODESTAR_CONNECTION_ARN=...` if you
// move accounts.
const CODESTAR_CONNECTION_ARN =
  process.env.CODESTAR_CONNECTION_ARN ??
  'arn:aws:codestar-connections:us-east-1:381492075615:connection/fed7ad17-4a1a-4f07-8160-f5c6964a45a0';

interface EnvConfig {
  readonly name: string;
  readonly enabled: boolean;
  readonly requiresApproval: boolean;
}

const ENVS: EnvConfig[] = [
  { name: 'dev',  enabled: true,  requiresApproval: false },
  { name: 'qa',   enabled: true,   requiresApproval: false },
  { name: 'uat',  enabled: true,  requiresApproval: true },
  { name: 'prod', enabled: true, requiresApproval: true },
];

interface MainPipelineStackProps extends cdk.StackProps {
  readonly region: string;
}

export class MainPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MainPipelineStackProps) {
    super(scope, id, { ...props, env: { region: props.region } });

    const sourceArtifact = new codepipeline.Artifact('Source');
    const buildArtifact  = new codepipeline.Artifact('Build');

    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      projectName: `${SERVICE_NAME}-${props.region}-build`,
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      environmentVariables: {
        TARGET_REGION: { value: props.region },
      },
    });

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `${SERVICE_NAME}-${props.region}-main`,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeStarConnectionsSourceAction({
              actionName: 'GitHub',
              owner: REPO_OWNER,
              repo: REPO_NAME,
              branch: BRANCH,
              connectionArn: CODESTAR_CONNECTION_ARN,
              output: sourceArtifact,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: buildProject,
              input: sourceArtifact,
              outputs: [buildArtifact],
            }),
          ],
        },
        ...ENVS.filter(e => e.enabled).map(envCfg => {
          const deployProject = new codebuild.PipelineProject(this, `Deploy${envCfg.name}Project`, {
            projectName: `${SERVICE_NAME}-${props.region}-deploy-${envCfg.name}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename('deployspec.yml'),
            environmentVariables: {
              TARGET_ENV:    { value: envCfg.name },
              TARGET_REGION: { value: props.region },
            },
          });
          return {
            stageName: `Deploy-${envCfg.name}`,
            actions: [
              ...(envCfg.requiresApproval
                ? [new codepipeline_actions.ManualApprovalAction({
                    actionName: `Approve-${envCfg.name}`,
                    runOrder: 1,
                  })]
                : []),
              new codepipeline_actions.CodeBuildAction({
                actionName: `Deploy-${envCfg.name}`,
                project: deployProject,
                input: buildArtifact,
                runOrder: envCfg.requiresApproval ? 2 : 1,
              }),
            ],
          };
        }),
      ],
    });

    cdk.Tags.of(this).add('Service', SERVICE_NAME);
    cdk.Tags.of(this).add('Product', 'commerce-cart');
    cdk.Tags.of(this).add('Region',  props.region);
    cdk.Tags.of(this).add('ManagedBy', 'cdk');
  }
}

const app = new cdk.App();
for (const region of REGIONS) {
  new MainPipelineStack(app, `V7CommerceCartAppServiceMainPipeline-${region}`, { region });
}
