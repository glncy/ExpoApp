import { useState } from "react";
import { AnyObject, ObjectSchema, ValidationError } from "yup";

export const useValidatorHook = <T extends AnyObject>(
  schema: ObjectSchema<T>
) => {
  type ErrorState = {
    [key in keyof T]?: string;
  };

  type Validators = {
    [key in keyof T]: (
      value: string | number | boolean,
      objectValues?: {
        [key in keyof T]?: string | number | boolean;
      }
    ) => Promise<void>;
  };

  const initialState = (): ErrorState => {
    const state: any = {};
    for (const key of Object.keys(schema.fields)) {
      state[key] = "";
    }
    return state;
  };

  const [errors, setErrors] = useState<ErrorState>(initialState());

  const createValidators = (): Validators => {
    const validators: any = {};
    for (const key of Object.keys(schema.fields)) {
      validators[key] = async (
        value: string | number | boolean,
        objectValues?: {
          [key in keyof T]?: string | number | boolean;
        }
      ) => {
        try {
          schema.validateSyncAt(key, { [key]: value, ...(objectValues ?? {}) });
          setErrors((prev) => ({ ...prev, [key]: "" }));
        } catch (err) {
          if (err instanceof ValidationError) {
            const message = err.message;
            setErrors((prev) => ({ ...prev, [key]: message }));
          }
        }
      };
    }
    return validators;
  };

  const validate = (data: T): null | ErrorState => {
    try {
      schema.validateSync(data, { abortEarly: false });
      setErrors(initialState());
      return null;
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationObject: ErrorState = initialState();
        err.inner.forEach((error) => {
          const path = error.path as keyof typeof validationObject;
          if (!validationObject[path]) {
            validationObject[path] = error.message;
          }
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
