const InputField = ({
  type,
  value,
  name,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <input
      type={type ? type : "text"}
      name={name}
      onChange={onChange}
      placeholder={`Enter ${placeholder} **`}
      maxLength={name === "locationCode" ? 4 : 255}
      required={required ? required : false}
    />
  );
};
export default InputField;
