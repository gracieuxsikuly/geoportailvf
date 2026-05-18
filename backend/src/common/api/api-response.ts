import { ApiMetaDto } from './api-response.dto';

export interface ApiSuccessResponse<TData> {
  success: true;
  message: string;
  data: TData;
  meta: ApiMetaDto;
}

export function createApiResponse<TData>(
  data: TData,
  message: string,
  meta: ApiMetaDto,
): ApiSuccessResponse<TData> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}
