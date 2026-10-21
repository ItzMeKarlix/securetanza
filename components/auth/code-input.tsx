"use client";

import { useEffect, useRef } from "react";
import { AUTH_INPUT } from "./auth-shell";

/**
 * A single field for a 6-digit verification code. One input (not six boxes),
 * so paste, password managers and the phone's one-time-code autofill all just
 * work. Calls onComplete once six digits are in.
 */
export function CodeInput({
	value,
	onChange,
	onComplete,
	disabled,
	autoFocus = true,
	id = "verification-code",
	label = "Verification code",
}: {
	value: string;
	onChange: (value: string) => void;
	onComplete?: (code: string) => void;
	disabled?: boolean;
	autoFocus?: boolean;
	id?: string;
	label?: string;
}) {
	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (autoFocus && !disabled) ref.current?.focus();
	}, [autoFocus, disabled]);

	return (
		<input
			ref={ref}
			id={id}
			aria-label={label}
			type="text"
			inputMode="numeric"
			autoComplete="one-time-code"
			pattern="[0-9]*"
			maxLength={7}
			value={value}
			disabled={disabled}
			onChange={(e) => {
				const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
				onChange(digits);
				if (digits.length === 6) onComplete?.(digits);
			}}
			placeholder="000000"
			className={`${AUTH_INPUT} h-14 text-center font-mono text-2xl tracking-[0.5em] tabular-nums`}
		/>
	);
}
