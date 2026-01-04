# ContactsApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**contactsGet**](ContactsApi.md#contactsget) | **GET** /contacts | Get all contacts with message counts |



## contactsGet

> Array&lt;ModelsContact&gt; contactsGet()

Get all contacts with message counts

Fetches all contacts along with their message counts from the database

### Example

```ts
import {
  Configuration,
  ContactsApi,
} from '';
import type { ContactsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContactsApi();

  try {
    const data = await api.contactsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsContact&gt;**](ModelsContact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully loaded contacts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

