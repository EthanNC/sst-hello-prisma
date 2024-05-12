/// <reference path="./.sst/platform/config.d.ts" />
import * as mongodbatlas from "@pulumi/mongodbatlas";

export default $config({
  app(input) {
    return {
      name: "hello-prisma",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        random: true,
      },
    };
  },
  async run() {
    $linkable(mongodbatlas.Cluster, function () {
      return {
        properties: {
          name: this.name,
          host: this.connectionStrings[0].standardSrv.apply(
            (s) => s.split(".")[1]
          ),
        },
      };
    });
    $linkable(mongodbatlas.DatabaseUser, function () {
      return {
        properties: {
          username: this.username,
          password: this.password,
        },
      };
    });

    const project = new mongodbatlas.Project("Project", {
      name: $app.name,
      orgId: process.env.MONGODB_ATLAS_ORG_ID,
    });

    new mongodbatlas.ProjectIpAccessList("PublicIpAccess", {
      projectId: project.id,
      cidrBlock: "0.0.0.0/0",
      comment: "allow all traffic",
    });

    const cluster = new mongodbatlas.Cluster(`Cluster`, {
      backingProviderName: "AWS",
      projectId: project.id,
      providerInstanceSizeName: "M0",
      providerName: "TENANT",
      providerRegionName: "US_EAST_1",
    });

    const user = new mongodbatlas.DatabaseUser("DatabaseUser", {
      authDatabaseName: "admin",
      username: $interpolate`${$app.name}-${$app.stage}`,
      password: new random.RandomString("DatabasePassword", {
        length: 16,
        special: false,
      }).result,
      projectId: project.id,
      roles: [
        {
          roleName: "readWrite",
          databaseName: $interpolate`${$app.name}-${$app.stage}`,
        },
      ],
      scopes: [
        {
          name: cluster.name,
          type: "CLUSTER",
        },
      ],
    });

    const lambdaPrismaConfig = {
      copyFiles: Boolean($dev)
        ? []
        : [
            {
              from: "node_modules/.prisma",
              to: "node_modules/.prisma",
            },
            {
              from: "./node_modules/@prisma/client",
              to: "node_modules/@prisma/client",
            },
            {
              from: "node_modules/prisma",
              to: "node_modules/prisma",
            },
          ],

      nodejs: Boolean($dev)
        ? {
            install: ["@prisma/client"],
          }
        : {
            esbuild: {
              platform: "node",
              external: ["@prisma/client"],
            },
          },

      architecture: "arm64",
      runtime: "nodejs20.x",
    } as sst.aws.FunctionArgs;

    const api = new sst.aws.Function("Api", {
      url: true,
      handler: "src/api.handler",
      link: [cluster, user],
      ...lambdaPrismaConfig,
    });

    return {
      url: api.url,
    };
  },
});
