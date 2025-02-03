export interface ILoginsData {
  data: {
    [key: string]: {
      school_id: number;
      day: string;
      entry_count: number;
    }[];
  };
  uniqueDaysInOrder: string[];
}
