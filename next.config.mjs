/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: '/twin-lobe-roots-blower.php',
      destination: '/products/twin-lobe-roots-blower',
      permanent: true,
    },
    {
      source: '/air-cooled-roots-blower.php',
      destination: '/products/air-cooled-roots-blower',
      permanent: true,
    },
    {
      source: '/bulker-unloading-system.php',
      destination: '/products/cement-bulker-unloading-system',
      permanent: true,
    },
    {
      source: '/products/etp-roots-blowe',
      destination: '/products/water-treatment-plant-roots-blower',
      permanent: true,
    },
    {
      source: '/products/buler-unloading-system',
      destination: '/products/cement-bulker-unloading-system',
      permanent: true,
    },
    {
      source: '/products/bulker-unloding-system',
      destination: '/products/cement-bulker-unloading-system',
      permanent: true,
    },
    {
      source: '/products/ambika-bulker-unloding-system',
      destination: '/products/cement-bulker-unloading-system',
      permanent: true,
    },
  ],
};

export default nextConfig;
