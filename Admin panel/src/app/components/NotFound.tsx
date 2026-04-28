import { Link } from "react-router";
import { Button } from "./ui/button";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-semibold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Không tìm thấy trang bạn đang tìm kiếm.
      </p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4 mr-2" />
          Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
}