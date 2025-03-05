import { InventoryValidation } from "@functions/inventory-validation";
import type { AWS } from "@serverless/typescript";

export const permissions = {
  ProficiencyQualificationTestProviderAuthCredsGWInvokePermission: {
    Type: "AWS::Lambda::Permission",
    Properties: {
      FunctionName: `arn:aws:lambda:\${self:custom.variables.region.\${self:provider.stage}}:\${self:custom.variables.AccountId.\${self:provider.stage}}:function:order-processing-service-\${self:provider.stage}`,
      Action: "lambda:InvokeFunction",
      Principal: "apigateway.amazonaws.com",
      SourceArn: `arn:aws:execute-api:\${self:custom.variables.region.\${self:provider.stage}}:\${self:custom.variables.AccountId.\${self:provider.stage}}:\${self:custom.variables.EIP_API_ID.\${self:provider.stage}}/*/*/api/*`,
    },
  },
};

const serverlessConfiguration: AWS = {
  service: "order-processing-handlers",
  plugins: ["serverless-esbuild"],
  frameworkVersion: "*",
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "eu-west-1",
    stage: "${opt:stage}",
    environment: {
      PORT: "5000",
      JWT_SECRET: "mysecretkey123",
      JWT_REFRESH_SECRET: "myrefreshsecretkey123",
      REGION: "${self:custom.variables.region.${self:provider.stage}}",
      API_KEY: "xhapidmwkj",
      DOMAIN: "test.io",
    },
  },
  functions: {
    InventoryValidation,
  },
  resources: {
    Resources: {
      ...permissions,
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      external: ["class-validator", "class-transformer"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    variables: {
      region: {
        dev: "eu-west-1",
        prod: "eu-west-1",
      },
    },
  },
};

module.exports = serverlessConfiguration;
