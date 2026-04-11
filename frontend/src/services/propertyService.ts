import type {
  PropertyApiResponse,
  PropertiesListApiResponse,
  PropertyQueryParams,
  DeletePropertyApiResponse,
} from '../types/property'

const API_BASE = '/api/property'

function extractErrorMessage(data: Record<string, unknown>): string {
  const msgs: string[] =
    Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors
      : [((data.error as Record<string, unknown>)?.message as string) ?? (data.error as string) ?? 'Something went wrong']
  return msgs.join(' · ')
}

export async function createProperty(formData: FormData): Promise<PropertyApiResponse> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertyApiResponse
}

export async function getProperties(query: PropertyQueryParams = {}): Promise<PropertiesListApiResponse> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.append(key, String(value))
  }

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE
  const res = await fetch(url, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertiesListApiResponse
}

export async function getPropertyById(id: string): Promise<PropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertyApiResponse
}

export async function updateProperty(id: string, formData: FormData): Promise<PropertyApiResponse> {
  // #region agent log
  const sentFields: Record<string,string> = {}
  formData.forEach((v,k) => { sentFields[k] = typeof v === 'string' ? v : '[File]' })
  fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'propertyService.ts:updateProperty-fetch',message:'PATCH fetch about to fire',data:{url:`${API_BASE}/${id}`,sentFields,fieldCount:Object.keys(sentFields).length},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  })

  const data = await res.json()
  // #region agent log
  fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'propertyService.ts:updateProperty-response',message:'PATCH response received',data:{status:res.status,ok:res.ok,responsePrice:(data as Record<string,unknown>).data ? ((data as Record<string,{price:number}>).data?.price) : 'no data key',responseSuccess:(data as Record<string,unknown>).success,errorField:(data as Record<string,unknown>).error},timestamp:Date.now(),hypothesisId:'H2-H3-H5'})}).catch(()=>{});
  // #endregion
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertyApiResponse
}

export async function deleteProperty(id: string): Promise<DeletePropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as DeletePropertyApiResponse
}
