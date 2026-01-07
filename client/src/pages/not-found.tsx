import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-xs">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full font-semibold">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
