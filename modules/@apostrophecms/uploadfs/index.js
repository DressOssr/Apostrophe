const requiredS3EnvVars = [
  'APOS_S3_BUCKET',
  'APOS_S3_REGION',
  'APOS_S3_KEY',
  'APOS_S3_SECRET'
];

const useS3 = requiredS3EnvVars.every((name) => Boolean(process.env[name]));

export default {
  options: {
    // Keep development simple: use local upload storage unless the full S3
    // credential set is present in the environment.
    uploadfs: useS3
      ? {
        backend: 's3',
        bucket: process.env.APOS_S3_BUCKET,
        region: process.env.APOS_S3_REGION,
        key: process.env.APOS_S3_KEY,
        secret: process.env.APOS_S3_SECRET
      }
      : {}
  }
};
