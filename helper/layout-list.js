// Dữ liệu mẫu (Giả định canvas xuất file in là 300 DPI)
// Ví dụ: Giấy 4x6 inch = 1200x1800 pixels
// Giấy 2x6 inch (Strip) = 600x1800 pixels

const layoutList = [
    {
        layoutCode: "layout-1", // Mã layout (trùng với tên file ảnh .png của frame)
        name: "layout-1", // Tên hiển thị
        paperSize: "LARGE", // Kích thước giấy
        photoCount: 1, // Số lượng ảnh khách cần chụp/chọn
        cameraRatio: "1108/1543", // Tỉ lệ khung hình camera (ngang)
        rotate: false,
        // Tọa độ các bức ảnh trên Canvas cuối cùng (x, y, chiều rộng, chiều cao)
        coordinates: [
            { id: 1, x: 46, y: 46, width: 1108, height: 1543 }, // Ảnh 1
        ],
    },
    {
        layoutCode: "layout-2",
        name: "layout-2",
        paperSize: "LARGE",
        photoCount: 2,
        cameraRatio: "1108/670",
        rotate: false,
        // Layout này có thể chừa nhiều khoảng trống ở dưới cho logo hơn layout-1
        coordinates: [
            { id: 1, x: 46, y: 46, width: 1108, height: 670 }, // Ảnh 1 (Trên cùng)
            { id: 2, x: 46, y: 763, width: 1108, height: 670 },
        ],
    },
    {
        layoutCode: "layout-3",
        name: "layout-3",
        paperSize: "SMALL", // Kích thước dải dọc
        photoCount: 4, // Chỉ cần chụp 3 ảnh
        cameraRatio: "548/384", // Tỉ lệ khung hình camera (dọc)
        rotate: false,
        // Canvas 600x1800, xếp 3 ảnh dọc từ trên xuống dưới
        coordinates: [
            { id: 1, x: 26, y: 26, width: 548, height: 384 }, // Ảnh 1 (Trên cùng)
            { id: 2, x: 26, y: 436, width: 548, height: 384 }, // Ảnh 2 (Giữa)
            { id: 3, x: 26, y: 846, width: 548, height: 384 }, // Ảnh 3 (Dưới cùng)
            { id: 4, x: 26, y: 1255, width: 548, height: 384 }, // Ảnh 4 (Dưới cùng)
        ],
    },
    
    {
        layoutCode: "layout-4",
        name: "layout-4",
        paperSize: "LARGE",
        photoCount: 1,
        cameraRatio: "1670/965",
        rotate: true,
        // Layout này có thể chừa nhiều khoảng trống ở dưới cho logo hơn layout-1
        coordinates: [{ id: 1, x: 65, y: 65, width: 1670, height: 965 }],
    },
];

// Hàm tiện ích để lấy thông tin 1 layout dựa theo mã code
const getLayoutByCode = (code) => {
    return layoutList.find((layout) => layout.layoutCode === code);
};

// Hàm tiện ích lấy tất cả layout của một size giấy cụ thể
const getLayoutsByPaperSize = (size) => {
    return layoutList.filter((layout) => layout.paperSize === size);
};

// Xuất ra để sử dụng ở các file khác
module.exports = {
    layoutList,
    getLayoutByCode,
    getLayoutsByPaperSize,
};
