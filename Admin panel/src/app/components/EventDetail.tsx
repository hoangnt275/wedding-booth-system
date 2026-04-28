import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Share2,
  Edit,
  Trash2,
  Clock,
  Package,
  Heart,
} from "lucide-react";

// Mock data - trong thực tế sẽ fetch từ API
const eventsData = [
  {
    id: 1,
    eventName: "Tiệc cưới Hùng & Lan",
    eventType: "wedding",
    packageType: "premium",
    date: "2026-05-15",
    time: "18:00",
    location: "Trung tâm hội nghị ACB, Hà Nội",
    contactName: "Nguyễn Văn Hùng",
    phone: "0912345678",
    social: "@hung_lan_wedding",
    groomName: "Nguyễn Văn Hùng",
    brideName: "Trần Thị Lan",
    status: "upcoming",
  },
  {
    id: 2,
    eventName: "Sinh nhật công ty XYZ",
    eventType: "general",
    packageType: "basic",
    date: "2026-04-20",
    time: "19:00",
    location: "Khách sạn Metropole, Hà Nội",
    contactName: "Lê Văn Nam",
    phone: "0923456789",
    social: "@companyxyz",
    status: "upcoming",
  },
  {
    id: 3,
    eventName: "Đám cưới Minh & Hoa",
    eventType: "wedding",
    packageType: "premium",
    date: "2026-04-18",
    time: "17:30",
    location: "Nhà hàng tiệc cưới Palace, TP.HCM",
    contactName: "Phạm Văn Minh",
    phone: "0934567890",
    social: "@minh_hoa_2026",
    groomName: "Phạm Văn Minh",
    brideName: "Nguyễn Thị Hoa",
    status: "completed",
  },
  {
    id: 4,
    eventName: "Khai trương cửa hàng ABC",
    eventType: "general",
    packageType: "basic",
    date: "2026-04-25",
    time: "10:00",
    location: "Số 123 Nguyễn Huệ, TP.HCM",
    contactName: "Trần Thị Mai",
    phone: "0945678901",
    social: "@abc_store",
    status: "upcoming",
  },
  {
    id: 5,
    eventName: "Lễ cưới Tuấn & Linh",
    eventType: "wedding",
    packageType: "basic",
    date: "2026-06-10",
    time: "18:30",
    location: "Trung tâm hội nghị Quốc gia, Hà Nội",
    contactName: "Hoàng Văn Tuấn",
    phone: "0956789012",
    social: "@tuan_linh_forever",
    groomName: "Hoàng Văn Tuấn",
    brideName: "Vũ Thị Linh",
    status: "upcoming",
  },
];

export function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = eventsData.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Không tìm thấy sự kiện
        </h2>
        <Button onClick={() => navigate("/events")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getEventTypeText = (eventType: string) => {
    return eventType === "wedding" ? "Đám cưới" : "Sự kiện chung";
  };

  const getPackageText = (packageType: string) => {
    return packageType === "premium" ? "Premium" : "Basic";
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Chi Tiết Sự Kiện
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Xem thông tin chi tiết của sự kiện
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/events/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh Sửa
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{event.eventName}</CardTitle>
                  {event.eventType === "wedding" && (
                    <p className="text-gray-500 mt-2">
                      <Heart className="w-4 h-4 inline mr-2 text-red-500" />
                      {event.groomName} & {event.brideName}
                    </p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={getStatusColor(event.status)}
                >
                  {getStatusText(event.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tổ chức</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ bắt đầu</p>
                    <p className="font-medium text-gray-900">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại gói</p>
                    <p className="font-medium text-gray-900">
                      {getPackageText(event.packageType)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại sự kiện</p>
                    <p className="font-medium text-gray-900">
                      {getEventTypeText(event.eventType)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                    <p className="font-medium text-gray-900">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi Chú & Yêu Cầu Đặc Biệt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Không có ghi chú đặc biệt cho sự kiện này.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Lưu ý:</strong> Vui lòng chuẩn bị thiết bị và đội ngũ
                  trước 1 giờ so với thời gian sự kiện bắt đầu.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Liên Hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Người đặt</p>
                  <p className="font-medium text-gray-900">
                    {event.contactName}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <a
                    href={`tel:${event.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {event.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Share2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Social Media</p>
                  <p className="font-medium text-gray-900">{event.social}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Gọi Điện
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống Kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Số ảnh chụp</span>
                <span className="font-semibold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Số khách tham gia</span>
                <span className="font-semibold text-gray-900">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Thời gian chụp</span>
                <span className="font-semibold text-gray-900">-</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
