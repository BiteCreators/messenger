import { NextFederationPlugin } from '@module-federation/nextjs-mf';

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
  reactStrictMode: true,
  webpack(config, options) {
    config.plugins.push(
        new NextFederationPlugin({
          exposes: {
            "./Messenger": './src/features/messenger/ui/Messenger',
          },
          extraOptions: {
            enableImageLoaderFix: true,
            enableUrlLoaderFix: true,
            exposePages: true,
          },
          filename: 'static/chunks/remoteEntry.js',
          name: 'messenger',
          shared: {},
        })
    )

    return config
  }

};

export default nextConfig;
