import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GET_TEMPLATE,
  SUBMIT_FORM
} from "../store/api/formsApi";
import { useMutation, useQuery } from "@apollo/client/react";
import { Question, QuestionType } from '../__generated__/graphql';

function FormFiller() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: templateResponse, loading: isTemplateLoading, error } = useQuery(GET_TEMPLATE, { variables: { id: id! } });
  const [submitResponse, { loading: isSubmitting }] = useMutation(SUBMIT_FORM);

  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleAnswerChange = (questionId: string, value: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    let newAnswers: string[];
    if (checked) {
      newAnswers = [...currentAnswers, optionValue];
    } else {
      newAnswers = currentAnswers.filter((v) => v !== optionValue);
    }
    setAnswers((prev) => ({ ...prev, [questionId]: newAnswers }));
  };

  const template = templateResponse?.template;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!template) return;

    const questions = template.questions.map((q) => ({
      text: q.text,
      type: q.type,
      options: q.options,
      required: q.required,
      answers: answers[q.id]
    }));

    try {
      await submitResponse({ variables: { formId: id!, questions } });
      navigate("/");
    } catch (err) {
      console.error("Failed to submit response:", err);
      alert("Failed to submit response. Please try again.");
    }
  };

  if (isTemplateLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading form...</div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">
          Error loading form: {error && "message" in error ? error.message : "Form not found"}
        </p>
      </div>
    );
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case QuestionType.Text:
        return (
          <input
            type="text"
            value={(answers[question.id]?.[0] as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, [e.target.value])}
            required={question.required}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case QuestionType.MultipleChoice:
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id]?.[0] === option}
                  onChange={(e) =>
                    handleAnswerChange(question.id, [e.target.value])
                  }
                  required={question.required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case QuestionType.Checkbox:
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                name={question.id}
                  type="checkbox"
                  value={option}
                  checked={((answers[question.id] as string[]) || []).includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      question.id,
                      option,
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case QuestionType.Date:
        return (
          <input
            name={question.id}
            type="date"
            value={(answers[question.id]?.[0] as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, [e.target.value])}
            required={question.required}
            className="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>
        {template.description && (
          <p className="text-gray-600">{template.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {template.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            </div>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormFiller;
