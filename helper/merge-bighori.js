const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function mergeBigHori(
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

    // ✅ CHỈ LẤY ẢNH GỐC
    const photoFiles = fs
        .readdirSync(uploadsDir)
        .filter((f) => /^IMG_\d+\.(jpg|jpeg|png)$/i.test(f))
        .map((file) => ({
            name: file,
            time: fs.statSync(path.join(uploadsDir, file)).mtimeMs,
        }))
        .sort((a, b) => b.time - a.time)
        .slice(0, 3)
        .map((f) => f.name);

    if (photoFiles.length < 3) {
        throw new Error("NOT_ENOUGH_PHOTOS");
    }

    const framePath = path.join(
        __dirname,
        `../public/frames/${frameType}_frame/${selectedFrame}.png`
    );

    const [rawFrame, ...rawPhotos] = await Promise.all([
        resizeToRaw(framePath, PRINT_WIDTH, PRINT_HEIGHT),
        ...photoFiles.map((f) =>
            resizeToRaw(path.join(uploadsDir, f), PHOTO_W, PHOTO_H)
        ),
    ]);

    const layers = [
        {
            input: rawPhotos[0].data,
            raw: rawPhotos[0].info,
            top: START_Y,
            left: MARGIN_X,
        },
        {
            input: rawPhotos[1].data,
            raw: rawPhotos[1].info,
            top: START_Y + PHOTO_H + GAP_Y,
            left: MARGIN_X,
        },
        {
            input: rawPhotos[2].data,
            raw: rawPhotos[2].info,
            top: START_Y + (PHOTO_H + GAP_Y) * 2,
            left: MARGIN_X,
        },
    ];
    const outputFileName = `final_${selectedFrame}_${filterName}.jpg`;
    const output = path.join(outputPath, outputFileName);

    await sharp(rawFrame.data, {
        raw: rawFrame.info,
    })
        .composite(layers)
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(output);

    console.log(`✅ Merge xong: ${Date.now() - startTime}ms`);

    return outputFileName; // 👈 RẤT QUAN TRỌNG
}

module.exports = { mergeBigHori };
