"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import MandalartBlock_3x3 from "./MandalartBlock_3x3";

// DB position을 그리드 영역으로 매핑
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

// 임시
interface MandalartBoardProps {
  data?: any; // TODO: Supabase에서 가져온 실제 데이터 타입으로 교체
}

export default function MandalartBoard_9x9({ data }: MandalartBoardProps) {
  // 임시 데이터
  const dummyGoal = "NEO's 2026";
  const dummyMajors = Array.from({ length: 8 }, (_, i) => ({
    id: `m-${i}`,
    title: `Major ${i}`,
    position: i,
  }));
  const dummySubs = Array.from({ length: 64 }, (_, i) => ({
    id: `s-${i}`,
    title: `Sub ${i}`,
    position: i % 8,
    major_id: `m-${Math.floor(i / 8)}`,
  }));

  return (
    <Box
      w="100%"
      maxW="800px"
      aspectRatio={1 / 1}
      bg="white"
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
        {/* Goal + 8 Majors */}
        <GridItem area={"c"}>
          <MandalartBlock_3x3
            centerTitle={dummyGoal}
            surroundingItems={dummyMajors}
            isMainCenterBlock={true}
          />
        </GridItem>

        {/* Major + 8 Subs */}
        {dummyMajors.map((major) => {
          // 해당 Major에 속한 Sub들만 필터링 (임시 로직)
          const relatedSubs = dummySubs.filter(
            (sub) => sub.major_id === major.id
          );

          return (
            <GridItem key={major.id} area={positionToAreaMap[major.position]}>
              <MandalartBlock_3x3
                centerTitle={major.title}
                surroundingItems={relatedSubs}
                isMainCenterBlock={false}
              />
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
}
