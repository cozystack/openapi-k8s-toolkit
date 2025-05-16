import axios, { AxiosResponse } from 'axios'

export const createNewEntry = async <T>({
  endpoint,
  body,
}: {
  endpoint: string
  body: unknown
}): Promise<AxiosResponse<T>> => {
  return axios.post(endpoint, JSON.stringify(body), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const updateEntry = async <T>({
  endpoint,
  body,
}: {
  endpoint: string
  body: unknown
}): Promise<AxiosResponse<T>> => {
  return axios.put(endpoint, JSON.stringify(body), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteEntry = async <T>({ endpoint }: { endpoint: string }): Promise<AxiosResponse<T>> => {
  return axios.delete(endpoint)
}
