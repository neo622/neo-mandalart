"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import MandalartCell from "./MandalartCell";

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

interface CellItem {
  id: string;
  title: string;
  position: number;
}

interface MandalartBlockProps {
  centerId: string;
  centerTitle: string;
  surroundingItems: CellItem[];
  isMainCenterBlock?: boolean;
  onCellClick: (
    id: string,
    type: "GOAL" | "MAJOR" | "SUB",
    title: string
  ) => void;
}

export default function MandalartBlock_3x3({
  centerId,
  centerTitle,
  surroundingItems,
  isMainCenterBlock = false,
  onCellClick,
}: MandalartBlockProps) {
  // 센터 셀 클릭 시
  const handleCenterClick = () => {
    // MainCenterBlock의 센터 = GOAL
    // 아니라면 = MAJOR
    const type = isMainCenterBlock ? "GOAL" : "MAJOR";
    onCellClick(centerId, type, centerTitle);
  };

  return (
    <Grid
      h="100%"
      w="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={0}
      border={isMainCenterBlock ? "2px solid" : "1px solid"}
      borderColor={isMainCenterBlock ? "blue.400" : "gray.300"}
      templateAreas={`"nw n ne" "w  c  e" "sw s se"`}
    >
      {/* 가운데 셀 */}
      <GridItem area={"c"}>
        <MandalartCell
          title={centerTitle}
          isCenter={isMainCenterBlock}
          isMajorCenter={!isMainCenterBlock}
          onClick={handleCenterClick}
        />
      </GridItem>

      {/* 주변 8개 셀 */}
      {surroundingItems.map((item) => (
        <GridItem key={item.id} area={positionToAreaMap[item.position]}>
          <MandalartCell
            title={item.title}
            isMajorCenter={isMainCenterBlock}
            onClick={() => {
              const type = isMainCenterBlock ? "MAJOR" : "SUB";
              onCellClick(item.id, type, item.title);
            }}
          />
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
