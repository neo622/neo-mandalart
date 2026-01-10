"use client";

import { Flex, Text } from "@chakra-ui/react";

interface MandalartCellProps {
  title?: string;
  isCenter?: boolean; // 가운데 셀인지
  isMajorCenter?: boolean; // Major Category의 셀인지
  onClick?: () => void;
}

export default function MandalartCell({
  title,
  isCenter = false,
  isMajorCenter = false,
  onClick,
}: MandalartCellProps) {
  // 색상 로직: Goal > Major Cat > Sub Cat
  let bgColor = "white";
  let textColor = "gray.700";
  let fontWeight = "normal";
  let placeholder = "";

  if (isCenter) {
    bgColor = "blue.500";
    textColor = "white";
    fontWeight = "bold";
    placeholder = "최종 목표";
  } else if (isMajorCenter) {
    bgColor = "blue.100";
    textColor = "blue.800";
    fontWeight = "semibold";
    placeholder = "세부 목표";
  }

  // title이 빈 문자열("")이면 placeholder를 보여줌
  const displayTitle = title && title.trim() !== "" ? title : placeholder;

  return (
    <Flex
      as="button"
      onClick={onClick}
      bg={bgColor}
      color={textColor}
      fontWeight={fontWeight}
      border="1px solid"
      borderColor="gray.200"
      align="center"
      justify="center"
      p={1}
      h="100%"
      w="100%"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: isCenter ? "blue.600" : isMajorCenter ? "blue.200" : "gray.50",
        transform: "scale(1.05)",
        zIndex: 1,
        boxShadow: "md",
      }}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        textAlign="center"
        noOfLines={3}
      >
        {displayTitle}
      </Text>
    </Flex>
  );
}
