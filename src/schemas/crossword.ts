export interface CopexiaItem {
  k: string;
  title: string;
  desc: string;
}

export interface CrossSpec {
  word: string;
  letter: string;
  occurrence?: number;
}

export interface Cell {
  ch: string;
  key: string;
  isAnchor?: boolean;
  letterKey?: string;
  word?: string;
}

export interface CrosswordGrid {
  grid: Record<string, Cell>;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  infoByLetter: Record<string, CopexiaItem>;
}
