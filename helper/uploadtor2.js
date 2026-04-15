const fs = require("fs");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");

async function uploadPhoto({ filePath, eventSlug, sessionCode, fileName }) {
    const fileStream = fs.createReadStream(filePath);
    
    // Cấu trúc đường dẫn: ten-su-kien/macode/final.jpg
    const key = `${eventSlug}/${sessionCode}/${fileName}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: "ever-after", // Đổi sang bucket mới
            Key: key,
            Body: fileStream,
            ContentType: "image/jpeg",
        }),
    );

    console.log("✅ Uploaded:", key);
    return key;
}

module.exports = uploadPhoto;