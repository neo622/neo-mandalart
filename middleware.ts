import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 모든 요청에 대해 Supabase 세션 갱신 (로그인 유지용)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 아래 경로들은 미들웨어를 거치지 않음 (이미지, 정적 파일 등)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
