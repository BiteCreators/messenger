import {NextFederationPlugin} from '@module-federation/nextjs-mf';

import packageJson from './package.json' assert { type: 'json' };

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        buildActivity: false,
    },
    experimental: {
        esmExternals: "loose"
    },
    i18n: {
        defaultLocale: "ru",
        locales: ["en", "ru"],
    },
    reactStrictMode: false,
    webpack(config, options) {
        config.plugins.push(
            new NextFederationPlugin({
                exposes: {
                    "./Messenger": './src/features/messenger/ui/MessengerWithStore.tsx',
                },
                filename: 'static/chunks/remoteEntry.js',
                name: 'messenger',
                shared: {
                },
                extraOptions: {
                    exposePages: true,
                    enableImageLoaderFix: true,
                    enableUrlLoaderFix: true,
                },
            })
        )

        return config
    }

};

export default nextConfig;
