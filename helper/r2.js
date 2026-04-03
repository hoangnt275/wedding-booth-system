const { S3Client } = require("@aws-sdk/client-s3");

const r2 = new S3Client({
    region: "auto",
    endpoint:
        "https://5dda0c3a6733f06254821801a4239ae0.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: "3f6244ad570a0f4e38a301ad1db96cd6",
        secretAccessKey:
            "0119ff04b7d13b43d5694fa9b43b11bdd77abd21d17a7ec02478f054a3d1781c",
    },
});

module.exports = r2;
