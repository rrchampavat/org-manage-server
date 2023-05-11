export const orgTableName = "organisations";
export const userTableName = "users";
export const roleTableName = "roles";
export const superAdminTableName = "super_admins";
export const locationTableName = "locations";

export const orgTableKeys = {
  id: "org_id",
  name: "org_name",
  country: "org_country",
  establish_date: "org_establish_date",
  is_active: "org_is_active",
  prm_email: "org_prm_email",
  scd_email: "org_scd_email",
  created_by: "org_created_by",
  register_date: "org_register_date",
  updated_at: "org_updated_at",
};

export const roleTableKeys = {
  id: "role_id",
  name: "role_name",
  org_id: "role_org_id",
};

export const sAdminTableKeys = {
  id: "sadmin_id",
  name: "sadmin_name",
  email: "sadmin_email",
  password: "sadmin_password",
  is_active: "sadmin_is_active",
};

export const userTableKeys = {
  id: "user_id",
  first_name: "user_first_name",
  last_name: "user_last_name",
  email: "user_email",
  password: "user_password",
  image: "user_image",
  contact: "user_contact",
  org_id: "user_org_id",
  role_id: "user_role_id",
  is_active: "user_is_active",
  joining_date: "user_joining_date",
  location_id: "user_location_id",
  address_id: "user_address_id",
};

export const locationTableKeys = {
  id: "location_id",
  city: "location_city",
  state: "location_state",
  country: "location_country",
  pin: "location_pin",
  org_id: "location_org_id",
  area: "location_area",
};
