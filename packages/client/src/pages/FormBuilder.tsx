import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client/react';
import { CREATE_FORM_TEMPLATE } from "../store/api/formsApi";

import { CreateFormTemplateQuestion, QuestionType } from '../__generated__/graphql';

type QuestionDraft = CreateFormTemplateQuestion;

function FormBuilder() {
  const navigate = useNavigate();
  const [createForm, { loading: isSubmitting }] = useMutation(CREATE_FORM_TEMPLATE);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: QuestionType.Text,
        options: [],
        required: false,
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof QuestionDraft, value: string | boolean) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push('');
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      questions: questions.map((q) => ({
        text: q.text,
        type: q.type,
        options: q.options.filter((opt) => opt.trim()),
        required: q.required,
      })),
    };

    try {
      const result = await createForm({ variables: formData });
      navigate(`/forms/${result.data?.createFormTemplate.id}/fill`);
    } catch (err) {
      console.error("Failed to create form:", err);
      alert("Failed to create form. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form description"
              />
            </div>
          </div>
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Question {qIndex + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, "text", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter question text"
                />
              </div>

              <div>
                <select
                  value={question.type}
                  onChange={(e) =>
                    updateQuestion(qIndex, "type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="TEXT">Text Input</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="CHECKBOX">Checkboxes</option>
                  <option value="DATE">Date</option>
                </select>
              </div>

              {(question.type === "MULTIPLE_CHOICE" ||
                question.type === "CHECKBOX") && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(qIndex, optIndex, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, optIndex)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) =>
                    updateQuestion(qIndex, "required", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Required question
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Form"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormBuilder;
