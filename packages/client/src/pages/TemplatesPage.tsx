import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client/react';
import { GET_TEMPLATES } from "../store/api/formsApi";

function TemplatesPage() {
  const { data: forms, loading, error } = useQuery(GET_TEMPLATES);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">
          Error loading templates: {"message" in error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <Link
          to="/forms/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Template
        </Link>
      </div>
      {forms && forms.templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No templates created yet</p>
          <Link
            to="/forms/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create your first template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms?.templates?.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {form.title}
                </h3>
                {form.description && (
                  <p className="text-gray-500 text-sm mb-4">
                    {form.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mb-4">
                  {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/forms/${form.id}/fill`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Fill Form →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplatesPage;
