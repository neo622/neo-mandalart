export interface Todo {
  id: string;
  content: string;
  is_completed: boolean;
}

export interface SubCategory {
  id: string;
  title: string;
  position: number;
  todos?: Todo[];
}

export interface MajorCategory {
  id: string;
  title: string;
  position: number;
  sub_categories: SubCategory[];
}

export interface MandalartData {
  id: string;
  title: string;
  major_categories: MajorCategory[];
}

export type CellType = "GOAL" | "MAJOR" | "SUB";

export interface SelectedCellData {
  id: string;
  type: CellType;
  title: string;
}
