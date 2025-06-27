export type HTTPResponse<T = Record<string, Scalar>> = {
  error?: string;
  result: T;
  statusCode: number;
};

export type GetRequest = {
  endpoint: string;
  network: string;
};

export type PostRequest<TBody> = {
  endpoint: string;
  body?: TBody;
  network: string;
};

export type Scalar = number | string | boolean;

export const get = async <TResponse>(
  req: GetRequest
): Promise<HTTPResponse<TResponse>> => {
  return request('GET', req.endpoint, req.network);
};

export const post = async <TBody, TResponse>(
  req: PostRequest<TBody>
): Promise<HTTPResponse<TResponse>> => {
  return request<TBody, TResponse>('POST', req.endpoint, req.network, req.body);
};

const request = async <
  TBody = Record<string, Scalar>,
  TResponse = Record<string, Scalar>,
>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  network: string,
  body?: TBody
): Promise<HTTPResponse<TResponse>> => {
  const response = await fetch(endpoint, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'x-network': network === 'ethereum' ? 'mainnet' : network,
    },
  });

  // Error logic
  if (!response.ok) {
    const json = await response.json();
    return {
      statusCode: response.status,
      error:
        (json as unknown as { error: string }).error ||
        (json as unknown as { message: string }).message ||
        'Oops! Something went wrong',
    } as HTTPResponse<TResponse>;
  }

  try {
    const json = await response.json();

    return {
      result: json,
      statusCode: response.status,
    };
  } catch (e) {
    console.log(e);
    return { result: {} as TResponse, statusCode: response.status };
  }
};
