/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
	DataTag,
	DefinedInitialDataOptions,
	DefinedUseInfiniteQueryResult,
	DefinedUseQueryResult,
	InfiniteData,
	MutationFunction,
	QueryFunction,
	QueryKey,
	UndefinedInitialDataOptions,
	UseInfiniteQueryOptions,
	UseInfiniteQueryResult,
	UseMutationOptions,
	UseMutationResult,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import type {
	CreateTagDto,
	TagControllerFilterTagParams,
	TagControllerListTagsParams,
	TagModelPaged,
	UpdateTagDto,
} from ".././models";
import { customInstance } from "../../lib/axios/index";
import type { ErrorType, BodyType } from "../../lib/axios/index";

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const tagControllerCreate = (
	createTagDto: BodyType<CreateTagDto>,
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<void>(
		{
			url: `/tags`,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: createTagDto,
			signal,
		},
		options,
	);
};

export const getTagControllerCreateMutationOptions = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerCreate>>,
		TError,
		{ data: BodyType<CreateTagDto> },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof tagControllerCreate>>,
	TError,
	{ data: BodyType<CreateTagDto> },
	TContext
> => {
	const { mutation: mutationOptions, request: requestOptions } = options ?? {};

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof tagControllerCreate>>,
		{ data: BodyType<CreateTagDto> }
	> = (props) => {
		const { data } = props ?? {};

		return tagControllerCreate(data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type TagControllerCreateMutationResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerCreate>>
>;
export type TagControllerCreateMutationBody = BodyType<CreateTagDto>;
export type TagControllerCreateMutationError = ErrorType<unknown>;

export const useTagControllerCreate = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerCreate>>,
		TError,
		{ data: BodyType<CreateTagDto> },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationResult<
	Awaited<ReturnType<typeof tagControllerCreate>>,
	TError,
	{ data: BodyType<CreateTagDto> },
	TContext
> => {
	const mutationOptions = getTagControllerCreateMutationOptions(options);

	return useMutation(mutationOptions);
};
export const tagControllerListTags = (
	params: TagControllerListTagsParams,
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<TagModelPaged>(
		{ url: `/tags`, method: "GET", params, signal },
		options,
	);
};

export const getTagControllerListTagsQueryKey = (
	params: TagControllerListTagsParams,
) => {
	return [`/tags`, ...(params ? [params] : [])] as const;
};

export const getTagControllerListTagsInfiniteQueryOptions = <
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TagControllerListTagsParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerListTags>>,
				QueryKey,
				TagControllerListTagsParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getTagControllerListTagsQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		QueryKey,
		TagControllerListTagsParams["page"]
	> = ({ signal, pageParam }) =>
		tagControllerListTags(
			{ ...params, page: pageParam || params?.["page"] },
			requestOptions,
			signal,
		);

	return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TError,
		TData,
		Awaited<ReturnType<typeof tagControllerListTags>>,
		QueryKey,
		TagControllerListTagsParams["page"]
	> & { queryKey: DataTag<QueryKey, TData> };
};

export type TagControllerListTagsInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerListTags>>
>;
export type TagControllerListTagsInfiniteQueryError = ErrorType<unknown>;

export function useTagControllerListTagsInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TagControllerListTagsParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options: {
		query: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerListTags>>,
				QueryKey,
				TagControllerListTagsParams["page"]
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerListTags>>,
					TError,
					TData,
					QueryKey
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): DefinedUseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerListTagsInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TagControllerListTagsParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerListTags>>,
				QueryKey,
				TagControllerListTagsParams["page"]
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerListTags>>,
					TError,
					TData,
					QueryKey
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerListTagsInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TagControllerListTagsParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerListTags>>,
				QueryKey,
				TagControllerListTagsParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};

export function useTagControllerListTagsInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TagControllerListTagsParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerListTags>>,
				QueryKey,
				TagControllerListTagsParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
} {
	const queryOptions = getTagControllerListTagsInfiniteQueryOptions(
		params,
		options,
	);

	const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getTagControllerListTagsQueryOptions = <
	TData = Awaited<ReturnType<typeof tagControllerListTags>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getTagControllerListTagsQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof tagControllerListTags>>
	> = ({ signal }) => tagControllerListTags(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof tagControllerListTags>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData> };
};

export type TagControllerListTagsQueryResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerListTags>>
>;
export type TagControllerListTagsQueryError = ErrorType<unknown>;

export function useTagControllerListTags<
	TData = Awaited<ReturnType<typeof tagControllerListTags>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options: {
		query: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerListTags>>,
					TError,
					TData
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerListTags<
	TData = Awaited<ReturnType<typeof tagControllerListTags>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerListTags>>,
					TError,
					TData
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useTagControllerListTags<
	TData = Awaited<ReturnType<typeof tagControllerListTags>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useTagControllerListTags<
	TData = Awaited<ReturnType<typeof tagControllerListTags>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerListTagsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerListTags>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
	const queryOptions = getTagControllerListTagsQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const tagControllerUpdateTag = (
	id: string,
	updateTagDto: BodyType<UpdateTagDto>,
	options?: SecondParameter<typeof customInstance>,
) => {
	return customInstance<void>(
		{
			url: `/tags/${id}`,
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			data: updateTagDto,
		},
		options,
	);
};

export const getTagControllerUpdateTagMutationOptions = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerUpdateTag>>,
		TError,
		{ id: string; data: BodyType<UpdateTagDto> },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof tagControllerUpdateTag>>,
	TError,
	{ id: string; data: BodyType<UpdateTagDto> },
	TContext
> => {
	const { mutation: mutationOptions, request: requestOptions } = options ?? {};

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof tagControllerUpdateTag>>,
		{ id: string; data: BodyType<UpdateTagDto> }
	> = (props) => {
		const { id, data } = props ?? {};

		return tagControllerUpdateTag(id, data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type TagControllerUpdateTagMutationResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerUpdateTag>>
>;
export type TagControllerUpdateTagMutationBody = BodyType<UpdateTagDto>;
export type TagControllerUpdateTagMutationError = ErrorType<unknown>;

export const useTagControllerUpdateTag = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerUpdateTag>>,
		TError,
		{ id: string; data: BodyType<UpdateTagDto> },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationResult<
	Awaited<ReturnType<typeof tagControllerUpdateTag>>,
	TError,
	{ id: string; data: BodyType<UpdateTagDto> },
	TContext
> => {
	const mutationOptions = getTagControllerUpdateTagMutationOptions(options);

	return useMutation(mutationOptions);
};
export const tagControllerDeleteTag = (
	id: string,
	options?: SecondParameter<typeof customInstance>,
) => {
	return customInstance<void>(
		{ url: `/tags/${id}`, method: "DELETE" },
		options,
	);
};

export const getTagControllerDeleteTagMutationOptions = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerDeleteTag>>,
		TError,
		{ id: string },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof tagControllerDeleteTag>>,
	TError,
	{ id: string },
	TContext
> => {
	const { mutation: mutationOptions, request: requestOptions } = options ?? {};

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof tagControllerDeleteTag>>,
		{ id: string }
	> = (props) => {
		const { id } = props ?? {};

		return tagControllerDeleteTag(id, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type TagControllerDeleteTagMutationResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerDeleteTag>>
>;

export type TagControllerDeleteTagMutationError = ErrorType<unknown>;

export const useTagControllerDeleteTag = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof tagControllerDeleteTag>>,
		TError,
		{ id: string },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationResult<
	Awaited<ReturnType<typeof tagControllerDeleteTag>>,
	TError,
	{ id: string },
	TContext
> => {
	const mutationOptions = getTagControllerDeleteTagMutationOptions(options);

	return useMutation(mutationOptions);
};
export const tagControllerFilterTag = (
	params: TagControllerFilterTagParams,
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<void>(
		{ url: `/tags/filter`, method: "GET", params, signal },
		options,
	);
};

export const getTagControllerFilterTagQueryKey = (
	params: TagControllerFilterTagParams,
) => {
	return [`/tags/filter`, ...(params ? [params] : [])] as const;
};

export const getTagControllerFilterTagInfiniteQueryOptions = <
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TagControllerFilterTagParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				QueryKey,
				TagControllerFilterTagParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getTagControllerFilterTagQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		QueryKey,
		TagControllerFilterTagParams["page"]
	> = ({ signal, pageParam }) =>
		tagControllerFilterTag(
			{ ...params, page: pageParam || params?.["page"] },
			requestOptions,
			signal,
		);

	return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TError,
		TData,
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		QueryKey,
		TagControllerFilterTagParams["page"]
	> & { queryKey: DataTag<QueryKey, TData> };
};

export type TagControllerFilterTagInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerFilterTag>>
>;
export type TagControllerFilterTagInfiniteQueryError = ErrorType<unknown>;

export function useTagControllerFilterTagInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TagControllerFilterTagParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options: {
		query: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				QueryKey,
				TagControllerFilterTagParams["page"]
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerFilterTag>>,
					TError,
					TData,
					QueryKey
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): DefinedUseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerFilterTagInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TagControllerFilterTagParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				QueryKey,
				TagControllerFilterTagParams["page"]
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerFilterTag>>,
					TError,
					TData,
					QueryKey
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerFilterTagInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TagControllerFilterTagParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				QueryKey,
				TagControllerFilterTagParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};

export function useTagControllerFilterTagInfinite<
	TData = InfiniteData<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TagControllerFilterTagParams["page"]
	>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseInfiniteQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData,
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				QueryKey,
				TagControllerFilterTagParams["page"]
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
} {
	const queryOptions = getTagControllerFilterTagInfiniteQueryOptions(
		params,
		options,
	);

	const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getTagControllerFilterTagQueryOptions = <
	TData = Awaited<ReturnType<typeof tagControllerFilterTag>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getTagControllerFilterTagQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof tagControllerFilterTag>>
	> = ({ signal }) => tagControllerFilterTag(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof tagControllerFilterTag>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData> };
};

export type TagControllerFilterTagQueryResult = NonNullable<
	Awaited<ReturnType<typeof tagControllerFilterTag>>
>;
export type TagControllerFilterTagQueryError = ErrorType<unknown>;

export function useTagControllerFilterTag<
	TData = Awaited<ReturnType<typeof tagControllerFilterTag>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options: {
		query: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerFilterTag>>,
					TError,
					TData
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData>;
};
export function useTagControllerFilterTag<
	TData = Awaited<ReturnType<typeof tagControllerFilterTag>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof tagControllerFilterTag>>,
					TError,
					TData
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useTagControllerFilterTag<
	TData = Awaited<ReturnType<typeof tagControllerFilterTag>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useTagControllerFilterTag<
	TData = Awaited<ReturnType<typeof tagControllerFilterTag>>,
	TError = ErrorType<unknown>,
>(
	params: TagControllerFilterTagParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof tagControllerFilterTag>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
	const queryOptions = getTagControllerFilterTagQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}
