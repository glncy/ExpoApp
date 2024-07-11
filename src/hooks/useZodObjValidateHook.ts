import { useState } from "react";
import { ZodError, ZodIssue, ZodObject, ZodRawShape } from "zod";

export const useZodObjValidateHook = <T extends ZodRawShape>(
  schema: ZodObject<T>
) => {
  type ErrorState = {
    [key in keyof typeof schema.shape]?: ZodIssue[];
  };

  type Validators = {
    [key in keyof typeof schema.shape]?: (
      value: string | number | boolean
    ) => ZodIssue[] | null;
  };

  const initialErrorState = (): ErrorState => {
    const state: ErrorState = {};
    for (const key of Object.keys(schema.shape)) {
      state[key as keyof ErrorState] = undefined;
    }
    return state;
  };

  const [errors, setErrors] = useState<ErrorState>(initialErrorState());

  const createValidators = (): Validators => {
    const validators: {
      [key in keyof typeof schema.shape]?: (
        value: string | number | boolean
      ) => ZodIssue[] | null;
    } = {};
    for (const key of Object.keys(schema.shape)) {
      validators[key as keyof typeof schema.shape] = (
        value: string | number | boolean
      ) => {
        try {
          schema.shape[key].parse(value);
          setErrors((prev) => ({ ...prev, [key]: undefined }));
          return null;
        } catch (err) {
          if (err instanceof ZodError) {
            setErrors((prev) => ({ ...prev, [key]: err.issues }));
            return err.issues;
          }
          return null;
        }
      };
    }
    return validators;
  };

  const validate = (data: T): null | ErrorState => {
    try {
      schema.parse(data);
      setErrors(initialErrorState());
      return null;
    } catch (err) {
      if (err instanceof ZodError) {
        const validationObject: ErrorState = initialErrorState();
        err.issues.forEach((error) => {
          const path = error.path;
          path.forEach((key) => {
            const transformKey = key as keyof typeof validationObject;
            if (!validationObject[transformKey]) {
              validationObject[transformKey] = [];
            }
            validationObject[transformKey]?.push(error);
          });
        });
        setErrors(validationObject);
        return validationObject;
      }
      console.log(err);
      return null;
    }
  };

  return {
    errors,
    setErrors,
    validators: createValidators(),
    validate,
  };
};
