# v7-commerce-cart-app-service

v7 commerce-cart-app-service

| | |
|---|---|
| **Flavor** | Fastify (Node / TypeScript) |
| **Tier** | api |
| **Domain** | cart |
| **Product** | commerce-cart |
| **Owner** | group:default/platform |
| **CI/CD** | aws-codepipeline |

Scaffolded from the Amway service template via Projen.

## Local development

```bash
yarn install
yarn dev        # ts-node-dev with live reload on src/index.ts
yarn build      # tsc
yarn test       # jest
yarn lint       # eslint src --ext .ts
```

## Seed infrastructure (provisioned at scaffold-time)

The Backstage scaffolder pre-seeded these L3 constructs in [cdk/app-infra/service-stack.ts](cdk/app-infra/service-stack.ts) based on the checkboxes you ticked:

_None — you didn't tick any seed-infra boxes on the scaffolder form. The service stack is empty; add constructs as needed._

## Adding MORE infrastructure later

This service follows Amway's pattern: **infra is defined in code, not via the Backstage UI**. To add a new service-scoped resource:

1. Edit `cdk/app-infra/service-stack.ts` (Node service) or open a PR to the platform `app-infra` repo (Python / Java services).
2. Re-run `npx projen` if you re-render this template — the `<PROJEN:USER-CONSTRUCTS-START>` block is preserved across regenerations.

## Pipelines

- **Lint stage**: true
- **Test stage**: true
- **Security scan stage**: true
- **Container build stage**: true
- **Deploy stage**: true

## Deployment topology — what is deployed, where

Below is the exact env × region matrix this service will land in. Every cell corresponds to one ArgoCD `Application` (one Kubernetes deployment instance) and one CodePipeline stage. The same container image SHA flows through every cell — no rebuilds per region/env.

| Env | us-east-1 |
|---|---|
| **dev** | [`v7-commerce-cart-app-service-dev-us-east-1`](https://argocd.dep.altimetrik.io/applications/v7-commerce-cart-app-service-dev-us-east-1) |
| **qa** | [`v7-commerce-cart-app-service-qa-us-east-1`](https://argocd.dep.altimetrik.io/applications/v7-commerce-cart-app-service-qa-us-east-1) |
| **uat** 🛡️ | [`v7-commerce-cart-app-service-uat-us-east-1`](https://argocd.dep.altimetrik.io/applications/v7-commerce-cart-app-service-uat-us-east-1) |
| **prod** 🛡️ | [`v7-commerce-cart-app-service-prod-us-east-1`](https://argocd.dep.altimetrik.io/applications/v7-commerce-cart-app-service-prod-us-east-1) |

🛡️ = manual approval gate before this env deploys.

### Quick links (also surfaced as clickable links on the Backstage entity page)

| Resource | Where |
|---|---|
| Source repo | [`priyankaajbhagatt-collab/v7-commerce-cart-app-service`](https://github.com/priyankaajbhagatt-collab/v7-commerce-cart-app-service) |
| Pull requests | [Open PRs](https://github.com/priyankaajbhagatt-collab/v7-commerce-cart-app-service/pulls) |
| Slack — general | `#commerce-cart-general` |
| Slack — approvals | `#commerce-cart-approval` |
| CodePipeline (us-east-1) | [`v7-commerce-cart-app-service-us-east-1-main`](https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/v7-commerce-cart-app-service-us-east-1-main/view?region=us-east-1) |
| ECR repo (us-east-1) | [`v7-commerce-cart-app-service`](https://us-east-1.console.aws.amazon.com/ecr/repositories/private/v7-commerce-cart-app-service?region=us-east-1) |
| CloudWatch logs (us-east-1) | [`/aws/ecs/v7-commerce-cart-app-service`](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/%2Faws%2Fecs%2Fv7-commerce-cart-app-service) |

Environments enabled (with approval gates):
- **dev** — approval required: false
- **qa** — approval required: false
- **uat** — approval required: true
- **prod** — approval required: true

## Auto-approve + auto-merge

PRs on this repo are **auto-approved and auto-merged** when CI is green — no manual approval click required.

