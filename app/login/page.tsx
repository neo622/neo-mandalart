"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "로그인 실패",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "로그인 성공!",
          description: "만다라트 페이지로 이동합니다.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        router.push("/");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={8}
        rounded="xl"
        boxShadow="lg"
        w="full"
        maxW="md"
        borderTop="4px solid"
        borderColor="blue.500"
      >
        <VStack spacing={6} align="stretch">
          <VStack spacing={2}>
            <Heading as="h1" size="xl" color="blue.600" textAlign="center">
              Welcome
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Create my mandalart
            </Text>
          </VStack>

          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.700">이메일</FormLabel>
              <Input
                type="email"
                placeholder="exam@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                focusBorderColor="blue.400"
                bg="gray.50"
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.700">비밀번호</FormLabel>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                focusBorderColor="blue.400"
                bg="gray.50"
                size="lg"
              />
            </FormControl>
          </VStack>

          <Button
            colorScheme="blue"
            size="lg"
            fontSize="md"
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="로그인 중..."
            _hover={{
              bg: "blue.600",
              transform: "translateY(-2px)",
              boxShadow: "md",
            }}
            transition="all 0.2s"
          >
            로그인하기
          </Button>

          {/* TODO: 회원가입 링크 등을 넣을 공간 */}
          <Text fontSize="sm" color="gray.500" textAlign="center" pt={2}>
            계정이 없으신가요?{" "}
            <Link color="blue.500" fontWeight="bold" href="#">
              (문의필요)
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
