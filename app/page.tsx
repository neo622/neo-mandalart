"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Spinner,
  VStack,
  Heading,
  Text,
  Button,
  Center,
  useToast,
  Box,
} from "@chakra-ui/react";
import MandalartBoard_9x9 from "@/components/mandalart/MandalartBoard_9x9";
import { MandalartData } from "@/types/mandalart";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [mandalart, setMandalart] = useState<MandalartData | null>(null);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태
  const [creating, setCreating] = useState(false); // 생성 중 로딩 상태

  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  const fetchMandalartData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("mandalarts")
        .select(
          `
          *,
          major_categories (
            *,
            sub_categories (*)
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("데이터 조회 에러:", error);
        return;
      }

      if (data) {
        console.log("Mandalart Data Loaded:", data);
        setMandalart(data as MandalartData);
      }
    } catch (e) {
      console.error("fetchMandalartData Error:", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 유저 확인
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }
        setUser(user);

        // 데이터 가져오기
        await fetchMandalartData(user.id);
      } catch (e) {
        console.error("초기화 중 에러:", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router, supabase]);

  const handleRefresh = async () => {
    if (user?.id) {
      await fetchMandalartData(user.id);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "로그아웃 되었습니다.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // 만다라트 생성 핸들러
  const handleCreateMandalart = async () => {
    if (!user) return;
    setCreating(true);

    try {
      const { data, error } = await supabase
        .from("mandalarts")
        .insert({
          title: "NEO's 2026 Goal",
          user_id: user.id,
        })
        .select(
          `
            *,
            major_categories (
              *,
              sub_categories (*)
            )
        `
        )
        .single();

      if (error) throw error;

      setMandalart(data);

      toast({
        title: "만다라트 생성 완료!",
        description: "목표 달성을 위한 첫 걸음을 내디뎠습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "생성 실패",
        description: error.message,
        status: "error",
      });
    } finally {
      setCreating(false);
    }
  };
  const LogoutButton = () => (
    <Button
      position="absolute"
      top={4}
      right={4}
      size="sm"
      colorScheme="gray"
      variant="ghost"
      onClick={handleLogout}
      zIndex={10} // 다른 요소보다 위에 오도록
    >
      로그아웃
    </Button>
  );

  // Case 1: 로딩 중
  if (loading) {
    return (
      <Center h="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.500">데이터를 불러오는 중...</Text>
        </VStack>
      </Center>
    );
  }

  // Case 2: 데이터가 있음 -> 만다라트 보드 화면
  if (mandalart) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100vh"
        overflow="hidden"
        bg="gray.50"
        p={4}
        position="relative"
      >
        <LogoutButton />

        <VStack spacing={6} w="full" maxW="900px" h="full" justify="center">
          <Heading size="lg" color="blue.700">
            {mandalart.title}
          </Heading>

          <MandalartBoard_9x9 data={mandalart} onRefresh={handleRefresh} />
        </VStack>
      </Flex>
    );
  }

  // Case 3: 데이터가 없음 -> 초기 화면
  return (
    <Center h="100vh" bg="gray.50" p={6} position="relative">
      <LogoutButton />
      <VStack
        spacing={8}
        bg="white"
        p={10}
        borderRadius="xl"
        boxShadow="lg"
        maxW="md"
        w="full"
      >
        <VStack spacing={2}>
          <Heading size="xl" color="gray.800">
            환영합니다!
          </Heading>
          <Text color="gray.500" fontSize="sm">
            {user?.email}님
          </Text>
        </VStack>

        <Text textAlign="center" color="gray.600">
          아직 생성된 만다라트가 없습니다.
          <br />
          지금 바로 목표를 세워보세요.
        </Text>

        <Button
          colorScheme="blue"
          size="lg"
          w="full"
          onClick={handleCreateMandalart}
          isLoading={creating}
          loadingText="생성 중..."
          _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
        >
          ✨ 새 만다라트 만들기
        </Button>
      </VStack>
    </Center>
  );
}
