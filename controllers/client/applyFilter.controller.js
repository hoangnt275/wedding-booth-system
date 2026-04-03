const { exec } = require("child_process");
const path = require("path");

const fs = require("fs");
const { filters } = require("../../helper/filters-list");
function applyFilterFunction(input, output, filterName) {
    return new Promise((resolve, reject) => {
        const absInput = path.resolve(input);
        const absOutput = path.resolve(output);
        const filterContent = filters[filterName];
        if (!filters[filterName]) {
            return res.status(400).json({ error: "Invalid filter" });
        }
        const command = `
magick "${absInput}"
${filterContent}
"${absOutput}"
        `.replace(/\n/g, " ");

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error("❌ ImageMagick error:", err.message);
                return reject(err);
            }
            resolve(absOutput);
        });
    });
}

module.exports.applyFilter = async (req, res) => {
    try {
        const filterName = req.query.filterName;

        if (!filterName || !filters[filterName]) {
            return res.status(400).json({
                success: false,
                message: "Invalid filter",
            });
        }

        const inputPath = path.join(__dirname, "../../public/uploads/test.jpg");

        const outputPath = path.join(
            __dirname,
            "../../public/images/test_" + filterName + ".jpg"
        );

        // đảm bảo thư mục images tồn tại
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        await applyFilterFunction(inputPath, outputPath, filterName);

        return res.json({
            success: true,
            finalPhoto: `/images/test_${filterName}.jpg`,
        });
    } catch (err) {
        console.error("❌ applyFilter test error:", err);
        res.status(500).json({ success: false });
    }
};
module.exports.testApplyFilter = async (req, res) => {
    const { selectedFrame, frameType } = req.session;
    res.render("client/pages/testApplyFilter", {
        pageTitle: "Test Apply Filter",
        filters,
        frameType,
        selectedFrame,
    });
};
