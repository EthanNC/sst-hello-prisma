import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
const connectionString = `mongodb+srv://${Resource.DatabaseUser.username}:${Resource.DatabaseUser.password}@${Resource.Cluster.name}.${Resource.Cluster.host}.mongodb.net/${Resource.App.name}-${Resource.App.stage}?retryWrites=true`;
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
});
export const handler: APIGatewayProxyHandlerV2 = async () => {
  //   await prisma.user.create({
  //     data: {
  //       name: "Rich",
  //       email: "hello@prisma.com",
  //       posts: {
  //         create: {
  //           title: "My first post",
  //           body: "Lots of really interesting stuff",
  //           slug: "my-first-post",
  //         },
  //       },
  //     },
  //   });

  const allUsers = await prisma.user.findMany({
    include: {
      //   _count: {
      //     select: { posts: true },
      //   },
      posts: true,
    },
  });
  await prisma.$disconnect();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: allUsers,
    }),
  };
};
