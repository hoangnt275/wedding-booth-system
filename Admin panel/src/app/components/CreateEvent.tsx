import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Save } from "lucide-react";

export function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "wedding",
    packageType: "basic",
    date: "",
    time: "",
    location: "",
    contactName: "",
    phone: "",
    social: "",
    brideName: "",
    groomName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save event data
    console.log("Event data:", formData);
    navigate("/events");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Tạo Sự Kiện Mới
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Điền thông tin để tạo sự kiện photobooth mới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Thông Tin Sự Kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="eventName">
                  Tên Sự Kiện <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="VD: Tiệc cưới Hùng & Lan"
                  required
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType">
                  Loại Sự Kiện <span className="text-red-500">*</span>
                </Label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="wedding">Đám Cưới</option>
                  <option value="general">Sự Kiện Chung</option>
                </select>
              </div>

              {/* Package Type */}
              <div className="space-y-2">
                <Label htmlFor="packageType">
                  Loại Gói Chụp <span className="text-red-500">*</span>
                </Label>
                <select
                  id="packageType"
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Ngày Tổ Chức <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Giờ Bắt Đầu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Địa Điểm Tổ Chức <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="VD: Trung tâm hội nghị tiệc cưới ABC, Hà Nội"
                  required
                />
              </div>

              {/* Bride and Groom Names (only for wedding) */}
              {formData.eventType === "wedding" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Tên Chú Rể</Label>
                    <Input
                      id="groomName"
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleChange}
                      placeholder="Nhập tên chú rể"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideName">Tên Cô Dâu</Label>
                    <Input
                      id="brideName"
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleChange}
                      placeholder="Nhập tên cô dâu"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Liên Hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Tên Người Đặt <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Nhập tên người đặt"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social">Instagram / Facebook</Label>
                <Input
                  id="social"
                  name="social"
                  value={formData.social}
                  onChange={handleChange}
                  placeholder="@username hoặc link profile"
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Sự Kiện
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/events")}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
