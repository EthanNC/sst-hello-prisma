# SST-prisma

Provision a free MongoDB Atlas cluster and connect to it with [Prisma](https://www.prisma.io/). All resources are created using the new [SST Ion](https://ion.sst.dev/) engine.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [SST CLI](https://ion.sst.dev/)

## Getting Started

```bash
git clone
cd sst-hello-prisma
pnpm install
```

add the following environment variables to your `.env` file:

```
MONGODB_ATLAS_PUBLIC_KEY=
MONGODB_ATLAS_PRIVATE_KEY=
MONGODB_ATLAS_ORG_ID=
```

Run the following command:

```bash
sst dev
```
