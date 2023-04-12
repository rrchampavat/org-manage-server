import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const idValidation = z.object({
  id: z.number({ required_error: "id must be number!" }),
});

export const superAdminJwtTokenSchema = z.object({
  jwtToken: z
    .object({
      id: z.number({
        required_error: "Logged user id missing from request header!",
      }),
      iat: z.number({
        required_error: "JWT token create time missing from request header!",
      }),
      exp: z.number({
        required_error: "JWT expiration time missing from request header!",
      }),
    })
    .strict(),
});

export const superAdminLoginSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required!" })
        .email("Please provide valid email!"),
      password: z.string({ required_error: "Password is required!" }),
    })
    .strict(),
});

export const superAdminRegisterSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required!" }),
    email: z
      .string({ required_error: "Email is required!" })
      .email("Please provide valid email!"),
    password: z
      .string({ required_error: "Password is required!" })
      .regex(
        passwordRegex,
        "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"
      ),
  }),
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
  .merge(idValidation)
  .merge(superAdminJwtTokenSchema);
