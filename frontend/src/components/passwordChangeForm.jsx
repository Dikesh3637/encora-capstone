import InputFieldSetWithValidation from "./inputFieldSetWithValidation";
import { passwordValidator } from "../utils/validators";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../query/changePasswordQuery";
import { toast } from "sonner";
import { useUser } from "../provider/userProvider";

const PasswordChangeForm = () => {
  const { logout } = useUser();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(
        "Password changed successfully! please relogin using new password."
      );
      logout();
    },
    onError: (error) => {
      toast.error("Error changing password: " + error.response.data.message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      oldPassword: formData.get("old-password-input"),
      newPassword: formData.get("new-password-input"),
    };
    mutation.mutate(data);
  };

  return (
    <div className="registration-form-container col-span-1 col-start-2 place-self-center w-[50%] p-6 rounded-lg">
      <form
        className="registration-form flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl">Change Password</h1>
        <InputFieldSetWithValidation
          label="Old Password"
          placeholder="Enter old password"
          required={true}
          type="password"
          validationFunction={passwordValidator}
          validationHint="Please enter your old password"
        />
        <InputFieldSetWithValidation
          label="New Password"
          placeholder="Enter your new password"
          required={true}
          type="password"
          validationFunction={passwordValidator}
          validationHint="password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        />

        <button type="submit" className="submit-button btn btn-primary">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
