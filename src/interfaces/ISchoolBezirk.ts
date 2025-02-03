export interface ISchoolBezirk {
  Id: string;
  Name: string;
  Schulen: {
    Id: string;
    Name: string;
    Ort: string;
  }[];
}
