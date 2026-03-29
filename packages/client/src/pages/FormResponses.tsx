import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_SUBMITTED_FORM } from "../store/api/formsApi";
import { QuestionType } from '../__generated__/graphql';

const formatAnswers: Record<QuestionType, (answers: string[]) => string> = {
  [QuestionType.Text]: (answers) => answers.join(', '),
  [QuestionType.MultipleChoice]: (answers) => answers.join(', '),
  [QuestionType.Checkbox]: (answers) => answers.join(', '),
  [QuestionType.Date]: (answers) => answers.map((date) => new Date(date).toLocaleDateString()).join(', '),
}

function FormResponses() {
  const { id } = useParams<{ id: string }>();
  const { data: submittedFormResponse, loading: isFormLoading } = useQuery(GET_SUBMITTED_FORM, { variables: { id: id! } });

  if (isFormLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading responses...</div>
      </div>
    );
  }

  if (!submittedFormResponse?.submittedForm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Form not found</p>
      </div>
    );
  }

  const { submittedForm } = submittedFormResponse;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{submittedForm.title}</h1>
        {submittedForm.description && (
          <p className="text-gray-600">{submittedForm.description}</p>
        )}
      </div>

      
        <div className="space-y-8">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="space-y-4">
          {submittedForm.questions.map((question) => (
            <div
                      key={question.id}
                      className="border-b border-gray-100 pb-3 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {question.text}
                      </p>
                      <p className="text-gray-900">
                        {formatAnswers[question.type](question.answers)}
                      </p>
                    </div>
          ))}
          </div>
          </div>
          </div>
        </div>
      
    </div>
  );
}

export default FormResponses;
