export const superAdminTokenMaxAge: number = 60 * 60; // in seconds

interface IRoles {
  [key: string]: number;
}

export const super_admin = "Super Admin",
  admin = "Admin",
  employee = "Employee";

export const roles: IRoles = {
  "Super Admin": 1,
  "Admin": 2,
  "Employee": 3,
};
