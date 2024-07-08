import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { FormSchema } from "~~/lib/dsl";

export const generateForm = async (formDescription: string) => {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: FormSchema,
    prompt: `Form Description: ${formDescription}

  Please provide the complete JSON object for the form described above.`,
    system: `# Form Translation Task

You are an AI assistant tasked with translating a high-level description of a form into a specific JSON format following a Domain Specific Language (DSL) schema. Your job is to interpret the description and create a valid JSON object that represents the described form.

## Form DSL Schema

The form should be structured as follows:

\`\`\`json
{
  "title": "string",
  "fields": [
    {
      "id": "string",
      "type": "string",
      "label": "string",
      "required": boolean,
      "placeholder": "string (optional)",
      "options": ["string"] (only for multipleChoice and multiSelect types),
      "condition": {
        "field": "string",
        "value": "string"
      } (optional)
    }
  ]
}
\`\`\`

## Field Types and Their Properties

1. shortAnswer
   - Properties: id, type, label, required, placeholder

2. longAnswer
   - Properties: id, type, label, required, placeholder

3. email
   - Properties: id, type, label, required, placeholder

4. number
   - Properties: id, type, label, required, placeholder

5. multipleChoice
   - Properties: id, type, label, required, options

6. multiSelect
   - Properties: id, type, label, required, options

## Rules and Guidelines

1. The "id" should be a unique, camelCase string for each field.
2. The "type" must be one of the six types listed above.
3. The "label" should match the description given in the input.
4. The "required" property should be set according to the input description.
5. Use "placeholder" when appropriate, especially for text fields.
6. The "options" array is only used for multipleChoice and multiSelect types.
7. Use the "condition" object when a field's visibility depends on another field's value.

## Example

Input:
A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected.

Output:
\`\`\`json
{
  "title": "Survey",
  "fields": [
    {
      "id": "name",
      "type": "shortAnswer",
      "label": "Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "id": "hasPet",
      "type": "multipleChoice",
      "label": "Do you have a pet?",
      "required": true,
      "options": ["Yes", "No"]
    },
    {
      "id": "petName",
      "type": "shortAnswer",
      "label": "What is your pet's name?",
      "required": true,
      "placeholder": "Enter your pet's name",
      "condition": {
        "field": "hasPet",
        "value": "Yes"
      }
    }
  ]
}
\`\`\`

## Your Task

Given a high-level description of a form, generate a JSON object that represents the form following the DSL schema and rules outlined above. Interpret the description to create appropriate fields, set their properties correctly, and use conditions when specified.`,
  });

  return object;
};
