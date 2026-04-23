import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface VolumeContextType {
	isMuted: boolean;
	volume: Array<number>;
	setGlobalMute: (muted: boolean) => void;
	setGlobalVolume: (val: Array<number>) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false);

	const [isMuted, setIsMuted] = useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("isMuted");
			return saved ? JSON.parse(saved) : true;
		}
		return true;
	});

	const [volume, setVolume] = useState<Array<number>>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("volume");
			return saved ? JSON.parse(saved) : [80];
		}
		return [80];
	});

	useEffect(() => {
		const savedVolume = localStorage.getItem("volume");
		const savedMuted = localStorage.getItem("isMuted");
		if (savedMuted) {
			// eslint-disable-next-line
			setIsMuted(JSON.parse(savedMuted));
		}
		if (savedVolume) {
			setVolume(JSON.parse(savedVolume));
		}

		setMounted(true);
	}, []);

	const setGlobalMute = (muted: boolean) => {
		setIsMuted(muted);
		localStorage.setItem("isMuted", JSON.stringify(muted));
	};

	const setGlobalVolume = (val: Array<number>) => {
		setVolume(val);
		localStorage.setItem("volume", JSON.stringify(val));
	};

	if (!mounted) return null;

	return (
		<VolumeContext.Provider
			value={{ isMuted, volume, setGlobalMute, setGlobalVolume }}
		>
			{children}
		</VolumeContext.Provider>
	);
}

export const useVolume = () => {
	const context = useContext(VolumeContext);
	if (!context) throw new Error("useVolume must be used within VolumeProvider");
	return context;
};
