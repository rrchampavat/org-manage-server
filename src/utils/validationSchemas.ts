import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const idValidation = z.object({
  id: z.number({ required_error: "id is requried!" }),
});

export const paramsIDSchema = z.object({
  params: z
    .object({
      id: z
        .string({ required_error: "Param id missing!" })
        .nonempty({ "message": "Param id missing!" }),
    })
    .strict(),
});

// export const superAdminJwtTokenSchema = z.object({
//   jwtToken: z
//     .object({
//       id: z.number({
//         required_error: "Logged user id missing from request header! ",
//       }),
//       iat: z.number({
//         required_error: "JWT token create time missing from request header!",
//       }),
//       exp: z.number({
//         required_error: "JWT expiration time missing from request header!",
//       }),
//     })
//     .strict(),
// });

export const superAdminLoginSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required!" })
        .email("Please provide valid email!")
        .nonempty({ "message": "Email is required!" }),
      password: z.string({ required_error: "Password is required!" }),
    })
    .strict(),
});

export const superAdminRegisterSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required!" })
        .nonempty({ "message": "Name is required!" }),
      email: z
        .string({ required_error: "Email is required!" })
        .email("Please provide valid email!")
        .nonempty({ "message": "Email is required!" }),
      password: z
        .string({ required_error: "Password is required!" })
        .regex(
          passwordRegex,
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"
        ),
    })
    .strict(),
});

export const getSuperAdminSchema = z
  .object({
    params: z
      .object({
        id: z
          .string({ required_error: "id is required!" })
          .nullable()
          .optional(),
      })
      .strict(),
  })
  .merge(idValidation);
// .merge(superAdminJwtTokenSchema);

export const createOrgSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Organisation name is required!",
          invalid_type_error: "Organisation name must be a string!",
        })
        .nonempty({ "message": "Organisation name is required!" }),
      country: z
        .string({
          required_error: "Country name is required!",
          invalid_type_error: "Country name must be a string!",
        })
        .nonempty({ "message": "Country name is required!" }),
      prmEmail: z
        .string({ required_error: "Primary email is required!" })
        .email("Please provide valid primary email!")
        .nonempty({ "message": "Primary email is required!" }),
      scdEmail: z
        .string({ required_error: "Secondary email is required!" })
        .email("Please provide valid secondary email!")
        .nonempty({ "message": "Secondary email is required!" }),
    })
    .strict()
    .refine((data) => data.prmEmail !== data.scdEmail, {
      "message": "Primary and secondary emails must be different",
    }),
});
// .merge(superAdminJwtTokenSchema);

export const createRoleSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Role name is required!",
        invalid_type_error: "Role name must be string!",
      }),
    })
    .strict(),
});

export const updateRoleSchema = z
  .object({
    body: z.object({
      name: z
        .string({
          required_error: "Name is required!",
          invalid_type_error: "Name must be string!",
        })
        .nonempty({ "message": "Name is required!" }),
    }),
  })
  .merge(paramsIDSchema);
