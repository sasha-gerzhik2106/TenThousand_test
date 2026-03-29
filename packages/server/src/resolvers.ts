import { store } from './store';
import * as types from './__generated__/resolvers-types';

export const resolvers: types.Resolvers = {
  Query: {
    templates: () => store.getAllTemplates(),
    template: (_, { id }) => store.getTemplate(id)!,
    submittedForms: () => store.getSubmittedForms(),
    submittedForm: (_, { id }) => store.getSubmittedForm(id)!,
  },
  Mutation: {
    createFormTemplate: (_, { title, description, questions }) => {
      const now = new Date().toISOString();
      const form: types.Form = {
        id: crypto.randomUUID(),
        title,
        description: description || null,
        questions: questions.map((q) => ({
          id: crypto.randomUUID(),
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required,
          answers: [],
        })),
        isTemplate: true,
        createdAt: now,
        updatedAt: now,
      };
      store.createTemplate(form);
      return form;
    },
    submitForm: (_, { formId, questions }) => {
      const form = store.getTemplate(formId);
      if (!form) {
        throw new Error('Form not found');
      }
      const now = new Date().toISOString();
      const submittedForm: types.Form = {
        id: crypto.randomUUID(),
        title: form.title,
        description: form.description,
        questions: questions.map((q) => ({
          id: crypto.randomUUID(),
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required,
          answers: q.answers,
        })),
        isTemplate: false,
        createdAt: now,
        updatedAt: now,
      };
      store.addSubmittedForm(submittedForm);
      return submittedForm;
    }
  },
};
