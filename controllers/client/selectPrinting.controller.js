module.exports.index = (req, res) => {
    // Lấy tên file hoặc đường dẫn ảnh cuối cùng từ URL (vd: final_light)
    const finalPhoto = req.session.finalPhoto;

    // TODO: Bạn tự ghép lại đường dẫn gốc (vd: /uploads/...) sao cho khớp với thư mục thật của hệ thống nhé
    // Tạm thời tôi ghép đuôi .jpg (hoặc .png) để làm ví dụ
    const photoUrl = `/images/${finalPhoto}`;

    res.render("client/pages/select-printing", {
        finalPhotoUrl: photoUrl,
    });
};
