const { ReadStream } = require("node:fs");
const { getOr } = require("lodash/fp");
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const { extractCredentials, isUrlFromBucket } = require("./utils");

const assertUrlProtocol = (url) => {
  return /^\w*:\/\//.test(url);
};

const getConfig = ({ baseUrl, rootPath, s3Options, ...legacyS3Options }) => {
  if (Object.keys(legacyS3Options).length > 0) {
    process.emitWarning(
      "S3 configuration options passed at root level of the plugin's providerOptions is deprecated and will be removed in a future release. Please wrap them inside the 's3Options:{}' property."
    );
  }
  const credentials = extractCredentials({ s3Options, ...legacyS3Options });
  const config = {
    ...s3Options,
    ...legacyS3Options,
    ...(credentials ? { credentials } : {}),
  };

  config.params.ACL = getOr("public-read", ["params", "ACL"], config);

  return config;
};

const init = ({ baseUrl, rootPath, s3Options, ...legacyS3Options }) => {
  const config = getConfig({
    baseUrl,
    rootPath,
    s3Options,
    ...legacyS3Options,
  });
  const s3Client = new S3Client(config);
  const filePrefix = rootPath ? `${rootPath.replace(/\/+$/, "")}/` : "";

  const getFileKey = (file) => {
    const path = file.path ? `${file.path}/` : "";
    return `${filePrefix}${path}${file.hash}${file.ext}`;
  };

  const upload = async (file, customParams = {}) => {
    const fileKey = getFileKey(file);
    const uploadObj = new Upload({
      client: s3Client,
      params: {
        Bucket: config.params.Bucket,
        Key: fileKey,
        Body: file.stream || Buffer.from(file.buffer, "binary"),
        ACL: config.params.ACL,
        ContentType: file.mime,
        ...customParams,
      },
    });

    const uploadResult = await uploadObj.done();

    if (assertUrlProtocol(uploadResult.Location)) {
      const cleanFileKey = fileKey.startsWith(rootPath)
        ? fileKey.slice(rootPath.length)
        : fileKey;
      file.url = baseUrl ? `${baseUrl}/${cleanFileKey}` : uploadResult.Location;
    } else {
      file.url = `https://${uploadResult.Location}`;
    }
  };

  return {
    isPrivate() {
      return config.params.ACL === "private";
    },

    async getSignedUrl(file, customParams) {
      if (!isUrlFromBucket(file.url, config.params.Bucket, baseUrl)) {
        return { url: file.url };
      }
      const fileKey = getFileKey(file);

      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: config.params.Bucket,
          Key: fileKey,
          ...customParams,
        }),
        {
          expiresIn: getOr(15 * 60, ["params", "signedUrlExpires"], config),
        }
      );

      return { url };
    },

    uploadStream(file, customParams = {}) {
      return upload(file, customParams);
    },

    upload(file, customParams = {}) {
      return upload(file, customParams);
    },

    delete(file, customParams = {}) {
      const command = new DeleteObjectCommand({
        Bucket: config.params.Bucket,
        Key: getFileKey(file),
        ...customParams,
      });
      return s3Client.send(command);
    },
  };
};

module.exports = { init };
