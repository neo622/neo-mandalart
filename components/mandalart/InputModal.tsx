"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Checkbox,
  IconButton,
  Text,
  Divider,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CellType, Todo } from "@/types/mandalart";

// 아이콘 (npm install @chakra-ui/icons 필요, 없으면 텍스트로 대체 가능)
// import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
// 아이콘 대신 텍스트(삭제, 추가)로 구현하겠습니다.

interface MandalartInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellId: string;
  cellType: CellType;
  initialTitle: string;
  onUpdateSuccess: () => void; // refresh 용
}

export default function MandalartInputModal({
  isOpen,
  onClose,
  cellId,
  cellType,
  initialTitle,
  onUpdateSuccess,
}: MandalartInputModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const toast = useToast();

  // 모달 열릴 때 초기값 세팅 & Todo 가져오기
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      if (cellType === "SUB") {
        fetchTodos();
      }
    }
  }, [isOpen, initialTitle, cellId]);

  // 투두리스트 불러오기 (Sub Category인 경우만)
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("sub_category_id", cellId)
      .order("created_at", { ascending: true });

    if (data) setTodos(data);
  };

  // 제목 저장 핸들러
  const handleSaveTitle = async () => {
    setLoading(true);
    let table = "";

    // 타입에 따라 업데이트할 테이블 결정
    if (cellType === "GOAL") table = "mandalarts";
    else if (cellType === "MAJOR") table = "major_categories";
    else if (cellType === "SUB") table = "sub_categories";

    try {
      const { error } = await supabase
        .from(table)
        .update({ title: title })
        .eq("id", cellId);

      if (error) throw error;

      toast({ status: "success", title: "저장되었습니다." });
      onUpdateSuccess(); // 부모 데이터 새로고침
      onClose(); // 모달 닫기
    } catch (e: any) {
      toast({ status: "error", title: "저장 실패", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  // 투두 추가 핸들러
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert({ sub_category_id: cellId, content: newTodo })
      .select()
      .single();

    if (data) {
      setTodos([...todos, data]); // 목록 갱신
      setNewTodo("");
    }
  };

  // 투두 완료 토글
  const toggleTodo = async (todoId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !currentStatus })
      .eq("id", todoId);

    if (!error) {
      setTodos(
        todos.map((t) =>
          t.id === todoId ? { ...t, is_completed: !currentStatus } : t
        )
      );
    }
  };

  // 투두 삭제
  const deleteTodo = async (todoId: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", todoId);
    if (!error) {
      setTodos(todos.filter((t) => t.id !== todoId));
    }
  };

  // 모달 타이틀 결정
  const modalHeaderTitle =
    cellType === "GOAL"
      ? "핵심 목표 설정"
      : cellType === "MAJOR"
      ? "세부 목표 설정"
      : "실천 계획 & 할 일";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={cellType === "SUB" ? "lg" : "md"}
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100">
          {modalHeaderTitle}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* 1. 제목 입력 섹션 (공통) */}
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                목표 제목
              </FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="목표를 입력하세요"
                size="lg"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {/* 2. Todo List 섹션 (Sub Category 전용) */}
            {cellType === "SUB" && (
              <>
                <Divider />
                <Box>
                  <FormLabel fontWeight="bold" color="gray.600" mb={3}>
                    상세 실행 목록 ({todos.filter((t) => t.is_completed).length}
                    /{todos.length})
                  </FormLabel>

                  {/* 입력창 */}
                  <HStack mb={4}>
                    <Input
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="할 일을 입력하고 추가하세요"
                      size="sm"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                    />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={handleAddTodo}
                    >
                      추가
                    </Button>
                  </HStack>

                  {/* 리스트 */}
                  <VStack
                    align="stretch"
                    spacing={2}
                    maxH="200px"
                    overflowY="auto"
                  >
                    {todos.map((todo) => (
                      <HStack
                        key={todo.id}
                        bg="gray.50"
                        p={2}
                        borderRadius="md"
                        justify="space-between"
                      >
                        <Checkbox
                          isChecked={todo.is_completed}
                          onChange={() =>
                            toggleTodo(todo.id, todo.is_completed)
                          }
                          colorScheme="green"
                        >
                          <Text
                            as={todo.is_completed ? "s" : "span"}
                            color={todo.is_completed ? "gray.400" : "black"}
                          >
                            {todo.content}
                          </Text>
                        </Checkbox>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          삭제
                        </Button>
                      </HStack>
                    ))}
                    {todos.length === 0 && (
                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        등록된 할 일이 없습니다.
                      </Text>
                    )}
                  </VStack>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderBottomRadius="xl">
          <Button variant="ghost" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSaveTitle}
            isLoading={loading}
          >
            저장하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
