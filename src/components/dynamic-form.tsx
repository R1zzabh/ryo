"use client";

import { useState, useEffect, Fragment } from "react";
import { z } from "zod";
import { FormSchema } from "~~/lib/dsl";
import {
  ShortAnswerComponent,
  LongAnswerComponent,
  EmailComponent,
  NumberComponent,
  MultipleChoiceComponent,
  MultiSelectComponent,
} from "./form-components";

type FormData = Record<string, any>;

const DynamicForm: React.FC<{
  formId: string;
  schema: z.infer<typeof FormSchema>;
}> = ({ formId, schema }) => {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    // Initialize form data with default values
    const initialData: FormData = {};
    schema.fields.forEach((field) => {
      if (field.type === "multiSelect") {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = "";
      }
    });
    setFormData(initialData);
  }, [schema]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [fieldId]: value }));
  };

  const isFieldVisible = (
    field: z.infer<typeof FormSchema>["fields"][number]
  ): boolean => {
    if (!field.condition) return true;
    return formData[field.condition.field] === field.condition.value;
  };

  const renderField = (field: z.infer<typeof FormSchema>["fields"][number]) => {
    if (!isFieldVisible(field)) return null;

    const commonProps = {
      field,
      value: formData[field.id],
      onChange: (value: any) => handleChange(field.id, value),
    };

    switch (field.type) {
      case "shortAnswer":
        // @ts-expect-error: Type mismatch in field props
        return <ShortAnswerComponent {...commonProps} />;
      case "longAnswer":
        // @ts-expect-error: Type mismatch in field props
        return <LongAnswerComponent {...commonProps} />;
      case "email":
        // @ts-expect-error: Type mismatch in field props
        return <EmailComponent {...commonProps} />;
      case "number":
        // @ts-expect-error: Type mismatch in field props
        return <NumberComponent {...commonProps} />;
      case "multipleChoice":
        // @ts-expect-error: Type mismatch in field props
        return <MultipleChoiceComponent {...commonProps} />;
      case "multiSelect":
        // @ts-expect-error: Type mismatch in field props
        return <MultiSelectComponent {...commonProps} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId, data: formData }),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        // Optionally, reset the form or show a success message
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">{schema.title}</h2>
      {schema.fields.map((field) => (
        <Fragment key={field.id}>{renderField(field)}</Fragment>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
