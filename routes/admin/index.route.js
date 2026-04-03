const dashboardRoutes = require("./dashboard.route");
const system = require("../../config/system");
const paymentRoutes = require("./payment.router");
const codeListRoutes = require("./codeList.route");
const addFramesRoutes = require("./addFrames.route");
const imgTakedRoutes = require("./imgTaked.route");
const shootRoutes = require("./shoot.route");
module.exports = (app) => {
    PATH_ADMIN = system.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/payment", paymentRoutes);
    app.use(PATH_ADMIN + "/codeList", codeListRoutes);
    app.use(PATH_ADMIN + "/addFrames", addFramesRoutes);
    app.use(PATH_ADMIN + "/imgTaked", imgTakedRoutes);
    app.use(PATH_ADMIN + "/shoot", shootRoutes);
};
