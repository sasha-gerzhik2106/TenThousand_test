import * as types from './__generated__/resolvers-types';

export class InMemoryStore {
  #templates: types.Form[];
  #submittedForms: types.Form[];

  constructor() {
    this.#templates = [];
    this.#submittedForms = [];
  }

  getAllTemplates() {
    return this.#templates;
  }

  getTemplate(id: string) {
    return this.#templates.find(form => form.id === id);
  }

  createTemplate(form: types.Form) {
    this.#templates.push(form);
    return form;
  }

  getSubmittedForms() {
    return this.#submittedForms;
  }

  getSubmittedForm(id: string) {
    return this.#submittedForms.find(form => form.id === id);
  }

  addSubmittedForm(response: types.Form) {
    this.#submittedForms.push(response);
    return response;
  }
}

export const store = new InMemoryStore();
