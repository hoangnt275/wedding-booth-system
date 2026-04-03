const fs = require("fs");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");
const now = new Date();
const date = now.getDate();
const month = now.getMonth() + 1;
async function uploadPhoto({ filePath, index }) {
    const fileStream = fs.createReadStream(filePath);
    let totalSessions = 0;
    const statsFilePath = path.join(__dirname, "../../public/data/stats.json");

    if (fs.existsSync(statsFilePath)) {
        const rawData = fs.readFileSync(statsFilePath, "utf8");
        if (rawData.trim() !== "") {
            const stats = JSON.parse(rawData);
            totalSessions = stats.totalSessions || 0;
        }
    }
    const key = `${date}-${month}/${totalSessions + 1}/photo_${index}.jpg`;

    await r2.send(
        new PutObjectCommand({
            Bucket: "fotolatter-photos",
            Key: key,
            Body: fileStream,
            ContentType: "image/jpeg",
        }),
    );

    console.log("✅ Uploaded:", key);
}

module.exports = uploadPhoto;
