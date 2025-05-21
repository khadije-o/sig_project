import { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';

type InputFieldProps = {
  label?: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;

  children?: ReactNode;
};

export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error = null,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  children,
}: InputFieldProps) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`form-control ${error ? 'input-error' : ''}`}
      />
      {error && <small className="error-text">{error}</small>}
      {children}
    </div>
  );
}
