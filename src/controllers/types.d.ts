import { RowDataPacket } from "mysql2";

interface Organisation extends RowDataPacket {
  org_id: string | number | null;
  org_name: string;
  org_country: string;
  org_establish_date: Date;
  org_is_active: boolean;
  org_prm_email: string;
  org_scd_email: string;
  org_created_by: string;
  org_register_date: Date;
}

interface SuperAdmin extends RowDataPacket {
  sadmin_id: string | number | null;
  sadmin_name: string;
  sadmin_email: string;
  sadmin_password: string;
  sadmin_is_active: boolean;
}

interface Role extends RowDataPacket {
  role_id: string | number | null;
  role_name: string;
  role_org_id: number | number | null;
}

interface User extends RowDataPacket {
  user_id: string | number | null;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_password: string;
  user_image: string;
  user_contact: string;
  user_org_id: string | number | null;
  user_role_id: string | number | null;
  user_is_active: boolean;
  user_joining_date: Date;
  user_location_id: string | number | null;
  user_address_id: string | number | null;
}

interface Location {
  location_id: number | string | null;
  location_city: string;
  location_state: string;
  location_country: string;
  location_pin: string;
  location_org_id: number;
  location_area: string;
}
