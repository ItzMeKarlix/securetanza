"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/** One modal chrome for every dialog on the settings surface. */
export function Modal({
	title,
	width = "max-w-md",
	onClose,
	children,
}: {
	title: string;
	width?: string;
	onClose: () => void;
	children: React.ReactNode;
}) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px] dark:bg-black/60"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				onClick={(e) => e.stopPropagation()}
				className={`settings-surface w-full ${width} settings-dialog rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.28)] dark:border-white/[0.09] dark:bg-[#0F172A] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]`}
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<h2 className="text-[0.9375rem] font-semibold tracking-[-0.008em] text-slate-900 dark:text-white">
						{title}
					</h2>
					<button
						onClick={onClose}
						aria-label="Close"
						className="-mt-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body
	);
}
