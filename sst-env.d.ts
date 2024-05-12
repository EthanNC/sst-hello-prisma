/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Cluster: {
      host: string
      name: string
      type: "mongodbatlas.index/cluster.Cluster"
    }
    DatabaseUser: {
      password: string
      type: "mongodbatlas.index/databaseUser.DatabaseUser"
      username: string
    }
  }
}
export {}