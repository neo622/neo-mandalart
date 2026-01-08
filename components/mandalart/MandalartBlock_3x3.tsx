"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import MandalartCell from "./MandalartCell";

// DB의 position (0~7)을 그리드 영역 이름으로 매핑
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

interface MandalartBlockProps {
  centerTitle?: string; // 가운데 들어갈 제목
  surroundingItems?: { id: string; title: string; position: number }[]; // 주변 8개 데이터
  isMainCenterBlock?: boolean; // 가운데 Block인지
}

export default function MandalartBlock_3x3({
  centerTitle,
  surroundingItems = [],
  isMainCenterBlock = false,
}: MandalartBlockProps) {
  return (
    <Grid
      h="100%"
      w="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={0}
      border={isMainCenterBlock ? "2px solid" : "1px solid"}
      borderColor={isMainCenterBlock ? "blue.400" : "gray.300"}
      // 3x3 그리드 영역 정의
      templateAreas={`
        "nw n ne"
        "w  c  e"
        "sw s se"
      `}
    >
      {/* 가운데 셀 */}
      <GridItem area={"c"}>
        <MandalartCell
          title={centerTitle}
          isCenter={isMainCenterBlock}
          isMajorCenter={!isMainCenterBlock}
        />
      </GridItem>

      {/* 주변 8개 셀 */}
      {surroundingItems.map((item) => (
        <GridItem key={item.id} area={positionToAreaMap[item.position]}>
          <MandalartCell title={item.title} />
        </GridItem>
      ))}

      {[0, 1, 2, 3, 4, 5, 6, 7].map((pos) => {
        if (surroundingItems.find((item) => item.position === pos)) return null;
        return (
          <GridItem key={`empty-${pos}`} area={positionToAreaMap[pos]}>
            <MandalartCell />
          </GridItem>
        );
      })}
    </Grid>
  );
}
