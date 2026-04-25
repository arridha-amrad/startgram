import { X } from "lucide-react";
import type { RefObject } from "react";
import { useState } from "react";
import type { TaggedUser } from "./create-post-context";
import { useCreatePost } from "./create-post-context";
import TagUserWrapper from "./tag-user-wrapper";

type ItemProps = {
	containerRef: HTMLDivElement | null;
	taggedUser: TaggedUser;
	imageOrder: number;
};

export function TaggedUserItem({
	containerRef,
	taggedUser,
	imageOrder,
}: ItemProps) {
	const { removeFromTaggedUsers, updateTaggedUserCoordinate } = useCreatePost();
	const [c, setC] = useState(taggedUser.coordinate);

	return (
		<TagUserWrapper
			containerRef={containerRef}
			coordinate={c}
			setCoordinate={setC}
			onDragEnd={(coord) =>
				updateTaggedUserCoordinate(taggedUser.id, coord, imageOrder)
			}
		>
			<div className="flex items-center gap-x-2 p-2">
				<div className="w-max max-w-32 pl-1 text-sm text-foreground">
					{taggedUser.username}
				</div>
				<button
					type="button"
					title="remove tag"
					className=""
					onClick={() => removeFromTaggedUsers(taggedUser.id, imageOrder)}
				>
					<X className="size-4" />
				</button>
			</div>
		</TagUserWrapper>
	);
}

type Props = {
	emblaRefs: RefObject<Array<HTMLDivElement | null>>;
	taggedUsers: Array<TaggedUser>;
	imageOrder: number;
};

export function TaggedUserList({ emblaRefs, taggedUsers, imageOrder }: Props) {
	const container = emblaRefs.current[imageOrder];

	return taggedUsers.map((tu) => (
		<TaggedUserItem
			key={tu.id}
			containerRef={container}
			taggedUser={tu}
			imageOrder={imageOrder}
		/>
	));
}
