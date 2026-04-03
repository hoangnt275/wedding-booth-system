const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function mergeDiy(
    uploadsDir,
    selectedFrame,
    frameType,
    PRINT_WIDTH,
    PRINT_HEIGHT,
    PHOTO_W,
    PHOTO_H,
    MARGIN_X,
    START_Y,
    GAP_Y,
    GAP_X,
    outputPath,
    filterName
) {
    const startTime = Date.now();
    sharp.cache(false);

    async function resizeToRaw(input, w, h) {
        return sharp(input)
            .resize(w, h, { fit: "cover", position: "centre" })
            .raw()
            .toBuffer({ resolveWithObject: true });
    }

    // ✅ LỌC VÀ LẤY 4 ẢNH MỚI NHẤT
    const photoFiles = fs
        .readdirSync(uploadsDir)
        .filter((f) => /^IMG_\d+\.(jpg|jpeg|png)$/i.test(f))
        .map((file) => ({
            name: file,
            time: fs.statSync(path.join(uploadsDir, file)).mtimeMs,
        }))
        .sort((a, b) => b.time - a.time)
        .slice(0, 4)
        .map((f) => f.name);

    if (photoFiles.length < 4) {
        throw new Error("NOT_ENOUGH_PHOTOS");
    }

    const framePath = path.join(
        __dirname,
        `../public/frames/${frameType}_frame/${selectedFrame}.png`
    );

    // ✅ GỘP CHUNG VÀO 1 LẦN CHẠY PROMISE.ALL DUY NHẤT
    const [
        rawFrame,
        rawPhoto0,
        rawPhoto1,
        rawPhoto2,
        rawPhoto3,
        rawSecondPhoto2, // Ảnh thứ 3 thu nhỏ
        rawSecondPhoto3  // Ảnh thứ 4 thu nhỏ
    ] = await Promise.all([
        resizeToRaw(framePath, PRINT_WIDTH, PRINT_HEIGHT),
        resizeToRaw(path.join(uploadsDir, photoFiles[0]), PHOTO_W, PHOTO_H),
        resizeToRaw(path.join(uploadsDir, photoFiles[1]), PHOTO_W, PHOTO_H),
        resizeToRaw(path.join(uploadsDir, photoFiles[2]), PHOTO_W, PHOTO_H),
        resizeToRaw(path.join(uploadsDir, photoFiles[3]), PHOTO_W, PHOTO_H),
        resizeToRaw(path.join(uploadsDir, photoFiles[2]), 446, 386),
        resizeToRaw(path.join(uploadsDir, photoFiles[3]), 446, 386),
    ]);

    const layers = [
        {
            input: rawPhoto0.data,
            raw: rawPhoto0.info,
            top: START_Y,
            left: MARGIN_X,
        },
        {
            input: rawPhoto1.data,
            raw: rawPhoto1.info,
            top: START_Y + PHOTO_H + GAP_Y,
            left: MARGIN_X,
        },
        {
            input: rawPhoto2.data,
            raw: rawPhoto2.info,
            top: START_Y,
            left: MARGIN_X + PHOTO_W + GAP_X,
        },
        {
            input: rawPhoto3.data,
            raw: rawPhoto3.info,
            top: START_Y + PHOTO_H + GAP_Y,
            left: MARGIN_X + PHOTO_W + GAP_X,
        },
        {
            input: rawSecondPhoto2.data,
            raw: rawSecondPhoto2.info,
            top: 821,
            left: 77,
        },
        {
            input: rawSecondPhoto3.data,
            raw: rawSecondPhoto3.info,
            top: 1243,
            left: 77,
        },
    ];

    const outputFileName = `final_${selectedFrame}_${filterName}.jpg`;
    const output = path.join(outputPath, outputFileName);

    // ✅ GHÉP ẢNH
    await sharp(rawFrame.data, {
        raw: rawFrame.info,
    })
        .composite(layers)
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(output);

    console.log(`✅ Merge xong: ${Date.now() - startTime}ms`);

    return outputFileName; 
}

module.exports = { mergeDiy };