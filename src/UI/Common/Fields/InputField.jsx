const InputField = ({
  type,
  value,
  name,
  onChange,
  placeholder,
  maxLength,
  required,
}) => {
  return (
    <input
      type={type ? type : "text"}
      name={name}
      onChange={onChange}
      placeholder={`Enter ${placeholder} **`}
      maxLength={`${maxLength}`}
      required={required ? required : false}
    />
  );
};
export default InputField;
