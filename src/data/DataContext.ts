import React from 'react';


export interface Data {
  games?: CsvData[];
}

export interface DataContextProps {
  data: Data;
  setGames: (games: CsvData[]) => void;
}

export interface CsvData {
  [key: string]: string | number | null | undefined;
}

const defaultContext: DataContextProps = {
  data: {}
} as DataContextProps;

export const DataContextProvider = React.createContext<DataContextProps>(defaultContext);
