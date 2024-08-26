export interface RequestSubmitDTO {
   title: string;
   description: string;
}

export interface Request {
  id: number,
  title: string,
  description: string,
  status: string,
  createDate: Date,
  updateDate: Date,
  citizenId: number,
  assignedDepartmentId: number,
  citizenUsername: string,
  assignedDepartmentTitle: string
}