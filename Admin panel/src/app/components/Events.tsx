import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Search, MoreVertical, PlusCircle, Download, Filter } from "lucide-react";

type Event = {
  id: number;
  eventName: string;
  eventType: "wedding" | "general";
  packageType: "basic" | "premium";
  date: string;
  time: string;
  location: string;
  contactName: string;
  phone: string;
  social: string;
  brideName?: string;
  groomName?: string;
  status: "upcoming" | "completed" | "cancelled";
};

const eventsData: Event[] = [
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

export function Events() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.phone.includes(searchTerm);

    const matchesFilter =
      filterType === "all" || event.eventType === filterType;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Event["status"]) => {
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

  const getStatusText = (status: Event["status"]) => {
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

  const getPackageText = (packageType: Event["packageType"]) => {
    return packageType === "basic" ? "Basic" : "Premium";
  };

  const getEventTypeText = (eventType: Event["eventType"]) => {
    return eventType === "wedding" ? "Đám cưới" : "Sự kiện chung";
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year} - ${time}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Quản Lý Sự Kiện
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý toàn bộ sự kiện photobooth
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button onClick={() => navigate("/create-event")}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo Sự Kiện
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Tổng Sự Kiện</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {eventsData.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Sắp Diễn Ra</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {eventsData.filter((e) => e.status === "upcoming").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Đám Cưới</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {eventsData.filter((e) => e.eventType === "wedding").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Gói Premium</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {eventsData.filter((e) => e.packageType === "premium").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Danh Sách Sự Kiện</CardTitle>
            <div className="flex items-center space-x-3">
              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="wedding">Đám cưới</option>
                <option value="general">Sự kiện chung</option>
              </select>

              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sự kiện..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên Sự Kiện</TableHead>
                  <TableHead>Ngày Giờ</TableHead>
                  <TableHead>Loại Gói</TableHead>
                  <TableHead>Loại Sự Kiện</TableHead>
                  <TableHead>Địa Điểm</TableHead>
                  <TableHead>Người Đặt</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event, index) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{event.eventName}</p>
                        {event.eventType === "wedding" && (
                          <p className="text-xs text-gray-500">
                            {event.groomName} & {event.brideName}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDateTime(event.date, event.time)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          event.packageType === "premium"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {getPackageText(event.packageType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {getEventTypeText(event.eventType)}
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-[200px] truncate">
                      {event.location}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{event.contactName}</p>
                        <p className="text-xs text-gray-500">{event.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(event.status)}
                      >
                        {getStatusText(event.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/events/${event.id}`)}>
                            Xem Chi Tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/events/${event.id}/edit`)}>
                            Chỉnh Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>Đánh Dấu Hoàn Thành</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Hủy Sự Kiện
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}