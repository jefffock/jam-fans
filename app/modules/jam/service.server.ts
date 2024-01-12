import { db } from "~/database";
import type { add_link, profiles } from "@prisma/client";

export async function addLink(data: {
	username: string;
	link: string;
	version_id: number;
}) {
	const { username, link, version_id } = data;

	const newLink = await db.add_link.create({
		data: {
			username,
			link,
			version_id,
		},
	});

	const updatedVersion = await db.versions.update({
		where: {
			id: version_id,
		},
		data: {
			listen_link: link,
		},
	});

	// Return both newLink and updatedVersion if needed
	return { newLink, updatedVersion };
}