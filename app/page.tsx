"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 페이지 로드 시 로그인된 사용자 정보 확인
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // 로그인 안 했으면 로그인 페이지로 이동
        router.push("/login");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router, supabase]);

  const handleCreateMandalart = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. 만다라트 메인 데이터 1개 생성
      // user_id는 DB에서 알아서 'auth.uid()'로 채워주므로 안 보냄
      const { data, error } = await supabase
        .from("mandalarts")
        .insert({
          title: "2026년 나의 목표", // 임시 기본 제목
        })
        .select() // 생성된 데이터 반환
        .single();

      if (error) throw error;

      alert(`성공! 만다라트가 생성되었습니다.\nID: ${data.id}`);
      console.log("생성된 만다라트:", data);

      // TODO 여기서 생성된 페이지로 이동
      // router.push(`/mandalart/${data.id}`);
    } catch (error: any) {
      console.error("에러 발생:", error);
      alert("생성 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10">로딩 중...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">환영합니다, {user.email}님</h1>

      <button
        onClick={handleCreateMandalart}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition disabled:opacity-50"
      >
        {loading ? "생성 중..." : "✨ 새 만다라트 만들기"}
      </button>

      <div className="mt-8 text-sm text-gray-400">
        * 버튼을 누르면 DB에 데이터가 자동 생성되는지 테스트
      </div>
    </div>
  );
}
