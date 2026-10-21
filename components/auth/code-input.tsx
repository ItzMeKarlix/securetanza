"use client";

import { useEffect, useRef } from "react";
import { AUTH_INPUT } from "./auth-shell";

const LENGTH = 6;

/**
 * A 6-digit verification code as six boxes. Typing moves to the next box,
 * Backspace steps back, and a pasted code (or the phone's one-time-code
 * autofill, which fills the first box) spreads across all six. The value stays
 * one string of digits, so callers treat it like a single field. Calls
 * onComplete once six digits are in.
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
	const boxes = useRef<Array<HTMLInputElement | null>>([]);
	const latest = useRef(value);
	useEffect(() => {
		latest.current = value;
	}, [value]);

	const focusBox = (index: number) => boxes.current[Math.min(Math.max(index, 0), LENGTH - 1)]?.focus();

	useEffect(() => {
		if (autoFocus && !disabled) focusBox(latest.current.length);
	}, [autoFocus, disabled]);

	const commit = (next: string, focusIndex: number) => {
		// Focus moves before React re-renders, so the focus rule must see the new value.
		latest.current = next;
		onChange(next);
		focusBox(focusIndex);
		if (next.length === LENGTH) onComplete?.(next);
	};

	const handleChange = (index: number, raw: string) => {
		let typed = raw.replace(/\D/g, "");
		// A box that already holds a digit receives the old and new one together.
		if (value[index] && typed.length === 2) typed = typed.replace(value[index], "");
		if (!typed) return;
		const next = (value.slice(0, index) + typed + value.slice(index + typed.length)).slice(0, LENGTH);
		commit(next, Math.min(index + typed.length, next.length === LENGTH ? LENGTH - 1 : next.length));
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			e.preventDefault();
			if (value[index]) commit(value.slice(0, index) + value.slice(index + 1), index);
			else if (index > 0) commit(value.slice(0, index - 1) + value.slice(index), index - 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focusBox(index - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			focusBox(index + 1);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
		if (!pasted) return;
		e.preventDefault();
		commit(pasted, pasted.length === LENGTH ? LENGTH - 1 : pasted.length);
	};

	return (
		<div role="group" aria-label={label} className="flex gap-2 sm:gap-2.5">
			{Array.from({ length: LENGTH }, (_, index) => (
				<input
					key={index}
					ref={(el) => {
						boxes.current[index] = el;
					}}
					id={index === 0 ? id : undefined}
					aria-label={`${label}, digit ${index + 1} of ${LENGTH}`}
					type="text"
					inputMode="numeric"
					autoComplete={index === 0 ? "one-time-code" : "off"}
					pattern="[0-9]*"
					value={value[index] ?? ""}
					disabled={disabled}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					// Boxes fill in order: a click past the end lands on the next empty one.
					onFocus={(e) => {
						if (index > latest.current.length) focusBox(latest.current.length);
						else e.target.select();
					}}
					className={`${AUTH_INPUT} h-14 min-w-0 flex-1 px-0! text-center font-sans text-2xl tabular-nums`}
				/>
			))}
		</div>
	);
}
