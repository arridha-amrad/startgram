import { type InputHTMLAttributes, useId } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type FormInputProps<T extends FieldValues> = {
	label: string;
	placeholder?: InputHTMLAttributes<HTMLElement>["placeholder"];
	validationError?: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	type?: InputHTMLAttributes<HTMLElement>["type"];
};

export function FormInput<T extends FieldValues>({
	name,
	label,
	placeholder,
	validationError,
	register,
	type,
}: FormInputProps<T>) {
	const id = useId();
	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				id={id}
				type={type ?? "text"}
				placeholder={placeholder}
				{...register(name)}
			/>
			{validationError && (
				<FieldError errors={[{ message: validationError }]} />
			)}
		</Field>
	);
}
