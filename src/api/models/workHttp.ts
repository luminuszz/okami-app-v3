/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */
import type { WorkHttpCategory } from "./workHttpCategory";
import type { TagModel } from "./tagModel";

export interface WorkHttp {
	/** @nullable */
	alternativeName: string | null;
	category: WorkHttpCategory;
	chapter: number;
	createdAt: string;
	/** @nullable */
	description: string | null;
	hasNewChapter: boolean;
	id: string;
	imageId: string;
	/** @nullable */
	imageUrl: string | null;
	isDropped: boolean;
	isFavorite: boolean;
	isFinished: boolean;
	name: string;
	/** @nullable */
	nextChapter: number | null;
	/** @nullable */
	nextChapterUpdatedAt: string | null;
	refreshStatus: string;
	tags: TagModel[];
	updatedAt: string;
	url: string;
	userId: string;
}
