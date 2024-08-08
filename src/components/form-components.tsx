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

export const ShortAnswerComponent: React.FC<
  FieldProps<typeof ShortAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={field.id}
      className="block mb-2 text-sm font-bold text-neutral-700"
    >
      {field.label}
    </label>
    <input
      type="text"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className="w-full px-3 py-2 text-neutral-700 border rounded-lg focus:outline-none focus:border-blue-500"
    />
  </div>
);

export const LongAnswerComponent: React.FC<
  FieldProps<typeof LongAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={field.id}
      className="block mb-2 text-sm font-bold text-neutral-700"
    >
      {field.label}
    </label>
    <textarea
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className="w-full px-3 py-2 text-neutral-700 border rounded-lg focus:outline-none focus:border-blue-500 h-32"
    />
  </div>
);

export const EmailComponent: React.FC<FieldProps<typeof EmailField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label
      htmlFor={field.id}
      className="block mb-2 text-sm font-bold text-neutral-700"
    >
      {field.label}
    </label>
    <input
      type="email"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className="w-full px-3 py-2 text-neutral-700 border rounded-lg focus:outline-none focus:border-blue-500"
    />
  </div>
);

export const NumberComponent: React.FC<FieldProps<typeof NumberField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label
      htmlFor={field.id}
      className="block mb-2 text-sm font-bold text-neutral-700"
    >
      {field.label}
    </label>
    <input
      type="number"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className="w-full px-3 py-2 text-neutral-700 border rounded-lg focus:outline-none focus:border-blue-500"
    />
  </div>
);

export const MultipleChoiceComponent: React.FC<
  FieldProps<typeof MultipleChoiceField>
> = ({ field, value, onChange }) => (
  <fieldset className="mb-4 p-4 border rounded-lg">
    <legend className="text-sm font-bold text-neutral-700">
      {field.label}
    </legend>
    {field.options.map((option, index) => (
      <div key={index} className="mb-2">
        <input
          type="radio"
          id={`${field.id}-${index}`}
          name={field.id}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          required={field.required}
          className="mr-2"
        />
        <label htmlFor={`${field.id}-${index}`}>{option}</label>
      </div>
    ))}
  </fieldset>
);

export const MultiSelectComponent: React.FC<
  FieldProps<typeof MultiSelectField>
> = ({ field, value, onChange }) => (
  <fieldset className="mb-4 p-4 border rounded-lg">
    <legend className="text-sm font-bold text-neutral-700">
      {field.label}
    </legend>
    {field.options.map((option, index) => (
      <div key={index} className="mb-2">
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
          className="mr-2"
        />
        <label htmlFor={`${field.id}-${index}`}>{option}</label>
      </div>
    ))}
  </fieldset>
);
