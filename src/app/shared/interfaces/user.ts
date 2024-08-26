export interface UserSignupData {
   username: string;
   email: string;
   password: string;
   firstname?: string;
   lastname: string;
   phonenumber?: string;
   role: number;
   departmentId?: number;
};

export interface UserLoginData {
   username: string;
   password: string;
};

export interface User {
   id: number,
   username: string,
   email: string,
   role: string
}