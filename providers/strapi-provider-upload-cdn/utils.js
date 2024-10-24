const ENDPOINT_PATTERN = /^(.+\.)?s3[.-]([a-z0-9-]+)\./;

function isUrlFromBucket(fileUrl, bucketName, baseUrl = "") {
  const url = new URL(fileUrl);

  if (baseUrl) {
    return false;
  }

  const { bucket } = getBucketFromAwsUrl(fileUrl);

  if (bucket) {
    return bucket === bucketName;
  }

  return (
    url.host.startsWith(`${bucketName}.`) ||
    url.pathname.includes(`/${bucketName}/`)
  );
}

function getBucketFromAwsUrl(fileUrl) {
  const url = new URL(fileUrl);

  if (url.protocol === "s3:") {
    const bucket = url.host;

    if (!bucket) {
      return { err: `Invalid S3 url: no bucket: ${url}` };
    }
    return { bucket };
  }

  if (!url.host) {
    return { err: `Invalid S3 url: no hostname: ${url}` };
  }

  const matches = url.host.match(ENDPOINT_PATTERN);
  if (!matches) {
    return {
      err: `Invalid S3 url: hostname does not appear to be a valid S3 endpoint: ${url}`,
    };
  }

  const prefix = matches[1];

  if (!prefix) {
    if (url.pathname === "/") {
      return { bucket: null };
    }

    const index = url.pathname.indexOf("/", 1);

    if (index === -1) {
      return { bucket: url.pathname.substring(1) };
    }

    if (index === url.pathname.length - 1) {
      return { bucket: url.pathname.substring(1, index) };
    }

    return { bucket: url.pathname.substring(1, index) };
  }

  return { bucket: prefix.substring(0, prefix.length - 1) };
}

const extractCredentials = (options) => {
  if (options.s3Options?.credentials) {
    return {
      accessKeyId: options.s3Options.credentials.accessKeyId,
      secretAccessKey: options.s3Options.credentials.secretAccessKey,
    };
  }
  return null;
};

module.exports = {
  isUrlFromBucket,
  getBucketFromAwsUrl,
  extractCredentials,
};
