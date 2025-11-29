import { useState } from "react";

function InputFieldSetWithValidation({
  label = "",
  placeholder = "",
  type = "text",
  validationHint,
  required = false,
  validationFunction,
  className,
}) {
  const [isValid, setIsValid] = useState(true);
  const onChangeHandler = (e) => {
    const value = e.target.value;
    if (validationFunction) {
      setIsValid(validationFunction(value));
    }
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input
        type={type}
        id={label.toLowerCase().replace(" ", "-") + "-input"}
        name={label.toLowerCase().replace(" ", "-") + "-input"}
        className={"input validator w-full " + (className || "")}
        placeholder={placeholder}
        required={required}
        onChange={onChangeHandler}
        aria-invalid={!isValid}
      />
      <div className="validator-hint hidden">{validationHint}</div>
    </fieldset>
  );
}

export default InputFieldSetWithValidation;
