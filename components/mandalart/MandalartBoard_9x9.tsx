"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import MandalartBlock_3x3 from "./MandalartBlock_3x3";

// Position -> Grid Area 매핑
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

// TODO: 타입 분리 필요
interface SubCategory {
  id: string;
  title: string;
  position: number;
}
interface MajorCategory {
  id: string;
  title: string;
  position: number;
  sub_categories: SubCategory[];
}
interface MandalartData {
  id: string;
  title: string;
  major_categories: MajorCategory[];
}

interface MandalartBoardProps {
  data: MandalartData; // DB 데이터
}

export default function MandalartBoard_9x9({ data }: MandalartBoardProps) {
  if (!data) return null;

  return (
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
        templateAreas={`
          "nw n ne"
          "w  c  e"
          "sw s se"
        `}
      >
        {/* 정중앙 핵심 블록 (Goal Block)                  */}
        {/* - 센터 텍스트: 만다라트 전체 제목 (Root Title)       */}
        {/* - 주변 아이템: Major Categories (8개)              */}
        <GridItem area={"c"}>
          <MandalartBlock_3x3
            centerTitle={data.title}
            surroundingItems={data.major_categories}
            isMainCenterBlock={true} // Goal Center
          />
        </GridItem>

        {/* 주변 8개 확장 블록 (Major Category Blocks)          */}
        {/* - 센터 텍스트: Major Category Title               */}
        {/* - 주변 아이템: Sub Categories (64개)               */}
        {data.major_categories.map((major) => (
          <GridItem key={major.id} area={positionToAreaMap[major.position]}>
            <MandalartBlock_3x3
              centerTitle={major.title}
              surroundingItems={major.sub_categories}
              isMainCenterBlock={false}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
