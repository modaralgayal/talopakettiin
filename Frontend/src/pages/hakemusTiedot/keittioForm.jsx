import { OptionRender } from "../../components/optionRender";

export const KitchenForm = ({ formData, setFormData, validationErrors }) => {

  return (
    <div className="space-y-6">
      <OptionRender
        field={"kitchenType"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"kitchenAccessories"}
        formData={formData}
        setFormData={setFormData}
        fieldType="checkBox"
        validationErrors={validationErrors}
      />
    </div>
  );
};
