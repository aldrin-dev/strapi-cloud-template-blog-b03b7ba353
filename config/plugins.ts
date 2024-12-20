export default ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-cdn",
      providerOptions: {
        rootPath: "prd/strapi/",
        baseUrl: "https://strapi-production-statics.invgate.com",
        s3Options: {
          credentials: {
            accessKeyId: env("AWS_ACCESS_KEY_ID"),
            secretAccessKey: env("AWS_ACCESS_SECRET"),
          },
          region: env("AWS_REGION"),
          params: {
            ACL: "private",
            signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
            Bucket: env("AWS_BUCKET"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
