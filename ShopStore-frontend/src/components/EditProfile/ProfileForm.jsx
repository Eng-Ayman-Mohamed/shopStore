import React from "react";

export default function ProfileForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  children,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      {children}
      <div className="form-actions">
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" />
              Uploading...
            </>
          ) : (
            "Save changes"
          )}
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
