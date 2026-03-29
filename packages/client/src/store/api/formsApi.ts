// import { gql } from '@apollo/client';
import { gql } from '../../__generated__/gql';

export const GET_TEMPLATES = gql(`
  query GetTemplates {
    templates {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);

export const GET_TEMPLATE = gql(`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);

export const GET_SUBMITTED_FORMS = gql(`
  query GetSubmittedForms {
    submittedForms {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);

export const GET_SUBMITTED_FORM = gql(`
  query GetSubmittedForm($id: ID!) {
    submittedForm(id: $id) {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);  

export const CREATE_FORM_TEMPLATE = gql(`
  mutation CreateFormTemplate(
    $title: String!
    $description: String
    $questions: [CreateFormTemplateQuestion!]!
  ) {
    createFormTemplate(
      title: $title
      description: $description
      questions: $questions
    ) {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);

export const SUBMIT_FORM = gql(`
  mutation SubmitForm($formId: ID!, $questions: [AnswerInput!]!) {
    submitForm(formId: $formId, questions: $questions) {
      id
      title
      description
      isTemplate
      questions {
        id
        text
        type
        options
        required
        answers
      }
      createdAt
      updatedAt
    }
  }
`);
