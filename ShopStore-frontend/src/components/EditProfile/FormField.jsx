import React from "react";

export default function FormField({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div className="form-row">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
}
