import { PrismaClient } from '@prisma/client';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';
const connector = new Connector();
const clientOpts = await connector.getOptions({
	instanceConnectionName: env.DATABASE_INSTANCE_NAME!,
	ipType: IpAddressTypes.PUBLIC,
	authType: AuthTypes.IAM
});

const pool = new pg.Pool({
	...clientOpts,
	user: env.DATABASE_USERNAME,
	database: env.DATABASE_NAME,
	password: env.DATABASE_PASSWORD
});
const adapter = new PrismaPg(pool);
export const prismaClient = new PrismaClient({
	adapter
});
