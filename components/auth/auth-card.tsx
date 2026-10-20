import Image from "next/image";

/** The sign-in surface's backdrop and card, for the pages around /login. */
export function AuthCard({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="h-screen overflow-y-auto flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 py-8">
			<div className="fixed inset-0 pointer-events-none bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
			<div className="relative w-full max-w-md mx-auto my-auto">
				<div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center">
								<Image src="/SC LOGO W 1.png" alt="SecureTanza Logo" width={46} height={46} className="object-contain" priority />
							</div>
						</div>
						<h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
						{subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}
