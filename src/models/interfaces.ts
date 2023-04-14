import { RowDataPacket } from "mysql2";

export interface IOrganization extends RowDataPacket {
  org_id: string | number | null;
  org_name: string;
  org_country: string;
  org_created_at: Date;
  org_is_active: boolean;
  org_prm_email: string;
  org_scd_email: string;
  org_created_by: string;
}

export interface ISuperAdmin extends RowDataPacket {
  sadmin_id: string | number | null;
  sadmin_name: string;
  sadmin_email: string;
  sadmin_password: string;
}

export interface IRole extends RowDataPacket {
  role_id: string | number | null;
  role_name: string;
}
