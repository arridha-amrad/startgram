/** biome-ignore-all lint/a11y/noStaticElementInteractions: it's ok */
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	containerRef: HTMLDivElement | null;
	setCoordinate: Dispatch<
		SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	coordinate: {
		x: number;
		y: number;
	};
};

export default function TagUserWrapper({
	containerRef,
	setCoordinate,
	coordinate,
	children,
}: Props & PropsWithChildren) {
	const [isDragging, setIsDragging] = useState(false);

	const dragOffset = useRef({ x: 0, y: 0 });

	const handleMouseDown = (e: React.MouseEvent) => {
		// Stop propagation to prevent image click handler from firing
		e.stopPropagation();
		if (!containerRef) return;

		// Don't drag if clicking on an interactive element like an input or button
		const target = e.target as HTMLElement;
		if (target.tagName === "INPUT" || target.closest("button")) {
			return;
		}

		const rect = containerRef.getBoundingClientRect();
		// Hitung posisi komponen saat ini dalam pixel
		const currentX = (coordinate.x * rect.width) / 100;
		const currentY = (coordinate.y * rect.height) / 100;

		// Simpan jarak antara posisi mouse dan asal (origin) komponen
		dragOffset.current = {
			x: e.clientX - rect.left - currentX,
			y: e.clientY - rect.top - currentY,
		};

		setIsDragging(true);
	};

	// Fungsi untuk update koordinat berdasarkan posisi mouse/touch
	const updatePosition = useCallback(
		(clientX: number, clientY: number) => {
			if (!containerRef) return;

			const rect = containerRef.getBoundingClientRect();

			// Hitung posisi baru dengan mengurangi offset awal agar tidak jump
			let x = ((clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
			let y = ((clientY - rect.top - dragOffset.current.y) / rect.height) * 100;

			// Batasi agar tidak keluar gambar (0% - 100%)
			x = Math.max(0, Math.min(100, x));
			y = Math.max(0, Math.min(100, y));

			console.log({x, y});

			setCoordinate({ x, y });
		},
		[containerRef, setCoordinate],
	);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				updatePosition(e.clientX, e.clientY);
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.body.style.cursor = "grabbing";
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.body.style.cursor = "";
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, updatePosition]);

	return (
		<div
			className={cn(
				"pointer-events-none absolute z-50 flex flex-col transition-transform duration-150 ease-in select-none",
				isDragging ? "scale-110" : "",
			)}
			style={{
				top: `${coordinate.y}%`,
				left: `${coordinate.x}%`,
			}}
		>
			{/* Input Box with Pseudo-Arrow */}
			<div
				onMouseDown={handleMouseDown}
				className={cn(
					"tag-box pointer-events-auto relative top-[7px] flex flex-col rounded-lg bg-background shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
					isDragging ? "cursor-grabbing" : "cursor-grab",
					coordinate.x < 15
						? "tag-box-left translate-x-[-15%] items-start"
						: coordinate.x > 85
							? "tag-box-right translate-x-[-85%] items-end"
							: "tag-box-center -translate-x-1/2 items-center",
				)}
			>
				{children}
			</div>
		</div>
	);
}
