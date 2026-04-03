/**
 * Danh sách filter ImageMagick
 * Chỉ chứa tham số magick (options)
 */

const filters = {
    original: ``,
    // glow: `
    //     ^( +clone -blur 0x10 -evaluate Multiply 0.5 ^)
    //     -compose Screen -composite
    //     -attenuate 0.15 +noise Gaussian
    // `,

    vintage: `
       -sigmoidal-contrast 3x45%%
-modulate 100,85,100
-color-matrix "1.02 0.01 0  0.01 1.01 0  0 0 0.96"
^( +clone -blur 0x12 -evaluate Multiply 0.5 ^)
-compose Screen -composite

^( "C:/Users/dell/Documents/wedding-booth-system/public/dust/dust_01.png"
   -colorspace Gray
-alpha copy
^)
-compose SoftLight -composite
    `,
    //     bw: `
    //     -modulate 100,20
    //     -sigmoidal-contrast 4x60%%
    //     ^( +clone -blur 0x12 -evaluate Multiply 0.5 ^)
    // -compose Screen -composite

    //     `,

    dark: `
        -brightness-contrast -5x-10
        -attenuate 0.1 +noise Gaussian
    `,
};

function getFilter(name) {
    return filters[name] || null;
}

module.exports = {
    filters,
    getFilter,
};
