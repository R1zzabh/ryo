"use client";

import { z } from "zod";
import {
  ShortAnswerField,
  LongAnswerField,
  EmailField,
  NumberField,
  MultipleChoiceField,
  MultiSelectField,
} from "~~/lib/dsl";

type FieldProps<T extends z.ZodType<any, any>> = {
  field: z.infer<T>;
  value: any;
  onChange: (value: any) => void;
};

const RequiredStar: React.FC = () => (
  <span className="text-red-500 ml-1">*</span>
);

const Label: React.FC<{
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, required, children }) => (
  <label
    htmlFor={htmlFor}
    className="block mb-2 text-sm font-medium text-neutral-700"
  >
    {children}
    {required && <RequiredStar />}
  </label>
);

const inputClasses =
  "w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out";

export const ShortAnswerComponent: React.FC<
  FieldProps<typeof ShortAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="text"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const LongAnswerComponent: React.FC<
  FieldProps<typeof LongAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <textarea
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={`${inputClasses} h-32 resize-none`}
    />
  </div>
);

export const EmailComponent: React.FC<FieldProps<typeof EmailField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="email"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const NumberComponent: React.FC<FieldProps<typeof NumberField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="number"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const MultipleChoiceComponent: React.FC<
  FieldProps<typeof MultipleChoiceField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <div className="space-y-2">
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <input
            type="radio"
            id={`${field.id}-${index}`}
            name={field.id}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            required={field.required}
            className="mr-2 text-blue-500 focus:ring-blue-500 h-4 w-4"
          />
          <span className="text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export const MultiSelectComponent: React.FC<
  FieldProps<typeof MultiSelectField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <div className="space-y-2">
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <input
            type="checkbox"
            id={`${field.id}-${index}`}
            name={field.id}
            value={option}
            checked={value?.includes(option)}
            onChange={(e) => {
              const newValue = e.target.checked
                ? [...(value || []), option]
                : (value || []).filter((v: string) => v !== option);
              onChange(newValue);
            }}
            className="mr-2 text-blue-500 focus:ring-blue-500 h-4 w-4 rounded"
          />
          <span className="text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);
