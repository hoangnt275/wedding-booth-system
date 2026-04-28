const path = require("path");

/**
 * Danh sách filter ImageMagick
 * Chỉ chứa tham số magick (options)
 */

// Xử lý đường dẫn động để không bị lỗi khi đổi máy hoặc deploy
const dustPath = path
    .join(process.cwd(), "public", "dust", "dust_01.png")
    .replace(/\\/g, "/");

const filters = {
    original: ``,
    // glow: `
    //     ^( +clone -blur 0x10 -evaluate Multiply 0.5 ^)
    //     -compose Screen -composite
    //     -attenuate 0.15 +noise Gaussian
    // `,

    //test gloom ok lan 1
    vintage: `
-modulate 90,100
        ^( +clone -blur 0x20 ^)
        -compose Screen -composite

    `,

    // vintage: `
    //     -colorspace Gray
    //     +level-colors "#1e130f","#e6d3c5"
    //     -level 5%%,95%%,1.1
    //     -sigmoidal-contrast 6x50%%
    //     ^( +clone -blur 0x15 -evaluate Multiply 0.3 ^)
    //     -compose Screen -composite
    //     -attenuate 0.15 +noise Gaussian
    //     ^( "${dustPath}"
    //        -colorspace Gray
    //        -alpha copy
    //     ^)
    //     -compose SoftLight -composite
    // `,
    // bw: `
    //     -modulate 100,20
    //     -sigmoidal-contrast 4x60%%
    //     ^( +clone -blur 0x12 -evaluate Multiply 0.5 ^)
    // -compose Screen -composite

    //     `,

    // dark: `
    //     -brightness-contrast -5x-10
    //     -attenuate 0.1 +noise Gaussian
    // `,
    //     vintage_light: ` mau sang
    //     -set option:base_dim "%wx%h"
    //     -sigmoidal-contrast 3x60%%
    //     -modulate 100,60,100
    //     -color-matrix "1.08 -0.02 0  -0.02 1.04 -0.02  0 -0.02 1.10"
    //     \( +clone -blur 0x8 -evaluate Multiply 0.4 \)
    //     -compose Screen -composite
    //     \( -size "%[base_dim]" xc:#FEE7EB \)
    //     -compose SoftLight -composite
    // `,
};

function getFilter(name) {
    return filters[name] || null;
}

module.exports = {
    filters,
    getFilter,
};
