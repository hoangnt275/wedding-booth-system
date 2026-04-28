const dashboardRoutes = require("./dashboard.route");
const eventsRoutes = require("./events.route");
const settingsRoutes = require("./settings.route");
const system = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = system.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/events", eventsRoutes);
    app.use(PATH_ADMIN + "/settings", settingsRoutes);
    
    // Redirect /admin to /admin/dashboard
    app.get(PATH_ADMIN, (req, res) => {
        res.redirect(`${PATH_ADMIN}/dashboard`);
    });
};
