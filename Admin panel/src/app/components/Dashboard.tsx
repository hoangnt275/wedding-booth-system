import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const stats = [
  {
    name: "Tổng Sự Kiện",
    value: "45",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
  },
  {
    name: "Sự Kiện Tháng Này",
    value: "8",
    change: "+20.0%",
    trend: "up",
    icon: Camera,
  },
  {
    name: "Đám Cưới",
    value: "28",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Doanh Thu",
    value: "125tr",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
];

const revenueData = [
  { month: "T1", revenue: 45, events: 4 },
  { month: "T2", revenue: 38, events: 3 },
  { month: "T3", revenue: 62, events: 6 },
  { month: "T4", revenue: 55, events: 5 },
  { month: "T5", revenue: 78, events: 8 },
  { month: "T6", revenue: 68, events: 7 },
  { month: "T7", revenue: 85, events: 9 },
];

const orderData = [
  { day: "T2", orders: 2 },
  { day: "T3", orders: 3 },
  { day: "T4", orders: 1 },
  { day: "T5", orders: 4 },
  { day: "T6", orders: 5 },
  { day: "T7", orders: 3 },
  { day: "CN", orders: 2 },
];

const recentActivity = [
  {
    id: 1,
    user: "Nguyễn Văn Hùng",
    action: "đã đặt sự kiện đám cưới",
    time: "2 phút trước",
    amount: "Premium",
  },
  {
    id: 2,
    user: "Lê Văn Nam",
    action: "đã đặt sự kiện công ty",
    time: "15 phút trước",
    amount: "Basic",
  },
  {
    id: 3,
    user: "Phạm Văn Minh",
    action: "đã hoàn thành sự kiện",
    time: "1 giờ trước",
    amount: null,
  },
  {
    id: 4,
    user: "Trần Thị Mai",
    action: "đã đặt sự kiện khai trương",
    time: "2 giờ trước",
    amount: "Basic",
  },
  {
    id: 5,
    user: "Hoàng Văn Tuấn",
    action: "đã đặt sự kiện đám cưới",
    time: "3 giờ trước",
    amount: "Premium",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Tổng Quan</h2>
        <p className="text-sm text-gray-500 mt-1">
          Chào mừng trở lại! Đây là thông tin hệ thống hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh Thu & Sự Kiện (Triệu VNĐ)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} id="revenue-area-chart">
                <defs>
                  <linearGradient id="colorRevenueChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} key="stop-1" />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} key="stop-2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenueChart)"
                  name="Doanh thu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sự Kiện Trong Tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData} id="weekly-bar-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Sự kiện" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-medium text-gray-900">
                    {activity.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}