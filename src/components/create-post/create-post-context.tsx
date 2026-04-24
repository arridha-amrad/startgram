import { RectangleVertical, Square } from "lucide-react";
import type {
	Dispatch,
	PropsWithChildren,
	RefObject,
	SetStateAction,
} from "react";
import { createContext, useContext, useRef, useState } from "react";
import { aspectRatios } from "@/db/enum";

export type AspectRatio = (typeof aspectRatios)[number];

export const availableRatio = [
	{ value: "1 / 1" as AspectRatio, icon: Square },
	{ value: "4 / 5" as AspectRatio, icon: RectangleVertical },
	{ value: "16 / 9" as AspectRatio, icon: RectangleVertical },
];

export enum Steps {
	Picker,
	Preview,
	MakeCaption,
	Submitting,
	Submitted,
}

export type TaggedUser = {
	id: string;
	username: string;
	coordinate: {
		x: number;
		y: number;
	};
};

export type MediaType = "image" | "video";

export type MediaWithTaggedUsers = {
	order: number;
	src: string;
	file: File;
	taggedUsers: Array<TaggedUser>;
	type: MediaType;
};

const CreatePostContext = createContext<{
	aspectRatio: AspectRatio;
	setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
	taggedUsers: Array<TaggedUser>;
	setTaggedUsers: Dispatch<SetStateAction<Array<TaggedUser>>>;
	removeFromTaggedUsers: (id: string, order: number) => void;
	mediaWithTaggedUsers: Array<MediaWithTaggedUsers>;
	setMediaWithTaggedUsers: Dispatch<
		SetStateAction<Array<MediaWithTaggedUsers>>
	>;
	setMedia: (
		newData: Array<{ src: string; file: File; type: MediaType }>,
	) => void;
	tagUser: (user: TaggedUser, order: number) => void;
	step: Steps;
	setStep: Dispatch<SetStateAction<Steps>>;
	nextStep: () => void;
	prevStep: () => void;
	reset: () => void;
	addMedia: (
		newData: Array<{ src: string; file: File; type: MediaType }>,
	) => void;
	formRef: RefObject<HTMLFormElement | null>;
} | null>(null);

export const CreatePostContextProvider = ({ children }: PropsWithChildren) => {
	const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1 / 1");
	const [taggedUsers, setTaggedUsers] = useState<Array<TaggedUser>>([]);
	const [mediaWithTaggedUsers, setMediaWithTaggedUsers] = useState<
		Array<MediaWithTaggedUsers>
	>([]);
	const [step, setStep] = useState<Steps>(Steps.Picker);

	const formRef = useRef<HTMLFormElement>(null);

	const reset = () => {
		setAspectRatio("1 / 1");
		setTaggedUsers([]);
		setMediaWithTaggedUsers([]);
		setStep(Steps.Picker);
	};

	const removeFromTaggedUsers = (id: string, order: number) => {
		setMediaWithTaggedUsers((data) => {
			return data.map((item, index) => {
				if (index === order) {
					return {
						...item,
						taggedUsers: item.taggedUsers.filter((u) => u.id !== id),
					};
				}
				return item;
			});
		});
	};

	const addMedia = (
		newData: Array<{ src: string; file: File; type: MediaType }>,
	) => {
		setMediaWithTaggedUsers((data) => [
			...data, // 4
			...newData.map((v, i) => ({
				src: v.src,
				file: v.file,
				type: v.type,
				taggedUsers: [],
				order: i + data.length - 1,
			})),
		]);
	};

	const setMedia = (
		newData: Array<{ src: string; file: File; type: MediaType }>,
	) => {
		setMediaWithTaggedUsers(
			newData.map((v, i) => ({
				src: v.src,
				type: v.type,
				taggedUsers: [],
				file: v.file,
				order: i
			})),
		);
	};

	const tagUser = (user: TaggedUser, order: number) => {
		setMediaWithTaggedUsers((data) => {
			return data.map((item, index) => {
				if (index === order) {
					return {
						...item,
						taggedUsers: [...item.taggedUsers, user],
					};
				}
				return item;
			});
		});
	};

	const nextStep = () => {
		setStep((val) => val + 1);
	};

	const prevStep = () => {
		setStep((val) => val - 1);
	};

	return (
		<CreatePostContext.Provider
			value={{
				mediaWithTaggedUsers,
				setMediaWithTaggedUsers,
				formRef,
				addMedia,
				reset,
				nextStep,
				prevStep,
				setStep,
				step,
				tagUser,
				aspectRatio,
				setAspectRatio,
				setTaggedUsers,
				taggedUsers,
				removeFromTaggedUsers,
				setMedia,
			}}
		>
			{children}
		</CreatePostContext.Provider>
	);
};

export const useCreatePost = () => {
	const context = useContext(CreatePostContext);
	if (!context) {
		throw new Error(
			"useCreatePost must be used inside CreatePostContextProvider",
		);
	}
	return context;
};
