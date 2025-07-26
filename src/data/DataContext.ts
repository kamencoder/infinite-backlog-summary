import React from 'react';
import type { Summary } from './summarizer';


export interface Data {
  games?: CsvData[];
  summary: Summary | null,
  userData: UserData,
}

export interface UserData {
  gameEdits: Record<string, GameEdit | undefined>; // Game edits by game id
}
export interface GameEdit {
  coverImage: string | null;
}

export interface DataContextProps {
  data: Data;
  setGames: (games: CsvData[]) => void;
  editGame: (gameId: string, gameEdit: GameEdit) => void;
}

export interface CsvData {
  [key: string]: string | number | null | undefined;
}

const defaultContext: DataContextProps = {
  data: {}
} as DataContextProps;

export const DataContext = React.createContext<DataContextProps>(defaultContext);
