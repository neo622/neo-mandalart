"use client";

import { Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import MandalartBlock_3x3 from "./MandalartBlock_3x3";
import { useState } from "react";
import MandalartInputModal from "./InputModal";
import { MandalartData, SelectedCellData } from "@/types/mandalart";

const positionToAreaMap: { [key: number]: string } = {
  0: "nw",
  1: "n",
  2: "ne",
  3: "w",
  4: "e",
  5: "sw",
  6: "s",
  7: "se",
};

interface MandalartBoardProps {
  data: MandalartData;
  onRefresh: () => void;
}

export default function MandalartBoard_9x9({
  data,
  onRefresh,
}: MandalartBoardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCell, setSelectedCell] = useState<SelectedCellData | null>(
    null
  );

  if (!data) return null;

  // 셀 클릭 함수
  const handleCellClick = (
    id: string,
    type: "GOAL" | "MAJOR" | "SUB",
    title: string
  ) => {
    setSelectedCell({ id, type, title });
    onOpen();
  };

  return (
    <>
      <Box
        w="100%"
        maxW="800px"
        aspectRatio={1 / 1}
        bg="gray.100"
        boxShadow="xl"
        borderRadius="md"
        overflow="hidden"
      >
        <Grid
          h="100%"
          w="100%"
          templateRows="repeat(3, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={1}
          bg="gray.100"
          templateAreas={`"nw n ne" "w  c  e" "sw s se"`}
        >
          {/* 1. 정중앙 핵심 블록 (Goal + Major) */}
          <GridItem area={"c"}>
            <MandalartBlock_3x3
              centerTitle={data.title}
              centerId={data.id}
              surroundingItems={data.major_categories}
              isMainCenterBlock={true}
              onCellClick={handleCellClick}
            />
          </GridItem>

          {/* 2. 주변 확장 블록 (Major + Sub) */}
          {data.major_categories.map((major) => (
            <GridItem key={major.id} area={positionToAreaMap[major.position]}>
              <MandalartBlock_3x3
                centerTitle={major.title}
                centerId={major.id}
                surroundingItems={major.sub_categories}
                isMainCenterBlock={false}
                onCellClick={handleCellClick}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>

      {selectedCell && (
        <MandalartInputModal
          isOpen={isOpen}
          onClose={onClose}
          cellId={selectedCell.id}
          cellType={selectedCell.type}
          initialTitle={selectedCell.title}
          onUpdateSuccess={onRefresh}
        />
      )}
    </>
  );
}
