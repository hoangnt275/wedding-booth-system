import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Camera } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Cài Đặt</h2>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý cài đặt tài khoản và hệ thống
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
          <TabsTrigger value="account">Tài Khoản</TabsTrigger>
          <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
          <TabsTrigger value="security">Bảo Mật</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Hồ Sơ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    QT
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Đổi Ảnh
                </Button>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input id="firstName" defaultValue="Quản" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input id="lastName" defaultValue="Trị" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@photobooth.vn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Giới Thiệu</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Viết vài dòng về bạn..."
                  defaultValue="Quản trị viên hệ thống photobooth chuyên nghiệp."
                />
              </div>

              <Button>Lưu Thay Đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Tài Khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Tên Đăng Nhập</Label>
                <Input id="username" defaultValue="admin" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Ngôn Ngữ</Label>
                <select
                  id="language"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Múi Giờ</Label>
                <select
                  id="timezone"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>GMT+7 (Giờ Việt Nam)</option>
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-red-600 mb-2">
                  Vùng Nguy Hiểm
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Khi xóa tài khoản, bạn sẽ không thể khôi phục lại.
                </p>
                <Button variant="destructive">Xóa Tài Khoản</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tùy Chọn Thông Báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông Báo Email</Label>
                  <p className="text-sm text-gray-500">
                    Nhận email về hoạt động tài khoản
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông Báo Đẩy</Label>
                  <p className="text-sm text-gray-500">
                    Nhận thông báo đẩy trên thiết bị
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Báo Cáo Hàng Tuần</Label>
                  <p className="text-sm text-gray-500">
                    Nhận báo cáo tổng kết hàng tuần
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Marketing</Label>
                  <p className="text-sm text-gray-500">
                    Nhận email về tính năng mới
                  </p>
                </div>
                <Switch />
              </div>

              <Button>Lưu Tùy Chọn</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Bảo Mật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button>Cập Nhật Mật Khẩu</Button>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Xác Thực Hai Yếu Tố
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thêm lớp bảo mật cho tài khoản của bạn
                </p>
                <Button variant="outline">Bật 2FA</Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Phiên Hoạt Động</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Quản lý và đăng xuất khỏi các phiên hoạt động
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Phiên Hiện Tại</p>
                      <p className="text-xs text-gray-500">
                        Chrome trên Mac • Hà Nội, Việt Nam
                      </p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Đang hoạt động
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Thiết Bị Di Động</p>
                      <p className="text-xs text-gray-500">
                        Safari trên iPhone • 2 giờ trước
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Đăng Xuất
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}