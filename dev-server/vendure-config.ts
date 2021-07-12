import {
    examplePaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';
import { FavoritesPlugin } from '../src/plugin';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';

export const headlessConfig: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },// turn this off for production
        adminApiDebug: true, // turn this off for production
        shopApiPath: 'shop-api',
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },// turn this off for production
        shopApiDebug: true,// turn this off for production
    },
    authOptions: {
        //   sessionSecret: 'v5evpqy0rn',
        superadminCredentials: {
            identifier: 'superadmin',
            password: 'superadmin',
        },
    },
    //   workerOptions: {
    //       options: {
    //           host: process.env.WORKER_HOST || 'localhost',
    //           port: Number(process.env.WORKER_PORT) || 3020,
    //       },
    //   },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: false, // turn this off for production
        logging: false,
        database: 'vendure',
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: 'goget1',
        password: '000000',
        migrations: [path.join(__dirname, '../migrations/*.ts')],
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, './static/assets'),
        }),
        DefaultJobQueuePlugin,
        DefaultSearchPlugin,
        FavoritesPlugin.init({
            trackHistory: true
        })
    ],
};

export const config: VendureConfig = {
    ...headlessConfig,
    plugins: [
        ...headlessConfig.plugins || [],
        AdminUiPlugin.init({
            port: 3002,
            app: compileUiExtensions({
                devMode: true,
                outputPath: path.join(__dirname, 'admin-ui'),
                extensions: [
                    FavoritesPlugin.uiExtensions,
                ],
            }),
            route: 'admin',
        }),
    ]
}
