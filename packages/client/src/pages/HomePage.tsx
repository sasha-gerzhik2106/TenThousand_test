import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client/react';
import { GET_SUBMITTED_FORMS } from "../store/api/formsApi";

function HomePage() {
  const { data, loading, error } = useQuery(GET_SUBMITTED_FORMS);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading submitted forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">
          Error loading submissions: {"message" in error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submitted Forms</h1>
      {data && data.submittedForms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No forms submitted yet</p>
          <Link
            to="/templates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.submittedForms?.map((form) => (
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
                  Submitted: {new Date(form.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/forms/${form.id}/responses`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Responses →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
