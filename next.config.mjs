// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  locales: ["es", "en"],
  defaultLocale: "es",
});

const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
